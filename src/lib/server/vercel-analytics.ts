/**
 * Server-side Vercel Web Analytics + Observability helpers.
 * Requires VERCEL_ACCESS_TOKEN (https://vercel.com/account/tokens).
 * Project/team IDs fall back to deployment system env when unset.
 */

export type VercelSeriesPoint = {
  key: string;
  views: number;
  visitors?: number;
};

export type VercelAnalyticsPayload = {
  configured: boolean;
  message?: string;
  range: { since: string; until: string };
  totals: { pageviews: number; visitors: number };
  byDay: VercelSeriesPoint[];
  byPath: VercelSeriesPoint[];
  byCountry: VercelSeriesPoint[];
  byDevice: VercelSeriesPoint[];
  byReferrer: VercelSeriesPoint[];
  errors: Array<{
    name: string;
    count: number;
    route?: string;
    lastSeen?: string;
  }>;
  dashboardUrl: string;
};

function projectId() {
  return (
    process.env.VERCEL_PROJECT_ID ||
    process.env.VERCEL_PROJECT_ID_OVERRIDE ||
    ""
  ).trim();
}

function teamId() {
  return (
    process.env.VERCEL_TEAM_ID ||
    process.env.VERCEL_ORG_ID ||
    ""
  ).trim();
}

function accessToken() {
  return (
    process.env.VERCEL_ACCESS_TOKEN ||
    process.env.VERCEL_API_TOKEN ||
    ""
  ).trim();
}

function dashboardUrl() {
  const team = teamId() || "thelouisgrams-projects";
  const project = projectId() || "nodoseoff";
  // Prefer project name slug in the dashboard URL when we only have an id.
  const slug = project.startsWith("prj_") ? "nodoseoff" : project;
  return `https://vercel.com/${team}/${slug}/analytics`;
}

function rangeDays(days = 14) {
  const until = new Date();
  const since = new Date(until.getTime() - days * 24 * 60 * 60 * 1000);
  return { since: since.toISOString(), until: until.toISOString() };
}

function pickCount(row: Record<string, unknown>): number {
  for (const key of [
    "pageviews",
    "views",
    "count",
    "total",
    "devices",
    "visitors",
  ]) {
    const n = Number(row[key]);
    if (Number.isFinite(n)) return n;
  }
  return 0;
}

function pickVisitors(row: Record<string, unknown>): number | undefined {
  const n = Number(row.visitors ?? row.devices);
  return Number.isFinite(n) ? n : undefined;
}

function pickDimension(
  row: Record<string, unknown>,
  dim: string
): string {
  const v = row[dim] ?? row.key ?? row.groupId ?? row.name;
  if (v == null || v === "") return "Unknown";
  return String(v);
}

