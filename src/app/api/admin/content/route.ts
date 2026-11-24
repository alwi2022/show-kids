import { save } from "@/server/controllers/content-controller";
export const runtime = "nodejs";
export const POST = (request: Request) => save(request);
