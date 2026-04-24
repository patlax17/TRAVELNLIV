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

-- 5. SITE SETTINGS (Dynamic Layout Keys)
CREATE TABLE IF NOT EXISTS homepage_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS about_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. GALLERY IMAGES (High-Res Asset Bank)
CREATE TABLE IF NOT EXISTS gallery_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url TEXT NOT NULL,
    category TEXT DEFAULT 'COMMUNITY',
    title TEXT,
    description TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. IMAGES (Global Core Assets Mapping)
CREATE TABLE IF NOT EXISTS images (
    image_key TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── ROW LEVEL SECURITY (RLS) ──────────────────────────────────────────
ALTER TABLE homepage_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read" ON homepage_settings FOR SELECT USING (true);
CREATE POLICY "Public Read" ON about_settings FOR SELECT USING (true);
CREATE POLICY "Public Read" ON gallery_images FOR SELECT USING (true);
CREATE POLICY "Public Read" ON images FOR SELECT USING (true);

-- Admin Write Access (Manual Auth Trigger)
CREATE POLICY "Admin Write" ON homepage_settings FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Write" ON about_settings FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Write" ON gallery_images FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Write" ON images FOR ALL TO authenticated USING (true);