async function vercelGet(
  path: string,
  query: Record<string, string | string[] | undefined>
): Promise<unknown> {
  const token = accessToken();
  if (!token) throw new Error("MISSING_TOKEN");

  const url = new URL(`https://api.vercel.com${path}`);
  for (const [k, v] of Object.entries(query)) {
    if (v == null) continue;
    if (Array.isArray(v)) {
      for (const item of v) url.searchParams.append(k, item);
    } else {
      url.searchParams.set(k, v);
    }
  }
  const team = teamId();
  if (team && !url.searchParams.has("teamId")) {
    url.searchParams.set("teamId", team);
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Vercel API ${res.status}: ${body.slice(0, 240)}`);
  }
  return res.json();
}

async function aggregateVisits(
  by: string[],
  since: string,
  until: string,
  limit = 20
): Promise<VercelSeriesPoint[]> {
  const pid = projectId();
  const data = (await vercelGet("/v1/query/web-analytics/visits/aggregate", {
    projectId: pid,
    since,
    until,
    limit: String(limit),
    by,
  })) as { data?: Array<Record<string, unknown>> };

  const dim = by.find((d) => !["hour", "day", "week", "month", "year"].includes(d))
    || by[0]
    || "day";

  return (data.data || []).map((row) => {
    const key =
      dim === "day" || dim === "hour" || dim === "week" || dim === "month"
        ? String(row.timestamp || row[dim] || "")
        : pickDimension(row, dim);
    return {
      key: key || "Unknown",
      views: pickCount(row),
      visitors: pickVisitors(row),
    };
  });
}

async function countVisits(
  since: string,
  until: string
): Promise<{ pageviews: number; visitors: number }> {
  const pid = projectId();
  const data = (await vercelGet("/v1/query/web-analytics/visits/count", {
    projectId: pid,
    since,
    until,
  })) as {
    data?: { pageviews?: number; visitors?: number } | Array<Record<string, unknown>>;
  };

  if (data.data && !Array.isArray(data.data)) {
    return {
      pageviews: Number(data.data.pageviews || 0),
      visitors: Number(data.data.visitors || 0),
    };
  }
  if (Array.isArray(data.data) && data.data[0]) {
    return {
      pageviews: pickCount(data.data[0]),
      visitors: pickVisitors(data.data[0]) || 0,
    };
  }
  return { pageviews: 0, visitors: 0 };
}

async function fetchRuntimeErrors(): Promise<
  VercelAnalyticsPayload["errors"]
> {
  const pid = projectId();
  // Observability errors endpoint (best-effort; shape varies by plan)
  try {
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const data = (await vercelGet(`/v1/projects/${pid}/runtime-logs/errors`, {
      since,
      limit: "10",
    })) as {
      errors?: Array<Record<string, unknown>>;
      data?: Array<Record<string, unknown>>;
    };
    const rows = data.errors || data.data || [];
    return rows.slice(0, 10).map((row) => ({
      name: String(row.name || row.errorName || row.message || "Error"),
      count: Number(row.count || row.occurrences || 0) || 0,
      route: row.route ? String(row.route) : undefined,
      lastSeen: row.lastSeen
        ? String(row.lastSeen)
        : row.last_seen
          ? String(row.last_seen)
          : undefined,
    }));
  } catch {
    return [];
  }
}

export function vercelAnalyticsConfigured(): boolean {
  return Boolean(accessToken() && projectId());
}

export async function getVercelAnalytics(
  days = 14
): Promise<VercelAnalyticsPayload> {
  const range = rangeDays(days);
  const base: VercelAnalyticsPayload = {
    configured: false,
    range,
    totals: { pageviews: 0, visitors: 0 },
    byDay: [],
    byPath: [],
    byCountry: [],
    byDevice: [],
    byReferrer: [],
    errors: [],
    dashboardUrl: dashboardUrl(),
  };

  if (!accessToken()) {
    return {
      ...base,
      message:
        "Add VERCEL_ACCESS_TOKEN (Vercel → Account → Tokens) to load live Web Analytics here.",
    };
  }
  if (!projectId()) {
    return {
      ...base,
      message:
        "Missing VERCEL_PROJECT_ID. On Vercel deployments this is set automatically.",
    };
  }

  try {
    const [totals, byDay, byPath, byCountry, byDevice, byReferrer, errors] =
      await Promise.all([
        countVisits(range.since, range.until),
        aggregateVisits(["day"], range.since, range.until, 30),
        aggregateVisits(["requestPath"], range.since, range.until, 15),
        aggregateVisits(["country"], range.since, range.until, 10),
        aggregateVisits(["deviceType"], range.since, range.until, 8),
        aggregateVisits(["referrerHostname"], range.since, range.until, 10),
        fetchRuntimeErrors(),
      ]);

    return {
      configured: true,
      range,
      totals,
      byDay: byDay.reverse(),
      byPath,
      byCountry,
      byDevice,
      byReferrer,
      errors,
      dashboardUrl: dashboardUrl(),
    };
  } catch (err) {
    return {
      ...base,
      configured: false,
      message:
        err instanceof Error
          ? err.message
          : "Failed to load Vercel analytics",
    };
  }
}
