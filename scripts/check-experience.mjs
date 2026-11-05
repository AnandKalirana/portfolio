import nextEnv from "@next/env";
const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

const rows = await sql`
  SELECT company, role, period
  FROM experiences
  ORDER BY sort_order
`;

console.log(rows);
