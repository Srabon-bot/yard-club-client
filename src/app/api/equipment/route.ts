import { apiPublic } from "@/lib/api.server";
import type { Equipment } from "@/lib/types";

type CatalogueResponse = {
  items: Equipment[];
  total: number;
};

function boundedLimit(value: string | null): number {
  const parsed = Number(value ?? "8");
  if (!Number.isFinite(parsed)) return 8;
  return Math.min(12, Math.max(1, Math.trunc(parsed)));
}

/** Same-origin proxy for the public Express catalogue used by the command palette. */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const query = new URLSearchParams({
    featured: "true",
    limit: String(boundedLimit(params.get("limit"))),
    sort: "rating",
  });

  const q = params.get("q")?.trim();
  if (q) query.set("q", q.slice(0, 80));

  try {
    const data = await apiPublic<CatalogueResponse>(
      `/api/equipment?${query.toString()}`,
    );
    return Response.json({ items: data.items ?? [], total: data.total ?? 0 });
  } catch {
    return Response.json({ items: [], total: 0 }, { status: 503 });
  }
}
