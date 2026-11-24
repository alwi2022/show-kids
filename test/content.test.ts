import { test } from "node:test";
import assert from "node:assert/strict";
import {
  parseFilters,
  catalogUrl,
  slugify,
  videoEmbed,
} from "../src/lib/content";
import { parseContent } from "../src/server/validators/content";
import { jsonLd } from "../src/lib/seo";

function validForm() {
  const form = new FormData();
  for (const [key, value] of Object.entries({
    title: "Belajar tentang alam",
    category: "Animal & Nature",
    type: "Video",
    description: "Amati tumbuhan bersama anak.",
    thumbnail: "https://example.com/nature.png",
    alt_text: "Daun di halaman",
    media_url: "https://www.youtube.com/watch?v=abcdefghijk",
    duration: "180",
    meta_title: "Belajar tentang alam",
    meta_description: "Mengamati tumbuhan bersama anak.",
    published: "1",
  }))
    form.set(key, value);
  return form;
}
test("generates editable ASCII slugs and bounds filter parameters", () => {
  assert.equal(
    slugify("  Ayo, Belajar & Bernyanyi!  "),
    "ayo-belajar-bernyanyi",
  );
  assert.equal(slugify("Café"), "cafe");
  assert.deepEqual(
    parseFilters({
      q: ["bad"],
      category: "Custom category",
      page: "-1",
      status: "arbitrary",
    }),
    { q: "", category: "Custom category", type: "", status: "", page: 1 },
  );
  assert.equal(parseFilters({ page: "999999" }).page, 10000);
  const url = catalogUrl(parseFilters({ q: "a&b", type: "Video" }), {
    category: "Music & Song",
  });
  assert.equal(new URL(url, "http://localhost").searchParams.get("q"), "a&b");
});
test("rejects executable URLs and impersonated video domains", () => {
  assert.equal(videoEmbed("javascript:alert(1)"), null);
  assert.equal(
    videoEmbed("https://youtube.com.evil.test/watch?v=abcdefghijk"),
    null,
  );
  assert.equal(
    videoEmbed("https://evil.test@youtube.com/watch?v=abcdefghijk"),
    null,
  );
  assert.equal(
    videoEmbed("https://youtu.be/abcdefghijk"),
    "https://www.youtube-nocookie.com/embed/abcdefghijk",
  );
});
test("validates the complete content form, sanitizes text, generates slug", () => {
  const form = validForm();
  form.set("title", "<b>Belajar</b>");
  const parsed = parseContent(form);
  assert.equal(parsed.success, true);
  if (parsed.success) {
    assert.equal(parsed.data.title, "Belajar");
    assert.equal(parsed.data.slug, "belajar");
    assert.equal(parsed.data.published, true);
  }
});
test("rejects empty content, long metadata, missing alt text and unsafe media", () => {
  const form = validForm();
  form.set("meta_title", "x".repeat(61));
  form.set("meta_description", "x".repeat(161));
  form.set("alt_text", "");
  form.set("description", " ");
  form.set("media_url", "https://evil.test/video");
  const parsed = parseContent(form);
  assert.equal(parsed.success, false);
  if (!parsed.success)
    for (const key of [
      "meta_title",
      "meta_description",
      "alt_text",
      "description",
      "media_url",
    ])
      assert.ok(parsed.error.issues.some((issue) => issue.path[0] === key));
});
test("worksheet requires a PDF; article can omit media and duration", () => {
  const form = validForm();
  form.set("type", "Worksheet");
  form.set("media_url", "https://example.com/file.exe");
  assert.equal(parseContent(form).success, false);
  form.set("media_url", "storage:worksheets/12345678-abcd.pdf");
  assert.equal(parseContent(form).success, true);
  form.set("type", "Artikel");
  form.set("media_url", "");
  form.set("duration", "");
  assert.equal(parseContent(form).success, true);
});
test("JSON-LD cannot terminate its containing script", () => {
  const encoded = jsonLd({ headline: "</script><script>alert(1)</script>" });
  assert.ok(!encoded.includes("<"));
  assert.equal(
    JSON.parse(encoded).headline,
    "</script><script>alert(1)</script>",
  );
});
test("allows bundled worksheet demos and rejects arbitrary local file paths", () => {
  const form = validForm();
  form.set("type", "Worksheet");
  form.set("duration", "");
  form.set("thumbnail", "/assets/demo/shapes.svg");
  form.set("media_url", "/assets/demo/shapes.pdf");
  assert.equal(parseContent(form).success, true);
  for (const path of [
    "/assets/demo/../secret.pdf",
    "//evil.test/document.pdf",
    "/assets/demo/reading.pdf",
    "/private/file.pdf",
  ]) {
    form.set("media_url", path);
    assert.equal(parseContent(form).success, false);
  }
});
