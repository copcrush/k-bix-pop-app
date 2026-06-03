-- Artist brand themes (colors for name badges on the shop)

CREATE TABLE IF NOT EXISTS public.artists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  color_start text NOT NULL DEFAULT '#6366f1',
  color_end text,
  gradient_angle smallint NOT NULL DEFAULT 135,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;

-- Example: aespa purple → cyan gradient
-- INSERT INTO public.artists (slug, name, color_start, color_end, gradient_angle)
-- VALUES ('aespa', 'aespa', '#7c3aed', '#06b6d4', 135);
