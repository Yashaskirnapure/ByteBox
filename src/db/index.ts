import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '@/src/db/schema';
import { neon } from "@neondatabase/serverless";

const isProd = process.env.NODE_ENV === 'production';
const databaseUrl = isProd
  ? process.env.DATABASE_URL_PROD!
  : process.env.DATABASE_URL_DEV!;

const sql = neon(databaseUrl);
export const db = drizzle(sql, { schema });
export { sql };