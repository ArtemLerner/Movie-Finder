import {Router} from "express";
import {pool} from "../db";
import bcrypt from "bcrypt";


const router = Router();

router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const passHash = await bcrypt.hash(password, 10);

    if (!email || !password || password.length < 6) {
        return res.status(400).json({ message: "Некорректные данные" });
    }

    const user = await pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [email]
        )

    const userRow = user.rows[0];

    if (!userRow) {
        const newUser = await pool.query(
            `INSERT INTO users (email, password) VALUES ($1, $2)`,
            [email, passHash]
        )
        return res.json({ ok: true, user: newUser });
    }else {
        return res.json({ ok: false });
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
        return res.json({ user: true });
    }else{
        return res.json({ user: false });
    }
})



export default router;