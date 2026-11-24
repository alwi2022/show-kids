import { NextResponse } from "next/server";
import { uploadArticleImage } from "@/server/services/article-image-service";
import { requireAdmin } from "@/server/services/auth-service";
import { sameOrigin, limitedForm, errorResponse } from "./http";
export async function upload(request: Request) {
  try {
    sameOrigin(request);
    await requireAdmin();
    return NextResponse.json(
      await uploadArticleImage(await limitedForm(request)),
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
