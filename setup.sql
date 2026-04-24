-- ── DATABASE SETUP: TRAVEL & LIV COLLECTIVE ──────────────────────────

-- 1. DESTINATIONS TABLE
CREATE TABLE IF NOT EXISTS destinations (
    slug TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    emoji TEXT DEFAULT '🏝️',
    url TEXT,
    status TEXT DEFAULT 'booking_open',
    dates TEXT,
    price TEXT,
    badge TEXT,
    tagline TEXT,
    teaser_desc TEXT,
    description TEXT,
    squadtrip_link TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ITINERARIES TABLE
CREATE TABLE IF NOT EXISTS itineraries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    destination_slug TEXT REFERENCES destinations(slug) ON DELETE CASCADE,
    day_number INT NOT NULL,
    title TEXT NOT NULL,
    body TEXT,
    highlights TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. INCLUDES TABLE
CREATE TABLE IF NOT EXISTS includes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    destination_slug TEXT REFERENCES destinations(slug) ON DELETE CASCADE,
    icon TEXT,
    title TEXT NOT NULL,
    description TEXT,
    order_index INT DEFAULT 0
);

-- 4. ROOMS TABLE
CREATE TABLE IF NOT EXISTS rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    destination_slug TEXT REFERENCES destinations(slug) ON DELETE CASCADE,
    title TEXT NOT NULL,
    price TEXT,
    deposit_note TEXT,
    badge TEXT,
    order_index INT DEFAULT 0
);

-- 5. SITE CONFIG TABLE
CREATE TABLE IF NOT EXISTS site_config (
    section_key TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. IMAGES TABLE (Key-Value map for external URLs or storage paths)
CREATE TABLE IF NOT EXISTS images (
    image_key TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── ROW LEVEL SECURITY (RLS) ──────────────────────────────────────────

-- Enable RLS on all tables
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE includes ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_assets ENABLE ROW LEVEL SECURITY;

-- Allow public READ access to everything
CREATE POLICY "Public Read Access" ON destinations FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON itineraries FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON includes FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON rooms FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON site_config FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON images FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON gallery_assets FOR SELECT USING (true);

-- Allow authenticated (Admin) WRITE access to everything
CREATE POLICY "Admin Write Access" ON destinations FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Write Access" ON itineraries FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Write Access" ON includes FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Write Access" ON rooms FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Write Access" ON site_config FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Write Access" ON images FOR ALL TO authenticated USING (true);
