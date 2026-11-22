import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import type { UserRole } from "@/lib/types";

const API_URL = process.env.API_URL ?? "http://localhost:5000";

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
 * Reads the Better Auth session on the server for route guards. The Express
 * API is called with a signed JWT instead of the session cookie.
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

/** Server-side route guard used by the three dashboard areas. */
export async function requireRole(
  roles: UserRole | UserRole[],
  next: string,
): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) {
    redirect(`/login?next=${encodeURIComponent(next)}`);
  }

  const allowed = Array.isArray(roles) ? roles : [roles];
  if (!allowed.includes(user.role)) {
    redirect(`/${user.role === "customer" ? "dashboard" : user.role}`);
  }

  return user;
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const user = await getSessionUser();
  if (!user) {
    throw new ApiError("Sign in to continue.", 401);
  }

  const token = await getAccessToken();
  return request<T>(path, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...init.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}

/**
 * Mints the short-lived Better Auth JWT for the current session. The token
 * stays on the Next.js server and is never exposed to the browser.
 */
async function getAccessToken(): Promise<string> {
  try {
    const result = await auth.api.getToken({ headers: await headers() });
    if (result?.token) return result.token;
  } catch {
    // Fall through to the shared unauthorized error below.
  }

  throw new ApiError("Sign in to continue.", 401);
}

/**
 * Public catalogue reads. No session or token is needed, and the response is
 * never cached at build time because the Express API may be down.
 */
export async function apiPublic<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  return request<T>(path, {
    ...init,
    headers: {
      ...(init.body ? { "content-type": "application/json" } : {}),
      ...init.headers,
    },
  });
}

async function request<T>(path: string, init: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      cache: "no-store",
      next: { revalidate: 0 },
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
