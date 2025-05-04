import { migrate } from "drizzle-orm/neon-http/migrator";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
if(process.env.DATABASE_URL) throw new Error("Database url not found");

const runMigration = async () => {
    try{
        const sql = neon(process.env.DATABASE_URL!);
        const db = drizzle(sql);

        await migrate(db, { migrationsFolder: './drizzle' });
        console.log("Migrations done successfully.");
    }catch(err){
        console.error("Something went wrong while migrating.", err);
        process.exit(1);
    }
}

runMigration();