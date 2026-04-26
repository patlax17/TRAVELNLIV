-- ============================================================
-- TRAVEL & LIV COLLECTIVE — SUPABASE SEED
-- Run this ONCE in your Supabase SQL Editor → Run All
-- Safe to re-run: all inserts use ON CONFLICT DO NOTHING
-- ============================================================


-- ────────────────────────────────────────────────────────────
-- 1.  site_copy  (one row per page: 'home', 'about')
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS site_copy (
  page                  TEXT PRIMARY KEY,

  -- HERO
  hero_heading          TEXT,
  hero_heading_italic   TEXT,
  hero_subtitle         TEXT,
  hero_cta_primary      TEXT,
  hero_cta_secondary    TEXT,
  hero_bg_img           TEXT,

  -- STATS BAR
  stat1_num TEXT, stat1_label TEXT,
  stat2_num TEXT, stat2_label TEXT,
  stat3_num TEXT, stat3_label TEXT,

  -- TICKER
  ticker_items          JSONB  DEFAULT '[]',

  -- WHO WE ARE / IDENTITY
  identity_heading        TEXT,
  identity_heading_italic TEXT,
  identity_para1 TEXT, identity_para2 TEXT, identity_para3 TEXT,

  -- SOCIAL PROOF STATS
  proof_stat1 TEXT, proof_label1 TEXT,
  proof_stat2 TEXT, proof_label2 TEXT,
  proof_stat3 TEXT, proof_label3 TEXT,

  -- SOCIAL PROOF PHOTO GRID (10 slots)
  proof_photos          JSONB  DEFAULT '[]',

  -- NEXT TRIP BLOCK
  nt_badge TEXT, nt_destination TEXT, nt_dates TEXT,
  nt_url TEXT, nt_description TEXT, nt_image TEXT,
  nt_squadtrip_url TEXT,

  -- PAST EVENT BLOCK
  past_event_location     TEXT,
  past_event_title        TEXT,
  past_event_title_italic TEXT,
  past_event_visible      TEXT,
  past_event_desc         TEXT,
  launch_party_photos     JSONB  DEFAULT '[]',

  -- FINAL CTA
  cta_heading TEXT, cta_heading_italic TEXT, cta_body TEXT,
  cta_bg_img  TEXT,

  -- ABOUT PAGE
  founder_heading TEXT,
  founder_photo   TEXT,
  founder_bio     TEXT,

  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE site_copy ENABLE ROW LEVEL SECURITY;

-- Public read / open write (matches your existing auth pattern)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'site_copy' AND policyname = 'Public read site_copy'
  ) THEN
    CREATE POLICY "Public read site_copy" ON site_copy FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'site_copy' AND policyname = 'Auth write site_copy'
  ) THEN
    CREATE POLICY "Auth write site_copy" ON site_copy FOR ALL USING (true);
  END IF;
END $$;


-- ────────────────────────────────────────────────────────────
-- 2.  faqs  (one row per question)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS faqs (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  category    TEXT NOT NULL DEFAULT 'general',
  sort_order  INT  NOT NULL DEFAULT 0,
  question    TEXT NOT NULL,
  answer      TEXT NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'faqs' AND policyname = 'Public read faqs'
  ) THEN
    CREATE POLICY "Public read faqs" ON faqs FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'faqs' AND policyname = 'Auth write faqs'
  ) THEN
    CREATE POLICY "Auth write faqs" ON faqs FOR ALL USING (true);
  END IF;
END $$;


-- ────────────────────────────────────────────────────────────
-- 3.  trip_pages  (one row per destination slug)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS trip_pages (
  slug            TEXT PRIMARY KEY,

  -- Identity
  name            TEXT,
  emoji           TEXT,

  -- Card fields (Upcoming Page controller)
  month_tag       TEXT,
  duration_tag    TEXT,
  dates           TEXT,
  price_display   TEXT,
  deposit         TEXT,
  payment_splits  TEXT,
  description     TEXT,
  includes_list   JSONB DEFAULT '[]',
  status          TEXT DEFAULT 'coming-soon',  -- 'open' | 'coming-soon'

  -- Photo strip (5 ordered URLs)
  photo_strip     JSONB DEFAULT '[]',

  -- Destination sub-page fields
  hero_image      TEXT,
  page_title      TEXT,
  page_subtitle   TEXT,
  page_body       TEXT,

  updated_at      TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE trip_pages ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'trip_pages' AND policyname = 'Public read trip_pages'
  ) THEN
    CREATE POLICY "Public read trip_pages" ON trip_pages FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'trip_pages' AND policyname = 'Auth write trip_pages'
  ) THEN
    CREATE POLICY "Auth write trip_pages" ON trip_pages FOR ALL USING (true);
  END IF;
