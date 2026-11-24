import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";

test("migrations enforce role membership, publication, constraints and storage access", async () => {
  const db = new PGlite();
  try {
    await db.exec(`
      create role anon; create role authenticated;
      create schema auth; create table auth.users(id uuid primary key);
      create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true),'')::uuid $$;
      grant usage on schema auth to anon, authenticated; grant execute on function auth.uid() to anon, authenticated;
      create schema storage;
      create table storage.buckets(id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
      create table storage.objects(id uuid primary key default gen_random_uuid(), bucket_id text, name text);
      alter table storage.objects enable row level security;
      grant usage on schema storage to anon, authenticated;
      grant select,insert,update,delete on storage.objects to anon, authenticated;
      insert into auth.users values ('00000000-0000-4000-8000-000000000001'),('00000000-0000-4000-8000-000000000002');
    `);
    for (const file of [
      "202611230001_content_and_admin.sql",
      "202611230002_storage.sql",
    ])
      await db.exec(
        await readFile(
          new URL(`../../supabase/migrations/${file}`, import.meta.url),
          "utf8",
        ),
      );
    await db.exec(`
      insert into public.admin_users(user_id) values ('00000000-0000-4000-8000-000000000001');
      insert into public.contents(title,slug,category,type,description,thumbnail,alt_text,meta_title,meta_description,published) values
        ('Published','published','Education Learning','Artikel','Body','storage:thumbnails/abc.png','Alt','Title','Description',true),
        ('Draft','draft','Education Learning','Artikel','Body','storage:thumbnails/def.png','Alt','Title','Description',false);
      insert into storage.objects(bucket_id,name) values ('thumbnails','abc.png'),('thumbnails','def.png');
      set role anon;
    `);
    assert.equal(
      (await db.query("select * from public.contents")).rows.length,
      1,
    );
    assert.equal(
      (await db.query("select * from storage.objects")).rows.length,
      1,
    );
    await assert.rejects(
      db.exec(
        "insert into public.admin_users(user_id) values ('00000000-0000-4000-8000-000000000002')",
      ),
    );
    await assert.rejects(db.exec("delete from public.contents"));
    await db.exec(
      "reset role; set role authenticated; set request.jwt.claim.sub = '00000000-0000-4000-8000-000000000002'",
    );
    assert.equal(
      (await db.query("select * from public.admin_users")).rows.length,
      0,
    );
    assert.equal(
      (await db.query("select * from public.contents")).rows.length,
      1,
    );
    await assert.rejects(
      db.exec(
        "insert into storage.objects(bucket_id,name) values ('thumbnails','evil.png')",
      ),
    );
    assert.equal(
      (
        await db.query(
          "update public.contents set title='intrusion' returning id",
        )
      ).rows.length,
      0,
    );
    await assert.rejects(
      db.exec(
        "insert into public.admin_users(user_id) values ('00000000-0000-4000-8000-000000000002')",
      ),
    );
    await db.exec(
      "set request.jwt.claim.sub = '00000000-0000-4000-8000-000000000001'",
    );
    assert.equal(
      (await db.query("select * from public.contents")).rows.length,
      2,
    );
    assert.equal(
      (await db.query("select * from storage.objects")).rows.length,
      2,
    );
    await db.exec(
      "update public.contents set published=false where slug='published'",
    );
    await assert.rejects(
      db.exec("update public.contents set slug='draft' where slug='published'"),
    );
    await assert.rejects(
      db.exec(
        "update public.contents set meta_title=repeat('x',61) where slug='draft'",
      ),
    );
    await assert.rejects(
      db.exec("update public.contents set alt_text='' where slug='draft'"),
    );
    await db.exec(
      "insert into storage.objects(bucket_id,name) values ('worksheets','test.pdf')",
    );
    await db.exec("reset role; set request.jwt.claim.sub = ''; set role anon");
    assert.equal(
      (await db.query("select * from public.contents")).rows.length,
      0,
    );
    assert.equal(
      (await db.query("select * from storage.objects")).rows.length,
      0,
    );
  } finally {
    await db.close();
  }
});
