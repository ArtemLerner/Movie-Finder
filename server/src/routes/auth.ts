import {Router} from "express";
import {pool} from "../db";
import bcrypt from "bcrypt";


const router = Router();

router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const passHash = await bcrypt.hash(password, 10);

    // 1. Базовая проверка
    if (!email || !password || password.length < 6) {
        return res.status(400).json({ message: "Некорректные данные" });
    }


    const newUser = await pool.query(
         `INSERT INTO users (email, password) VALUES ($1, $2)`,
            [email, passHash]
    )
    return res.status(200).json({
        message: "Данные успешно дошли до сервера!",
        user: { newUser }
    });
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // 1. Базовая проверка
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


router.get('/users', async (req, res) => {
    try {
        const result = await pool.query("SELECT password, email FROM users");
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: "Ошибка при чтении из БД" });
    }
});


export default router;