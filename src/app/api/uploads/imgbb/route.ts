import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/api.server";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

type ImgbbResponse = {
  success?: boolean;
  error?: { message?: string };
  data?: {
    id?: string;
    url?: string;
    display_url?: string;
    delete_url?: string;
  };
};

/**
 * Signed-in users upload through this route so the ImgBB API key stays on the
 * server. The returned i.ibb.co URL is what gets saved with the listing.
 */
export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in to upload images." }, { status: 401 });
  }

  const apiKey = process.env.IMGBB_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Image upload is not configured." },
      { status: 503 },
    );
  }

  let incoming: FormData;
  try {
    incoming = await request.formData();
  } catch {
    return NextResponse.json({ error: "Expected image form data." }, { status: 400 });
  }

  const file = incoming.get("image");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Choose an image file." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Use a JPG, PNG, WebP, or GIF image." },
      { status: 400 },
    );
  }
  if (file.size === 0 || file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "Images must be under 5 MB." },
      { status: 400 },
    );
  }

  const payload = new FormData();
  payload.set("image", file);
  const name = incoming.get("name");
  if (typeof name === "string" && name.trim()) {
    payload.set("name", name.trim().slice(0, 120));
  }

  try {
    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`,
      { method: "POST", body: payload, cache: "no-store" },
    );
    const result = (await response.json()) as ImgbbResponse;

    if (!response.ok || !result.success || !result.data?.url) {
      return NextResponse.json(
        { error: result.error?.message || "ImgBB rejected the upload." },
        { status: 502 },
      );
    }

    return NextResponse.json({
      url: result.data.url,
      displayUrl: result.data.display_url ?? result.data.url,
      deleteUrl: result.data.delete_url ?? "",
      id: result.data.id ?? "",
    });
  } catch (error) {
    console.error("ImgBB upload failed:", error);
    return NextResponse.json(
      { error: "The image host is unavailable. Try again." },
      { status: 502 },
    );
  }
}
