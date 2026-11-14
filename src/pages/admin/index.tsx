import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Globe2,
  LayoutDashboard,
  RefreshCw,
  Smartphone,
  Users as UsersIcon,
} from "lucide-react";
import { toast } from "@/lib/notify";
import { apiJson } from "@/lib/api-client";
import { useAuth } from "@/contexts/AuthContext";
import SeoHead from "@/components/seo/SeoHead";
import Loader from "@/components/dashboard/Loader";
import { SoftButton, SoftCard, SoftPage } from "@/components/ui/soft";

type Tab = "overview" | "analytics" | "users" | "visits";

type Overview = {
  users: number;
  drugs: number;
  visits24h: number;
  visits7d: number;
};

type AdminUser = {
  userId: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  drug_count: number;
};

type VisitsPayload = {
  recent: Array<{
    id: number;
    path: string;
    user_id: string | null;
    visitor_id: string | null;
    referrer: string | null;
    created_at: string;
  }>;
  byPath: Array<{ path: string; count: number }>;
  byDay: Array<{ day: string; count: number }>;
};

type VercelAnalytics = {
  configured: boolean;
  message?: string;
  range: { since: string; until: string };
  totals: { pageviews: number; visitors: number };
  byDay: Array<{ key: string; views: number; visitors?: number }>;
  byPath: Array<{ key: string; views: number }>;
  byCountry: Array<{ key: string; views: number }>;
  byDevice: Array<{ key: string; views: number }>;
  byReferrer: Array<{ key: string; views: number }>;
  errors: Array<{
    name: string;
    count: number;
    route?: string;
    lastSeen?: string;
  }>;
  dashboardUrl: string;
};

const TABS: Array<{ id: Tab; label: string }> = [
  { id: "overview", label: "Overview" },
  { id: "analytics", label: "Vercel Analytics" },
  { id: "users", label: "Users" },
  { id: "visits", label: "First-party visits" },
];

