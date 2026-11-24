import sanitizeHtml from "sanitize-html";
import { decodeHTML } from "entities";
export function articlePlainText(value: string) {
  const blocks = value
    .replace(/<br\s*\/?\s*>/gi, "\n")
    .replace(/<\/(?:p|h[1-6]|li|blockquote|ul|ol)>/gi, "\n\n");
  return decodeHTML(
    sanitizeHtml(blocks, { allowedTags: [], allowedAttributes: {} }),
  )
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
export function articleHtml(value: string) {
  const source = /<\/?(?:p|h[1-6]|ul|ol|li|blockquote|strong|em|a|img)\b/i.test(
    value,
  )
    ? value
    : value
        .split(/\n\s*\n/)
        .map(
          (p) =>
            `<p>${p.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>`,
        )
        .join("");
  return sanitizeHtml(source, {
    allowedTags: [
      "p",
      "h2",
      "h3",
      "strong",
      "em",
      "s",
      "ul",
      "ol",
      "li",
      "blockquote",
      "br",
      "a",
      "img",
    ],
    allowedAttributes: { a: ["href", "title"], img: ["src", "alt", "title"] },
    exclusiveFilter: (frame) =>
      frame.tag === "img" &&
      (!frame.attribs.alt?.trim() ||
        !(
          /^https:\/\//.test(frame.attribs.src || "") ||
          /^\/article-images\/[a-f0-9-]{36}\.(png|jpg|webp)$/.test(
            frame.attribs.src || "",
          )
        )),
    allowedSchemes: ["https", "http", "mailto"],
    allowProtocolRelative: false,
  });
}
export function articleText(value: string) {
  return sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }).trim();
}
export function articleDocument(value: string) {
  const toc: { id: string; label: string; level: number }[] = [];
  const html = articleHtml(value).replace(
    /<h([23])>([\s\S]*?)<\/h\1>/g,
    (_, level, text) => {
      const label = articleText(text);
      const id = `bagian-${toc.length + 1}`;
      toc.push({ id, label, level: Number(level) });
      return `<h${level} id="${id}">${text}</h${level}>`;
    },
  );
  return { html, toc };
}
