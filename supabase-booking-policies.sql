-- Run this in Supabase SQL Editor if Book / Unbook does not persist.
-- It fixes RLS for booking cancellation and prevents duplicate bookings.

alter table public.bookings enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'bookings'
      and policyname = 'Anyone authenticated can view bookings'
  ) then
    create policy "Anyone authenticated can view bookings"
      on public.bookings
      for select
      to authenticated
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'bookings'
      and policyname = 'Users can create own bookings'
  ) then
    create policy "Users can create own bookings"
      on public.bookings
      for insert
      to authenticated
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'bookings'
      and policyname = 'Users can delete own bookings'
  ) then
    create policy "Users can delete own bookings"
      on public.bookings
      for delete
      to authenticated
      using (auth.uid() = user_id);
  end if;
end $$;

delete from public.bookings a
using public.bookings b
where a.id > b.id
  and a.user_id = b.user_id
  and a.class_id = b.class_id;

create unique index if not exists bookings_user_class_unique
  on public.bookings(user_id, class_id);
