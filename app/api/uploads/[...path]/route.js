import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join, resolve, extname } from "path";

const MIME_TYPES = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

export async function GET(request, { params }) {
  const { path: pathParts } = await params;
  if (!pathParts || pathParts.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const DATA_DIR = process.env.DATA_DIR || "/data";
  const uploadsDir = join(DATA_DIR, "uploads");
  const filePath = resolve(join(uploadsDir, ...pathParts));

  // Prevent path traversal
  if (!filePath.startsWith(uploadsDir + "/") && filePath !== uploadsDir) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const buffer = await readFile(filePath);
    const ext = extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
