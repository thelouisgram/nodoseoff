import {
  clearAccessTokenCache,
  getAccessToken,
  waitForAccessToken,
} from "@/lib/auth/client";

export class AuthRequiredError extends Error {
  constructor(message = "Not signed in (missing access token)") {
    super(message);
    this.name = "AuthRequiredError";
  }
}

export async function apiJson<T>(
  path: string,
  options: RequestInit & { json?: unknown } = {},
  retryOnUnauthorized = true
): Promise<T> {
  const { json, ...init } = options;
  const headers = new Headers(init.headers);
  if (json !== undefined) {
    headers.set("Content-Type", "application/json");
  }
  // Brief wait covers JWT mint race after session restore / OAuth.
  const token = (await getAccessToken()) ?? (await waitForAccessToken(3, 200));
  if (!token) {
    throw new AuthRequiredError();
  }
  headers.set("Authorization", `Bearer ${token}`);
  const res = await fetch(path, {
    ...init,
    headers,
    credentials: "include",
    body: json !== undefined ? JSON.stringify(json) : init.body,
  });
  if (res.status === 401 && retryOnUnauthorized) {
    clearAccessTokenCache();
    return apiJson<T>(path, options, false);
  }
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