END $$;


-- ────────────────────────────────────────────────────────────
-- 4.  ADD COLUMN migrations (safe — IF NOT EXISTS)
--     Run these even if the tables already exist from a previous deploy
-- ────────────────────────────────────────────────────────────

-- site_copy additions
ALTER TABLE site_copy
  ADD COLUMN IF NOT EXISTS proof_photos        JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS launch_party_photos JSONB DEFAULT '[]';

-- trip_pages additions (covers older deploys missing these columns)
ALTER TABLE trip_pages
  ADD COLUMN IF NOT EXISTS name           TEXT,
  ADD COLUMN IF NOT EXISTS emoji          TEXT,
  ADD COLUMN IF NOT EXISTS month_tag      TEXT,
  ADD COLUMN IF NOT EXISTS duration_tag   TEXT,
  ADD COLUMN IF NOT EXISTS dates          TEXT,
  ADD COLUMN IF NOT EXISTS price_display  TEXT,
  ADD COLUMN IF NOT EXISTS deposit        TEXT,
  ADD COLUMN IF NOT EXISTS payment_splits TEXT,
  ADD COLUMN IF NOT EXISTS description    TEXT,
  ADD COLUMN IF NOT EXISTS includes_list  JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS photo_strip    JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS status         TEXT  DEFAULT 'coming-soon';


-- ────────────────────────────────────────────────────────────
-- 5.  SEED — site_copy: homepage
-- ────────────────────────────────────────────────────────────
INSERT INTO site_copy (
  page,
  hero_heading, hero_heading_italic, hero_subtitle,
  hero_cta_primary, hero_cta_secondary,
  stat1_num, stat1_label,
  stat2_num, stat2_label,
  stat3_num, stat3_label,
  ticker_items,
  identity_heading, identity_heading_italic,
  identity_para1, identity_para2, identity_para3,
  proof_stat1, proof_label1,
  proof_stat2, proof_label2,
  proof_stat3, proof_label3,
  nt_badge, nt_destination, nt_dates, nt_url, nt_description,
  past_event_location, past_event_title, past_event_title_italic,
  past_event_visible, past_event_desc,
  cta_heading, cta_heading_italic, cta_body
)
VALUES (
  'home',

  -- Hero
  'Where destinations', 'become connections.',
  'Group trips for people who actually make it out of the group chat. Curated experiences. Real connections. Unforgettable destinations.',
  'Join the Next Experience', 'Explore Upcoming Trips',

  -- Stats Bar
  '4–5★', 'Stays Only',
  'Global', 'Destinations',
  '💳', 'Flexible Payment Plans Available',

  -- Ticker
  '["Pre-Trip Meet & Greets","Welcome Dinners","4–5 Star Stays Only","Curated Experiences","Flexible Payment Plans","Real Connections","Farewell Dinners Included","Come Solo. Leave With More."]',

  -- Who We Are
  'This isn''t a travel group.', 'It''s your kind of people.',
  'You know that feeling when everyone talks about traveling... but no one actually books it?',
  'We built Travel & LIV Collective for the ones who do.',
  'The ones who crave more than just a trip — but a shared experience with people who get it.',

  -- Social Proof Stats
  '20+', 'Strangers Connected',
  '100%', 'Would Go Again',
  '∞',   'Memories Made',

  -- Next Trip
  'Booking Open', 'Bali, Indonesia', 'July 30 – August 5, 2026 · 7 Days', '/bali.html',
  'Sacred rice terraces, rooftop infinity pools, temple sunrises, and nights the group chat will never let you forget. This is Bali with the collective.',

  -- Past Event
  'NYC — April 2025', 'The Launch Party', '— it was a vibe.', 'visible',
  'We kicked off Travel & LIV Collective in New York City and the energy was unmatched. Red carpet, Mix & Bingo, good people — this is what happens when the collective shows up.',

  -- Final CTA
  'You''ll either be on the next trip...', 'or watching it on Instagram.',
  'The collective is growing. The next trip is being planned. Your seat is waiting.'
)
ON CONFLICT (page) DO NOTHING;


