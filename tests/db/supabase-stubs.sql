create extension if not exists pgcrypto;
create role anon nologin;
create role authenticated nologin;
create role service_role nologin;
create schema auth;
create schema storage;
create table auth.users (
  instance_id uuid, id uuid primary key default gen_random_uuid(), aud text, role text, email text unique,
  encrypted_password text, email_confirmed_at timestamptz, raw_app_meta_data jsonb, raw_user_meta_data jsonb,
  created_at timestamptz, updated_at timestamptz, confirmation_token text, recovery_token text,
  email_change_token_new text, email_change text
);
create table auth.identities (
  id uuid primary key, user_id uuid references auth.users (id) on delete cascade, provider_id text,
  identity_data jsonb, provider text, last_sign_in_at timestamptz, created_at timestamptz, updated_at timestamptz
);
create function auth.uid() returns uuid language sql stable as
  $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
create table storage.buckets (id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
create table storage.objects (id uuid primary key default gen_random_uuid(), bucket_id text, name text);
alter table storage.objects enable row level security;
grant usage on schema auth, storage to anon, authenticated, service_role;
grant all on all tables in schema storage to anon, authenticated, service_role;
alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
alter default privileges in schema public grant all on functions to anon, authenticated, service_role;
grant usage on schema public to anon, authenticated, service_role;
