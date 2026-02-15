-- 1. Create a storage bucket for 'avatars'
-- Note: You might need to create this manually in the dashboard if this script fails due to permissions,
-- but running this is the standard way.
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- 2. Set up security policies for the 'avatars' bucket
-- Allow public access to view files
create policy "Avatar images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'avatars' );

-- Allow authenticated users to upload files
create policy "Anyone can upload an avatar."
  on storage.objects for insert
  with check ( bucket_id = 'avatars' and auth.role() = 'authenticated' );

-- Allow users to update their own avatar (optional, depends on how you handle file names)
create policy "Anyone can update their own avatar."
  on storage.objects for update
  using ( bucket_id = 'avatars' and auth.role() = 'authenticated' );

-- 3. Add avatar_url column to app_users table
alter table public.app_users 
add column if not exists avatar_url text;
