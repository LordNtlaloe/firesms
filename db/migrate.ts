import { db } from "./database"
import { readFileSync } from "fs";
import { join } from "path";

async function migrate() {
    const schema = readFileSync(join(__dirname, "schema.sql"), "utf-8");

    const statements = schema
        .split(";")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

    for (const statement of statements) {
        await db.execute(statement);
        console.log("✓", statement.slice(0, 50).replace(/\n/g, " "));
    }

    console.log("\n Migration complete");
    process.exit(0);
}

migrate().catch((err) => {
    console.error("Migration failed:", err.message);
    process.exit(1);
});