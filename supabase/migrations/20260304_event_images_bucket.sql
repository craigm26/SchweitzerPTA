-- Create a dedicated public storage bucket for event images
insert into storage.buckets (id, name, public)
values ('event-images', 'event-images', true)
on conflict (id) do nothing;

create policy "Public Access Event Images"
on storage.objects for select
using (bucket_id = 'event-images');

create policy "Authenticated Upload Event Images"
on storage.objects for insert
with check (
  bucket_id = 'event-images'
  and auth.role() = 'authenticated'
  and exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'editor')
  )
);

create policy "Authenticated Update Event Images"
on storage.objects for update
using (
  bucket_id = 'event-images'
  and auth.role() = 'authenticated'
  and exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'editor')
  )
);

create policy "Authenticated Delete Event Images"
on storage.objects for delete
using (
  bucket_id = 'event-images'
  and auth.role() = 'authenticated'
  and exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'editor')
  )
);
