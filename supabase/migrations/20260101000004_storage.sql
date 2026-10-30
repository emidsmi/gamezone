-- Bucket publico para capas, banners e galerias
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('game-media', 'game-media', true, 5242880, array['image/svg+xml', 'image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do update set public = true, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "game_media_public_read" on storage.objects for select using (bucket_id = 'game-media');
create policy "game_media_admin_insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'game-media' and public.is_admin());
create policy "game_media_admin_update" on storage.objects for update to authenticated
  using (bucket_id = 'game-media' and public.is_admin());
create policy "game_media_admin_delete" on storage.objects for delete to authenticated
  using (bucket_id = 'game-media' and public.is_admin());
