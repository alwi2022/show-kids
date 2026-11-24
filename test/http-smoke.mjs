import assert from "node:assert/strict";
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { createRequire } from "node:module";
import { readFile, writeFile } from "node:fs/promises";

const require = createRequire(import.meta.url);
const fixture = {
  id: "00000000-0000-4000-8000-000000000010",
  title: "Test fixture nature lesson",
  slug: "test-fixture-nature",
  category: "Animal & Nature",
  type: "Video",
  description: "Content used only by the automated HTTP checks.",
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
const api = createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  if (url.pathname === "/rest/v1/contents") {
    let rows = [
      fixture,
      {
        ...fixture,
        id: "00000000-0000-4000-8000-000000000011",
        slug: "test-fixture-article",
        title: "Test fixture article",
        type: "Artikel",
        media_url: "",
        duration: null,
      },
    ];
    if (url.searchParams.has("slug"))
      rows = rows.filter(
        (c) => `eq.${c.slug}` === url.searchParams.get("slug"),
      );
    if (url.searchParams.has("id"))
      rows = rows.filter((c) => `eq.${c.id}` === url.searchParams.get("id"));
    if (url.searchParams.has("type"))
      rows = rows.filter(
        (c) => `eq.${c.type}` === url.searchParams.get("type"),
      );
    if (url.searchParams.get("or")?.includes("unmatched")) rows = [];
    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Range",
      `0-${Math.max(0, rows.length - 1)}/${rows.length}`,
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
  assert.equal((home.match(/<h1(?:\s|>)/g) || []).length, 1);
  assert.ok(home.includes(fixture.title), "public content must be in SSR HTML");
  assert.ok(home.includes('Hari ini, mau tahu apa?'), 'published content powers topic discovery');
  assert.ok(!home.includes('dragon-flame') && !home.includes('Buat naga menyemburkan api'), 'dragon no longer has a fire interaction');
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
    "catalogue search remains available",
  );
  assert.ok(
    !home.includes('<canvas'),
    "background has no WebGL canvas",
  );
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
  assert.equal((detail.match(/<h1(?:\s|>)/g) || []).length, 1);
  const article = await (
    await fetch(`${base}/content/test-fixture-article`)
  ).text();
  assert.ok(article.split("</head>")[0].includes('"@type":"Article"'));
  const empty = await (await fetch(`${base}/?q=unmatched`)).text();
  assert.ok(empty.includes("Belum ada yang cocok"));
  assert.ok(!empty.includes('Hari ini, mau tahu apa?'), 'search results do not repeat homepage discovery');
  assert.ok(!empty.includes(fixture.title));
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
  console.log(
    "PASS: SSR catalogue, metadata + JSON-LD in head, one H1, real 404, admin redirect, sitemap, robots, origin and authorization checks.",
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
