import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from '@/src/db/schema';
import postgres from 'postgres';

const isProd = process.env.NODE_ENV === 'production';
const databaseUrl = isProd
  ? process.env.DATABASE_URL_PROD!
  : process.env.DATABASE_URL_DEV!;

const client = postgres(databaseUrl, {
  max: 1,
  idle_timeout: 20,
  connect_timeout: 30,
  ssl: 'require'
});

export const db = drizzle(client, { schema });