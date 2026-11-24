begin;
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (name = trim(name) and char_length(name) between 1 and 80),
  created_at timestamptz not null default now()
);
create unique index categories_name_case_insensitive on public.categories (lower(name));
insert into public.categories(name) values
('Music & Song'),('Education Learning'),('Creative & DIY'),('Animal & Nature'),('Healthy Habits');
insert into public.categories(name) select distinct category from public.contents on conflict (name) do nothing;
alter table public.contents drop constraint contents_category_check;
alter table public.contents add constraint contents_category_fkey foreign key (category)
references public.categories(name) on update cascade on delete restrict;
alter table public.categories enable row level security;
revoke all on public.categories from anon, authenticated;
grant select on public.categories to anon, authenticated;
grant insert, update, delete on public.categories to authenticated;
create policy "Read categories" on public.categories for select to anon, authenticated using (true);
create policy "Admin create categories" on public.categories for insert to authenticated with check ((select public.is_admin()));
create policy "Admin update categories" on public.categories for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admin delete categories" on public.categories for delete to authenticated using ((select public.is_admin()));
commit;
