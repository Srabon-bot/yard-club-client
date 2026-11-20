import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import type { UserRole } from "@/lib/types";

const API_URL = process.env.API_URL ?? "http://localhost:5000";

const API_INTERNAL_KEY = process.env.API_INTERNAL_KEY;

export type SessionUser = {
  id: string;
  role: UserRole;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const ROLES: UserRole[] = ["customer", "owner", "admin"];

function asRole(value: unknown): UserRole {
  return ROLES.includes(value as UserRole) ? (value as UserRole) : "customer";
}

/**
 * Reads the Better Auth session on the server. The dashboard API trusts the
 * user id only when it arrives together with the shared internal key.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return null;

  const user = session.user as typeof session.user & {
    role?: string | null;
  };

  return {
    id: String(user.id),
    role: asRole(user.role),
  };
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const user = await getSessionUser();
  if (!user) {
    throw new ApiError("Sign in to continue.", 401);
  }

  if (!API_INTERNAL_KEY) {
    throw new ApiError(
      "API_INTERNAL_KEY is missing from the client environment.",
      500,
    );
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      cache: "no-store",
      headers: {
        "content-type": "application/json",
        ...init.headers,
        "x-internal-key": API_INTERNAL_KEY,
        "x-user-id": user.id,
      },
    });
  } catch {
    throw new ApiError(
      "The Yardclub API is not reachable. Is the server running?",
      503,
    );
  }

  const payload = (await response.json().catch(() => null)) as
    | (Record<string, unknown> & { error?: string })
    | null;

  if (!response.ok) {
    throw new ApiError(
      payload?.error || "Something went wrong. Please try again.",
      response.status,
    );
  }

  return payload as T;
}
