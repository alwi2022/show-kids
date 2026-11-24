import { NextResponse } from "next/server";
import { z } from "zod";
import { publicMedia } from "@/server/services/content-service";
export const dynamic = "force-dynamic";
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; kind: string }> },
) {
  const { id, kind } = await params;
  if (
    !z.uuid().safeParse(id).success ||
    !["thumbnail", "worksheet"].includes(kind)
  )
    return new NextResponse(null, { status: 404 });
  try {
    const url = await publicMedia(id, kind);
    return url
      ? NextResponse.redirect(new URL(url, request.url), {
          status: 307,
          headers: { "Cache-Control": "no-store" },
        })
      : new NextResponse(null, { status: 404 });
  } catch {
    return new NextResponse(null, {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
