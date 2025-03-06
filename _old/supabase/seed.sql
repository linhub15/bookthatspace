-- Required for `supabase db reset`
INSERT INTO storage.buckets
  (id, name, public, avif_autodetection, allowed_mime_types)
VALUES
  ('room-photos', 'room-photos', true, false, ARRAY [ 'image/*' ]);