function formatDay(key: string) {
  const d = new Date(key);
  if (Number.isNaN(d.getTime())) return key;
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function MiniBars({
  rows,
  labelKey = "key",
}: {
  rows: Array<{ key: string; views: number }>;
  labelKey?: string;
}) {
  const max = Math.max(1, ...rows.map((r) => r.views));
  if (rows.length === 0) {
    return <p className="text-sm text-soft-muted">No data yet</p>;
  }
  return (
    <ul className="space-y-2.5">
      {rows.map((row) => (
        <li key={`${labelKey}-${row.key}`}>
          <div className="mb-1 flex items-center justify-between gap-3 text-sm">
            <span className="truncate font-mono text-[12px] text-soft-muted">
              {row.key.startsWith("20") ? formatDay(row.key) : row.key}
            </span>
            <span className="shrink-0 font-semibold text-soft-ink">
              {row.views.toLocaleString()}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-black/[0.05]">
            <div
              className="h-full rounded-full bg-[#002860]"
              style={{ width: `${Math.max(4, (row.views / max) * 100)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const [tab, setTab] = useState<Tab>("overview");
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [visits, setVisits] = useState<VisitsPayload | null>(null);
  const [analytics, setAnalytics] = useState<VercelAnalytics | null>(null);
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);

  const gate = useCallback(async () => {
    try {
      const me = await apiJson<{ isAdmin: boolean }>("/api/admin/me");
      setAllowed(me.isAdmin);
    } catch {
      setAllowed(false);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setChecking(false);
      setAllowed(false);
      return;
    }
    void gate();
  }, [authLoading, user, gate]);

  const loadOverview = useCallback(async () => {
    setBusy(true);
    try {
      setOverview(await apiJson<Overview>("/api/admin/overview"));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load overview");
    } finally {
      setBusy(false);
    }
  }, []);

  const loadUsers = useCallback(async (q?: string) => {
    setBusy(true);
    try {
      const qs = q ? `?q=${encodeURIComponent(q)}` : "";
      const data = await apiJson<{ users: AdminUser[] }>(
        `/api/admin/users${qs}`
      );
      setUsers(data.users);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load users");
    } finally {
      setBusy(false);
    }
  }, []);

  const loadVisits = useCallback(async () => {
    setBusy(true);
    try {
      setVisits(await apiJson<VisitsPayload>("/api/admin/visits"));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load visits");
    } finally {
      setBusy(false);
    }
  }, []);

  const loadAnalytics = useCallback(async () => {
    setBusy(true);
    try {
      setAnalytics(
        await apiJson<VercelAnalytics>("/api/admin/analytics?days=14")
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load analytics");
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    if (!allowed) return;
    if (tab === "overview") void loadOverview();
    if (tab === "users") void loadUsers();
    if (tab === "visits") void loadVisits();
    if (tab === "analytics") void loadAnalytics();
  }, [
    allowed,
    tab,
    loadOverview,
    loadUsers,
    loadVisits,
    loadAnalytics,
  ]);

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    void loadUsers(query.trim());
  };

  const refresh = () => {
    if (tab === "overview") void loadOverview();
    if (tab === "users") void loadUsers(query.trim() || undefined);
    if (tab === "visits") void loadVisits();
    if (tab === "analytics") void loadAnalytics();
  };

  if (checking || authLoading || !allowed) {
    return <Loader label="Opening admin…" />;
  }

  return (
    <>
      <SeoHead
        title="Admin"
        description="NoDoseOff admin console."
        path="/admin"
        noIndex
      />
      <SoftPage>
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-soft-muted">NoDoseOff</p>
              <h1 className="text-3xl font-bold tracking-tight text-soft-ink">
                Admin console
              </h1>
              <p className="mt-1 max-w-xl text-sm text-soft-muted">
                Product metrics, Vercel Web Analytics, and first-party visits.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={refresh}
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-lg border border-black/[0.08] bg-white px-3 py-2 text-sm font-semibold text-soft-ink hover:bg-black/[0.03] disabled:opacity-50"
              >
                <RefreshCw
                  className={`size-3.5 ${busy ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-[#002860] hover:underline"
              >
                ← Dashboard
              </Link>
            </div>
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            {TABS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  tab === id
                    ? "bg-[#002860] text-white"
                    : "bg-white text-soft-ink hover:bg-black/[0.04]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {busy && (
            <p className="mb-4 text-sm text-soft-muted">Refreshing…</p>
          )}

          {tab === "overview" && overview && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {(
                  [
                    {
                      label: "Users",
                      value: overview.users,
                      icon: UsersIcon,
                    },
                    {
                      label: "Active drugs",
                      value: overview.drugs,
                      icon: Activity,
                    },
                    {
                      label: "Visits (24h)",
                      value: overview.visits24h,
                      icon: Globe2,
                    },
                    {
                      label: "Visits (7d)",
                      value: overview.visits7d,
                      icon: LayoutDashboard,
                    },
                  ] as const
                ).map(({ label, value, icon: Icon }) => (
                  <SoftCard key={label} className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm text-soft-muted">{label}</p>
                        <p className="mt-1 text-3xl font-bold text-soft-ink">
                          {value.toLocaleString()}
                        </p>
                      </div>
                      <span className="rounded-xl bg-[#002860]/08 p-2 text-[#002860]">
                        <Icon className="size-4" />
                      </span>
                    </div>
                  </SoftCard>
                ))}
              </div>
              <SoftCard className="p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-semibold text-soft-ink">
                      Vercel Web Analytics
                    </h2>
                    <p className="mt-0.5 text-sm text-soft-muted">
                      Open the Analytics tab for pageviews, countries, and
                      devices from Vercel.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTab("analytics")}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#002860] px-3.5 py-2 text-sm font-semibold text-white"
                  >
                    Open analytics
                    <ArrowUpRight className="size-3.5" />
                  </button>
                </div>
              </SoftCard>
            </div>
          )}

          {tab === "analytics" && analytics && (
            <div className="space-y-6">
              {!analytics.configured ? (
                <SoftCard className="border-[#f0d9a8] bg-[#fff8eb] p-5">
                  <div className="flex gap-3">
                    <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-700" />
                    <div>
                      <h2 className="text-sm font-semibold text-soft-ink">
                        Connect Vercel Analytics API
                      </h2>
                      <p className="mt-1 text-sm text-soft-muted">
                        {analytics.message ||
                          "Set VERCEL_ACCESS_TOKEN and VERCEL_TEAM_ID to pull live metrics into this console."}
                      </p>
                      <a
                        href={analytics.dashboardUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#002860] hover:underline"
                      >
                        Open Vercel dashboard
                        <ArrowUpRight className="size-3.5" />
                      </a>
                    </div>
                  </div>
                </SoftCard>
              ) : null}

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <SoftCard className="p-5">
                  <p className="text-sm text-soft-muted">Pageviews (14d)</p>
                  <p className="mt-1 text-3xl font-bold text-soft-ink">
                    {analytics.totals.pageviews.toLocaleString()}
                  </p>
                </SoftCard>
                <SoftCard className="p-5">
                  <p className="text-sm text-soft-muted">Visitors (14d)</p>
                  <p className="mt-1 text-3xl font-bold text-soft-ink">
                    {analytics.totals.visitors.toLocaleString()}
                  </p>
                </SoftCard>
                <SoftCard className="p-5">
                  <p className="text-sm text-soft-muted">Range</p>
                  <p className="mt-1 text-sm font-semibold text-soft-ink">
                    {formatDay(analytics.range.since)} –{" "}
                    {formatDay(analytics.range.until)}
                  </p>
                  <a
                    href={analytics.dashboardUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#002860] hover:underline"
                  >
                    Full Vercel report
                    <ArrowUpRight className="size-3" />
                  </a>
                </SoftCard>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <SoftCard className="p-5">
                  <h2 className="mb-4 text-sm font-semibold text-soft-ink">
                    Pageviews by day
                  </h2>
                  <MiniBars rows={analytics.byDay} />
                </SoftCard>
                <SoftCard className="p-5">
                  <h2 className="mb-4 text-sm font-semibold text-soft-ink">
                    Top paths
                  </h2>
                  <MiniBars rows={analytics.byPath} />
                </SoftCard>
                <SoftCard className="p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <Globe2 className="size-4 text-[#002860]" />
                    <h2 className="text-sm font-semibold text-soft-ink">
                      Countries
                    </h2>
                  </div>
                  <MiniBars rows={analytics.byCountry} />
                </SoftCard>
                <SoftCard className="p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <Smartphone className="size-4 text-[#002860]" />
                    <h2 className="text-sm font-semibold text-soft-ink">
                      Devices
                    </h2>
                  </div>
                  <MiniBars rows={analytics.byDevice} />
                </SoftCard>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <SoftCard className="p-5">
                  <h2 className="mb-4 text-sm font-semibold text-soft-ink">
                    Referrers
                  </h2>
                  <MiniBars rows={analytics.byReferrer} />
                </SoftCard>
                <SoftCard className="p-5">
                  <h2 className="mb-4 text-sm font-semibold text-soft-ink">
                    Recent runtime errors
                  </h2>
                  {analytics.errors.length === 0 ? (
                    <p className="text-sm text-soft-muted">
                      No recent error clusters returned.
                    </p>
                  ) : (
                    <ul className="space-y-3">
                      {analytics.errors.map((err) => (
                        <li
                          key={`${err.name}-${err.route || ""}`}
                          className="border-b border-black/[0.04] pb-3 last:border-0"
                        >
                          <div className="flex justify-between gap-3">
                            <p className="text-sm font-medium text-soft-ink">
                              {err.name}
                            </p>
                            <span className="shrink-0 text-xs font-semibold text-soft-muted">
                              ×{err.count}
                            </span>
                          </div>
                          {err.route ? (
                            <p className="mt-0.5 font-mono text-[12px] text-soft-muted">
                              {err.route}
                            </p>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  )}
                </SoftCard>
              </div>
            </div>
          )}

          {tab === "users" && (
            <div className="space-y-4">
              <form onSubmit={onSearch} className="flex gap-2">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search name or email"
                  className="flex-1 rounded-lg border border-black/[0.08] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#002860]/30"
                />
                <SoftButton type="submit">Search</SoftButton>
              </form>
              <SoftCard className="overflow-hidden p-0">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left text-sm">
                    <thead className="border-b border-black/[0.06] bg-black/[0.02] text-soft-muted">
                      <tr>
                        <th className="px-4 py-3 font-medium">Name</th>
                        <th className="px-4 py-3 font-medium">Email</th>
                        <th className="px-4 py-3 font-medium">Phone</th>
                        <th className="px-4 py-3 font-medium">Drugs</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr
                          key={u.userId}
                          className="border-b border-black/[0.04] last:border-0"
                        >
                          <td className="px-4 py-3 font-medium text-soft-ink">
                            {u.name || "—"}
                          </td>
                          <td className="px-4 py-3 text-soft-muted">
                            {u.email || "—"}
                          </td>
                          <td className="px-4 py-3 text-soft-muted">
                            {u.phone || "—"}
                          </td>
                          <td className="px-4 py-3 text-soft-ink">
                            {u.drug_count}
                          </td>
                        </tr>
                      ))}
                      {users.length === 0 && (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-4 py-8 text-center text-soft-muted"
                          >
                            No users found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </SoftCard>
            </div>
          )}

          {tab === "visits" && visits && (
            <div className="grid gap-6 lg:grid-cols-2">
              <SoftCard className="p-5">
                <h2 className="mb-3 text-sm font-semibold text-soft-ink">
                  Top paths (7d)
                </h2>
                <ul className="space-y-2 text-sm">
                  {visits.byPath.map((row) => (
                    <li
                      key={row.path}
                      className="flex justify-between gap-3 border-b border-black/[0.04] pb-2 last:border-0"
                    >
                      <span className="truncate font-mono text-soft-muted">
                        {row.path}
                      </span>
                      <span className="font-semibold text-soft-ink">
                        {row.count}
                      </span>
                    </li>
                  ))}
                  {visits.byPath.length === 0 && (
                    <li className="text-soft-muted">No visits yet</li>
                  )}
                </ul>
              </SoftCard>
              <SoftCard className="p-5">
                <h2 className="mb-3 text-sm font-semibold text-soft-ink">
                  Recent
                </h2>
                <ul className="max-h-96 space-y-2 overflow-y-auto text-sm">
                  {visits.recent.map((row) => (
                    <li
                      key={row.id}
                      className="border-b border-black/[0.04] pb-2 last:border-0"
                    >
                      <div className="flex justify-between gap-2">
                        <span className="font-mono text-soft-ink">
                          {row.path}
                        </span>
                        <span className="shrink-0 text-xs text-soft-muted">
                          {new Date(row.created_at).toLocaleString()}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </SoftCard>
            </div>
          )}
        </div>
      </SoftPage>
    </>
  );
}
