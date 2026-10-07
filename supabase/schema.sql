-- ============================================================
-- Vent It Out — Supabase schema (free tier)
-- Run this once in the Supabase SQL editor (paste & Run).
-- ============================================================

-- 1) Profiles: one row per auth user, holds the public username
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique not null,
  created_at timestamptz not null default now()
);

-- 2) Posts (vents)
create table if not exists public.posts (
  id bigint generated always as identity primary key,
  username text not null,
  title text not null,
  message text not null,
  type text not null,               -- Happy | Sad | Angry | Love | Surprise | Relaxed
  reaction int not null default 0,  -- like count
  created_at timestamptz not null default now()
);
create index if not exists posts_created_idx on public.posts (created_at desc);
create index if not exists posts_type_idx on public.posts (type);
create index if not exists posts_username_idx on public.posts (username);

-- 3) One like per user per post
create table if not exists public.post_likes (
  post_id bigint not null references public.posts (id) on delete cascade,
  username text not null,
  created_at timestamptz not null default now(),
  primary key (post_id, username)
);

-- 4) Global chat messages
create table if not exists public.messages (
  id bigint generated always as identity primary key,
  username text not null,
  message text not null,
  created_at timestamptz not null default now()
);
create index if not exists messages_created_idx on public.messages (created_at desc);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.post_likes enable row level security;
alter table public.messages enable row level security;

-- Profiles: usernames are public in the app; users can only create their own row
drop policy if exists "Profiles are public" on public.profiles;
create policy "Profiles are public"
  on public.profiles for select to anon, authenticated using (true);

drop policy if exists "Users create own profile" on public.profiles;
create policy "Users create own profile"
  on public.profiles for insert to authenticated
  with check (id = auth.uid());

-- Posts: anyone can read; only signed-in users can post/delete as themselves
drop policy if exists "Posts are public" on public.posts;
create policy "Posts are public"
  on public.posts for select to anon, authenticated using (true);

drop policy if exists "Users post as themselves" on public.posts;
create policy "Users post as themselves"
  on public.posts for insert to authenticated
  with check (username = (select username from public.profiles where id = auth.uid()));

drop policy if exists "Users delete own posts" on public.posts;
create policy "Users delete own posts"
  on public.posts for delete to authenticated
  using (username = (select username from public.profiles where id = auth.uid()));

-- Likes: readable by all; like/unlike handled by the like_post() RPC below
drop policy if exists "Likes are public" on public.post_likes;
create policy "Likes are public"
  on public.post_likes for select to anon, authenticated using (true);

-- Messages: anyone can read; only signed-in users can send as themselves
drop policy if exists "Messages are public" on public.messages;
create policy "Messages are public"
  on public.messages for select to anon, authenticated using (true);

drop policy if exists "Users send as themselves" on public.messages;
create policy "Users send as themselves"
  on public.messages for insert to authenticated
  with check (username = (select username from public.profiles where id = auth.uid()));

-- ============================================================
-- like_post(): records one like per user, bumps the counter.
-- Username is derived server-side from the auth token — clients
-- cannot spoof someone else's like.
-- Returns true when this was a NEW like, false if already liked.
-- ============================================================
create or replace function public.like_post(p_post_id bigint)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_username text;
  v_is_new boolean := false;
begin
  select username into v_username from public.profiles where id = auth.uid();
  if v_username is null then
    raise exception 'not authenticated';
  end if;

  insert into public.post_likes (post_id, username)
  values (p_post_id, v_username)
  on conflict do nothing;

  if found then
    update public.posts set reaction = reaction + 1 where id = p_post_id;
    v_is_new := true;
  end if;

  return v_is_new;
end;
$$;

grant execute on function public.like_post(bigint) to authenticated;

-- ============================================================
-- Realtime: stream new chat messages to all connected clients
-- ============================================================
do $$
begin
  alter publication supabase_realtime add table public.messages;
exception when duplicate_object then
  null;
end $$;
