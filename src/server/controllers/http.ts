import { NextResponse } from "next/server";
import { AppError } from "@/server/services/auth-service";
import { siteUrl } from "@/lib/config";
export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const expected =
    process.env.NODE_ENV === "production"
      ? new URL(siteUrl).origin
      : new URL(request.url).origin;
  if (!origin || origin !== expected)
    throw new AppError(
      "Permintaan ditolak. Muat ulang halaman dan coba kembali.",
      403,
    );
}
export function errorResponse(error: unknown) {
  if (error instanceof AppError)
    return NextResponse.json(
      { message: error.message, errors: error.errors },
      { status: error.status, headers: { "Cache-Control": "no-store" } },
    );
  console.error(
    "Request failed",
    error instanceof Error ? error.message : "Database or storage error",
  );
  return NextResponse.json(
    { message: "Permintaan belum dapat diproses. Coba kembali." },
    { status: 500, headers: { "Cache-Control": "no-store" } },
  );
}
export async function limitedForm(request: Request) {
  if (!request.body) throw new AppError("Formulir kosong.", 422);
  const max = 4 * 1024 * 1024 + 128 * 1024;
  let size = 0;
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > max) {
      await reader.cancel();
      throw new AppError(
        "Ukuran formulir terlalu besar. Maksimal 2 MB per file.",
        413,
      );
    }
    chunks.push(value);
  }
  const body = Buffer.concat(chunks);
  return new Response(body, {
    headers: { "Content-Type": request.headers.get("content-type") || "" },
  }).formData();
}
