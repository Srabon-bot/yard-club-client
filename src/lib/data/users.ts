import { apiFetch } from "@/lib/api.server";
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
  counts: {
    all: number;
    customer: number;
    owner: number;
    admin: number;
    suspended: number;
  };
};

export async function listUsers(query: UserQuery = {}): Promise<UserPage> {
  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  if (query.role && query.role !== "all") params.set("role", query.role);
  if (query.status && query.status !== "all") {
    params.set("status", query.status);
  }
  if (query.page) params.set("page", String(query.page));
  if (query.perPage) params.set("limit", String(query.perPage));

  const search = params.toString();
  return apiFetch<UserPage>(`/api/admin/users${search ? `?${search}` : ""}`);
}

export async function getProfile(): Promise<User> {
  const data = await apiFetch<{ user: User }>("/api/profile");
  return data.user;
}
