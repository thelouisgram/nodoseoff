import type { NextApiRequest, NextApiResponse } from "next";
import { requireUserId } from "@/lib/server/auth";
import { getSql } from "@/lib/db";
import { deleteCloudinaryAsset } from "@/lib/cloudinary";
import { uploadProfileImage } from "@/lib/cloudinary";
import { isAllergicToDrug, sameDrugName } from "@/utils/drugs";

type MutationBody = {
  action: string;
  payload?: Record<string, unknown>;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let userId: string;
  try {
    userId = await requireUserId(req);
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { action, payload = {} } = req.body as MutationBody;
  const sql = getSql();

  try {
    switch (action) {
      case "insertDrug": {
        const p = payload as Record<string, unknown>;
        const drugName = String(p.drug || "").trim().toLowerCase();
        const start = String(p.start ?? "").slice(0, 10);
        const end = String(p.end ?? "").slice(0, 10);
        if (!drugName || !start || !end) {
          return res.status(400).json({ error: "Drug name, start, and end are required" });
        }
        if (end < start) {
          return res.status(400).json({ error: "End date cannot be before start date" });
        }

        const allergyOverride = Boolean(p.allergyOverride);
        const allergyRows = await sql`
          SELECT drug FROM allergies WHERE "userId" = ${userId}
        `;
        if (
          !allergyOverride &&
          isAllergicToDrug(
            drugName,
            allergyRows as Array<{ drug?: string | null }>
          )
        ) {
          return res.status(409).json({
            error: `'${drugName}' is a known drug allergy. Confirm override if a clinician still needs you on it.`,
          });
        }

        const existing = await sql`
          SELECT drug, start, "end", "drugId"
          FROM drugs
          WHERE "userId" = ${userId}
        `;
        const overlap = (existing as Array<Record<string, unknown>>).find(
          (row) => {
            if (!sameDrugName(String(row.drug || ""), drugName)) return false;
            const aStart = String(row.start || "").slice(0, 10);
            const aEnd = String(row.end || "").slice(0, 10);
            if (!aStart || !aEnd) return false;
            return start <= aEnd && aStart <= end;
          }
        );
        if (overlap) {
          return res.status(409).json({
            error:
              "This medication already has an active course in that date range. Wait until it ends, or start the next course the day after.",
          });
        }

        await sql`
          INSERT INTO drugs ("userId", drug, frequency, route, start, "end", time, reminder, "drugId")
          VALUES (
            ${userId},
            ${drugName},
            ${String(p.frequency ?? "")},
            ${String(p.route ?? "")},
            ${start},
            ${end},
            ${JSON.stringify(p.time ?? [])}::jsonb,
            ${Boolean(p.reminder)},
            ${String(p.drugId ?? "")}
          )
        `;
        break;
      }
      case "updateDrug": {
        const p = payload as Record<string, unknown>;
        await sql`
          UPDATE drugs SET
            drug = ${String(p.drug)},
            frequency = ${String(p.frequency ?? "")},
            route = ${String(p.route ?? "")},
            start = ${String(p.start ?? "")},
            "end" = ${String(p.end ?? "")},
            time = ${JSON.stringify(p.time ?? [])}::jsonb,
            reminder = ${Boolean(p.reminder)}
          WHERE "userId" = ${userId} AND drug = ${String(p.activeDrug)}
        `;
        break;
      }
      case "deleteDrug": {
        await sql`DELETE FROM drugs WHERE "userId" = ${userId} AND drug = ${String(payload.drug)}`;
        break;
      }
      case "updateSchedule": {
        const schedule = payload.schedule;
        if (!Array.isArray(schedule)) {
          return res.status(400).json({ error: "schedule must be an array" });
        }
        if (schedule.length > 20_000) {
          return res.status(400).json({ error: "schedule too large" });
        }
        await sql`
          UPDATE schedule SET schedule = ${JSON.stringify(schedule)}::jsonb
          WHERE "userId" = ${userId}
        `;
        break;
      }
      case "updateCompletedDrugs": {
        await sql`
          UPDATE "completedDrugs" SET "completedDrugs" = ${JSON.stringify(payload.completedDrugs ?? [])}::jsonb
          WHERE "userId" = ${userId}
        `;
        break;
      }
      case "insertAllergy": {
        const p = payload as Record<string, unknown>;
        await sql`
          INSERT INTO allergies ("userId", drug, frequency, route, start, "end", time, reminder, "drugId")
          VALUES (
            ${userId},
            ${String(p.drug)},
            ${String(p.frequency ?? "")},
            ${String(p.route ?? "")},
            ${String(p.start ?? "")},
            ${String(p.end ?? "")},
            ${JSON.stringify(p.time ?? [])}::jsonb,
            ${Boolean(p.reminder ?? true)},
            ${String(p.drugId ?? "")}
          )
        `;
        break;
      }
      case "deleteAllergy": {
        await sql`DELETE FROM allergies WHERE "userId" = ${userId} AND drug = ${String(payload.drug)}`;
        break;
      }
      case "markAsAllergy": {
        const p = payload as Record<string, unknown>;
        const tab = String(p.tab);
        const drug = String(p.drug);
        const target = (p.target ?? {}) as Record<string, unknown>;
        if (tab === "ongoing") {
          await sql`DELETE FROM drugs WHERE "userId" = ${userId} AND drug = ${drug}`;
        } else if (tab === "completed") {
          await sql`
            UPDATE "completedDrugs" SET "completedDrugs" = ${JSON.stringify(p.updatedCompleted ?? [])}::jsonb
            WHERE "userId" = ${userId}
          `;
        }
        await sql`
          INSERT INTO allergies ("userId", drug, frequency, route, start, "end", time, reminder, "drugId")
          VALUES (
            ${userId},
            ${drug},
            ${String(target.frequency ?? "")},
            ${String(target.route ?? "")},
            ${String(target.start ?? "")},
            ${String(target.end ?? "")},
            ${JSON.stringify(target.time ?? [])}::jsonb,
            true,
            ${String(target.drugId ?? "")}
          )
        `;
        break;
      }
      case "updateProfile": {
        await sql`
          UPDATE users SET name = ${String(payload.name)}, phone = ${String(payload.phone)}
          WHERE "userId" = ${userId}
        `;
        break;
      }
      case "updateTheme": {
        await sql`
          UPDATE users SET theme = ${String(payload.theme)}
          WHERE "userId" = ${userId}
        `;
        break;
      }
      case "updateReminders": {
        const enabled = Boolean(payload.enabled);
        await sql`
          UPDATE drugs SET reminder = ${enabled}
          WHERE "userId" = ${userId}
        `;
        break;
      }
      case "updateDrugHistory": {
        await sql`
          UPDATE "drugHistory" SET "otcDrugs" = ${String(payload.otcDrugs)}, herbs = ${String(payload.herbs)}
          WHERE "userId" = ${userId}
        `;
        break;
      }
      case "upsertAppointment": {
        const doctor = String(payload.doctor ?? "").trim().slice(0, 120);
        const location = String(payload.location ?? "").trim().slice(0, 200);
        const notes = String(payload.notes ?? "").trim().slice(0, 500);
        const startsAtRaw = String(payload.startsAt ?? "").trim();
        const startsAt = new Date(startsAtRaw);
        if (!startsAtRaw || Number.isNaN(startsAt.getTime())) {
          return res.status(400).json({ error: "Valid appointment date/time required" });
        }
        await sql`
          INSERT INTO appointments ("userId", doctor, location, starts_at, notes, updated_at)
          VALUES (
            ${userId},
            ${doctor},
            ${location},
            ${startsAt.toISOString()},
            ${notes},
            NOW()
          )
          ON CONFLICT ("userId") DO UPDATE SET
            doctor = EXCLUDED.doctor,
            location = EXCLUDED.location,
            starts_at = EXCLUDED.starts_at,
            notes = EXCLUDED.notes,
            updated_at = NOW()
        `;
        break;
      }
      case "deleteAppointment": {
        await sql`DELETE FROM appointments WHERE "userId" = ${userId}`;
        break;
      }
      case "insertHealthJournal": {
        const kindRaw = String(payload.kind ?? "").trim();
        const kind =
          kindRaw === "mood" || kindRaw === "side_effect" || kindRaw === "note"
            ? kindRaw
            : "";
        if (!kind) {
          return res.status(400).json({ error: "Invalid journal kind" });
        }
        const mood = String(payload.mood ?? "").trim().slice(0, 40);
        const symptom = String(payload.symptom ?? "").trim().slice(0, 120);
        const drug = String(payload.drug ?? "").trim().slice(0, 120);
        const drugId = String(payload.drugId ?? "").trim().slice(0, 120);
        const notes = String(payload.notes ?? "").trim().slice(0, 500);
        const severityRaw = payload.severity;
        let severity: number | null = null;
        if (severityRaw != null && severityRaw !== "") {
          const n = Number(severityRaw);
          if (!Number.isInteger(n) || n < 1 || n > 5) {
            return res.status(400).json({ error: "Severity must be 1–5" });
          }
          severity = n;
        }
        if (kind === "mood" && !mood) {
          return res.status(400).json({ error: "Pick a mood" });
        }
        if (kind === "side_effect" && !symptom) {
          return res.status(400).json({ error: "Describe the side effect" });
        }
        if (kind === "note" && !notes) {
          return res.status(400).json({ error: "Add a note" });
        }
        const loggedAtRaw = String(payload.loggedAt ?? "").trim();
        const loggedAt = loggedAtRaw ? new Date(loggedAtRaw) : new Date();
        if (Number.isNaN(loggedAt.getTime())) {
          return res.status(400).json({ error: "Invalid logged date" });
        }
        const rows = await sql`
          INSERT INTO health_journal (
            "userId", kind, mood, severity, symptom, drug, "drugId", notes, logged_at
          )
          VALUES (
            ${userId},
            ${kind},
            ${mood},
            ${severity},
            ${symptom},
            ${drug},
            ${drugId},
            ${notes},
            ${loggedAt.toISOString()}
          )
          RETURNING id, kind, mood, severity, symptom, drug, "drugId", notes, logged_at
        `;
        const row = rows[0] as Record<string, unknown>;
        return res.status(200).json({
          ok: true,
          entry: {
            id: Number(row.id),
            kind: String(row.kind),
            mood: String(row.mood ?? ""),
            severity: row.severity == null ? null : Number(row.severity),
            symptom: String(row.symptom ?? ""),
            drug: String(row.drug ?? ""),
            drugId: String(row.drugId ?? ""),
            notes: String(row.notes ?? ""),
            loggedAt: new Date(String(row.logged_at)).toISOString(),
          },
        });
      }
      case "deleteHealthJournal": {
        const id = Number(payload.id);
        if (!Number.isInteger(id) || id <= 0) {
          return res.status(400).json({ error: "Invalid entry id" });
        }
        await sql`
          DELETE FROM health_journal
          WHERE "userId" = ${userId} AND id = ${id}
        `;
        break;
      }
      case "uploadProfilePicture": {
        const { fileBase64, filename } = payload as {
          fileBase64: string;
          filename: string;
        };
        if (typeof fileBase64 !== "string" || !fileBase64) {
          return res.status(400).json({ error: "Missing image data" });
        }
        // ~5MB decoded ceiling (base64 is ~4/3 of binary size)
        if (fileBase64.length > 7_000_000) {
          return res.status(400).json({ error: "Image too large (max 5MB)" });
        }
        const lowerName = String(filename || "upload.jpg").toLowerCase();
        if (!/\.(jpe?g|png|webp|gif)$/.test(lowerName)) {
          return res.status(400).json({ error: "Unsupported image type" });
        }
        const existing = await sql`
          SELECT profile_picture FROM users WHERE "userId" = ${userId} LIMIT 1
        `;
        const currentPublicId = existing[0]?.profile_picture as string | undefined;
        if (currentPublicId) {
          await deleteCloudinaryAsset(currentPublicId);
        }
        const { publicId, url } = await uploadProfileImage(userId, fileBase64, filename);
        await sql`
          UPDATE users SET profile_picture = ${publicId}, profile_picture_url = ${url}
          WHERE "userId" = ${userId}
        `;
        return res.status(200).json({ profilePicture: url, publicId });
      }
      default:
        return res.status(400).json({ error: `Unknown action: ${action}` });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("mutation error", action, e);
    const message = e instanceof Error ? e.message : "Mutation failed";
    const isCloudinary =
      action === "uploadProfilePicture" ||
      message.includes("Cloudinary") ||
      message.includes("cloud_name");
    return res.status(isCloudinary ? 400 : 500).json({
      error: isCloudinary
        ? "Profile upload failed. Please try a smaller JPG or PNG."
        : "Mutation failed",
    });
  }
}
