import { owners } from "@/lib/mock/owners";
import { equipment } from "@/lib/mock/equipment";
import type { Owner } from "@/lib/types";

export async function listOwners(): Promise<Owner[]> {
  return owners;
}

export async function getOwner(id: string): Promise<Owner | undefined> {
  return owners.find((owner) => owner.id === id);
}

export async function getOwnerListings(ownerId: string) {
  return equipment
    .filter((item) => item.ownerId === ownerId && item.status === "approved")
    .sort((a, b) => b.rating - a.rating);
}
