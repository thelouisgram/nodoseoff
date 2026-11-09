import type { NextApiRequest, NextApiResponse } from "next";
import { requireUserId } from "@/lib/server/auth";
import { getSql } from "@/lib/db";
import { deleteCloudinaryAsset } from "@/lib/cloudinary";
import { uploadProfileImage } from "@/lib/cloudinary";

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
        await sql`
          INSERT INTO drugs ("userId", drug, frequency, route, start, "end", time, reminder, "drugId")
          VALUES (
            ${userId},
            ${String(p.drug)},
            ${String(p.frequency ?? "")},
            ${String(p.route ?? "")},
            ${String(p.start ?? "")},
            ${String(p.end ?? "")},
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
        await sql`
          UPDATE schedule SET schedule = ${JSON.stringify(payload.schedule ?? [])}::jsonb
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
      case "uploadProfilePicture": {
        const { fileBase64, filename } = payload as {
          fileBase64: string;
          filename: string;
        };
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
    const message =
      e instanceof Error ? e.message : "Mutation failed";
    const isCloudinary =
      action === "uploadProfilePicture" ||
      message.includes("Cloudinary") ||
      message.includes("cloud_name");
    return res.status(isCloudinary ? 400 : 500).json({
      error: isCloudinary
        ? "Profile upload failed. Check CLOUDINARY_CLOUD_NAME, API_KEY, and API_SECRET in .env."
        : "Mutation failed",
      detail: message,
    });
  }
}
