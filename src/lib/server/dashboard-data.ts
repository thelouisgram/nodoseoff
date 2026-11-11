import { getSql } from "@/lib/db";

export async function loadDashboardForUser(userId: string) {
  const sql = getSql();

  const [
    userRows,
    drugRows,
    completedRows,
    allergyRows,
    historyRows,
    scheduleRows,
    appointmentRows,
    journalResult,
  ] = await Promise.all([
      sql`SELECT name, phone, email, theme, profile_picture, profile_picture_url FROM users WHERE "userId" = ${userId} LIMIT 1`,
      sql`SELECT id, drug, frequency, route, start, "end", time, reminder, "drugId" FROM drugs WHERE "userId" = ${userId}`,
      sql`SELECT "completedDrugs" FROM "completedDrugs" WHERE "userId" = ${userId} LIMIT 1`,
      sql`SELECT drug, frequency, route, start, "end", time, reminder, "drugId" FROM allergies WHERE "userId" = ${userId}`,
      sql`SELECT "otcDrugs", herbs FROM "drugHistory" WHERE "userId" = ${userId} LIMIT 1`,
      sql`SELECT schedule FROM schedule WHERE "userId" = ${userId} LIMIT 1`,
      sql`SELECT doctor, location, starts_at, notes FROM appointments WHERE "userId" = ${userId} LIMIT 1`,
      sql`
        SELECT id, kind, mood, severity, symptom, drug, "drugId", notes, logged_at
        FROM health_journal
        WHERE "userId" = ${userId}
        ORDER BY logged_at DESC
        LIMIT 80
      `.catch((error: unknown) => {
        // Don't take down the whole dashboard if the journal migration isn't on this DB yet.
        const code =
          error && typeof error === "object" && "code" in error
            ? String((error as { code?: string }).code || "")
            : "";
        if (code === "42P01") {
          console.warn("health_journal missing; returning empty journal");
          return [] as Record<string, unknown>[];
        }
        throw error;
      }),
    ]);

  const journalRows = journalResult as Record<string, unknown>[];

  const user = userRows[0];
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  const drugs = drugRows as Array<Record<string, unknown>>;
  const existingCompleted =
    (completedRows[0] as { completedDrugs?: unknown })?.completedDrugs ?? [];

  const today = new Date();
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(today.getDate() - 2);

  const activeDrugs: unknown[] = [];
  const expiredDrugs: unknown[] = [];

  for (const drug of drugs) {
    if (new Date(String(drug.end)) > twoDaysAgo) {
      activeDrugs.push(drug);
    } else {
      expiredDrugs.push(drug);
    }
  }

  // Merge + dedupe by drugId (fallback: id) so completed list keys stay unique.
  const completedByKey = new Map<string, unknown>();
  const completedSeed = [
    ...(Array.isArray(existingCompleted) ? existingCompleted : []),
    ...expiredDrugs,
  ];
  for (const item of completedSeed) {
    const row = item as { drugId?: string; id?: number; drug?: string };
    const key =
      (typeof row.drugId === "string" && row.drugId) ||
      (row.id != null ? `id:${row.id}` : undefined) ||
      (typeof row.drug === "string" ? row.drug : undefined);
    if (!key) continue;
    completedByKey.set(key, item);
  }
  const updatedCompletedList = Array.from(completedByKey.values());

  const profileUrl = String(user.profile_picture_url || "");
  const profilePicture =
    profileUrl ||
    (user.profile_picture ? String(user.profile_picture) : "");

  const appointmentRow = appointmentRows[0] as
    | {
        doctor?: string;
        location?: string;
        starts_at?: string | Date;
        notes?: string;
      }
    | undefined;

  const appointment = appointmentRow?.starts_at
    ? {
        doctor: String(appointmentRow.doctor ?? ""),
        location: String(appointmentRow.location ?? ""),
        startsAt: new Date(appointmentRow.starts_at).toISOString(),
        notes: String(appointmentRow.notes ?? ""),
      }
    : null;

  const healthJournal = (journalRows as Array<Record<string, unknown>>).map(
    (row) => ({
      id: Number(row.id),
      kind: String(row.kind || "note"),
      mood: String(row.mood ?? ""),
      severity:
        row.severity == null || row.severity === ""
          ? null
          : Number(row.severity),
      symptom: String(row.symptom ?? ""),
      drug: String(row.drug ?? ""),
      drugId: String(row.drugId ?? ""),
      notes: String(row.notes ?? ""),
      loggedAt: new Date(String(row.logged_at)).toISOString(),
    })
  );

  return {
    userInfo: [
      {
        name: user.name,
        phone: user.phone,
        email: user.email,
        theme: user.theme,
      },
    ],
    profilePicture,
    profilePictureUrl: profileUrl,
    allergies: allergyRows,
    herbs: historyRows[0]?.herbs ?? "",
    otcDrugs: historyRows[0]?.otcDrugs ?? "",
    schedule: scheduleRows[0]?.schedule ?? [],
    appointment,
    healthJournal,
    activeDrugs,
    expiredDrugs,
    updatedCompletedList,
  };
}

