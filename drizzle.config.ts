import * as dotenv from "dotenv";
import { defineConfig } from 'drizzle-kit';

dotenv.config({ path: ".env.local" });

const isProd = process.env.NODE_ENV === 'production';
const databaseUrl = isProd
  ? process.env.DATABASE_URL_PROD!
  : process.env.DATABASE_URL_DEV!;

if(!databaseUrl) throw new Error("Database url not loaded.");

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: databaseUrl,
  },
  migrations: {
    table: "__drizzle_migration",
    schema: "public",
  },
  verbose: true,
  strict: true,
});