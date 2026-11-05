
import nextEnv from "@next/env";
import { neon } from "@neondatabase/serverless";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

async function testDatabase() {
    try {
        if (!process.env.DATABASE_URL) {
            throw new Error("DATABASE_URL is missing");
        }

        const sql = neon(process.env.DATABASE_URL);

        const result = await sql`
      SELECT current_database() AS database,
             NOW() AS server_time
    `;

        console.log("Database connection successful!");
        console.log("Database:", result[0].database);
        console.log("Server time:", result[0].server_time);
    } catch (error) {
        console.error("Database connection failed:");
        console.error(error.message);
        process.exitCode = 1;
    }
}

testDatabase();
