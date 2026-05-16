-- Run in Supabase SQL Editor after replacing the image URL placeholder.
-- If SELECT fails from the app, enable RLS read access (see bottom).

INSERT INTO products (
  name,
  description,
  price,
  stock_quantity,
  product_status,
  image_url,
  detail_images
) VALUES (
  'aespa - The 2nd Album [Armageddon] (Lemonade Mutant Ver.)',
  'The second full-length album from K-Pop group aespa. This ''Lemonade Mutant'' version features four unique jewel case covers with a dark, supernatural concept, highlighting the members'' striking yellow ''mutant'' eyes. Includes CD, booklet, and exclusive photocards.',
  24.99,
  100,
  'pre-order',
  'PASTE_MY_IMAGE_URL_HERE',
  ARRAY[
    'PASTE_MY_IMAGE_URL_HERE'
  ]::text[]
);

-- Optional: allow anonymous reads for frontend testing (skip if already configured)
-- ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Public read products"
--   ON products FOR SELECT
--   TO anon, authenticated
--   USING (true);
