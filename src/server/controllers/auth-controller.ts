import { NextResponse } from "next/server";
import { z } from "zod";
import { AppError, authenticate, logout } from "@/server/services/auth-service";
import { sameOrigin, errorResponse } from "./http";
export async function login(request: Request) {
  try {
    sameOrigin(request);
    const raw = await request.text();
    if (raw.length > 2000) throw new AppError("Isian login tidak valid.", 422);
    let body: unknown;
    try {
      body = JSON.parse(raw);
    } catch {
      throw new AppError("Isian login tidak valid.", 422);
    }
    const result = z
      .object({
        email: z.email().max(254),
        password: z.string().min(1).max(200),
      })
      .safeParse(body);
    if (!result.success)
      throw new AppError("Isi email dan password yang valid.", 422);
    await authenticate(result.data);
    return NextResponse.json(
      { success: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
export async function signOut(request: Request) {
  try {
    sameOrigin(request);
    await logout();
    return NextResponse.json(
      { success: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
