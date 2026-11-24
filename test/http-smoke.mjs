import assert from "node:assert/strict";
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { createRequire } from "node:module";
import { readFile, writeFile } from "node:fs/promises";

const require = createRequire(import.meta.url);
const articleImage = "00000000-0000-4000-8000-000000000050.png";
const testUser = {
  id: "00000000-0000-4000-8000-000000000001",
  aud: "authenticated",
  role: "authenticated",
  email: "fixture-admin@example.test",
  app_metadata: { provider: "email" },
  user_metadata: {},
  created_at: "2026-11-23T00:00:00Z",
};
const encode = (data) =>
  Buffer.from(JSON.stringify(data)).toString("base64url");
const token = `${encode({ alg: "HS256", typ: "JWT" })}.${encode({ sub: testUser.id, aud: "authenticated", exp: Math.floor(Date.now() / 1000) + 3600, role: "authenticated" })}.fixture-signature`;
const fixture = {
  id: "00000000-0000-4000-8000-000000000010",
  title: "Test fixture nature lesson",
  slug: "test-fixture-nature",
  category: "Animal & Nature",
  type: "Video",
  description:
    "Content used only by the automated HTTP checks.\n\nLong description paragraph for testing expansion and server-rendered text.\n\nCompanion activity paragraph remains available without JavaScript.",
  thumbnail: "https://example.com/test.png",
  alt_text: "Test image",
  media_url: "https://youtu.be/abcdefghijk",
  duration: 180,
  is_new: true,
  published: true,
  meta_title: "Test fixture title",
  meta_description: "Test fixture description",
  canonical_url: "",
  focus_keyword: "",
  created_at: "2026-11-23T00:00:00Z",
  updated_at: "2026-11-23T00:00:00Z",
};
const categoryRows = [
  "Music & Song",
  "Education Learning",
  "Creative & DIY",
  "Animal & Nature",
  "Healthy Habits",
].map((name, index) => ({
  id: `00000000-0000-4000-8000-${String(index + 30).padStart(12, "0")}`,
  name,
  created_at: fixture.created_at,
}));
const api = createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  if (url.pathname === `/storage/v1/object/sign/thumbnails/${articleImage}`) {
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify({ signedURL: `/object/sign/thumbnails/${articleImage}?token=fixture` }));
  }
  if (url.pathname === "/rest/v1/categories" && req.method === "GET") {
    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Range",
      `0-${categoryRows.length - 1}/${categoryRows.length}`,
    );
    return res.end(JSON.stringify(categoryRows));
  }
  if (url.pathname === "/auth/v1/token") {
    res.setHeader("Content-Type", "application/json");
    return res.end(
      JSON.stringify({
        access_token: token,
        refresh_token: "fixture-refresh-token",
        token_type: "bearer",
        expires_in: 3600,
        user: testUser,
      }),
    );
  }
  if (
    url.pathname === "/auth/v1/user" &&
    req.headers.authorization === `Bearer ${token}`
  ) {
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify(testUser));
  }
  if (
    url.pathname === "/rest/v1/admin_users" &&
    req.headers.authorization === `Bearer ${token}`
  ) {
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify([{ user_id: testUser.id }]));
  }
  if (url.pathname === "/rest/v1/contents") {
    if (url.searchParams.get("or")?.includes("simulate-failure")) {
      res.writeHead(503, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({ message: "Fixture database unavailable" }),
      );
    }
    let rows = [
      fixture,
      {
        ...fixture,
        id: "00000000-0000-4000-8000-000000000020",
        slug: "amazing-butterfly-facts",
        title: "Featured butterfly",
      },
      ...Array.from({ length: 13 }, (_, index) => ({
        ...fixture,
        id: `00000000-0000-4000-8000-${String(index + 100).padStart(12, "0")}`,
        slug: `fixture-video-${index}`,
        title: `Fixture video ${index}`,
      })),
      {
        ...fixture,
        id: "00000000-0000-4000-8000-000000000012",
        slug: "fixture-worksheet",
        title: "Fixture worksheet",
        type: "Worksheet",
        media_url: "/assets/demo/shapes.pdf",
        duration: null,
      },
      {
        ...fixture,
        id: "00000000-0000-4000-8000-000000000011",
        slug: "test-fixture-article",
        title: "Test fixture article",
        type: "Artikel",
        description:
          `<p>Intro artikel.</p><h2>Aktivitas bersama</h2><p><strong>Baca</strong> bersama.</p><h3>Persiapan</h3><ul><li>Kertas</li></ul><img src="/article-images/${articleImage}" alt="Gambar aktivitas" />`,
        media_url: "",
        duration: null,
      },
    ];
    if (url.searchParams.has("slug")) {
      const expression = url.searchParams.get("slug");
      rows = rows.filter((c) =>
        expression.startsWith("not.in.")
          ? !expression.slice(8, -1).split(",").includes(c.slug)
          : expression.startsWith("in.")
            ? expression.slice(4, -1).split(",").includes(c.slug)
            : `eq.${c.slug}` === expression,
      );
    }
    if (url.searchParams.has("id"))
      rows = rows.filter((c) => `eq.${c.id}` === url.searchParams.get("id"));
    if (url.searchParams.has("type"))
      rows = rows.filter(
        (c) => `eq.${c.type}` === url.searchParams.get("type"),
      );
    if (url.searchParams.has("category"))
      rows = rows.filter(
        (c) => `eq.${c.category}` === url.searchParams.get("category"),
      );
    if (url.searchParams.has("published"))
      rows = rows.filter((c) => `eq.${c.published}` === url.searchParams.get("published"));
    if (url.searchParams.has("description")) {
      const expression = url.searchParams.get("description");
      rows = rows.filter((c) => c.description.includes(expression.slice(6, -1)));
    }
    if (url.searchParams.get("or")?.includes("unmatched")) rows = [];
    const count = rows.length;
    const offset = Number(url.searchParams.get("offset") || 0);
    const limit = Number(url.searchParams.get("limit") || rows.length);
    rows = rows.slice(offset, offset + limit);
    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Range",
      `${offset}-${Math.max(offset, offset + rows.length - 1)}/${count}`,
    );
    return res.end(JSON.stringify(rows));
  }
  res.writeHead(401, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Unauthorized test request" }));
});
api.listen(0, "127.0.0.1");
await once(api, "listening");
const base = "http://localhost:3101";
let output = "";
const originalNextEnv = await readFile("next-env.d.ts", "utf8");
const originalTsconfig = await readFile("tsconfig.json", "utf8");
const testEnv = {
  ...process.env,
  NODE_ENV: "production",
  NEXT_BUILD_DIR: ".next-http",
  NEXT_PUBLIC_SITE_URL: base,
  NEXT_PUBLIC_SUPABASE_URL: `http://127.0.0.1:${api.address().port}`,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "automated-test-only",
};
const build = spawn(
  process.execPath,
  [require.resolve("next/dist/bin/next"), "build"],
  { env: testEnv, stdio: ["ignore", "pipe", "pipe"] },
);
let buildOutput = "";
build.stdout.on("data", (chunk) => (buildOutput += chunk));
build.stderr.on("data", (chunk) => (buildOutput += chunk));
const [buildCode] = await once(build, "exit");
await writeFile("next-env.d.ts", originalNextEnv);
await writeFile("tsconfig.json", originalTsconfig);
if (buildCode !== 0) {
  api.close();
  throw new Error(`Isolated HTTP test build failed: ${buildOutput}`);
}
const app = spawn(
  process.execPath,
  [require.resolve("next/dist/bin/next"), "start", "--port", "3101"],
  {
    env: testEnv,
    stdio: ["ignore", "pipe", "pipe"],
  },
);
app.stdout.on("data", (chunk) => (output += chunk));
app.stderr.on("data", (chunk) => (output += chunk));
try {
  let ready = false;
  for (let i = 0; i < 50; i++) {
    try {
      if ((await fetch(base)).status === 200) {
        ready = true;
        break;
      }
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  assert.ok(ready, `Next server did not become ready: ${output}`);
  const home = await (await fetch(base)).text();
  const imageResponse = await fetch(`${base}/article-images/${articleImage}`, { redirect: "manual" });
  assert.equal(imageResponse.status, 307, "published article images redirect to signed storage");
  assert.ok(imageResponse.headers.get("location")?.includes(`/thumbnails/${articleImage}?token=fixture`));
  assert.equal((await fetch(`${base}/article-images/00000000-0000-4000-8000-000000000051.png`, { redirect: "manual" })).status, 404, "unreferenced article images remain private");
  assert.equal((await fetch(`${base}/article-images/invalid.png`, { redirect: "manual" })).status, 404, "invalid image names are rejected");
  for (const path of ["/content/not-existing-review-slug", "/not-existing-review-route"]) {
    const missing = await fetch(`${base}${path}`);
    const html = await missing.text();
    assert.equal(missing.status, 404, `${path} returns HTTP 404`);
    assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `${path} renders one H1 without JavaScript`);
    assert.ok(html.includes('href="/"'), `${path} offers a route home`);
    assert.ok(html.includes('name="robots" content="noindex'), `${path} is not indexable`);
  }
  assert.equal((home.match(/<h1(?:\s|>)/g) || []).length, 1);
  assert.ok(home.includes(fixture.title), "public content must be in SSR HTML");
  assert.ok(
    home.includes("Hari ini, mau tahu apa?"),
    "published content powers topic discovery",
  );
  assert.ok(
    !home.includes("dragon-flame") &&
      !home.includes("Buat naga menyemburkan api"),
    "dragon no longer has a fire interaction",
  );
  assert.ok(
    home.includes('href="/admin"'),
    "public homepage exposes admin login as required by assessment",
  );
  const publicHeader = home.split("</header>")[0];
  assert.ok(
    !publicHeader.includes('href="/#search"'),
    "navbar has no search shortcut",
  );
  assert.ok(
    home.includes('id="content-search"'),
    "catalogue contains the public search form",
  );
  assert.ok(!home.includes("<canvas"), "background has no WebGL canvas");
  assert.ok(!home.includes('id="playground-title"'), "playground is removed");
  assert.ok(
    home.includes("/assets/show/hero-dragon.png"),
    "hero uses dragon artwork",
  );
  assert.ok(
    home.includes("/assets/show/show-logo.png"),
    "public header uses sourced SHOW logo",
  );
  const response = await fetch(`${base}/content/${fixture.slug}`);
  assert.equal(response.status, 200);
  const detail = await response.text();
  const head = detail.split("</head>")[0];
  assert.ok(head.includes(`<title>${fixture.meta_title}</title>`));
  assert.ok(
    head.includes('name="description" content="Test fixture description"'),
  );
  assert.ok(head.includes('property="og:title" content="Test fixture title"'));
  assert.ok(head.includes("application/ld+json"), "JSON-LD must be in head");
  assert.ok(head.includes("VideoObject"));
  assert.ok(
    detail.indexOf('class="video-frame"') <
      detail.indexOf('class="detail-heading"'),
    "video player precedes title in document order",
  );
  assert.ok(
    detail.includes("Baca deskripsi lengkap") &&
      detail.includes("Companion activity paragraph"),
    "full description is server-rendered in native disclosure",
  );
  assert.ok(!detail.includes("autoplay=1"));
  assert.equal((detail.match(/<h1(?:\s|>)/g) || []).length, 1);
  const article = await (
    await fetch(`${base}/content/test-fixture-article`)
  ).text();
  assert.ok(article.split("</head>")[0].includes('"@type":"Article"'));
  assert.ok(
    article.includes("Daftar isi") &&
      article.includes('href="#bagian-1"') &&
      article.includes('<h2 id="bagian-1">Aktivitas bersama</h2>') &&
      article.includes("<strong>Baca</strong>"),
    "rich article and table of contents render in server HTML",
  );
  assert.ok(
    article.includes("article-prose") &&
      article.includes("Semua tips parenting"),
  );
  assert.ok(
    !article.includes("Buka worksheet (PDF)"),
    "article has reading/navigation flow without PDF CTA",
  );
  const worksheetDetail = await (
    await fetch(`${base}/content/fixture-worksheet`)
  ).text();
  assert.ok(
    worksheetDetail.includes('href="/assets/demo/shapes.pdf"') &&
      worksheetDetail.includes("Unduh PDF") && worksheetDetail.includes("Buka PDF"),
  );
  assert.ok(
    worksheetDetail.includes('target="_blank"') &&
      worksheetDetail.includes("buka PDF di tab baru."),
  );
  assert.ok(
    worksheetDetail.includes("Semua worksheet") &&
      worksheetDetail.includes("Tentang worksheet"),
  );
  const empty = await (await fetch(`${base}/?q=unmatched`)).text();
  assert.ok(empty.includes("Belum ada yang cocok"));
  assert.ok(
    !empty.includes("Hari ini, mau tahu apa?"),
    "search results do not repeat homepage discovery",
  );
  assert.ok(!empty.includes(fixture.title));
  for (const [path, title] of [
    ["video", "Satu video, cerita baru."],
    ["worksheet", "Cetak, coba, ceritakan."],
    ["parents", "Ruang kecil untuk orang tua."],
  ]) {
    const html = await (await fetch(`${base}/${path}`)).text();
    assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1);
    assert.ok(html.includes(title));
    assert.ok(
      html.split("</head>")[0].includes(`href="${base}/${path}"`),
      "library canonical is rendered server-side",
    );
  }
  const videoPage = await (
    await fetch(`${base}/video?page=2&category=Animal%20%26%20Nature`)
  ).text();
  assert.ok(
    videoPage.includes("pagination-numbered") &&
      videoPage.includes('aria-label="Halaman 2" aria-current="page"'),
  );
  assert.ok(
    videoPage.includes("category=Animal") &&
      !videoPage.includes("Fixture worksheet"),
  );
  const beyondEnd = await (await fetch(`${base}/video?page=999`)).text();
  assert.ok(
    beyondEnd.includes('aria-label="Halaman 2" aria-current="page"'),
    "out-of-range pagination returns the last available page",
  );
  const pdfRedirect = await fetch(
    `${base}/media/00000000-0000-4000-8000-000000000012/worksheet`,
    { redirect: "manual" },
  );
  assert.equal(pdfRedirect.status, 307);
  assert.equal(
    pdfRedirect.headers.get("location"),
    `${base}/assets/demo/shapes.pdf`,
  );
  const download = await fetch(`${base}/media/00000000-0000-4000-8000-000000000012/download`);
  assert.equal(download.status, 200);
  assert.equal(download.headers.get("content-type"), "application/pdf");
  assert.match(download.headers.get("content-disposition"), /^attachment; filename="fixture-worksheet.pdf"$/);
  assert.ok((await download.text()).startsWith("%PDF-"));
  for (const id of ["invalid", "00000000-0000-4000-8000-000000000099"]) {
    assert.equal((await fetch(`${base}/media/${id}/download`)).status, 404);
  }
  const unavailable = await (await fetch(`${base}/?q=simulate-failure`)).text();
  assert.ok(
    unavailable.includes("Katalog sedang sulit dijangkau") &&
      unavailable.includes("hero-dragon.png"),
    "failed catalogue preserves hero and offers retry",
  );
  assert.ok(!unavailable.includes("Petualangan belajar segera hadir"));
  assert.equal((await fetch(`${base}/assets/demo/shapes.pdf`)).status, 200);
  assert.equal((await fetch(`${base}/content/unpublished`)).status, 404);
  assert.equal(
    (await fetch(`${base}/admin`, { redirect: "manual" })).status,
    307,
  );
  const robots = await (await fetch(`${base}/robots.txt`)).text();
  assert.ok(robots.includes("Disallow: /admin"));
  const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
  assert.ok(sitemap.includes(`/content/${fixture.slug}`));
  assert.ok(!sitemap.includes("unpublished"));
  assert.equal(
    (
      await fetch(`${base}/api/admin/content`, {
        method: "POST",
        headers: { origin: "https://evil.test" },
      })
    ).status,
    403,
  );
  assert.equal(
    (
      await fetch(`${base}/api/admin/content`, {
        method: "POST",
        headers: { origin: base },
      })
    ).status,
    401,
  );
  assert.equal(
    (
      await fetch(`${base}/api/admin/login`, {
        method: "POST",
        headers: { origin: base },
        body: "not-json",
      })
    ).status,
    422,
  );
  assert.equal((await fetch(`${base}/media/invalid/thumbnail`)).status, 404);
  assert.equal(
    (
      await fetch(`${base}/api/admin/categories`, {
        method: "POST",
        headers: { origin: base },
      })
    ).status,
    401,
  );
  const login = await fetch(`${base}/api/admin/login`, {
    method: "POST",
    headers: { origin: base, "Content-Type": "application/json" },
    body: JSON.stringify({
      email: testUser.email,
      password: "fixture-only-password",
    }),
  });
  assert.equal(login.status, 200, "mock admin login succeeds");
  const cookie = login.headers
    .getSetCookie()
    .map((value) => value.split(";")[0])
    .join("; ");
  assert.ok(cookie, "mock session cookie is created");
  const adminResponse = await fetch(`${base}/admin`, { headers: { cookie } });
  assert.equal(adminResponse.status, 200);
  const adminHtml = await adminResponse.text();
  assert.ok(
    adminHtml.includes("cms-sidebar") &&
      adminHtml.includes("<table") &&
      adminHtml.includes("cms-table-thumbnail"),
    "admin has sidebar, semantic table and thumbnails",
  );
  assert.ok(
    !adminHtml.includes("Content management") &&
      adminHtml.includes("cms-account-trigger"),
  );
  assert.ok(
    !adminHtml.includes("Lihat website") &&
      adminHtml.includes('href="/admin/categories"'),
  );
  const categoriesHtml = await (
    await fetch(`${base}/admin/categories`, { headers: { cookie } })
  ).text();
  assert.ok(
    categoriesHtml.includes("Tambah kategori") &&
      categoriesHtml.includes("Animal &amp; Nature"),
  );
  const adminUnavailable = await (
    await fetch(`${base}/admin?q=simulate-failure`, { headers: { cookie } })
  ).text();
  assert.ok(
    adminUnavailable.includes("Daftar konten belum bisa dimuat") &&
      adminUnavailable.includes("cms-sidebar"),
  );
  assert.ok(
    !adminHtml.includes('class="cms-account-panel"'),
    "logout is collapsed inside account menu",
  );
  assert.ok(
    adminHtml.includes("Diperbarui") && adminHtml.includes(fixture.title),
  );
  const recordResponse = await fetch(`${base}/admin/content/${fixture.id}`, {
    headers: { cookie },
    redirect: "manual",
  });
  const editorPath = `/admin/content/${fixture.id}/edit`;
  if (recordResponse.status === 307) {
    assert.equal(recordResponse.headers.get("location"), editorPath);
  } else {
    assert.equal(recordResponse.status, 200);
    const redirectHtml = await recordResponse.text();
    assert.ok(
      redirectHtml.includes('http-equiv="refresh"') &&
        redirectHtml.includes(`url=${editorPath}`),
      "streamed legacy page redirects to editor",
    );
  }
  const editorResponse = await fetch(
    `${base}/admin/content/${fixture.id}/edit`,
    { headers: { cookie } },
  );
  assert.equal(editorResponse.status, 200);
  const editorHtml = await editorResponse.text();
  assert.ok(
    editorHtml.includes("editor-publish") &&
      editorHtml.includes("cms-publication") &&
      editorHtml.includes("meta_description"),
    "editor retains publication and SEO fields",
  );
  assert.ok(
    !editorHtml.includes("editor-jump-links") &&
      editorHtml.includes("cms-seo-preview") &&
      editorHtml.includes("cms-live-preview") &&
      editorHtml.includes("youtube-nocookie.com/embed/"),
    "editor includes SEO and playable content previews without extra jump navigation",
  );
  const createResponse = await fetch(`${base}/admin/content/new`, {
    headers: { cookie },
  });
  assert.equal(createResponse.status, 200);
  assert.ok((await createResponse.text()).includes("Tambah konten"));
  console.log(
    "PASS: public SSR/SEO and authorization checks; mock-session CMS table, legacy redirect, edit and create pages.",
  );
  console.log(
    "Uses an isolated HTTP fixture. Does not verify live Supabase Auth or Storage.",
  );
} catch (error) {
  console.error(output.slice(-3000));
  throw error;
} finally {
  app.kill();
  await new Promise((resolve) => api.close(resolve));
}
