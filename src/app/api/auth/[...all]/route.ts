import { type NextRequest, NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// Resolve the auth instance per request so a recycled MongoDB topology results
// in a fresh handler instead of a permanently broken warm-lambda instance.
const nextHandler = (request: NextRequest) =>
  toNextJsHandler(getAuth()).GET(request);

const PWD_REGEX_UPPER = /[A-Z]/;
const PWD_REGEX_LOWER = /[a-z]/;

/** Intercept sign-up to enforce password strength beyond length. */
async function POST(request: NextRequest) {
  const url = new URL(request.url);

  if (url.pathname.endsWith("/sign-up/email")) {
    let body: Record<string, unknown> | null = null;
    try {
      body = await request.clone().json();
    } catch {
      // fall through — let better-auth return its own parse error
    }

    if (body && typeof body.password === "string") {
      const pwd: string = body.password;
      if (
        pwd.length < 6 ||
        !PWD_REGEX_UPPER.test(pwd) ||
        !PWD_REGEX_LOWER.test(pwd)
      ) {
        return NextResponse.json(
          {
            error: {
              message:
                "Password must be at least 6 characters and include both uppercase and lowercase letters.",
              code: "VALIDATION_ERROR",
            },
          },
          { status: 400 },
        );
      }
    }
  }

  return toNextJsHandler(getAuth()).POST(request);
}

export const GET = nextHandler;
export { POST };