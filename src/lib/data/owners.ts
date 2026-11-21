import { ApiError, apiPublic } from "@/lib/api.server";
import type { Equipment, Owner, Review } from "@/lib/types";

export type OwnerDetail = {
  owner: Owner;
  listings: Equipment[];
  reviews: Review[];
  today: string;
};

export async function listOwners(limit = 60): Promise<Owner[]> {
  const data = await apiPublic<{ items: Owner[] }>(
    `/api/owners?limit=${limit}`,
  );
  return data.items;
}

export async function getOwner(id: string): Promise<Owner | undefined> {
  const detail = await getOwnerDetail(id);
  return detail?.owner;
}

export async function getOwnerDetail(
  id: string,
): Promise<OwnerDetail | undefined> {
  try {
    return await apiPublic<OwnerDetail>(
      `/api/owners/${encodeURIComponent(id)}`,
    );
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return undefined;
    }
    throw error;
  }
}

export async function getOwnerListings(ownerId: string): Promise<Equipment[]> {
  const detail = await getOwnerDetail(ownerId);
  return detail?.listings ?? [];
}
