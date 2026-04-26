/* ============================================================
   TRAVELNLIV — site-sync.js
   Supabase → DOM Live Hydration Engine
   Runs on every public page. Fetches site_copy, trip_pages,
   and faqs then updates any element with [data-field] or
   known IDs. Falls back silently if Supabase is unreachable.
   ============================================================ */

(async function TNLIV_SYNC() {
    if (typeof supabaseClient === 'undefined') {
        console.warn('[site-sync] supabaseClient not ready — skipping sync');
        return;
    }
    const sb = supabaseClient;
    const page = document.body.dataset.page || '';

    /* ── Helpers ───────────────────────────────────────────── */
    function setText(id, val) { if (!val) return; const el = document.getElementById(id); if (el) el.textContent = val; }
    function setHtml(id, val) { if (!val) return; const el = document.getElementById(id); if (el) el.innerHTML = val; }
    function setAttr(id, attr, val) { if (!val) return; const el = document.getElementById(id); if (el) el.setAttribute(attr, val); }
    function setSrc(id, val) { if (!val) return; const el = document.getElementById(id); if (el) el.src = val; }
    function setBg(id, val) { if (!val) return; const el = document.getElementById(id); if (el) el.style.backgroundImage = 'url(' + val + ')'; }
    function setVal(id, val) { if (!val) return; const el = document.getElementById(id); if (el) el.value = val; }

    /* URL normalizer — handles strings, {url:"..."} objects, file://, empty */
    function normalizeSrc(raw) {
        const str = (raw && typeof raw === 'object') ? (raw.url || '') : (raw || '');
        if (!str || typeof str !== 'string') return '';
        const s = str.trim();
        if (!s || s === 'undefined' || s === 'null') return '';
        if (s.includes('supabase.co') || s.includes('supabase.in')) return s;
        if (s.startsWith('data:')) return s;
        if (s.startsWith('file://')) return '';
        try { return new URL(s).pathname; }
        catch (_) { return s; }
    }

    /* Generic data-field binder */
    function bindFields(data, prefix) {
        const pfx = prefix || '';
        Object.keys(data).forEach(key => {
            const val = data[key];
            if (val === null || val === undefined) return;
            if (typeof val === 'object') return; // skip JSON arrays for generic binding
            const fullKey = pfx ? pfx + '_' + key : key;
            document.querySelectorAll('[data-field="' + fullKey + '"]').forEach(el => {
                if (el.tagName === 'IMG') el.src = val;
                else if (el.tagName === 'A') el.href = val;
                else el.textContent = val;
            });
        });
    }

    /* ── HOMEPAGE (index.html) ──────────────────────────────── */
    async function syncHome(d) {
        if (!d) return;

        // Hero
        // Set heading text without destroying the nested <em id="hero-heading-italic">
        if (d.hero_heading) {
            const hEl = document.getElementById('hero-heading');
            if (hEl) {
                // Only update the first text node, preserve the <em> child
                const firstNode = hEl.childNodes[0];
                if (firstNode && firstNode.nodeType === Node.TEXT_NODE) {
                    firstNode.nodeValue = d.hero_heading;
                } else {
                    hEl.insertBefore(document.createTextNode(d.hero_heading), hEl.firstChild);
                }
            }
        }
        setText('hero-heading-italic', d.hero_heading_italic);
        setText('hero-subtitle', d.hero_subtitle);
        // CTA buttons — IDs match index.html exactly
        setText('hero-cta-primary', d.hero_cta_primary);
        setText('hero-cta-secondary', d.hero_cta_secondary);
        // Stats bar
        setText('hero-stat1-num', d.stat1_num); setText('hero-stat1-label', d.stat1_label);
        setText('hero-stat2-num', d.stat2_num); setText('hero-stat2-label', d.stat2_label);
        setText('hero-stat3-num', d.stat3_num); setText('hero-stat3-label', d.stat3_label);
        // Ticker
        if (Array.isArray(d.ticker_items) && d.ticker_items.length > 0) {
            const tracks = document.querySelectorAll('.ticker-track');
            if (tracks.length > 0) {
                const html = d.ticker_items.map(t => '<span class="ticker-item">' + t + '</span>').join('');
                tracks.forEach(tr => tr.innerHTML = html + html); // duplicate for seamless loop
            }
        }
        // Identity / Who We Are
        setText('identity-heading', d.identity_heading);
        setText('identity-heading-italic', d.identity_heading_italic);
        setText('identity-para1', d.identity_para1);
        setText('identity-para2', d.identity_para2);
        setText('identity-para3', d.identity_para3);
        // Proof stats
        setText('proof-stat1', d.proof_stat1); setText('proof-label1', d.proof_label1);
        setText('proof-stat2', d.proof_stat2); setText('proof-label2', d.proof_label2);
        setText('proof-stat3', d.proof_stat3); setText('proof-label3', d.proof_label3);
        // Next Trip card
        setText('nt-badge', d.nt_badge);
        setText('nt-destination', d.nt_destination);
        setText('nt-dates', d.nt_dates);
        setText('nt-description', d.nt_description);
        setAttr('nt-cta-btn', 'href', d.nt_url);
        setAttr('nt-details-btn', 'href', d.nt_url);
        setSrc('nt-img', d.nt_image);
        // Past Event
        const pastEl = document.getElementById('past-event-section');
        if (pastEl && d.past_event_visible === 'hidden') pastEl.style.display = 'none';
        setText('past-event-location', d.past_event_location);
        setText('past-event-title', d.past_event_title);
        setText('past-event-title-italic', d.past_event_title_italic);
        setText('past-event-desc', d.past_event_desc);
        // Final CTA
        setText('cta-heading', d.cta_heading);
        setText('cta-heading-italic', d.cta_heading_italic);
        setText('cta-body', d.cta_body);
        setBg('cta-bg', d.cta_bg_img);

        // Social Proof Photos — rendered in EXACT saved array order
        if (Array.isArray(d.proof_photos) && d.proof_photos.length > 0) {
            const validSrcs = d.proof_photos.map(normalizeSrc).filter(Boolean);
            const grid = document.getElementById('social-proof-grid');
            if (grid && validSrcs.length > 0) {
                grid.innerHTML = validSrcs.map((src, i) =>
                    '<div class="masonry-item">' +
                    '<img src="' + src + '"' +
                    ' alt="Travel &amp; LIV Community Photo ' + (i + 1) + '" loading="lazy"' +
                    ' onerror="console.error(\'[Image Load Error] Path: \' + this.src); this.closest(\'.masonry-item\').style.display=\'none\'" />' +
                    '<div class="masonry-overlay"><span>The Collective ✦</span></div>' +
                    '</div>'
                ).join('');
                console.log('[site-sync] ✅ Social proof grid online — ' + validSrcs.length + ' photos in saved order');
            }
        }

        // Launch Party Photos
        if (Array.isArray(d.launch_party_photos) && d.launch_party_photos.length > 0) {
            const classMap = ['lp-tall', '', '', '', '', 'lp-wide', ''];
            const validLP = d.launch_party_photos.map(normalizeSrc).filter(Boolean);
            const lpGrid = document.getElementById('launch-party-photo-grid');
            if (lpGrid && validLP.length > 0) {
                lpGrid.innerHTML = validLP.map((src, i) =>
                    '<div class="lp-photo-item ' + (classMap[i] || '') + '">' +
                    '<img src="' + src + '" alt="Launch Party Photo" loading="lazy"' +
                    ' onerror="console.error(\'[Image Load Error] Path: \' + this.src); this.closest(\'.lp-photo-item\').style.display=\'none\'" />' +
                    '</div>'
                ).join('');
            }
        }
    }

    /* ── ABOUT PAGE ─────────────────────────────────────────── */
    async function syncAbout(d) {
        if (!d) return;
        setText('about-founder-heading', d.founder_heading);
        setSrc('about-founder-photo', d.founder_photo);
        if (d.founder_bio) {
            const paras = d.founder_bio.split('\n\n').filter(Boolean);
            paras.forEach((p, i) => setText('about-bio-para' + (i + 1), p));
        }
    }

    /* ── UPCOMING PAGE ──────────────────────────────────────── */
    async function syncUpcomingTrips(trips) {
        if (!trips || !trips.length) return;
        trips.forEach(trip => {
            const s = trip.slug;
            const num = s === 'bali' ? '1' : s === 'punta-cana' ? '2' : '3';
            // Basic fields
            setText('trip' + num + '-month', trip.month_tag);
            setText('trip' + num + '-dates-tag', trip.duration_tag);
            setText('trip' + num + '-dates', trip.dates);
            setText('trip' + num + '-desc', trip.description);
            setText('trip' + num + '-price-val', trip.price_display);
            // Includes chips (bali only — other trips TBA)
            if (Array.isArray(trip.includes_list) && trip.includes_list.length > 0) {
                const grid = document.getElementById('trip' + num + '-includes');
                if (grid) {
                    grid.innerHTML = trip.includes_list.map(item =>
                        '<div class="upcoming-include"><span>' + item.charAt(0) + '</span>' + item.slice(1) + '</div>'
                    ).join('');
                }
            }
            // Bali photo strip
            if (s === 'bali' && Array.isArray(trip.photo_strip) && trip.photo_strip.length > 0) {
                const strip = document.getElementById('trip1-photo-strip');
                if (strip) {
                    strip.innerHTML = trip.photo_strip.map((src, i) =>
                        '<div class="tp-photo"><img src="' + src + '" alt="Bali Photo ' + (i + 1) + '" loading="lazy"/></div>'
                    ).join('');
                }
            }
            // Payment plan
            setText('trip' + num + '-deposit', trip.deposit);
            setText('trip' + num + '-payments', trip.payment_splits);
        });
    }

    /* ── FAQs PAGE ──────────────────────────────────────────── */
    async function syncFaqs(faqs) {
        if (!faqs || !faqs.length) return;
        const groups = {};
        faqs.forEach(f => {
            if (!groups[f.category]) groups[f.category] = [];
            groups[f.category].push(f);
        });
        Object.keys(groups).forEach(cat => {
            const container = document.getElementById('faq-section-' + cat);
            if (!container) return;
            container.innerHTML = groups[cat]
                .sort((a, b) => a.sort_order - b.sort_order)
                .map(f => `<div class="faq-item">
          <button class="faq-q">${f.question}<span class="faq-icon"></span></button>
          <div class="faq-a"><p>${f.answer}</p></div>
        </div>`).join('');
            // Re-init accordion behaviour
            container.querySelectorAll('.faq-item').forEach(item => {
                const btn = item.querySelector('.faq-q');
                if (!btn) return;
                btn.addEventListener('click', () => {
                    const isOpen = item.classList.contains('open');
                    document.querySelectorAll('.faq-item').forEach(x => x.classList.remove('open'));
                    if (!isOpen) item.classList.add('open');
                });
            });
        });
    }

    /* ── FETCH & DISPATCH ────────────────────────────────────── */
    try {
        const fetches = [
            sb.from('site_copy').select('*').in('page', ['home', 'about']),
            sb.from('trip_pages').select('*').in('slug', ['bali', 'punta-cana', 'rio']),
            sb.from('faqs').select('*').order('sort_order'),
        ];
        const [siteRes, tripsRes, faqsRes] = await Promise.all(fetches);
        if (siteRes.error) console.warn('[site-sync] site_copy error:', siteRes.error.message);
        if (tripsRes.error) console.warn('[site-sync] trip_pages error:', tripsRes.error.message);
        if (faqsRes.error) console.warn('[site-sync] faqs error:', faqsRes.error.message);

        const siteData = siteRes.data || [];
        const tripsData = tripsRes.data || [];
        const faqsData = faqsRes.data || [];

        const homeData = siteData.find(r => r.page === 'home') || null;
        const aboutData = siteData.find(r => r.page === 'about') || null;

        // Run hydration for relevant page
        if (page === 'home' || page === 'index' || page === '') await syncHome(homeData);
        if (page === 'about') await syncAbout(aboutData);
        if (page === 'upcoming') await syncUpcomingTrips(tripsData);
        if (page === 'faqs') await syncFaqs(faqsData);

        // Always bind generic data-field attributes
        if (homeData) bindFields(homeData, '');
        if (aboutData) bindFields(aboutData, '');

        console.log('[Supabase Sync] Hero Text Loaded: Squadddd', homeData);
        console.log('[site-sync] ✅ Hydration complete for page:', page || 'index');


    } catch (err) {
        console.warn('[site-sync] Caught error — running on static HTML fallback:', err.message);
    }
})();
