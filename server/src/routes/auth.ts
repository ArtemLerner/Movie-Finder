import express ,{Router} from "express";
import {pool} from "../db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import Mail from "../services/mail"


const router = Router();

router.post('/register', async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password || password.length < 6) {
            return res.status(400).json({ message: "Некорректные данные" });
        }

        // Проверяем, есть ли уже ПОДТВЕРЖДЕННЫЙ пользователь в основной таблице users
        // ВАЖНО: проверяем .length > 0, так как rows — это массив!
        const userFind = await pool.query(
            `SELECT id FROM users WHERE email = $1`,
            [email]
        );

        if (userFind.rows.length > 0) {
            return res.status(409).json({ message: "Этот email уже зарегистрирован и подтвержден" });
        }

        const passHash = await bcrypt.hash(password, 10);
        const emailToken = uuidv4().slice(0, 6);

        // Проверяем, есть ли пользователь в таблице ожидания users_pending
        const userFindPend = await pool.query(
            `SELECT id FROM users_pending WHERE email = $1`,
            [email]
        );

        let savedUser;

        if (userFindPend.rows.length > 0) {
            // ПЕРЕЗАПИСЫВАЕМ данные существующей записи в users_pending
            const updatedUser = await pool.query(
                `UPDATE users_pending
                 SET password = $1,
                     email_token = $2,
                     created_at = NOW()
                 WHERE email = $3
                     RETURNING id, email, email_token`,
                [passHash, emailToken, email]
            );
            savedUser = updatedUser.rows[0];
        } else {
            // СОЗДАЕМ новую запись, если её ещё нет
            const insertedUser = await pool.query(
                `INSERT INTO users_pending (email, password, email_token, created_at)
                 VALUES ($1, $2, $3, NOW())
                     RETURNING id, email, email_token`,
                [email, passHash, emailToken]
            );
            savedUser = insertedUser.rows[0];
        }

        await Mail(savedUser.email, savedUser.email_token);

        return res.status(201).json({
            id: savedUser.id,
            email: savedUser.email
        });

    } catch (err) {
        console.error("Ошибка в /register:", err);
        return res.status(500).json({ message: "Ошибка сервера" });
    }
});

router.post('/login', async (req: express.Request, res: express.Response) => {
    const { email, password } = req.body;

    if (!email || !password || password.length < 6) {
        return res.status(400).json({ message: "Некорректные данные" });
    }

    const userCheck = await pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [email]
    )

    const user = userCheck.rows[0]

    if(user && (await bcrypt.compare(password, user.password))) {
        setAuthCookie(res, user.id);
        return res.json({ id: user.id, email: user.email});
    }else{
        return res.status(401).json({ message: "Invalid email or password" });
    }

})

router.post('/logout', async (_req: express.Request, res: express.Response): Promise<void> => {
    const isProd = process.env.NODE_ENV === "production";

    res.clearCookie('token',
        { httpOnly: true, secure: isProd, sameSite: isProd ? "none" : "lax" });
    res.json({ message: "Logged out" });
})

router.get('/me', async (req: express.Request, res: express.Response) => {
    const token = req.cookies.token;

    const SECRET = process.env.JWT_SECRET;

    if(!SECRET) return

    if (!token) {
        return res.status(400).json({ message: "Not logged in" });
    }

    try{
        const payload = jwt.verify(token, SECRET) as {id: number};

        const result = await pool.query(
            `SELECT id, email FROM users WHERE id = $1`, [payload.id]);

        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        res.json(user);
    }catch{
        res.status(401).json({ message: "Invalid token" });
    }
})

router.post('/verify-e', async (req: express.Request, res: express.Response): Promise<void> => {
    const {email, token} = req.body;

        try{
            const emailTokenSaveBD = await pool.query(
                `UPDATE users_pending 
                                SET email_verified = true, email_token = NULL
                                WHERE email = $1 AND email_token = $2
                                RETURNING id, email, email_verified`,
                [email, token]
            );

            const user = emailTokenSaveBD.rows[0];

             if (!user) {
                 res.status(401).json({ message: "Invalid Token" });
             }else{
                 const result = await pool.query(
                     `WITH moved AS (
                     DELETE FROM users_pending
                     WHERE email = $1
                       AND created_at > now() - interval '30 minutes'
                         RETURNING email, password
                         )
                     INSERT INTO users (email, password, email_verified)
                     SELECT email, password, true FROM moved
                     RETURNING id, email, email_verified`,
                     [email]
                 );

                 const user = result.rows[0];

                 res.status(200).json({ user });
             }

        }catch {
            res.status(401).json({message: "Invalid fetch"});

        }


})

function setAuthCookie(res: express.Response, userId: number) {

    const SECRET = process.env.JWT_SECRET;

    if (!SECRET) {
        throw new Error("JWT_SECRET is not set in .env");
    }

    const token = jwt.sign({id: userId}, SECRET!, {'expiresIn': '7d'});

    const isProd = process.env.NODE_ENV === "production";

    res.cookie('token', token, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })
}

export async function isAuth(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    const token = req.cookies.token;

    const SECRET = process.env.JWT_SECRET;
    let user;

    if (!SECRET) {
        throw new Error("JWT_SECRET is not set in .env");
    }
    try{
        const payload = jwt.verify(token, SECRET) as {id: number};

        const result = await pool.query(
            `SELECT id, email FROM users WHERE id = $1`, [payload.id]);

        user = result.rows[0];

        if(!user) res.status(401).json({ message: "User not found" });

    }catch{
        res.status(401).json({ message: "Invalid auth" });
    }

    res.locals.user = user;
    next();
}


export default router;