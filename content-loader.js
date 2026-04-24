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

        // ── GALLERY RENDERING (Force Supabase Image Rendering) ──
        if (page === "gallery") {
            const grid = document.querySelector(".gallery-grid");
            if (grid && config.gallery.length) {
                grid.innerHTML = config.gallery.map(item => `
                    <div class="gallery-card">
                        <img src="${item.url}" alt="Gallery Photo" loading="lazy">
                        ${item.category ? `<div class="gallery-tag">${item.category}</div>` : ''}
                    </div>
                `).join("");
            }
        }
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', runLoader);
    else runLoader();
})();
