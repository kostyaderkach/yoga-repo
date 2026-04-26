alter table public.practice_types
  add column if not exists full_description_en text,
  add column if not exists full_description_ua text;
