-- Storage buckets for recordings and exports
-- Run this migration third, after 02_rls.sql

-- Create storage buckets
insert into storage.buckets (id, name, public) values
  ('recordings', 'recordings', false),
  ('exports', 'exports', false);

-- RLS policies for storage objects

-- Recordings: authenticated users can read their tenant's recordings
create policy "tenant read recordings" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'recordings'
    and exists (
      select 1 from public.calls c
      where c.recording_url = (storage.objects.bucket_id || '/' || storage.objects.name)
        and c.tenant_id = public.tenant_id_for_user()
    )
  );

-- Service role can upload recordings
create policy "service upload recordings" on storage.objects
  for insert to service_role
  with check (bucket_id = 'recordings');

-- Exports: authenticated users can read their tenant's exports
create policy "tenant read exports" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'exports'
    and (storage.foldername(name))[1] = public.tenant_id_for_user()::text
  );

-- Authenticated users can create exports in their tenant folder
create policy "tenant upload exports" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'exports'
    and (storage.foldername(name))[1] = public.tenant_id_for_user()::text
  );

-- Service role has full access to both buckets
create policy "service manage recordings" on storage.objects
  for all to service_role
  using (bucket_id = 'recordings');

create policy "service manage exports" on storage.objects
  for all to service_role
  using (bucket_id = 'exports');
