import { NextResponse } from "next/server";
import { articleImageUrl } from "@/server/services/article-image-service";
export const dynamic = "force-dynamic";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  try {
    const url = await articleImageUrl((await params).name);
    return url
      ? NextResponse.redirect(url, {
          status: 307,
          headers: { "Cache-Control": "private, no-store" },
        })
      : new NextResponse(null, { status: 404 });
  } catch {
    return new NextResponse(null, {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
