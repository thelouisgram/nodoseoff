import { getAccessToken } from "@/lib/auth/client";

export async function apiJson<T>(
  path: string,
  options: RequestInit & { json?: unknown } = {}
): Promise<T> {
  const { json, ...init } = options;
  const headers = new Headers(init.headers);
  if (json !== undefined) {
    headers.set("Content-Type", "application/json");
  }
  const token = await getAccessToken();
  if (!token) {
    throw new Error("Not signed in (missing access token)");
  }
  headers.set("Authorization", `Bearer ${token}`);
  const res = await fetch(path, {
    ...init,
    headers,
    credentials: "include",
    body: json !== undefined ? JSON.stringify(json) : init.body,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
