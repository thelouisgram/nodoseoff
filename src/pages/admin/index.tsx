import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { apiJson } from "@/lib/api-client";
import { isAdminEmail } from "@/lib/admin-emails";
import { useAuth } from "@/contexts/AuthContext";
import SeoHead from "@/components/seo/SeoHead";
import PageLoader from "@/components/ui/PageLoader";
import { SoftButton, SoftCard, SoftPage } from "@/components/ui/soft";

type Tab = "overview" | "users" | "visits";

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

export default function AdminPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [tab, setTab] = useState<Tab>("overview");
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [visits, setVisits] = useState<VisitsPayload | null>(null);
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);

  const gate = useCallback(async () => {
    try {
      const me = await apiJson<{ isAdmin: boolean }>("/api/admin/me");
      setAllowed(me.isAdmin);
      if (!me.isAdmin) {
        toast.error("Admin access required");
        router.replace("/dashboard");
      }
    } catch {
      setAllowed(false);
      router.replace("/login");
    } finally {
      setChecking(false);
    }
  }, [router]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    // Fast client hint; server still enforces
    if (user.email && !isAdminEmail(user.email)) {
      setChecking(false);
      setAllowed(false);
      router.replace("/dashboard");
      return;
    }
    void gate();
  }, [authLoading, user, gate, router]);

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

  useEffect(() => {
    if (!allowed) return;
    if (tab === "overview") void loadOverview();
    if (tab === "users") void loadUsers();
    if (tab === "visits") void loadVisits();
  }, [allowed, tab, loadOverview, loadUsers, loadVisits]);

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    void loadUsers(query.trim());
  };

  if (checking || authLoading || !allowed) {
    return <PageLoader label="Opening admin…" />;
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
        <div className="mx-auto max-w-5xl px-4 py-10">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-soft-muted">NoDoseOff</p>
              <h1 className="text-3xl font-bold tracking-tight text-soft-ink">
                Admin
              </h1>
            </div>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-[#002860] hover:underline"
            >
              ← Back to dashboard
            </Link>
          </div>

          <div className="mb-6 flex gap-2">
            {(
              [
                ["overview", "Overview"],
                ["users", "Users"],
                ["visits", "Visits"],
              ] as const
            ).map(([id, label]) => (
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
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {(
                [
                  ["Users", overview.users],
                  ["Active drugs", overview.drugs],
                  ["Visits (24h)", overview.visits24h],
                  ["Visits (7d)", overview.visits7d],
                ] as const
              ).map(([label, value]) => (
                <SoftCard key={label} className="p-5">
                  <p className="text-sm text-soft-muted">{label}</p>
                  <p className="mt-1 text-3xl font-bold text-soft-ink">
                    {value}
                  </p>
                </SoftCard>
              ))}
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
