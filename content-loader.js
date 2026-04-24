(function () {
    // ── SUPABASE CONFIGURATION ──────────────────────────────────────
    const SUPABASE_URL = "https://ziejdpdrhpxqxrhkwpew.supabase.co";
    const SUPABASE_KEY = "sb_publishable_raXNn8hTDaSHzkSeD1R3SQ_0EPZzUPX";

    // Load Supabase script if not present
    if (typeof supabase === 'undefined') {
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
        script.async = true;
        document.head.appendChild(script);
    }

    let _supabaseClient = null;
    const getSupabase = () => {
        if (!_supabaseClient && typeof supabase !== 'undefined') {
            _supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        }
        return _supabaseClient;
    };

    // ── SHARED STATE ────────────────────────────────────────────────
    window.globalImages = {};

    window.getSiteConfig = async function () {
        const client = getSupabase();
        if (!client) return JSON.parse(JSON.stringify(window.TNLIV_DEFAULTS || {}));
        try {
            const { data, error } = await client.from('site_config').select('*');
            if (error || !data) throw error;
            const config = JSON.parse(JSON.stringify(window.TNLIV_DEFAULTS || {}));
            data.forEach(row => { config[row.section_key] = row.data; });
            return config;
        } catch (e) { return JSON.parse(JSON.stringify(window.TNLIV_DEFAULTS || {})); }
    };

    window.getDestinations = async function () {
        const client = getSupabase();
        if (!client) return window.SITE_DEST_DEFAULTS || [];
        try {
            const { data, error } = await client
                .from('destinations')
                .select('*, itineraries(*), includes(*), rooms(*)')
                .order('display_order');
            if (error) throw error;
            return data.map(d => ({
                ...d,
                squadtrip: d.squadtrip_link,
                days: (d.itineraries || []).sort((a, b) => a.day_number - b.day_number),
                includes: (d.includes || []).sort((a, b) => a.order_index - b.order_index).map(inc => ({ icon: inc.icon, title: inc.title, desc: inc.description })),
                rooms: (d.rooms || []).sort((a, b) => a.order_index - b.order_index).map(r => ({ title: r.title, price: r.price, deposit: r.deposit_note, badge: r.badge }))
            }));
        } catch (e) { return window.SITE_DEST_DEFAULTS || []; }
    };

    window.fetchSiteData = async function () {
        const client = getSupabase();
        if (!client) return;
        try {
            const { data, error } = await client.from('images').select('*');
            if (error) throw error;
            const images = {};
            data.forEach(row => images[row.image_key] = row.url);
            window.globalImages = images;
            return { images };
        } catch (e) { }
    };

    // ── CORE LOADER ────────────────────────────────────────────────
    async function runLoader() {
        if (typeof supabase === 'undefined') {
            setTimeout(runLoader, 300);
            return;
        }

        const config = await window.getSiteConfig();
        const destinations = await window.getDestinations();
        await window.fetchSiteData();

        const page = document.body.getAttribute("data-page");
        const globalImages = window.globalImages;

        const set = (id, val) => { const el = document.getElementById(id); if (el) el.innerHTML = val || ""; };
        const setAttr = (id, attr, val) => { const el = document.getElementById(id); if (el) el.setAttribute(attr, val || ""); };
        const getImg = (key, fallback) => globalImages[key] || fallback;
        const setImgSrc = (id, key, fallback) => { const el = document.getElementById(id); if (el) el.src = getImg(key, fallback); };

        // ── HOMEPAGE ──
        if (page === "home") {
            const h = config.hero || {};
            set("hero-eyebrow", h.eyebrow);
            set("hero-heading", (h.heading || "") + ' <em class="italic-green">' + (h.headingItalic || "") + '</em>');
            set("hero-subtitle", h.subtitle);
            set("hero-stat1-num", h.stat1Number);
            set("hero-stat1-label", h.stat1Label);
            set("hero-stat2-num", h.stat2Number);
            set("hero-stat2-label", h.stat2Label);
            set("hero-stat3-num", h.stat3Number);
            set("hero-stat3-label", h.stat3Label);
            setImgSrc("hero-bg-img", "hero_bg", "");

            const ticker = document.getElementById("marquee-ticker");
            if (ticker && config.ticker) {
                ticker.innerHTML = config.ticker.map(t => `<span class="ticker-item"><span class="star-icon">✦</span> ${t}</span>`).join("");
            }
        }

        // ── ABOUT PAGE ──
        if (page === "about") {
            const bio = config.aboutBio || {};
            set("ab-quote", bio.founderQuote);
            set("ab-p1", bio.para1); set("ab-p2", bio.para2); set("ab-p3", bio.para3);
            set("ab-p4", bio.para4); set("ab-p5", bio.para5);
            setImgSrc("about-founder-img", "founder_photo", "olivia.jpg");

            const pastList = document.getElementById("past-trips-list");
            if (pastList && config.pastTrips) {
                pastList.innerHTML = config.pastTrips.map(t => `
                    <div class="past-trip-card">
                        <div class="pt-label">${t.label}</div>
                        <h3>${t.title}</h3>
                        <p>${t.description}</p>
                        <div class="pt-meta">${t.monthYear} · ${t.duration}</div>
                    </div>
                `).join("");
            }
        }

        // ── GALLERY PAGE ──
        if (page === "gallery") {
            const client = getSupabase();
            const { data, error } = await client.from('gallery_assets').select('*').order('display_order');
            const grid = document.querySelector(".gallery-grid");
            if (grid && data) {
                grid.innerHTML = data.map(item => `
                    <div class="gallery-card">
                        <img src="${item.url}" alt="Gallery Photo" loading="lazy">
                        ${item.category ? `<div class="gallery-tag">${item.category}</div>` : ''}
                    </div>
                `).join("");
            }
        }

        // ── DESTINATIONS ──
        const currentDest = destinations.find(d => d.slug === page);
        if (currentDest) {
            set("dest-name", currentDest.name);
            set("dest-dates", currentDest.dates);
            set("dest-price", currentDest.price);
            setImgSrc("dest-hero-img", page + "_hero", "");
        }
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', runLoader);
    else runLoader();
})();
