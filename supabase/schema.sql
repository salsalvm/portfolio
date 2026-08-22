-- Run this once in Supabase → SQL Editor → New query → Run
-- Free Postgres: stores unique visitors + enquiries
--
-- If you already have a `contacts` table, migrate with:
--   alter table public.contacts rename to enquiry;
--   alter index contacts_created_at_idx rename to enquiry_created_at_idx;
--   drop policy if exists "anon_insert_contacts" on public.enquiry;
-- then re-run the enquiry policy + grant section below.

create extension if not exists pgcrypto;

create table if not exists public.visitors (
  id text primary key,
  ip text not null,
  visit_count integer not null default 1,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  user_agent text default '',
  referrer text default '',
  path text default '/'
);

create table if not exists public.enquiry (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists enquiry_created_at_idx on public.enquiry (created_at desc);
create index if not exists visitors_last_seen_at_idx on public.visitors (last_seen_at desc);

alter table public.visitors enable row level security;
alter table public.enquiry enable row level security;

-- Public can submit enquiries; cannot read them (view in Supabase Table Editor)
drop policy if exists "anon_insert_enquiry" on public.enquiry;
create policy "anon_insert_enquiry"
  on public.enquiry
  for insert
  to anon, authenticated
  with check (
    char_length(name) > 0
    and char_length(email) > 0
    and char_length(subject) > 0
    and char_length(message) > 0
    and char_length(message) <= 4000
  );

-- Same IP = same row (update count). No public SELECT of IPs.
create or replace function public.track_visitor(
  p_id text,
  p_ip text,
  p_user_agent text default '',
  p_referrer text default '',
  p_path text default '/'
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  row public.visitors%rowtype;
begin
  if p_id is null or length(trim(p_id)) = 0 then
    raise exception 'invalid visitor id';
  end if;

  select * into row from public.visitors where id = p_id;

  if found then
    update public.visitors
    set
      visit_count = visit_count + 1,
      last_seen_at = now(),
      user_agent = coalesce(nullif(p_user_agent, ''), user_agent),
      referrer = coalesce(nullif(p_referrer, ''), referrer),
      path = coalesce(nullif(p_path, ''), path)
    where id = p_id
    returning * into row;

    return json_build_object(
      'is_new', false,
      'visit_count', row.visit_count
    );
  end if;

  insert into public.visitors (id, ip, visit_count, user_agent, referrer, path)
  values (
    p_id,
    coalesce(nullif(p_ip, ''), 'unknown'),
    1,
    coalesce(p_user_agent, ''),
    coalesce(p_referrer, ''),
    coalesce(nullif(p_path, ''), '/')
  )
  returning * into row;

  return json_build_object(
    'is_new', true,
    'visit_count', 1
  );
end;
$$;

revoke all on function public.track_visitor(text, text, text, text, text) from public;
grant execute on function public.track_visitor(text, text, text, text, text) to anon, authenticated;

revoke all on public.visitors from anon, authenticated;
revoke all on public.enquiry from anon, authenticated;
grant insert on public.enquiry to anon, authenticated;