-- ────────────────────────────────────────────────────────────
-- 6.  SEED — site_copy: about page
-- ────────────────────────────────────────────────────────────
INSERT INTO site_copy (page, founder_heading, founder_bio)
VALUES (
  'about',
  'Hi, I''m Olivia Owen — the founder of Travel & LIV Collective.',
  'Travel & LIV started as a personal mission to make group travel feel intentional again. After years of watching dream trips die in group chats, I decided to just book it — and invite anyone who was serious enough to show up. Now we''re a global collective of people who actually go.'
)
ON CONFLICT (page) DO NOTHING;


-- ────────────────────────────────────────────────────────────
-- 7.  SEED — trip_pages: Bali, Punta Cana, Rio
-- ────────────────────────────────────────────────────────────
INSERT INTO trip_pages (
  slug, name, emoji,
  month_tag, duration_tag, dates,
  price_display, deposit, payment_splits,
  description, includes_list, status
)
VALUES

  -- ── BALI ──────────────────────────────────────────────────
  (
    'bali',
    'Bali, Indonesia', '🏝️',
    'July–August 2026', '7 Days', 'July 30 – August 5, 2026',
    'Starting at $2,350', '$500 deposit to reserve', 'Then 3 payments of $623',
    'Seven days in the Island of the Gods. From sacred rice terraces and volcanic sunrises to rooftop infinity pools, traditional ceremonies, and nights you''ll never forget — Bali is where the soul gets recharged and strangers become lifelong friends.',
    '["🏨 Curated Villa Stay","🍽️ Welcome & Farewell Dinners","🌿 Group Excursions","🎋 Cultural Experiences","💳 Flexible Payments","🧳 Solo-Friendly"]',
    'open'
  ),

  -- ── PUNTA CANA ────────────────────────────────────────────
  (
    'punta-cana',
    'Punta Cana, D.R.', '🌴',
    'October 2026', NULL, NULL,
    'TBA', NULL, NULL,
    'White-sand beaches, crystal-clear waters, and the warmth of the Caribbean — Punta Cana is the perfect backdrop for an unforgettable collective experience. Full details dropping soon.',
    '[]',
    'coming-soon'
  ),

  -- ── RIO DE JANEIRO ────────────────────────────────────────
  (
    'rio',
    'Rio de Janeiro, Brazil', '🎉',
    'December 2026', NULL, NULL,
    'TBA', NULL, NULL,
    'End 2026 right. Carnival energy, iconic beaches, Christ the Redeemer, and samba nights — Rio is electric, and we''re bringing the collective there for a December experience you won''t forget.',
    '[]',
    'coming-soon'
  )

ON CONFLICT (slug) DO NOTHING;


