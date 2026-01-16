-- NOTE: Run this script in Supabase SQL editor. Some editors may flag
-- `CREATE EXTENSION` or RLS policy statements; if so, copy the commands
-- below into Supabase to execute them.

-- Create admins table for role management
-- create extension if not exists "uuid-ossp";
-- create extension if not exists pgcrypto;
-- create table if not exists admins (
--   id uuid primary key default gen_random_uuid(),
--   email text not null unique,
--   role text not null check (role in ('admin','subadmin')),
--   created_at timestamp with time zone default now()
-- );

-- Enable RLS
-- alter table admins enable row level security;

-- Policies (add in Supabase SQL once you decide rules)
-- Example: allow SELECT to authenticated users only
-- create policy "admins_select_authenticated" on admins for select using (auth.role() = 'authenticated');
-- Example: allow changes only to emails listed as admin
-- create policy "admins_modify_admins" on admins for all using (auth.email() in (select email from admins where role = 'admin'));
