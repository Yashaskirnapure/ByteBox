import * as dotenv from "dotenv";
import { defineConfig } from 'drizzle-kit';

dotenv.config({ path: ".env.local" });
if(!process.env.DATABASE_URL) throw new Error("Database url not loaded.");

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  migrations: {
    table: "__drizzle_migration",
    schema: "public",
  },
  verbose: true,
  strict: true,
});