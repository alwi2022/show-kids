import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin, AppError } from "@/server/services/auth-service";
import { saveContent, deleteContent } from "@/server/services/content-service";
import { errorResponse, limitedForm, sameOrigin } from "./http";
export async function save(request: Request, id?: string) {
  try {
    sameOrigin(request);
    await requireAdmin();
    if (id && !z.uuid().safeParse(id).success)
      throw new AppError("Konten tidak ditemukan.", 404);
    const content = await saveContent(await limitedForm(request), id);
    return NextResponse.json(
      { id: content.id },
      { status: id ? 200 : 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
export async function remove(request: Request, id: string) {
  try {
    sameOrigin(request);
    if (!z.uuid().safeParse(id).success)
      throw new AppError("Konten tidak ditemukan.", 404);
    await deleteContent(id);
    return NextResponse.json({ deleted: true });
  } catch (error) {
    return errorResponse(error);
  }
}
