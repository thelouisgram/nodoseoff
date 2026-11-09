import { NextApiRequest, NextApiResponse } from "next";
import { strictLimiter, createRateLimitHeaders } from "@/lib/ratelimit";
import { requireUserId } from "@/lib/server/auth";
import { deleteAllUserData } from "@/lib/server/dashboard-data";
import { deleteCloudinaryAsset } from "@/lib/cloudinary";

/**
 * Deletes app data for the signed-in Neon Auth user.
 * Neon Auth account deletion is performed on the client via authClient.deleteUser().
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const userId = await requireUserId(req);

    const rateLimitResult = await strictLimiter.limit(`user:${userId}`);
    const rateLimitHeaders = createRateLimitHeaders(rateLimitResult);
    Object.entries(rateLimitHeaders).forEach(([key, value]) => {
      if (value) res.setHeader(key, value);
    });
    if (!rateLimitResult.success) {
      return res.status(429).json({
        error: "Too many requests",
        message:
          "You have exceeded the rate limit for account deletion. Please try again later.",
      });
    }

    const publicId = await deleteAllUserData(userId);
    if (publicId) {
      try {
        await deleteCloudinaryAsset(publicId);
      } catch (e) {
        console.warn("Cloudinary delete failed", e);
      }
    }

    return res.status(200).json({ message: "User account deleted successfully" });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    console.error("Server error:", error);
    return res.status(500).json({ error: "Server error" });
  }
}
