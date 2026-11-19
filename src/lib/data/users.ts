import { users } from "@/lib/mock/users";
import type { User, UserRole } from "@/lib/types";

export type UserQuery = {
  q?: string;
  role?: UserRole | "all";
  status?: User["status"] | "all";
  page?: number;
  perPage?: number;
};

export type UserPage = {
  items: User[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
};

export async function listUsers(query: UserQuery = {}): Promise<UserPage> {
  const page = Math.max(1, query.page ?? 1);
  const perPage = Math.max(1, query.perPage ?? 8);
  const q = query.q?.trim().toLowerCase();

  const filtered = users.filter((user) => {
    if (query.role && query.role !== "all" && user.role !== query.role) return false;
    if (query.status && query.status !== "all" && user.status !== query.status) return false;
    if (!q) return true;
    return [user.name, user.email, user.phone, user.address]
      .join(" ")
      .toLowerCase()
      .includes(q);
  });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(page, totalPages);

  return {
    items: filtered.slice((safePage - 1) * perPage, safePage * perPage),
    total,
    page: safePage,
    perPage,
    totalPages,
  };
}

export async function getUser(id: string): Promise<User | undefined> {
  return users.find((user) => user.id === id);
}
