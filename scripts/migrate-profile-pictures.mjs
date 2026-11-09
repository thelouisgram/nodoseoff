/**
 * Downloads profile images from Supabase public storage (or existing URLs)
 * and uploads them to Cloudinary, then updates Neon users rows.
 *
 * Required: DATABASE_URL, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 * Optional: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (to scan storage when DB has no paths)
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Pool } from "@neondatabase/serverless";
import { v2 as cloudinary } from "cloudinary";

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

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function alreadyOnCloudinary(row) {
  const url = String(row.profile_picture_url || row.profile_picture || "");
  return url.includes("cloudinary.com") || url.includes("nodoseoff/profiles/");
}

function imageUrlForUser(row) {
  if (alreadyOnCloudinary(row)) return null;
  const url = String(row.profile_picture_url || "").trim();
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return { targetUserId: String(row.userId), sourceUrl: url };
  }
  const file = String(row.profile_picture || "").trim();
  if (!file) return null;
  if (file.startsWith("http://") || file.startsWith("https://")) {
    return { targetUserId: String(row.userId), sourceUrl: file };
  }
  const userId = String(row.userId);
  const path = file.includes("/") ? file : `${userId}/${file}`;
  return { targetUserId: userId, sourceUrl: `${STORAGE_PUBLIC}/${path}` };
}

function pickNeonUserIdForEmail(neonRows, email, legacyUserId) {
  const normalized = normalizeEmail(email);
  const matches = neonRows.filter((r) => normalizeEmail(r.email) === normalized);
  const clerk = matches.find((r) => String(r.userId).startsWith("user_"));
  if (clerk) return String(clerk.userId);
  const sameLegacy = matches.find((r) => String(r.userId) === legacyUserId);
  if (sameLegacy) return String(sameLegacy.userId);
  const byId = neonRows.find((r) => String(r.userId) === legacyUserId);
  if (byId) return String(byId.userId);
  return matches[0] ? String(matches[0].userId) : legacyUserId;
}

async function supabaseStorageList(serviceKey, prefix = "") {
  const res = await fetch(`${SUPABASE_PUBLIC_BASE}/storage/v1/object/list/profile-picture`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prefix, limit: 200, offset: 0 }),
  });
  if (!res.ok) {
    throw new Error(`Storage list failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

async function fetchSupabaseUsers(serviceKey) {
  const res = await fetch(`${SUPABASE_PUBLIC_BASE}/rest/v1/users?select=userId,email`, {
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
    },
  });
  if (!res.ok) throw new Error(`Supabase users: ${res.status}`);
  return res.json();
}

async function uploadAndUpdate(pool, folder, targetUserId, sourceUrl, label) {
  console.log(`Migrating ${label} ← ${sourceUrl}`);
  const res = await fetch(sourceUrl);
  if (!res.ok) {
    console.warn(`  SKIP fetch ${res.status}`);
    return false;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  const base64 = buf.toString("base64");
  const ext = sourceUrl.split(".").pop()?.split("?")[0] || "jpg";

  const result = await cloudinary.uploader.upload(
    `data:image/${ext};base64,${base64}`,
    {
      folder,
      public_id: `${targetUserId}/migrated-${Date.now()}`,
      overwrite: true,
      resource_type: "image",
    }
  );

  const updated = await pool.query(
    `UPDATE users SET profile_picture = $1, profile_picture_url = $2 WHERE "userId" = $3`,
    [result.public_id, result.secure_url, targetUserId]
  );
  if (!updated.rowCount) {
    console.warn(`  SKIP no Neon user row for ${targetUserId}`);
    return false;
  }
  console.log(`  → ${result.secure_url}`);
  return true;
}

async function main() {
  const {
    DATABASE_URL,
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
    SUPABASE_SERVICE_ROLE_KEY,
  } = process.env;
  if (!DATABASE_URL) throw new Error("DATABASE_URL is required");
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary env vars are required");
  }

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });

  const folder = process.env.CLOUDINARY_PROFILE_FOLDER || "nodoseoff/profiles";
  const pool = new Pool({ connectionString: DATABASE_URL });
  const { rows: neonRows } = await pool.query(
    `SELECT "userId", profile_picture, profile_picture_url, email FROM users`
  );

  let migrated = 0;
  let skipped = 0;
  const updatedUserIds = new Set();

  for (const row of neonRows) {
    const job = imageUrlForUser(row);
    if (!job) {
      skipped += 1;
      continue;
    }
    try {
      const ok = await uploadAndUpdate(
        pool,
        folder,
        job.targetUserId,
        job.sourceUrl,
        row.email || job.targetUserId
      );
      if (ok) {
        migrated += 1;
        updatedUserIds.add(job.targetUserId);
      } else skipped += 1;
    } catch (err) {
      console.warn(`  FAIL`, err.message || err);
      skipped += 1;
    }
  }

  if (SUPABASE_SERVICE_ROLE_KEY) {
    console.log("\nScanning Supabase storage bucket…");
    const supabaseUsers = await fetchSupabaseUsers(SUPABASE_SERVICE_ROLE_KEY);
    const emailByLegacyId = new Map(
      supabaseUsers.map((u) => [String(u.userId), String(u.email || "")])
    );
    const legacyIdsByEmail = new Map();
    for (const u of supabaseUsers) {
      const email = normalizeEmail(u.email);
      if (!email) continue;
      const list = legacyIdsByEmail.get(email) || [];
      list.push(String(u.userId));
      legacyIdsByEmail.set(email, list);
    }

    async function latestImageInFolder(legacyUserId) {
      const files = await supabaseStorageList(
        SUPABASE_SERVICE_ROLE_KEY,
        `${legacyUserId}/`
      );
      const imageFile = files
        .map((f) => String(f.name))
        .filter((n) => /\.(jpe?g|png|gif|webp)$/i.test(n))
        .sort()
        .pop();
      if (!imageFile) return null;
      return `${STORAGE_PUBLIC}/${legacyUserId}/${imageFile}`;
    }

    const neonUserIds = new Set(neonRows.map((r) => String(r.userId)));

    for (const neonRow of neonRows) {
      const targetUserId = String(neonRow.userId);
      if (alreadyOnCloudinary(neonRow)) {
        skipped += 1;
        continue;
      }

      const email = normalizeEmail(neonRow.email);
      const legacyIds = new Set([
        ...(legacyIdsByEmail.get(email) || []),
        targetUserId,
      ]);

      let sourceUrl = null;
      for (const legacyUserId of legacyIds) {
        sourceUrl = await latestImageInFolder(legacyUserId);
        if (sourceUrl) break;
      }
      if (!sourceUrl) continue;

      try {
        const ok = await uploadAndUpdate(
          pool,
          folder,
          targetUserId,
          sourceUrl,
          neonRow.email || targetUserId
        );
        if (ok) {
          migrated += 1;
          updatedUserIds.add(targetUserId);
        } else skipped += 1;
      } catch (err) {
        console.warn(`  FAIL`, err.message || err);
        skipped += 1;
      }
    }

    const topFolders = await supabaseStorageList(SUPABASE_SERVICE_ROLE_KEY);
    for (const entry of topFolders) {
      const legacyUserId = String(entry.name);
      const email = emailByLegacyId.get(legacyUserId) || "";
      const targetUserId = pickNeonUserIdForEmail(neonRows, email, legacyUserId);
      if (!neonUserIds.has(targetUserId) || updatedUserIds.has(targetUserId)) {
        continue;
      }
      const targetRow = neonRows.find((r) => String(r.userId) === targetUserId);
      if (targetRow && alreadyOnCloudinary(targetRow)) {
        skipped += 1;
        continue;
      }

      const sourceUrl = await latestImageInFolder(legacyUserId);
      if (!sourceUrl) continue;

      try {
        const ok = await uploadAndUpdate(
          pool,
          folder,
          targetUserId,
          sourceUrl,
          email || legacyUserId
        );
        if (ok) {
          migrated += 1;
          updatedUserIds.add(targetUserId);
        } else skipped += 1;
      } catch (err) {
        console.warn(`  FAIL`, err.message || err);
        skipped += 1;
      }
    }
  } else {
    console.log("\nSet SUPABASE_SERVICE_ROLE_KEY to migrate images only in storage.");
  }

  await pool.end();
  console.log(`\nDone. migrated=${migrated} skipped=${skipped}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