export async function cleanupExpiredDrugs(
  userId: string,
  updatedCompletedList: unknown[],
  expiredDrugs: Array<{ id?: number }>
) {
  const sql = getSql();
  const ids = expiredDrugs.map((d) => d.id).filter((id): id is number => typeof id === "number");
  await sql`
    UPDATE "completedDrugs"
    SET "completedDrugs" = ${JSON.stringify(updatedCompletedList)}::jsonb
    WHERE "userId" = ${userId}
  `;
  if (ids.length > 0) {
    await sql`DELETE FROM drugs WHERE "userId" = ${userId} AND id = ANY(${ids})`;
  }
}

export async function deleteAllUserData(userId: string) {
  const sql = getSql();
  const user = await sql`
    SELECT profile_picture FROM users WHERE "userId" = ${userId} LIMIT 1
  `;
  const publicId = user[0]?.profile_picture as string | undefined;
  await Promise.all([
    sql`DELETE FROM drugs WHERE "userId" = ${userId}`,
    sql`DELETE FROM allergies WHERE "userId" = ${userId}`,
    sql`DELETE FROM schedule WHERE "userId" = ${userId}`,
    sql`DELETE FROM "completedDrugs" WHERE "userId" = ${userId}`,
    sql`DELETE FROM "drugHistory" WHERE "userId" = ${userId}`,
    sql`DELETE FROM appointments WHERE "userId" = ${userId}`,
    sql`DELETE FROM health_journal WHERE "userId" = ${userId}`,
  ]);
  await sql`DELETE FROM users WHERE "userId" = ${userId}`;
  return publicId ?? "";
}

export async function bootstrapUser(
  userId: string,
  data: { name: string; phone: string; email: string },
  options?: { onlyIfMissing?: boolean }
) {
  const sql = getSql();
  if (options?.onlyIfMissing) {
    await sql`
      INSERT INTO users ("userId", name, phone, email)
      VALUES (${userId}, ${data.name}, ${data.phone}, ${data.email})
      ON CONFLICT ("userId") DO NOTHING
    `;
  } else {
    await sql`
      INSERT INTO users ("userId", name, phone, email)
      VALUES (${userId}, ${data.name}, ${data.phone}, ${data.email})
      ON CONFLICT ("userId") DO UPDATE SET
        name = EXCLUDED.name,
        phone = EXCLUDED.phone,
        email = EXCLUDED.email
    `;
  }
  await sql`
    INSERT INTO schedule ("userId", schedule) VALUES (${userId}, '[]'::jsonb)
    ON CONFLICT ("userId") DO NOTHING
  `;
  await sql`
    INSERT INTO "completedDrugs" ("userId", "completedDrugs") VALUES (${userId}, '[]'::jsonb)
    ON CONFLICT ("userId") DO NOTHING
  `;
  await sql`
    INSERT INTO "drugHistory" ("userId", "otcDrugs", herbs) VALUES (${userId}, '', '')
    ON CONFLICT ("userId") DO NOTHING
  `;
}

function jsonLength(value: unknown): number {
  return Array.isArray(value) ? value.length : 0;
}

