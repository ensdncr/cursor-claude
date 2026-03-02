-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Markets table
CREATE TABLE IF NOT EXISTS markets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  color_hex TEXT NOT NULL DEFAULT '#000000',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE
);

-- Catalogs table
CREATE TABLE IF NOT EXISTS catalogs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  market_id UUID NOT NULL REFERENCES markets(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  valid_from DATE NOT NULL,
  valid_until DATE NOT NULL,
  source_file_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  catalog_id UUID NOT NULL REFERENCES catalogs(id) ON DELETE CASCADE,
  market_id UUID NOT NULL REFERENCES markets(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  old_price DECIMAL(10, 2),
  category TEXT NOT NULL DEFAULT 'Diğer',
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_market_id ON products(market_id);
CREATE INDEX IF NOT EXISTS idx_products_catalog_id ON products(catalog_id);
CREATE INDEX IF NOT EXISTS idx_catalogs_market_id ON catalogs(market_id);
CREATE INDEX IF NOT EXISTS idx_catalogs_valid_until ON catalogs(valid_until);

-- Storage bucket for catalogs (run this in Supabase dashboard)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('catalogs', 'catalogs', true);

-- =================== SEED DATA ===================

-- Insert markets
INSERT INTO markets (id, name, color_hex) VALUES
  ('11111111-1111-1111-1111-111111111111', 'BİM', '#FF6B00'),
  ('22222222-2222-2222-2222-222222222222', 'A101', '#E31E24'),
  ('33333333-3333-3333-3333-333333333333', 'ŞOK', '#6B1FA2')
ON CONFLICT (name) DO NOTHING;

-- Insert categories
INSERT INTO categories (name) VALUES
  ('Elektronik'),
  ('Gıda'),
  ('Tekstil'),
  ('Ev & Yaşam'),
  ('Kişisel Bakım'),
  ('Diğer')
ON CONFLICT (name) DO NOTHING;

-- Insert catalogs (dates relative to a base date - adjust as needed)
INSERT INTO catalogs (id, market_id, title, valid_from, valid_until) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'BİM 3-9 Mart Aktüeli', '2026-03-03', '2026-03-09'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'BİM 17-23 Şubat Aktüeli', '2026-02-17', '2026-02-23'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', 'A101 Mart Aktüeli', '2026-03-01', '2026-03-08'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '22222222-2222-2222-2222-222222222222', 'A101 Şubat Aktüeli', '2026-02-20', '2026-02-28'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '33333333-3333-3333-3333-333333333333', 'ŞOK Bu Hafta', '2026-03-02', '2026-03-07'),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', '33333333-3333-3333-3333-333333333333', 'ŞOK Geçen Hafta', '2026-02-23', '2026-03-01')
ON CONFLICT DO NOTHING;

-- Insert BİM products (catalog aaaaaaaa)
INSERT INTO products (catalog_id, market_id, name, price, old_price, category) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'BİM Blender 1000W', 299.90, 449.90, 'Elektronik'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Çikolatalı Gofret 3''lü', 24.90, NULL, 'Gıda'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Erkek Spor Ayakkabı', 199.90, 299.90, 'Tekstil'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Yapışmaz Tava 28cm', 149.90, NULL, 'Ev & Yaşam'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Şampuan 400ml', 39.90, 59.90, 'Kişisel Bakım');

-- Insert A101 products (catalog cccccccc)
INSERT INTO products (catalog_id, market_id, name, price, old_price, category) VALUES
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', 'A101 Airfryer 4L', 799.90, 1199.90, 'Elektronik'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', 'Zeytinyağı 1L', 189.90, 219.90, 'Gıda'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', 'Kadın Pijama Takımı', 249.90, 349.90, 'Tekstil'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', 'Robot Süpürge', 1299.90, 1999.90, 'Ev & Yaşam'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', 'Diş Fırçası 3''lü', 29.90, NULL, 'Kişisel Bakım');

-- Insert ŞOK products (catalog eeeeeeee)
INSERT INTO products (catalog_id, market_id, name, price, old_price, category) VALUES
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '33333333-3333-3333-3333-333333333333', 'ŞOK Çamaşır Makinesi 8kg', 8499.90, 12999.90, 'Ev & Yaşam'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '33333333-3333-3333-3333-333333333333', 'Fındıklı Çikolata 100g', 19.90, 24.90, 'Gıda'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '33333333-3333-3333-3333-333333333333', 'Erkek Polar Hırka', 299.90, NULL, 'Tekstil'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '33333333-3333-3333-3333-333333333333', 'Kablosuz Kulaklık', 449.90, 699.90, 'Elektronik'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '33333333-3333-3333-3333-333333333333', 'Duş Jeli 500ml', 44.90, 64.90, 'Kişisel Bakım');

-- Row Level Security (RLS) policies
ALTER TABLE markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Allow public read on markets" ON markets FOR SELECT USING (true);
CREATE POLICY "Allow public read on catalogs" ON catalogs FOR SELECT USING (true);
CREATE POLICY "Allow public read on products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public read on categories" ON categories FOR SELECT USING (true);

-- Service role write access (admin operations use service role key)
CREATE POLICY "Allow service role write on markets" ON markets FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role write on catalogs" ON catalogs FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role write on products" ON products FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role write on categories" ON categories FOR ALL USING (auth.role() = 'service_role');
