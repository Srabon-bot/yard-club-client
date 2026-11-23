import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAuth } from "@/lib/auth";
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
  try {
    const requestHeaders = await headers();
    // Fast path: if no session cookie is present, skip hitting Better Auth / database
    const cookieHeader = requestHeaders.get("cookie") ?? "";
    if (
      !cookieHeader.includes("better-auth.session_token") &&
      !cookieHeader.includes("__Secure-better-auth.session_token")
    ) {
      return null;
    }

    const session = await getAuth().api.getSession({ headers: requestHeaders });
    if (!session?.user) return null;

    const user = session.user as typeof session.user & {
      role?: string | null;
    };

    return {
      id: String(user.id),
      role: asRole(user.role),
    };
  } catch (error: unknown) {
    // During Next.js static prerendering, headers() intentionally throws a HANGING_PROMISE_REJECTION
    // to signal the prerender runner that dynamic data was requested. Do not log this expected signal.
    const digest = (error as { digest?: string } | null | undefined)?.digest;
    if (digest !== "HANGING_PROMISE_REJECTION") {
      console.error("Failed to read session user:", error);
    }
    return null;
  }
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
    const result = await getAuth().api.getToken({ headers: await headers() });
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
  const isRead = !init.method || init.method.toUpperCase() === "GET";
  return request<T>(path, {
    // Cache public reads for 60 seconds with Next.js ISR for snappy page loads
    ...(isRead && !init.cache && !init.next ? { next: { revalidate: 60 } } : {}),
    ...init,
    headers: {
      ...(init.body ? { "content-type": "application/json" } : {}),
      ...init.headers,
    },
  });
}

async function request<T>(path: string, init: RequestInit): Promise<T> {
  const isRead = !init.method || init.method.toUpperCase() === "GET";
  let response: Response | undefined;
  let lastError: unknown;

  // Retry once on network / timeout errors for idempotent GET requests
  const maxAttempts = isRead ? 2 : 1;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      response = await fetch(`${API_URL}${path}`, {
        ...init,
        cache: init.cache ?? (init.next ? undefined : "no-store"),
        next: init.next ?? (init.cache ? undefined : { revalidate: 0 }),
        signal: init.signal ?? AbortSignal.timeout(10000),
      });
      break;
    } catch (err) {
      lastError = err;
      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    }
  }

  if (!response) {
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
