import type { NextApiRequest } from "next";
import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";

let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

function getJwks() {
  const url =
    process.env.NEON_AUTH_JWKS_URL ||
    (process.env.NEON_AUTH_BASE_URL
      ? `${process.env.NEON_AUTH_BASE_URL.replace(/\/$/, "")}/.well-known/jwks.json`
      : null);
  if (!url) {
    throw new Error("NEON_AUTH_JWKS_URL (or NEON_AUTH_BASE_URL) is not set");
  }
  if (!jwks) {
    jwks = createRemoteJWKSet(new URL(url));
  }
  return jwks;
}

export type AuthUser = {
  userId: string;
  email?: string;
  name?: string;
};

function payloadToUser(payload: JWTPayload): AuthUser | null {
  const userId = typeof payload.sub === "string" ? payload.sub : null;
  if (!userId) return null;
  const email =
    typeof payload.email === "string"
      ? payload.email
      : typeof (payload as { user?: { email?: string } }).user?.email === "string"
        ? (payload as { user: { email: string } }).user.email
        : undefined;
  const name =
    typeof payload.name === "string"
      ? payload.name
      : typeof (payload as { user?: { name?: string } }).user?.name === "string"
        ? (payload as { user: { name: string } }).user.name
        : undefined;
  return { userId, email, name };
}

export async function getAuthUserFromBearer(
  authorization: string | null | undefined
): Promise<AuthUser | null> {
  const bearer = authorization?.replace(/^Bearer\s+/i, "").trim();
  if (!bearer) return null;

  try {
    const { payload } = await jwtVerify(bearer, getJwks(), {
      algorithms: ["EdDSA", "RS256", "ES256"],
    });
    return payloadToUser(payload);
  } catch {
    return null;
  }
}

export async function getAuthUserFromRequest(
  req: NextApiRequest | Request
): Promise<AuthUser | null> {
  const authorization =
    req instanceof Request
      ? req.headers.get("authorization")
      : req.headers.authorization;
  return getAuthUserFromBearer(authorization);
}

export async function getUserIdFromRequest(
  req: NextApiRequest | Request
): Promise<string | null> {
  const user = await getAuthUserFromRequest(req);
  return user?.userId ?? null;
}

export async function requireUserId(
  req: NextApiRequest | Request
): Promise<string> {
  const userId = await getUserIdFromRequest(req);
  if (!userId) {
    throw new Error("UNAUTHORIZED");
  }
  return userId;
}

export async function requireAuthUser(
  req: NextApiRequest | Request
): Promise<AuthUser> {
  const user = await getAuthUserFromRequest(req);
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}
