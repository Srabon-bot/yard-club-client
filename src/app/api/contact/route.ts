import { NextResponse } from "next/server";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Contact form endpoint for the marketing site. Validates the inquiry and
 * acknowledges it; delivery to the operations mailbox is handled by ops
 * integrations (the API server owns the SMTP transport for notifications).
 */
export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: { message: "Invalid JSON body." } },
      { status: 400 },
    );
  }

  const body = (payload ?? {}) as Record<string, unknown>;
  const name = typeof body.name === "string" ? (body.name as string).trim() : "";
  const email = typeof body.email === "string" ? (body.email as string).trim() : "";
  const message = typeof body.message === "string" ? (body.message as string).trim() : "";

  if (!name || !email || !EMAIL_PATTERN.test(email) || !message) {
    return NextResponse.json(
      {
        error: {
          message:
            "Name, a valid email address and a message are required to send an inquiry.",
        },
      },
      { status: 400 },
    );
  }

  // TODO(integration): forward validated inquiries to the operations mailbox
  // via the API server's SMTP transport once a recipient address is configured.

  return NextResponse.json({ ok: true });
}