-- ────────────────────────────────────────────────────────────
-- 8.  SEED — faqs (14 questions, 3 categories)
-- ────────────────────────────────────────────────────────────
INSERT INTO faqs (category, sort_order, question, answer) VALUES

  -- General
  ('general', 1,
   'What is Travel & LIV Collective?',
   'Travel & LIV Collective is a curated group travel community built for people who actually want to go. We plan premium, intentional trips where strangers show up and leave as lifelong friends.'),

  ('general', 2,
   'Who goes on these trips?',
   'Our travelers are professionals, creatives, and adventurous souls aged 21–45 who want more than just a vacation — they want a real shared experience. Most travelers come solo and leave with a crew.'),

  ('general', 3,
   'Do I have to know anyone to join?',
   'Not at all. Most of our travelers come solo. Our pre-trip events and group structure are designed to build connections before you even land.'),

  ('general', 4,
   'How big are the groups?',
   'We keep groups intentionally small — typically 15–25 people — so the experience stays premium and personal, never a tour-bus situation.'),

  -- Trips
  ('trips', 5,
   'What''s included in the trip price?',
   'Every trip includes curated accommodation (4–5★ stays), a welcome dinner, farewell dinner, group excursions, and cultural experiences. Flights are not included so you can book what works best for you.'),

  ('trips', 6,
   'Are flights included?',
   'Flights are not included. This gives you the flexibility to book from your city and use your preferred airline or miles. We''ll share recommended flight windows once your trip is confirmed.'),

  ('trips', 7,
   'What if I have dietary restrictions or accessibility needs?',
   'We accommodate dietary restrictions and do our best to ensure accessibility on all planned activities. Let us know your needs when you register and we''ll handle the rest.'),

  ('trips', 8,
   'Can I request a single room?',
   'Shared accommodation is standard, but single supplement options may be available for an additional fee. Reach out before booking to check availability for your trip.'),

  ('trips', 9,
   'What happens if the trip doesn''t reach minimum capacity?',
   'In the rare case a trip doesn''t reach minimum capacity, you''ll be notified at least 60 days in advance and given a full refund or credit toward a future trip.'),

  -- Payments
  ('payments', 10,
   'How does the payment plan work?',
   'For Bali, a $500 deposit secures your spot, followed by 3 equal installment payments leading up to the trip. You''ll never need to pay everything at once.'),

  ('payments', 11,
   'Is my deposit refundable?',
   'Deposits are non-refundable but fully transferable to another traveler or a future trip if you need to cancel. We recommend travel insurance for full coverage.'),

  ('payments', 12,
   'What payment methods do you accept?',
   'We accept all major credit/debit cards and ACH bank transfers through our secure booking portal powered by Squadtrip.'),

  ('payments', 13,
   'Is travel insurance required?',
   'Travel insurance is strongly recommended but not required. We partner with trusted providers and can share options when you register.'),

  ('payments', 14,
   'When is the final payment due?',
   'Final payment is typically due 60 days before departure. You''ll receive automated reminders well in advance of each payment milestone.')

ON CONFLICT DO NOTHING;


-- ────────────────────────────────────────────────────────────
-- ✅  DONE — verify with:
--   SELECT page, updated_at FROM site_copy;
--   SELECT slug, name, status FROM trip_pages;
--   SELECT category, sort_order, question FROM faqs ORDER BY sort_order;
-- ────────────────────────────────────────────────────────────


-- ============================================================
-- PHOTO GRID CLEANUP — run if proof photos or launch party
-- photos are showing alt-text instead of images.
-- This resets both arrays to the correct relative paths used
-- on the Vercel deployment (travelnliv.vercel.app).
-- Safe to run multiple times — uses UPDATE not INSERT.
-- ============================================================

UPDATE site_copy
SET
  proof_photos = '[
    "social_proof/KQ6A1033.JPG",
    "social_proof/IMG_2476.JPG",
    "social_proof/IMG_2539.JPG",
    "social_proof/IMG_3312.JPG",
    "social_proof/IMG_3328.JPG",
    "social_proof/IMG_3337.JPG",
    "social_proof/IMG_3428.JPG",
    "social_proof/IMG_3482.JPG",
    "social_proof/IMG_2486.JPG",
    "social_proof/KQ6A1043.JPG"
  ]'::jsonb,

  launch_party_photos = '[
    "launch_party/LP_welcome_sign.jpg",
    "launch_party/LP_red_carpet_group.jpg",
    "launch_party/LP_red_carpet_man.jpg",
    "launch_party/LP_bingo.jpg",
    "launch_party/DSC07227_Original 2.JPG",
    "launch_party/DSC07234_Original 2.JPG",
    "launch_party/LP_crowd.jpg"
  ]'::jsonb,

  updated_at = NOW()

WHERE page = 'home';

-- Verify the fix:
-- SELECT jsonb_array_length(proof_photos)        AS proof_count,
--        jsonb_array_length(launch_party_photos)  AS launch_count,
--        proof_photos->0                          AS first_proof_url
-- FROM site_copy WHERE page = 'home';
