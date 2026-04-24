(function () {
    const SUPABASE_URL = "https://ziejdpdrhpxqxrhkwpew.supabase.co";
    const SUPABASE_KEY = "sb_publishable_raXNn8hTDaSHzkSeD1R3SQ_0EPZzUPX";

    let _supabase = null;
    const getSupabase = () => {
        if (!_supabase && typeof supabase !== 'undefined') {
            _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        }
        return _supabase;
    };

    window.fetchSiteData = async function () {
        const client = getSupabase();
        if (!client) return { images: {} };

        try {
            // Force fetch from User's Strict Table Names
            const [homeRes, aboutRes, galleryRes, imgRes] = await Promise.all([
                client.from('homepage_settings').select('*'),
                client.from('about_settings').select('*'),
                client.from('gallery_images').select('*').order('display_order'),
                client.from('images').select('*')
            ]);

            const images = {};
            if (imgRes.data) imgRes.data.forEach(r => images[r.image_key] = r.url);

            const config = {
                home: homeRes.data || [],
                about: aboutRes.data || [],
                gallery: galleryRes.data || []
            };

            window.globalImages = images;
            window.globalConfig = config;

            return { images, config };
        } catch (e) { return { images: {} }; }
    };

    async function runLoader() {
        if (typeof supabase === 'undefined') { setTimeout(runLoader, 200); return; }

        const { images, config } = await window.fetchSiteData();
        const page = document.body.getAttribute("data-page");

        const set = (id, val) => { const el = document.getElementById(id); if (el) el.innerHTML = val || ""; };
        const setImg = (id, key, fallback) => { const el = document.getElementById(id); if (el) el.src = images[key] || fallback; };

        // ── HOMEPAGE RENDERING ──
        if (page === "home") {
            const h = (config.home.find(r => r.key === 'hero') || {}).value || {};
            set("hero-eyebrow", h.eyebrow);
            set("hero-heading", `${h.heading || ""} <em class="italic-green">${h.headingItalic || ""}</em>`);
            setImg("hero-bg-img", "hero_img", "hero-bg.jpg");
        }

        // ── ABOUT RENDERING ──
        if (page === "about") {
            const bio = (config.about.find(r => r.key === 'bio') || {}).value || {};
            set("ab-quote", bio.founderQuote);
            set("ab-p1", bio.para1);
            setImg("about-founder-img", "founder_photo", "olivia.jpg");
        }

        // ── GALLERY RENDERING (Full High-Fidelity UI Sync) ──
        if (page === "gallery") {
            const grid = document.getElementById("galleryGrid");
            if (grid && config.gallery && config.gallery.length) {
                grid.innerHTML = config.gallery.map((item, idx) => `
                    <div class="gallery-card reveal animate-fade-up" 
                         data-category="${(item.category || 'community').toLowerCase()}" 
                         data-src="${item.url}" 
                         data-title="${item.title || 'Collective ✦'}" 
                         data-desc="${item.description || 'Travel & LIV Collective moments.'}"
                         style="animation-delay: ${idx * 0.05}s">
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
                                            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                                        </svg>
                                        View
                                    </button>
                                    <a href="${item.url}" download="travelnliv-${idx}.jpg" class="overlay-btn download-btn">
                                        <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                                        </svg>
                                        Download
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join("");

                // Re-initialize gallery animations and lightbox if defined in gallery.js
                if (window.initGallery) window.initGallery();
            }
        }
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', runLoader);
    else runLoader();
})();
