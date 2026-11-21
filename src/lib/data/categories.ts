import { apiPublic } from "@/lib/api.server";
import type { Category, CategoryId } from "@/lib/types";

export async function listCategories(): Promise<Category[]> {
  const data = await apiPublic<{ items: Category[] }>("/api/categories");
  return data.items;
}

export async function getCategory(
  id: CategoryId,
): Promise<Category | undefined> {
  const categories = await listCategories();
  return categories.find((category) => category.id === id);
}
