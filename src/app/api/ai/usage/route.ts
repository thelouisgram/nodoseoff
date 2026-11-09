import { requireUserId } from "@/lib/server/auth";
import { getAiQuota } from "@/lib/ai/quota";
import { listActiveDrugNames } from "@/lib/ai/user-meds";

export async function GET(req: Request) {
  try {
    const userId = await requireUserId(req);
    const [quota, drugNames] = await Promise.all([
      getAiQuota(userId),
      listActiveDrugNames(userId),
    ]);
    return Response.json({ ...quota, drugNames });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("ai/usage error:", error);
    return Response.json({ error: "Failed to load AI usage" }, { status: 500 });
  }
}
