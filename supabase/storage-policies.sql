-- Public bucket k-bix-pop-stores: allow storefront reads and admin uploads from the app (dev).
-- Tighten policies before production (e.g. restrict INSERT to authenticated admins only).

DROP POLICY IF EXISTS "Public read k-bix-pop-stores" ON storage.objects;
DROP POLICY IF EXISTS "Public upload k-bix-pop-stores" ON storage.objects;

CREATE POLICY "Public read k-bix-pop-stores"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'k-bix-pop-stores');

CREATE POLICY "Public upload k-bix-pop-stores"
  ON storage.objects FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'k-bix-pop-stores');
