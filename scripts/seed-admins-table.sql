-- Run this in the Supabase SQL editor. Comments start with --

-- Create required extensions (safe if already installed)
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- Create admins table for role management
create table if not exists admins (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  role text not null check (role in ('admin','subadmin')),
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table admins enable row level security;

-- Policies (adjust to your needs)
-- Allow SELECT to authenticated users
create policy "admins_select_authenticated" on admins for select using (auth.role() = 'authenticated');
-- Allow changes only if the authenticated email is an admin
create policy "admins_modify_admins" on admins for all using (
  auth.email() in (select email from admins where role = 'admin')
);
