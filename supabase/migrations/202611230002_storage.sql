insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types) values
  ('thumbnails', 'thumbnails', false, 2097152, array['image/jpeg','image/png','image/webp']),
  ('worksheets', 'worksheets', false, 2097152, array['application/pdf']);

-- Private buckets keep draft media from being exposed by a public bucket URL.
create policy "Read thumbnails attached to published content" on storage.objects for select to anon, authenticated
using (bucket_id = 'thumbnails' and ((select public.is_admin()) or exists (
  select 1 from public.contents c where c.published and c.thumbnail = 'storage:thumbnails/' || name
)));
create policy "Read worksheets attached to published content" on storage.objects for select to anon, authenticated
using (bucket_id = 'worksheets' and ((select public.is_admin()) or exists (
  select 1 from public.contents c where c.published and c.media_url = 'storage:worksheets/' || name
)));
create policy "Admin upload media" on storage.objects for insert to authenticated
with check (bucket_id in ('thumbnails','worksheets') and (select public.is_admin()));
create policy "Admin replace media" on storage.objects for update to authenticated
using (bucket_id in ('thumbnails','worksheets') and (select public.is_admin()))
with check (bucket_id in ('thumbnails','worksheets') and (select public.is_admin()));
create policy "Admin remove media" on storage.objects for delete to authenticated
using (bucket_id in ('thumbnails','worksheets') and (select public.is_admin()));
