-- Fix enquiry table for public form inserts (404 / 401 from /rest/v1/enquiry)
-- Supabase → SQL Editor → New query → paste → Run

-- 1) Rename old table if it still exists
do $$
begin
  if to_regclass('public.contacts') is not null
     and to_regclass('public.enquiry') is null then
    alter table public.contacts rename to enquiry;
  end if;
end $$;

-- 2) Create table if missing
create table if not exists public.enquiry (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists enquiry_created_at_idx on public.enquiry (created_at desc);

-- 3) RLS + insert policy for anon key (browser)
alter table public.enquiry enable row level security;

drop policy if exists "anon_insert_contacts" on public.enquiry;
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

-- 4) Table privileges (401 without these)
revoke all on public.enquiry from anon, authenticated;
grant insert on public.enquiry to anon, authenticated;

-- 5) Refresh PostgREST schema cache (clears stale 404 after rename)
notify pgrst, 'reload schema';
