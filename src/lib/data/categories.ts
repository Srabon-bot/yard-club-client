import { categories } from "@/lib/mock/categories";
import type { Category, CategoryId } from "@/lib/types";

export async function listCategories(): Promise<Category[]> {
  return categories;
}

export async function getCategory(id: CategoryId): Promise<Category | undefined> {
  return categories.find((category) => category.id === id);
}
