-- Lock Prisma-managed tables from the Supabase Data API.
-- Run automatically on the hosted project; keep this file as the source of truth.
--
-- users / addresses / _prisma_migrations are only accessed by k-bix-pop-api (Prisma).
-- Enabling RLS with no policies + revoking anon/authenticated grants blocks anyone
-- who has the project URL / anon key from reading passwords, emails, and addresses.
-- Prisma still works because it connects as the table owner, which bypasses RLS.

ALTER TABLE public._prisma_migrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public._prisma_migrations FROM anon, authenticated, public;
REVOKE ALL ON TABLE public.users FROM anon, authenticated, public;
REVOKE ALL ON TABLE public.addresses FROM anon, authenticated, public;

CREATE POLICY "no_direct_access" ON public._prisma_migrations
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

CREATE POLICY "no_direct_access" ON public.users
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

CREATE POLICY "no_direct_access" ON public.addresses
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);
