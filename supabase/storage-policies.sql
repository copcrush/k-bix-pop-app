-- k-bix-pop-stores is a public bucket: object URLs work without a SELECT policy.
-- Do not add a broad SELECT on storage.objects (that lets clients list every file).
-- Uploads go through the Nuxt admin server route with the service role (bypasses RLS).

DROP POLICY IF EXISTS "Public read k-bix-pop-stores" ON storage.objects;
DROP POLICY IF EXISTS "Public upload k-bix-pop-stores" ON storage.objects;
DROP POLICY IF EXISTS "work images are publicly readable" ON storage.objects;
