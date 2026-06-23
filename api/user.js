import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
    const users = await sql`SELECT * FROM users`;
    res.status(200).json(users);
}