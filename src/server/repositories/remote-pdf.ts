import { resolve4 } from "node:dns/promises";
import { get } from "node:https";
import { isIP } from "node:net";

export function publicIPv4(address: string) {
  if (isIP(address) !== 4) return false;
  const [a, b] = address.split(".").map(Number);
  return !(a === 0 || a === 10 || a === 127 || a >= 224 ||
    (a === 100 && b >= 64 && b <= 127) || (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && [0, 2, 168].includes(b)) ||
    (a === 198 && [18, 19, 51].includes(b)) || (a === 203 && b === 0));
}

export async function remotePdf(value: string, redirects = 0): Promise<Buffer> {
  const url = new URL(value);
  if (url.protocol !== "https:" || url.username || url.password || (url.port && url.port !== "443") || isIP(url.hostname))
    throw new Error("Unsupported PDF address");
  const addresses = await resolve4(url.hostname);
  if (!addresses.length || !addresses.every(publicIPv4)) throw new Error("Private PDF address");
  const target = new URL(url);
  target.hostname = addresses[0];
  return new Promise((resolve, reject) => {
    const request = get(target, { servername: url.hostname, headers: { Host: url.host, Accept: "application/pdf" }, agent: false }, (response) => {
      const status = response.statusCode || 0;
      if ([301, 302, 303, 307, 308].includes(status)) {
        response.resume();
        if (redirects >= 3 || !response.headers.location) return reject(new Error("Invalid PDF redirect"));
        remotePdf(new URL(response.headers.location, url).href, redirects + 1).then(resolve, reject);
        return;
      }
      if (status !== 200) { response.resume(); reject(new Error("PDF unavailable")); return; }
      const chunks: Buffer[] = [];
      let size = 0;
      response.on("data", (chunk: Buffer) => {
        size += chunk.length;
        if (size > 2 * 1024 * 1024) { response.destroy(new Error("PDF exceeds 2 MB")); return; }
        chunks.push(chunk);
      });
      response.on("error", reject);
      response.on("end", () => resolve(Buffer.concat(chunks)));
    });
    const deadline = setTimeout(() => request.destroy(new Error("PDF timeout")), 10000);
    request.on("close", () => clearTimeout(deadline));
    request.on("error", reject);
  });
}
