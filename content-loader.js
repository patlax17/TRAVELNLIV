/* ================================================================
   content-loader.js — Travel & LIV Collective
   GALLERY ONLY. Hero / About / Homepage copy is handled
   exclusively by site-sync.js (reads from 'site_copy' table).
   This file previously queried dead tables (homepage_settings,
   about_settings) and wrote empty strings into hero-heading,
   overriding valid static HTML before Supabase could hydrate it.
   That bug has been removed. Do not add homepage rendering here.
   ================================================================ */
(function () {
    const SUPABASE_URL = "https://ziejdpdrhpxqxrhkwpew.supabase.co";
    const SUPABASE_KEY = "sb_publishable_raXNn8hTDaSHzkSeD1R3SQ_0EPZzUPX";

    let _client = null;
    function getClient() {
        if (!_client && typeof supabase !== 'undefined') {
            _client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        }
        return _client;
    }

    async function runLoader() {
        if (typeof supabase === 'undefined') { setTimeout(runLoader, 200); return; }
        const client = getClient();
        if (!client) return;

        const page = document.body.getAttribute('data-page');

        // ── GALLERY ONLY ──────────────────────────────────────────────────────
        if (page !== 'gallery') return;

        try {
            const { data: gallery } = await client
                .from('gallery_images')
                .select('*')
                .order('display_order');

            const grid = document.getElementById('galleryGrid');
            if (!grid || !gallery || !gallery.length) return;

            grid.innerHTML = gallery.map((item, idx) => `
                <div class="gallery-card reveal animate-fade-up"
                     data-category="${(item.category || 'community').toLowerCase()}"
                     data-src="${item.url}"
                     data-title="${item.title || 'Collective ✦'}"
                     data-desc="${item.description || 'Travel &amp; LIV Collective moments.'}"
                     style="animation-delay:${idx * 0.05}s">
                    <div class="gallery-card-img">
                        <img src="${item.url}" alt="Travelnliv Collective" loading="lazy" />
                    </div>
                    <div class="gallery-card-overlay">
                        <div class="overlay-content">
                            <p class="overlay-title">${item.title || 'Collective ✦'}</p>
                            <p class="overlay-dest">${item.category || 'The Collective'}</p>
                            <div class="overlay-actions">
                                <button class="overlay-btn view-btn" aria-label="View fullscreen">
                                    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                                    </svg>
                                    View
                                </button>
                                <a href="${item.url}" download="travelnliv-${idx}.jpg" class="overlay-btn download-btn">
                                    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                                    </svg>
                                    Download
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');

            if (window.initGallery) window.initGallery();

        } catch (e) {
            /* gallery fetch failed — static HTML fallback is intact */
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runLoader);
    } else {
        runLoader();
    }
})();
