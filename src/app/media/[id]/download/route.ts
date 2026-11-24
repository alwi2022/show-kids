import { z } from "zod";
import { worksheetDownload } from "@/server/services/worksheet-download";

export const dynamic = "force-dynamic";
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const headers = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };
  if (!z.uuid().safeParse(id).success) return new Response(null, { status: 404, headers });
  try {
    const file = await worksheetDownload(id);
    if (!file) return new Response(null, { status: 404, headers });
    return new Response(new Uint8Array(file.buffer), { headers: {
      ...headers,
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${file.filename}"`,
      "Content-Length": String(file.buffer.length),
    } });
  } catch {
    return new Response("PDF belum bisa diunduh. Silakan coba kembali.", { status: 502, headers });
  }
}
