import { Pool } from "pg";
import "dotenv/config";

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
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

    await cleanupPending().catch(console.error);

    setInterval(() => cleanupPending().catch(console.error), 60 * 60 * 1000).unref();

}


