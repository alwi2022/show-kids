import { categoryMutation } from "@/server/controllers/category-controller";
export const runtime = "nodejs";
export const POST = (request: Request) => categoryMutation(request);
