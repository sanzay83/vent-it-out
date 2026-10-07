-- ============================================================
-- Migration 002 — self-service account deletion
-- Run this once in the Supabase SQL editor (paste & Run).
-- (Already included in schema.sql for fresh setups.)
-- ============================================================

-- delete_own_account(): removes the caller's auth user plus all of their
-- data — likes they gave (decrementing those posts' counters), their own
-- posts (their received likes cascade away), their chat messages, and
-- their profile row. Runs as the database owner (security definer) so it
-- can delete from auth.users, which clients can never touch directly.
create or replace function public.delete_own_account()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_username text;
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;

  select username into v_username from public.profiles where id = v_uid;

  if v_username is not null then
    -- give back the likes this user gave to other people's posts
    update public.posts p
      set reaction = greatest(p.reaction - 1, 0)
      from public.post_likes l
      where l.post_id = p.id and l.username = v_username;

    delete from public.post_likes where username = v_username;
    delete from public.posts where username = v_username;
    delete from public.messages where username = v_username;
  end if;

  delete from public.profiles where id = v_uid;
  delete from auth.users where id = v_uid;
end;
$$;

grant execute on function public.delete_own_account() to authenticated;
