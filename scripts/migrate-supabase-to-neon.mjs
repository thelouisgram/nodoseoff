/**
 * Migrates app data from Supabase Postgres → Neon.
 *
 * Required in .env (one of):
 *   SUPABASE_DATABASE_URL — direct Postgres URI (Supabase → Settings → Database)
 * OR
 *   SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY — REST export (bypasses RLS)
 *
 * Also required:
 *   DATABASE_URL — Neon target
 *   CLERK_SECRET_KEY — remap userId by email to Clerk user ids
 */
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

const SUPABASE_PUBLIC_BASE =
  process.env.SUPABASE_URL?.replace(/\/$/, "") ||
  "https://opshqmqagtfidynwftzk.supabase.co";
const STORAGE_PUBLIC = `${SUPABASE_PUBLIC_BASE}/storage/v1/object/public/profile-picture`;

async function fetchSupabaseRest(table, serviceKey) {
  const url = `${SUPABASE_PUBLIC_BASE}/rest/v1/${table}?select=*`;
  const res = await fetch(url, {
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      Prefer: "return=representation",
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Supabase REST ${table}: ${res.status} ${body}`);
  }
  return res.json();
}

async function loadFromSupabaseRest(serviceKey) {
  const tables = [
    "users",
    "drugs",
    "allergies",
    "completedDrugs",
    "drugHistory",
    "schedule",
  ];
  const out = {};
  for (const table of tables) {
    out[table] = await fetchSupabaseRest(table, serviceKey);
    console.log(`  ${table}: ${out[table].length} rows`);
  }
  return out;
}

async function loadFromSupabasePg(sourcePool) {
  const client = await sourcePool.connect();
  try {
    const tables = [
      "users",
      "drugs",
      "allergies",
      "completedDrugs",
      "drugHistory",
      "schedule",
    ];
    const out = {};
    for (const table of tables) {
      const quoted = table === "completedDrugs" || table === "drugHistory"
        ? `"${table}"`
        : table;
      const { rows } = await client.query(`SELECT * FROM ${quoted}`);
      out[table] = rows;
      console.log(`  ${table}: ${rows.length} rows`);
    }
    return out;
  } finally {
    client.release();
  }
}

async function fetchClerkUsersByEmail(secretKey) {
  const map = new Map();
  let offset = 0;
  const limit = 100;
  for (;;) {
    const res = await fetch(
      `https://api.clerk.com/v1/users?limit=${limit}&offset=${offset}`,
      { headers: { Authorization: `Bearer ${secretKey}` } }
    );
    if (!res.ok) {
      throw new Error(`Clerk API: ${res.status} ${await res.text()}`);
    }
    const users = await res.json();
    if (!users.length) break;
    for (const u of users) {
      const primary =
        u.email_addresses?.find((e) => e.id === u.primary_email_address_id) ||
        u.email_addresses?.[0];
      const email = primary?.email_address?.toLowerCase();
      if (email) map.set(email, u.id);
    }
    if (users.length < limit) break;
    offset += limit;
  }
  return map;
}

function mapUserId(oldId, email, clerkByEmail) {
  const mapped = email ? clerkByEmail.get(email.toLowerCase()) : undefined;
  if (mapped) return { id: mapped, mapped: true };
  return { id: oldId, mapped: false };
}

function pick(row, ...keys) {
  for (const k of keys) {
    if (row[k] !== undefined && row[k] !== null) return row[k];
  }
  return undefined;
}

