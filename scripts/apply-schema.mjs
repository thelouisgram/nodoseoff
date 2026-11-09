import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Pool } from "@neondatabase/serverless";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnvFile(path) {
  try {
    const text = readFileSync(path, "utf8");
    for (const line of text.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    /* optional */
  }
}

loadEnvFile(join(root, ".env"));
loadEnvFile(join(root, ".env.local"));

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set in .env or .env.local");
  process.exit(1);
}

const schema = readFileSync(join(root, "db", "schema.sql"), "utf8");
const pool = new Pool({ connectionString: url });
try {
  await pool.query(schema);
  console.log("Schema applied successfully.");
} finally {
  await pool.end();
}