/** Move all Neon rows from a legacy Supabase userId onto the signed-in Clerk userId. */
export async function mergeUserDataIntoAccount(
  fromUserId: string,
  toUserId: string
): Promise<void> {
  if (fromUserId === toUserId) return;
  const sql = getSql();

  const fromUsers = await sql`
    SELECT name, phone, email, theme, profile_picture, profile_picture_url
    FROM users WHERE "userId" = ${fromUserId} LIMIT 1
  `;
  if (!fromUsers[0]) return;

  const from = fromUsers[0];

  await sql`
    UPDATE users SET
      name = CASE WHEN ${from.name}::text <> '' THEN ${from.name} ELSE name END,
      phone = CASE WHEN ${from.phone}::text <> '' THEN ${from.phone} ELSE phone END,
      theme = COALESCE(${from.theme}, theme),
      profile_picture = CASE WHEN ${from.profile_picture}::text <> '' THEN ${from.profile_picture} ELSE profile_picture END,
      profile_picture_url = CASE WHEN ${from.profile_picture_url}::text <> '' THEN ${from.profile_picture_url} ELSE profile_picture_url END
    WHERE "userId" = ${toUserId}
  `;

  const [fromSchedule, toSchedule] = await Promise.all([
    sql`SELECT schedule FROM schedule WHERE "userId" = ${fromUserId} LIMIT 1`,
    sql`SELECT schedule FROM schedule WHERE "userId" = ${toUserId} LIMIT 1`,
  ]);
  const fromSched = fromSchedule[0]?.schedule;
  const toSched = toSchedule[0]?.schedule;
  const fromSchedLen = jsonLength(fromSched);
  const toSchedLen = jsonLength(toSched);
  if (fromSchedLen > 0) {
    if (toSchedLen > 0) {
      const merged = [
        ...(Array.isArray(toSched) ? toSched : []),
        ...(Array.isArray(fromSched) ? fromSched : []),
      ];
      await sql`
        UPDATE schedule SET schedule = ${JSON.stringify(merged)}::jsonb
        WHERE "userId" = ${toUserId}
      `;
      await sql`DELETE FROM schedule WHERE "userId" = ${fromUserId}`;
    } else {
      await sql`DELETE FROM schedule WHERE "userId" = ${toUserId}`;
      await sql`
        UPDATE schedule SET "userId" = ${toUserId} WHERE "userId" = ${fromUserId}
      `;
    }
  }

  const [fromCompleted, toCompleted] = await Promise.all([
    sql`SELECT "completedDrugs" FROM "completedDrugs" WHERE "userId" = ${fromUserId} LIMIT 1`,
    sql`SELECT "completedDrugs" FROM "completedDrugs" WHERE "userId" = ${toUserId} LIMIT 1`,
  ]);
  const fromComp = fromCompleted[0]?.completedDrugs ?? [];
  const toComp = toCompleted[0]?.completedDrugs ?? [];
  if (jsonLength(fromComp) > 0) {
    const merged = [
      ...(Array.isArray(toComp) ? toComp : []),
      ...(Array.isArray(fromComp) ? fromComp : []),
    ];
    await sql`
      INSERT INTO "completedDrugs" ("userId", "completedDrugs")
      VALUES (${toUserId}, ${JSON.stringify(merged)}::jsonb)
      ON CONFLICT ("userId") DO UPDATE SET "completedDrugs" = EXCLUDED."completedDrugs"
    `;
    await sql`DELETE FROM "completedDrugs" WHERE "userId" = ${fromUserId}`;
  }

  const [fromHistory, toHistory] = await Promise.all([
    sql`SELECT "otcDrugs", herbs FROM "drugHistory" WHERE "userId" = ${fromUserId} LIMIT 1`,
    sql`SELECT "otcDrugs", herbs FROM "drugHistory" WHERE "userId" = ${toUserId} LIMIT 1`,
  ]);
  if (fromHistory[0]) {
    const otc =
      String(fromHistory[0].otcDrugs || "") ||
      String(toHistory[0]?.otcDrugs || "");
    const herbs =
      String(fromHistory[0].herbs || "") || String(toHistory[0]?.herbs || "");
    await sql`
      INSERT INTO "drugHistory" ("userId", "otcDrugs", herbs)
      VALUES (${toUserId}, ${otc}, ${herbs})
      ON CONFLICT ("userId") DO UPDATE SET
        "otcDrugs" = CASE WHEN EXCLUDED."otcDrugs" <> '' THEN EXCLUDED."otcDrugs" ELSE "drugHistory"."otcDrugs" END,
        herbs = CASE WHEN EXCLUDED.herbs <> '' THEN EXCLUDED.herbs ELSE "drugHistory".herbs END
    `;
    await sql`DELETE FROM "drugHistory" WHERE "userId" = ${fromUserId}`;
  }

  await sql`UPDATE drugs SET "userId" = ${toUserId} WHERE "userId" = ${fromUserId}`;
  await sql`UPDATE allergies SET "userId" = ${toUserId} WHERE "userId" = ${fromUserId}`;

  const [fromAppt, toAppt] = await Promise.all([
    sql`SELECT doctor, location, starts_at, notes FROM appointments WHERE "userId" = ${fromUserId} LIMIT 1`,
    sql`SELECT "userId" FROM appointments WHERE "userId" = ${toUserId} LIMIT 1`,
  ]);
  if (fromAppt[0] && !toAppt[0]) {
    await sql`
      UPDATE appointments SET "userId" = ${toUserId} WHERE "userId" = ${fromUserId}
    `;
  } else if (fromAppt[0]) {
    await sql`DELETE FROM appointments WHERE "userId" = ${fromUserId}`;
  }

  await sql`
    UPDATE health_journal SET "userId" = ${toUserId}
    WHERE "userId" = ${fromUserId}
  `;

  await sql`DELETE FROM users WHERE "userId" = ${fromUserId}`;
}

/** Attach legacy Supabase rows (same email, different userId) to the Clerk account. */
export async function linkLegacyAccountsByEmail(
  clerkUserId: string,
  email: string
): Promise<number> {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return 0;

  const sql = getSql();
  const legacy = await sql`
    SELECT "userId" FROM users
    WHERE lower(trim(email)) = ${normalized} AND "userId" <> ${clerkUserId}
  `;

  let linked = 0;
  for (const row of legacy) {
    const oldId = String(row.userId);
    await mergeUserDataIntoAccount(oldId, clerkUserId);
    linked += 1;
  }
  return linked;
}