async function migrateToNeon(data, clerkByEmail, targetPool) {
  const idMap = new Map();
  const client = await targetPool.connect();

  try {
    await client.query("BEGIN");

    for (const row of data.users || []) {
      const oldId = String(pick(row, "userId", "userid", "user_id"));
      const email = String(pick(row, "email") ?? "");
      const { id: newId, mapped } = mapUserId(oldId, email, clerkByEmail);
      idMap.set(oldId, newId);

      const profileFile = pick(
        row,
        "profilePicture",
        "profile_picture",
        "profilepicture"
      );
      const profileUrl =
        pick(row, "profile_picture_url", "profilePictureUrl") ||
        (profileFile
          ? `${STORAGE_PUBLIC}/${oldId}/${profileFile}`
          : "");

      await client.query(
        `INSERT INTO users ("userId", name, phone, email, theme, profile_picture, profile_picture_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT ("userId") DO UPDATE SET
           name = EXCLUDED.name,
           phone = EXCLUDED.phone,
           email = EXCLUDED.email,
           theme = EXCLUDED.theme,
           profile_picture = COALESCE(NULLIF(EXCLUDED.profile_picture, ''), users.profile_picture),
           profile_picture_url = COALESCE(NULLIF(EXCLUDED.profile_picture_url, ''), users.profile_picture_url)`,
        [
          newId,
          String(pick(row, "name") ?? ""),
          String(pick(row, "phone") ?? ""),
          email,
          String(pick(row, "theme") ?? "light"),
          String(profileFile ?? ""),
          String(profileUrl ?? ""),
        ]
      );

      if (!mapped) {
        console.warn(
          `  ⚠ No Clerk user for email "${email}" — kept Supabase id ${oldId} (sign-in with Clerk will not see this data)`
        );
      }
    }

    for (const row of data.drugs || []) {
      const oldUser = String(pick(row, "userId", "userid"));
      const userId = idMap.get(oldUser) ?? oldUser;
      await client.query(
        `INSERT INTO drugs ("userId", drug, frequency, route, start, "end", time, reminder, "drugId")
         VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8, $9)`,
        [
          userId,
          String(row.drug ?? ""),
          String(row.frequency ?? ""),
          String(row.route ?? ""),
          String(row.start ?? ""),
          String(pick(row, "end", "End") ?? ""),
          JSON.stringify(row.time ?? []),
          Boolean(row.reminder ?? true),
          String(pick(row, "drugId", "drugid") ?? ""),
        ]
      );
    }

    for (const row of data.allergies || []) {
      const oldUser = String(pick(row, "userId", "userid"));
      const userId = idMap.get(oldUser) ?? oldUser;
      await client.query(
        `INSERT INTO allergies ("userId", drug, frequency, route, start, "end", time, reminder, "drugId")
         VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8, $9)`,
        [
          userId,
          String(row.drug ?? ""),
          String(row.frequency ?? ""),
          String(row.route ?? ""),
          String(row.start ?? ""),
          String(pick(row, "end", "End") ?? ""),
          JSON.stringify(row.time ?? []),
          Boolean(row.reminder ?? true),
          String(pick(row, "drugId", "drugid") ?? ""),
        ]
      );
    }

    for (const row of data.completedDrugs || []) {
      const oldUser = String(pick(row, "userId", "userid"));
      const userId = idMap.get(oldUser) ?? oldUser;
      const completed = pick(row, "completedDrugs", "completeddrugs") ?? [];
      await client.query(
        `INSERT INTO "completedDrugs" ("userId", "completedDrugs")
         VALUES ($1, $2::jsonb)
         ON CONFLICT ("userId") DO UPDATE SET "completedDrugs" = EXCLUDED."completedDrugs"`,
        [userId, JSON.stringify(completed)]
      );
    }

    for (const row of data.drugHistory || []) {
      const oldUser = String(pick(row, "userId", "userid"));
      const userId = idMap.get(oldUser) ?? oldUser;
      await client.query(
        `INSERT INTO "drugHistory" ("userId", "otcDrugs", herbs)
         VALUES ($1, $2, $3)
         ON CONFLICT ("userId") DO UPDATE SET
           "otcDrugs" = EXCLUDED."otcDrugs",
           herbs = EXCLUDED.herbs`,
        [
          userId,
          String(pick(row, "otcDrugs", "otcdrugs") ?? ""),
          String(row.herbs ?? ""),
        ]
      );
    }

    for (const row of data.schedule || []) {
      const oldUser = String(pick(row, "userId", "userid"));
      const userId = idMap.get(oldUser) ?? oldUser;
      const schedule = row.schedule ?? [];
      await client.query(
        `INSERT INTO schedule ("userId", schedule)
         VALUES ($1, $2::jsonb)
         ON CONFLICT ("userId") DO UPDATE SET schedule = EXCLUDED.schedule`,
        [userId, JSON.stringify(schedule)]
      );
    }

    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}

async function main() {
  const targetUrl = process.env.DATABASE_URL;
  const clerkSecret = process.env.CLERK_SECRET_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const sourceUrl = process.env.SUPABASE_DATABASE_URL;

  if (!targetUrl) {
    console.error("Missing DATABASE_URL (Neon target)");
    process.exit(1);
  }
  if (!clerkSecret) {
    console.error("Missing CLERK_SECRET_KEY (for user id mapping by email)");
    process.exit(1);
  }
  if (!serviceKey && !sourceUrl) {
    console.error(
      "Missing Supabase source credentials.\n" +
        "Add SUPABASE_SERVICE_ROLE_KEY (Supabase → Project Settings → API)\n" +
        "  or SUPABASE_DATABASE_URL (Supabase → Database → connection string)\n" +
        "to .env, then run: npm run migrate:supabase"
    );
    process.exit(1);
  }

  console.log("Loading Clerk users for email → userId mapping...");
  const clerkByEmail = await fetchClerkUsersByEmail(clerkSecret);
  console.log(`  Clerk accounts: ${clerkByEmail.size}`);

  console.log("Reading Supabase data...");
  let data;
  if (sourceUrl) {
    const sourcePool = new Pool({ connectionString: sourceUrl });
    try {
      data = await loadFromSupabasePg(sourcePool);
    } finally {
      await sourcePool.end();
    }
  } else {
    data = await loadFromSupabaseRest(serviceKey);
  }

  const userCount = data.users?.length ?? 0;
  if (userCount === 0) {
    console.error(
      "No rows in Supabase `users` table. Check credentials (service role / DB URL) and project."
    );
    process.exit(1);
  }

  console.log("Writing to Neon...");
  const targetPool = new Pool({ connectionString: targetUrl });
  try {
    await migrateToNeon(data, clerkByEmail, targetPool);
  } finally {
    await targetPool.end();
  }

  console.log("Migration finished.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
