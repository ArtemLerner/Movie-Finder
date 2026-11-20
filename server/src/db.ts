import { Pool } from "pg";
import "dotenv/config";

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: true } : {rejectUnauthorized: true},
});

export async function cleanupPending() {
    const result = await pool.query(
        `DELETE FROM users_pending WHERE created_at < now() - interval '30 minutes'`
    );
    return result.rowCount;
}

export default async function initDB() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            email_verified BOOLEAN NOT NULL DEFAULT false,
            email_token TEXT
        );

        CREATE TABLE IF NOT EXISTS favorites (
            id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            tmdb_id TEXT NOT NULL,
            media_type TEXT CHECK (media_type IN ('movie', 'tv')),
            PRIMARY KEY (id, tmdb_id, media_type)
        );

        CREATE TABLE IF NOT EXISTS users_pending (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            email_verified BOOLEAN NOT NULL DEFAULT false,
            email_token TEXT
            );

        ALTER TABLE users_pending
            ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now();
    `);

    pool.on("error", (err) => {
        console.error("PG pool error:", err.message);
    });

    await cleanupPending().catch(console.error);

    setInterval(() => cleanupPending().catch(console.error), 60 * 60 * 1000).unref();

}


