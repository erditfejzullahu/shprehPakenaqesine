import { auth } from "@/auth";
import { rateLimit } from "@/lib/redis";
import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

const MAX_FILE_SIZE = 50 * 1024 * 1024;

const ALLOWED_PREFIXES = [
  "complaints/",
  "contributions/",
  "reports/",
  "companys/",
  "users/",
  "contactUs/",
] as const;

const ALLOWED_CONTENT_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/quicktime",
  "video/x-msvideo",
  "video/webm",
  "audio/mp3",
  "audio/wav",
  "audio/ogg",
  "audio/mpeg",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
]);

function isAllowedPathname(pathname: string): boolean {
  return ALLOWED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function isPublicUploadPath(pathname: string): boolean {
  return pathname.startsWith("reports/");
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const session = await auth();
  const ipAddress =
    req.headers.get("x-forwarded-for") ||
    req.headers.get("x-real-ip") ||
    "unknown";

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const pathname = formData.get("pathname");

    if (!(file instanceof File) || typeof pathname !== "string" || !pathname.trim()) {
      return NextResponse.json(
        { error: "Skedari ose rruga e ngarkimit mungon." },
        { status: 400 }
      );
    }

    if (!isAllowedPathname(pathname)) {
      return NextResponse.json(
        { error: "Rruga e ngarkimit nuk lejohet." },
        { status: 400 }
      );
    }

    const isPublic = isPublicUploadPath(pathname);
    if (!session && !isPublic) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (isPublic && !session) {
      const { allowed, reset } = await rateLimit(
        `rate_limit:blob_upload:${ipAddress}`,
        20,
        60
      );
      if (!allowed) {
        return NextResponse.json(
          {
            error: `Shumë ngarkime. Provoni përsëri pas ${reset} sekondash.`,
          },
          { status: 429 }
        );
      }
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Skedari tejkalon limitin prej 50MB." },
        { status: 400 }
      );
    }

    const contentType = file.type || "application/octet-stream";
    if (!ALLOWED_CONTENT_TYPES.has(contentType)) {
      return NextResponse.json(
        { error: "Lloji i skedarit nuk lejohet." },
        { status: 400 }
      );
    }

    const blob = await put(pathname, file, {
      access: "public",
      contentType,
      addRandomSuffix: false,
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error("Blob upload failed:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Ngarkimi i skedarit dështoi.",
      },
      { status: 500 }
    );
  }
}
