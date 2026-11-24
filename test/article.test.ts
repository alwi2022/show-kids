import { test } from "node:test";
import assert from "node:assert/strict";
import {
  articleHtml,
  articleDocument,
  articlePlainText,
} from "../src/lib/article";
test("switching rich article to plain description preserves paragraphs without tags or encoded entities", () => {
  assert.equal(
    articlePlainText(
      "<h2>Judul</h2><p>Isi <strong>tebal</strong> &amp; jelas.</p><p>Paragraf kedua.</p>",
    ),
    "Judul\n\nIsi tebal & jelas.\n\nParagraf kedua.",
  );
});
import { parseContent } from "../src/server/validators/content";
test("article preserves supported formatting and removes executable markup", () => {
  const html = articleHtml(
    '<h1>Title</h1><h2>Bagian</h2><p onclick="alert(1)"><strong>Bold</strong><em>Italic</em></p><script>alert(1)</script><img src=x onerror=alert(1)><a href="javascript:alert(1)">bad</a>',
  );
  assert.ok(
    html.includes("<h2>Bagian</h2>") && html.includes("<strong>Bold</strong>"),
  );
  assert.ok(!/script|onclick|onerror|javascript|<h1|<img/.test(html));
});
test("article images require safe sources and alt text", () => {
  assert.ok(
    articleHtml(
      '<p>Foto</p><img src="https://example.com/image.jpg" alt="Anak membaca">',
    ).includes("<img"),
  );
  assert.ok(
    articleHtml(
      '<img src="/article-images/00000000-0000-4000-8000-000000000001.jpg" alt="Foto">',
    ).includes("<img"),
  );
  for (const source of [
    "javascript:alert(1)",
    "data:image/png;base64,abc",
    "//evil.test/a.jpg",
    "/private/file",
  ])
    assert.ok(
      !articleHtml(`<img src="${source}" alt="Foto">`).includes("<img"),
    );
  assert.ok(
    !articleHtml('<img src="https://example.com/a.jpg">').includes("<img"),
  );
});
test("article headings have stable unique anchors and legacy text stays readable", () => {
  const doc = articleDocument("<h2>Sama</h2><h3>Sama</h3><p>Isi</p>");
  assert.deepEqual(
    doc.toc.map((row) => row.id),
    ["bagian-1", "bagian-2"],
  );
  assert.ok(doc.html.includes('id="bagian-2"'));
  assert.equal(articleHtml("Satu\n\nDua"), "<p>Satu</p><p>Dua</p>");
});
test("article form rejects formatted empty content", () => {
  const form = new FormData();
  form.set("type", "Artikel");
  form.set("description", "<p></p>");
  const parsed = parseContent(form);
  assert.ok(
    !parsed.success &&
      parsed.error.issues.some((issue) => issue.path[0] === "description"),
  );
});
test("new category names are not restricted to the seeded category enum", () => {
  const form = new FormData();
  const values = {
    title: "Test",
    slug: "test",
    category: "Kategori baru saya",
    type: "Artikel",
    description: "<h2>Bagian</h2><p><strong>Isi</strong> artikel.</p>",
    thumbnail: "https://example.com/a.jpg",
    alt_text: "Alt",
    meta_title: "Test",
    meta_description: "Description",
  };
  for (const [key, value] of Object.entries(values)) form.set(key, value);
  const result = parseContent(form);
  assert.ok(result.success);
  if (result.success) {
    assert.equal(result.data.category, values.category);
    assert.ok(result.data.description.includes("<h2>"));
  }
});
