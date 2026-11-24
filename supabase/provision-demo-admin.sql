-- Create and confirm the demo account in Authentication > Users first.
-- This grants the existing demo account access; it never creates a password.
do $$
declare
  demo_id uuid;
begin
  select id into demo_id from auth.users where email = 'admin@showkids.local';
  if demo_id is null then
    raise exception 'Create admin@showkids.local in Authentication > Users first, with email confirmed.';
  end if;
  insert into public.admin_users(user_id) values (demo_id)
  on conflict (user_id) do nothing;
end;
$$;

select u.email, a.created_at
from public.admin_users a
join auth.users u on u.id = a.user_id
where u.email = 'admin@showkids.local';
