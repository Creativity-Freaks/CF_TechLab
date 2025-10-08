-- DANGER: This script drops ALL row level security policies for the listed tables
-- and DISABLES RLS so every row becomes publicly readable & writable via the anon key.
-- Use ONLY in a private dev environment. DO NOT run in production.
-- After running you will have:
--   * Full read/write on services, projects, testimonials, contact_messages
--   * Full read/write on storage.objects (uploads bucket) including delete
--   * Contact messages (private data) exposed
-- Re‑enable later with a restore script (you previously had one) or recreate policies manually.

-- 1. Drop policies on public tables
DO $$
DECLARE r record; BEGIN
  FOR r IN (
    SELECT policyname, tablename
    FROM pg_policies
    WHERE schemaname='public'
      AND tablename IN ('services','projects','testimonials','contact_messages')
  ) LOOP
    EXECUTE format('drop policy if exists %I on public.%I;', r.policyname, r.tablename);
  END LOOP;
END $$;

-- 2. Disable RLS on each table (makes all operations unrestricted under anon key)
alter table services disable row level security;
alter table projects disable row level security;
alter table testimonials disable row level security;
alter table contact_messages disable row level security;

-- 3. STORAGE: Drop all storage.object policies then disable RLS
DO $$
DECLARE r record; BEGIN
  FOR r IN (
    SELECT policyname
    FROM pg_policies
    WHERE schemaname='storage'
      AND tablename='objects'
  ) LOOP
    EXECUTE format('drop policy if exists %I on storage.objects;', r.policyname);
  END LOOP;
END $$;

-- NOTE: RLS cannot be disabled on storage.objects (managed by Supabase). Instead we add fully open policies.
create policy "public read uploads (open)" on storage.objects for select using (bucket_id='uploads');
create policy "public write uploads (open)" on storage.objects for insert with check (bucket_id='uploads');
create policy "public update uploads (open)" on storage.objects for update using (bucket_id='uploads') with check (bucket_id='uploads');
create policy "public delete uploads (open)" on storage.objects for delete using (bucket_id='uploads');

-- 4. Verification
select 'public_tables_rls_status' as section, relname as table_name, relrowsecurity as rls_enabled
from pg_class c join pg_namespace n on n.oid=c.relnamespace
where n.nspname='public' and relname in ('services','projects','testimonials','contact_messages')
order by relname;

select 'storage_rls_status' as section, relname as table_name, relrowsecurity as rls_enabled
from pg_class c join pg_namespace n on n.oid=c.relnamespace
where n.nspname='storage' and relname='objects';

select 'remaining_public_policies' as section, policyname, tablename, cmd
from pg_policies
where schemaname='public'
  and tablename in ('services','projects','testimonials','contact_messages')
order by tablename;

select 'remaining_storage_policies' as section, policyname, cmd
from pg_policies
where schemaname='storage' and tablename='objects';

-- 5. Reminder output
select 'ALL RLS DISABLED: Your data is now fully open. Re‑enable before deploying publicly.' as WARNING;