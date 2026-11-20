import express from "express";
import jwt from "jsonwebtoken";
import {pool} from "../db";

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

        res.locals.user = user;
        next();
    }catch{
        res.status(401).json({ message: "Invalid auth" });
    }

}