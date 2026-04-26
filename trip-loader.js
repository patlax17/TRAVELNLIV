/**
 * TRAVEL & LIV — TRIP PAGE LIVE LOADER
 * Fetches trip data from Supabase `trip_pages` table and hydrates the DOM.
 * Include AFTER the Supabase SDK on each trip page.
 * The page must have data-slug="bali" (or punta-cana / rio) on <body>.
 */
(function () {
    const SUPABASE_URL = "https://ziejdpdrhpxqxrhkwpew.supabase.co";
    const SUPABASE_KEY = "sb_publishable_raXNn8hTDaSHzkSeD1R3SQ_0EPZzUPX";

    const slug = document.body.getAttribute('data-slug');
    if (!slug) { console.warn('[TripLoader] No data-slug on <body> — skipping.'); return; }

    // Create client if not already available
    const client = (typeof window.supabaseClient !== 'undefined')
        ? window.supabaseClient
        : supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    window.supabaseClient = client;

    async function loadTripPage() {
        console.log('[TripLoader] Fetching trip_pages slug=', slug);
        const { data, error } = await client
            .from('trip_pages')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) {
            console.warn('[TripLoader] No record in trip_pages for slug:', slug, '— using static HTML fallback.');
            return;
        }

        console.log('[TripLoader] Loaded from Supabase:', data);
        applyTripData(data);
    }

    function applyTripData(d) {
        // ── Hero image ──────────────────────────────────────────────
        if (d.hero_image) {
            const heroImg = document.getElementById(slug + '-hero-img')
                || document.querySelector('[data-field="hero-img"]');
            if (heroImg) heroImg.src = d.hero_image;
        }

        // ── Hero headline ───────────────────────────────────────────
        if (d.headline) {
            const hl = document.querySelector('[data-field="headline"]');
            if (hl) hl.textContent = d.headline;
        }

        // ── Trip sub line (dates / price) ───────────────────────────
        if (d.sub_line) {
            const sub = document.querySelector('.trip-hero-sub');
            if (sub) sub.textContent = d.sub_line;
        }

        // ── Booking status badge ────────────────────────────────────
        if (d.status) {
            const badge = document.querySelector('[data-field="status-badge"]');
            if (badge) {
                badge.textContent = d.status === 'booking-open' ? '🟢 Booking Open' : '🟡 Coming Soon';
                badge.style.background = d.status === 'booking-open'
                    ? 'rgba(78,197,128,0.15)' : 'rgba(232,168,62,0.15)';
            }
        }

        // ── Description paragraphs ──────────────────────────────────
        if (d.description) {
            const descEl = document.querySelector('[data-field="description"]');
            if (descEl) {
                descEl.innerHTML = d.description
                    .split('\n\n')
                    .filter(Boolean)
                    .map(p => `<p style="color:var(--text-muted);line-height:1.9;font-size:1.05rem;margin-bottom:20px;">${p}</p>`)
                    .join('');
            }
        }

        // ── Price display ───────────────────────────────────────────
        if (d.price_display) {
            document.querySelectorAll('[data-field="price"]').forEach(el => {
                el.textContent = d.price_display;
            });
            const stickyPrice = document.querySelector('.sticky-sub');
            if (stickyPrice) stickyPrice.textContent = d.price_display + (d.duration ? ' · ' + d.duration : '');
        }

        // ── Gallery strip photos (data-index=0..N) ──────────────────
        if (Array.isArray(d.gallery_images)) {
            d.gallery_images.forEach((url, i) => {
                const el = document.getElementById(slug + '-g-' + i)
                    || document.querySelector('[data-gallery-index="' + i + '"]');
                if (el && url) el.src = url;
            });
        }

        // ── Room images ─────────────────────────────────────────────
        if (Array.isArray(d.room_images)) {
            d.room_images.forEach((url, i) => {
                const el = document.getElementById(slug + '-room-' + i)
                    || document.querySelector('[data-room-index="' + i + '"]');
                if (el && url) el.src = url;
            });
        }

        // ── Booking URL ─────────────────────────────────────────────
        if (d.squadtrip_url) {
            document.querySelectorAll('[data-field="book-url"]').forEach(el => {
                el.href = d.squadtrip_url;
            });
        }
    }

    // Run on DOMContentLoaded (or immediately if already loaded)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadTripPage);
    } else {
        loadTripPage();
    }
})();
