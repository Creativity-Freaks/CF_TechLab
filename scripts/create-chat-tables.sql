-- Chat logging tables
-- Run in Supabase SQL editor or psql. RLS optional for dev; secure before prod.

create table if not exists public.chat_sessions (
   id              uuid primary key default gen_random_uuid(),
   user_name       text,
   user_email      text,
   summary         text,
   created_at      timestamptz not null default now(),
   last_message_at timestamptz
);

create table if not exists public.chat_messages (
   id         uuid primary key default gen_random_uuid(),
   session_id uuid not null
      references public.chat_sessions ( id )
         on delete cascade,
   role       text not null check ( role in ( 'user',
                                        'assistant',
                                        'system' ) ),
   content    text not null,
   created_at timestamptz not null default now()
);

create index if not exists idx_chat_messages_session on
   public.chat_messages (
      session_id,
      created_at
   desc );

-- Dev only: open RLS (if enabled) or keep disabled for now.
-- alter table public.chat_sessions enable row level security;
-- alter table public.chat_messages enable row level security;
-- create policy "allow all dev" on public.chat_sessions for all using (true) with check (true);
-- create policy "allow all dev" on public.chat_messages for all using (true) with check (true);