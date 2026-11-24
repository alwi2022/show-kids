create policy "Read images attached to published articles" on storage.objects
for select to anon, authenticated using (
  bucket_id = 'thumbnails' and exists (
    select 1 from public.contents c
    where c.published and c.type = 'Artikel'
      and position('/article-images/' || storage.objects.name in c.description) > 0
  )
);
