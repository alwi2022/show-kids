import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { mutateCategory } from "@/server/services/category-service";
import { errorResponse, sameOrigin, limitedForm } from "./http";
import { requireAdmin } from "@/server/services/auth-service";
export async function categoryMutation(request: Request, id?: string) {
  try {
    sameOrigin(request);
    await requireAdmin();
    const result = await mutateCategory(
      request.method === "DELETE"
        ? ""
        : (await limitedForm(request)).get("name"),
      id,
      request.method === "DELETE",
    );
    revalidatePath("/", "layout");
    return NextResponse.json(result, {
      status: request.method === "POST" ? 201 : 200,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
