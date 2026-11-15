import express ,{Router} from "express";
import {pool} from "../db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const router = Router();

router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const passHash = await bcrypt.hash(password, 10);

    if (!email || !password || password.length < 6) {
        return res.status(400).json({ message: "Некорректные данные" });
    }

    const userFind = await pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [email]
        )

    const user = userFind.rows[0];


    if (!user) {
        const newUser = await pool.query(
            `INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email`,
            [email, passHash]
        )
        const user = newUser.rows[0];
        setAuthCookie(res, user.id);
        return res.json({ id: user.id, email: user.email});
    }else {
        return res.status(401).json({ error: "email is already in use" });
    }
})

router.post('/login', async (req, res) => {
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

router.post('/logout', async (_req, res) => {
    const isProd = process.env.NODE_ENV === "production";

    res.clearCookie('token',
        { httpOnly: true, secure: isProd, sameSite: isProd ? "none" : "lax" });
    res.json({ message: "Logged out" });
})

router.get('/me', async (req, res) => {
    const token = req.cookies.token;

    const SECRET = process.env.JWT_SECRET;

    if(!SECRET) return

    if (!token) {
        return res.status(401).json({ message: "Not logged in" });
    }

    try{
        const payload = jwt.verify(token, SECRET) as {id: number};

        const result = await pool.query(
            `SELECT * FROM users WHERE id = $1`, [payload.id]);

        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        res.json(user);
    }catch{
        res.status(401).json({ message: "Invalid token" });
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


export default router;