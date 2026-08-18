-- Fix: "permission denied for schema public" from the Nuxt app (anon / authenticated roles).
-- Storefront only needs SELECT. Admin catalog writes use the service role, which bypasses RLS.

GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT ON TABLES TO anon, authenticated;

REVOKE INSERT, UPDATE, DELETE ON TABLE public.artists FROM anon, authenticated, public;
REVOKE INSERT, UPDATE, DELETE ON TABLE public.products FROM anon, authenticated, public;

-- Never expose Prisma auth/PII tables through PostgREST.
REVOKE ALL ON TABLE public._prisma_migrations FROM anon, authenticated, public;
REVOKE ALL ON TABLE public.users FROM anon, authenticated, public;
REVOKE ALL ON TABLE public.addresses FROM anon, authenticated, public;
