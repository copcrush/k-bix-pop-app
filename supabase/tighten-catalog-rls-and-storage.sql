-- Catalog tables: public SELECT only. Writes go through the service role
-- (Nuxt server / Nest), which bypasses RLS.
-- Applied remotely as migration tighten_catalog_rls_and_storage_listing.

DROP POLICY IF EXISTS "Allow all artists for testing" ON public.artists;
DROP POLICY IF EXISTS "Allow all for testing" ON public.products;

REVOKE INSERT, UPDATE, DELETE ON TABLE public.artists FROM anon, authenticated, public;
REVOKE INSERT, UPDATE, DELETE ON TABLE public.products FROM anon, authenticated, public;
GRANT SELECT ON TABLE public.artists TO anon, authenticated;
GRANT SELECT ON TABLE public.products TO anon, authenticated;

-- Public buckets stay reachable by object URL. Broad SELECT lets clients list files.
DROP POLICY IF EXISTS "Public read k-bix-pop-stores" ON storage.objects;
DROP POLICY IF EXISTS "work images are publicly readable" ON storage.objects;

-- Anonymous uploads closed; admin uploads use the service role.
DROP POLICY IF EXISTS "Public upload k-bix-pop-stores" ON storage.objects;
