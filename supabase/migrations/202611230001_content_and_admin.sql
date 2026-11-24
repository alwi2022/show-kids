create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;
revoke all on public.admin_users from anon, authenticated;
grant select on public.admin_users to authenticated;
create policy "Admins can read their own membership" on public.admin_users
  for select to authenticated using (user_id = (select auth.uid()));

create function public.is_admin() returns boolean
language sql stable security definer set search_path = ''
as $$ select exists(select 1 from public.admin_users where user_id = (select auth.uid())); $$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create table public.contents (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) between 1 and 160),
  slug text not null unique check (char_length(slug) <= 120 and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  category text not null check (category in ('Music & Song','Education Learning','Creative & DIY','Animal & Nature','Healthy Habits')),
  type text not null check (type in ('Video','Worksheet','Artikel')),
  description text not null check (char_length(trim(description)) between 1 and 20000),
  thumbnail text not null check (char_length(trim(thumbnail)) > 0),
  alt_text text not null check (char_length(trim(alt_text)) between 1 and 250),
  media_url text not null default '',
  duration integer check (duration > 0 and duration <= 86400),
  is_new boolean not null default false,
  published boolean not null default false,
  meta_title text not null check (char_length(trim(meta_title)) between 1 and 60),
  meta_description text not null check (char_length(trim(meta_description)) between 1 and 160),
  canonical_url text not null default '',
  focus_keyword text not null default '' check (char_length(focus_keyword) <= 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint media_required check (type = 'Artikel' or char_length(trim(media_url)) > 0)
);
create index contents_public_catalog on public.contents (published, created_at desc, id);
create index contents_category_type on public.contents (category, type);
create function public.touch_content() returns trigger language plpgsql set search_path = '' as $$
begin
  new.created_at = old.created_at;
  new.updated_at = now();
  return new;
end;
$$;
create trigger content_updated before update on public.contents for each row execute function public.touch_content();
alter table public.contents enable row level security;
revoke all on public.contents from anon, authenticated;
grant select on public.contents to anon, authenticated;
grant insert, update, delete on public.contents to authenticated;
create policy "Read published content or administer" on public.contents for select to anon, authenticated
  using (published or (select public.is_admin()));
create policy "Admin insert" on public.contents for insert to authenticated with check ((select public.is_admin()));
create policy "Admin update" on public.contents for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admin delete" on public.contents for delete to authenticated using ((select public.is_admin()));
