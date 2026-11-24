import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { publicClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/config";
import { demoAsset } from "@/lib/content";
import { ContentRepository } from "@/server/repositories/content-repository";
import { remotePdf } from "@/server/repositories/remote-pdf";
import { splitStorageRef } from "./content-service";

export async function worksheetDownload(id: string) {
  if (!isSupabaseConfigured()) return null;
  const client = publicClient();
  const content = await new ContentRepository(client).byId(id);
  if (!content?.published || content.type !== "Worksheet") return null;
  const value = content.media_url;
  const ref = splitStorageRef(value);
  let buffer: Buffer;
  if (ref) {
    if (ref.bucket !== "worksheets") return null;
    const { data, error } = await client.storage.from(ref.bucket).download(ref.path);
    if (error || !data) throw new Error("PDF unavailable");
    buffer = Buffer.from(await data.arrayBuffer());
  } else if (demoAsset(value, "pdf")) {
    buffer = await readFile(join(process.cwd(), "public", value));
  } else {
    buffer = await remotePdf(value);
  }
  if (buffer.length > 2 * 1024 * 1024 || buffer.subarray(0, 5).toString() !== "%PDF-") throw new Error("Invalid PDF");
  return { buffer, filename: `${content.slug.replace(/[^a-z0-9-]/gi, "-")}.pdf` };
}
