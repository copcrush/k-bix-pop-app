-- Fix: "permission denied for schema public" from the Nuxt app (anon / authenticated roles).
-- Run in Supabase SQL Editor if the storefront cannot SELECT from public.products.

GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;

-- Dev / admin catalog writes from the app (tighten before production).
GRANT INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO anon, authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT ON TABLES TO anon, authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT INSERT, UPDATE, DELETE ON TABLES TO anon, authenticated;
