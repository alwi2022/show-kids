import { save, remove } from "@/server/controllers/content-controller";
export const runtime = "nodejs";
type Context = { params: Promise<{ id: string }> };
export async function PUT(request: Request, context: Context) {
  return save(request, (await context.params).id);
}
export async function DELETE(request: Request, context: Context) {
  return remove(request, (await context.params).id);
}
