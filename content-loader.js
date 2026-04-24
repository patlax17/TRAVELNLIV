// =============================================================
// TRAVEL & LIV COLLECTIVE — CONTENT LOADER
// Reads the GLOBAL site config from /site-data.json (committed to
// GitHub, served by Vercel) so every visitor sees the same content.
// Falls back gracefully to localStorage → TNLIV_DEFAULTS.
// =============================================================

(function () {
    const page = document.body.getAttribute("data-page");

    // ── Image helper ─────────────────────────────────────────────
    // Priority: 1) committed URL from site-data.json images map
    //           2) localStorage base64 (admin's own browser preview)
    //           3) default filename (code default)
    function getImg(key, fallback, globalImages) {
        var globalUrl = globalImages && globalImages[key];
        if (globalUrl) return globalUrl;
        var stored = localStorage.getItem("tnliv_img_" + key);
        return stored || fallback;
    }

    function setImgSrc(id, key, fallback, globalImages) {
        var el = document.getElementById(id);
        if (el) el.src = getImg(key, fallback, globalImages);
    }

    // ── Utility ─────────────────────────────────────────────────
    function set(id, html) {
        if (html === undefined || html === null) return;
        const el = document.getElementById(id);
        if (el) el.innerHTML = html;
    }

    function setAttr(id, attr, val) {
        const el = document.getElementById(id);
        if (el) el.setAttribute(attr, val);
    }
    function setStyle(id, prop, val) {
        const el = document.getElementById(id);
        if (el) el.style[prop] = val;
    }
    function show(id) { const el = document.getElementById(id); if (el) el.style.display = ""; }
    function hide(id) { const el = document.getElementById(id); if (el) el.style.display = "none"; }

    // ── Main: fetch global data then run DOM injection ───────────
    function runLoader(globalImages) {
        // Merge: localStorage config (admin's live edits) on top of defaults
        var cfg = window.getSiteConfig ? window.getSiteConfig() : window.TNLIV_DEFAULTS;

        // ── GLOBAL: site-wide social / nav CTA ──────────────────
        document.querySelectorAll("[data-admin='nav-cta-text']").forEach(el => el.textContent = cfg.navCta.text);
        document.querySelectorAll("[data-admin='nav-cta-url']").forEach(el => el.href = cfg.navCta.url);
        document.querySelectorAll("[data-admin='contact-email']").forEach(el => {
            el.href = "mailto:" + cfg.social.email;
            if (el.getAttribute("data-show-text")) el.textContent = cfg.social.email;
        });
        document.querySelectorAll("[data-admin='ig-url']").forEach(el => el.href = cfg.social.instagram);
        document.querySelectorAll("[data-admin='tt-url']").forEach(el => el.href = cfg.social.tiktok);
        document.querySelectorAll("[data-admin='fb-url']").forEach(el => el.href = cfg.social.facebook);
        document.querySelectorAll("[data-admin='wa-group-url']").forEach(el => el.href = cfg.social.whatsappGroup);
        document.querySelectorAll("[data-admin='wa-channel-url']").forEach(el => el.href = cfg.social.whatsappChannel);

        // ── HOME PAGE ────────────────────────────────────────────────
        if (page === "home") {

            // ── HERO ──
            var hr = cfg.hero || {};
            set("hero-eyebrow", hr.eyebrow);
            set("hero-heading", hr.heading);
            set("hero-heading-italic", hr.headingItalic);
            set("hero-subtitle", hr.subtitle);
            set("hero-stat1-num", hr.stat1Number);
            set("hero-stat1-label", hr.stat1Label);
            set("hero-stat2-num", hr.stat2Number);
            set("hero-stat2-label", hr.stat2Label);
            set("hero-stat3-num", hr.stat3Number);
            set("hero-stat3-label", hr.stat3Label);
            set("hero-cta-primary", hr.ctaPrimaryText);
            var heroImg = getImg("hero_img", hr.image, globalImages);
            if (heroImg) { var hi = document.getElementById("hero-img"); if (hi) hi.src = heroImg; }

            // ── TICKER ──
            if (cfg.ticker && cfg.ticker.length) {
                var tickerItems = cfg.ticker.map(function (t) {
                    return '<span>' + t + '</span><span class="ticker-sep">✦</span>';
                }).join('');
                document.querySelectorAll('.ticker-track').forEach(function (t) {
                    t.innerHTML = tickerItems + tickerItems; // duplicate for seamless loop
                });
            }

            // ── IDENTITY / WHO WE ARE ──
            var ident = cfg.identity || {};
            set("identity-eyebrow", ident.eyebrow);
            set("identity-heading", ident.heading);
            set("identity-heading-italic", ident.headingItalic);
            set("identity-para1", ident.para1);
            set("identity-para2", ident.para2);
            set("identity-para3", ident.para3);

            // ── SOCIAL PROOF STATS ──
            var sp = cfg.socialProof || {};
            set("sp-eyebrow", sp.eyebrow);
            set("sp-stat1-num", sp.stat1Number);
            set("sp-stat1-label", sp.stat1Label);
            set("sp-stat2-num", sp.stat2Number);
            set("sp-stat2-label", sp.stat2Label);
            set("sp-stat3-num", sp.stat3Number);
            set("sp-stat3-label", sp.stat3Label);

            // ── HOW IT WORKS ──
            var hiw = cfg.howItWorks || {};
            set("hiw-eyebrow", hiw.eyebrow);
            set("hiw-heading", hiw.heading);

            // ── NEXT TRIP CARD ──
            set("next-trip-badge", cfg.nextTrip.badge);
            set("next-trip-destination", cfg.nextTrip.destination);
            set("next-trip-dates", cfg.nextTrip.dates + (cfg.nextTrip.duration ? " · " + cfg.nextTrip.duration : ""));
            set("next-trip-desc", cfg.nextTrip.description);
            setImgSrc("next-trip-img", "next_trip", cfg.nextTrip.image, globalImages);
            if (cfg.nextTrip.squadtripUrl) {
                setAttr("home-booking-iframe", "data-src", cfg.nextTrip.squadtripUrl);
            }

            // ── PAST EVENT RECAP ──
            var pastSection = document.getElementById("past-event");
            if (pastSection) {
                pastSection.style.display = cfg.pastEvent.visible ? "" : "none";
                set("past-event-location", cfg.pastEvent.city + " &mdash; " + cfg.pastEvent.date);
                set("past-event-title", cfg.pastEvent.title + ' <em>&mdash; ' + cfg.pastEvent.titleItalic + '</em>');
                set("past-event-desc", cfg.pastEvent.description);
                for (var pi = 0; pi < 7; pi++) {
                    var pEl = document.getElementById("lp-photo-" + pi);
                    var stored = localStorage.getItem("tnliv_img_lp_photo_" + pi);
                    if (pEl && stored) pEl.src = stored;
                }
            }

            // ── WHY US ──
            var wu = cfg.whyUs || {};
            set("why-eyebrow", wu.eyebrow);
            set("why-heading", wu.heading);
            set("why-body", wu.body);

            // ── FINAL CTA ──
            var fc = cfg.finalCta || {};
            set("cta-eyebrow", fc.eyebrow);
            set("cta-heading", fc.heading);
            set("cta-heading-italic", fc.headingItalic);
            set("cta-body", fc.body);
            set("cta-btn-text", fc.ctaText);
            var ctaBgImg = getImg("cta_bg", fc.image, globalImages);
            if (ctaBgImg) { var ci = document.getElementById("cta-bg-img"); if (ci) ci.src = ctaBgImg; }

            // ── UPCOMING EVENT SECTION (legacy) ──
            var eventSection = document.getElementById("event");
            if (eventSection) {
                if (cfg.event.mode === "hidden") {
                    eventSection.style.display = "none";
                } else {
                    eventSection.style.display = "";
                    var bgImg = eventSection.querySelector(".event-bg img");
                    if (bgImg) bgImg.src = getImg("event_bg", cfg.event.bgImage, globalImages);

                    if (cfg.event.mode === "coming-soon") {
                        var csEl = document.getElementById("event-coming-soon-view");
                        var liveEl = document.getElementById("event-live-view");
                        if (csEl) csEl.style.display = "";
                        if (liveEl) liveEl.style.display = "none";
                        set("event-eyebrow", cfg.event.eyebrow);
                        set("event-heading", cfg.event.heading + '<br/><em>' + cfg.event.headingItalic + '</em>');
                        set("event-desc", cfg.event.description);
                        set("event-sub-desc", cfg.event.subDescription);
                        set("event-badge-text", cfg.event.badgeText);
                    } else if (cfg.event.mode === "live") {
                        var csEl2 = document.getElementById("event-coming-soon-view");
                        var liveEl2 = document.getElementById("event-live-view");
                        if (csEl2) csEl2.style.display = "none";
                        if (liveEl2) liveEl2.style.display = "";
                        set("event-live-name", cfg.event.liveEventName);
                        set("event-live-date", cfg.event.liveEventDate);
                        set("event-live-venue", cfg.event.liveEventVenue);
                        set("event-live-price", cfg.event.livePriceDisplay);
                        var ticketBtn = document.getElementById("event-live-ticket-btn");
                        if (ticketBtn) { ticketBtn.textContent = cfg.event.liveTicketBtn; ticketBtn.href = cfg.event.liveTicketUrl; }
                    }
                }
            }
        }

        // ── UPCOMING TRIPS PAGE ──────────────────────────────────────
        if (page === "upcoming") {
            cfg.trips.forEach(function (trip, i) {
                const prefix = "trip" + (i + 1);
                const row = document.getElementById(prefix + "-row");
                if (!row) return;
                row.style.display = trip.status === "hidden" ? "none" : "";

                const badgeEl = document.getElementById(prefix + "-badge");
                if (badgeEl) {
                    badgeEl.textContent = trip.badge || (trip.status === "booking-open" ? "Booking Open" : "Coming Soon");
                    badgeEl.className = "tag " + (trip.status === "booking-open" ? "tag-gold" : "tag-teal");
                }

                const imgEl = document.getElementById(prefix + "-img");
                if (imgEl) {
                    imgEl.src = getImg("trip" + (i + 1), trip.image, globalImages);
                    imgEl.alt = trip.destination;
                }

                set(prefix + "-destination", trip.destination);
                set(prefix + "-month", trip.monthYear);
                set(prefix + "-dates", trip.dates);
                set(prefix + "-region", trip.region);
                set(prefix + "-desc", trip.description);
                set(prefix + "-price-val", trip.priceDisplay || "TBA");

                const ctaEl = document.getElementById(prefix + "-cta");
                if (ctaEl) {
                    // Only update booking-open trips — "Get Notified" buttons are
                    // <button> elements that trigger the MailerLite popup and
                    // should not have their text or href overwritten.
                    if (trip.status === "booking-open") {
                        ctaEl.textContent = trip.ctaText;
                        if (ctaEl.tagName === "A") ctaEl.href = trip.ctaUrl;
                        ctaEl.className = "btn btn-gold";
                    } else {
                        ctaEl.className = "btn btn-outline";
                    }
                }

            });
        }

        // ── GALLERY PAGE ─────────────────────────────────────────────
        if (page === "gallery") {
            set("photoCount", cfg.gallery.photoCount);
            set("dest-count", cfg.gallery.destinationCount);
            set("trip-count", cfg.gallery.tripCount);
        }

        // ── FAQs PAGE ────────────────────────────────────────────────
        if (page === "faqs") {
            function renderFaqGroup(containerId, items) {
                const container = document.getElementById(containerId);
                if (!container) return;
                const list = container.querySelector(".faq-list");
                if (!list) return;
                list.innerHTML = items.map(function (item, i) {
                    return '<div class="faq-item"><button class="faq-q" id="' + containerId + '-' + i + '">' + item.q + '<span class="faq-icon">+</span></button><div class="faq-a"><p>' + item.a + '</p></div></div>';
                }).join("");
                // Re-attach accordion listeners
                list.querySelectorAll(".faq-q").forEach(function (btn) {
                    btn.addEventListener("click", function () {
                        const item = btn.closest(".faq-item");
                        const isOpen = item.classList.contains("open");
                        list.querySelectorAll(".faq-item").forEach(function (fi) { fi.classList.remove("open"); fi.querySelector(".faq-icon").textContent = "+"; });
                        if (!isOpen) { item.classList.add("open"); btn.querySelector(".faq-icon").textContent = "×"; }
                    });
                });
            }
            if (cfg.faqs) {
                renderFaqGroup("general", cfg.faqs.general || []);
                renderFaqGroup("trips", cfg.faqs.trips || []);
                renderFaqGroup("booking", cfg.faqs.booking || []);
                renderFaqGroup("connect", cfg.faqs.contact || []);
            }
            // Update contact email link in sidebar
            const contactBtn = document.getElementById("contact-btn");
            if (contactBtn) contactBtn.href = "mailto:" + cfg.social.email;
        }

    } // end runLoader()

    // ── Bootstrap ────────────────────────────────────────────────
    // 1) Run immediately with no global images (shows text content)
    runLoader(null);

    // 2) Fetch /site-data.json and re-run with global image URLs
    //    so committed uploads replace localStorage base64 for all visitors
    fetch('/site-data.json?_=' + Date.now(), { cache: 'no-store' })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (data) {
            if (data && data.images) {
                window._siteDataCache = data;
                runLoader(data.images);
            }
        })
        .catch(function () { /* no site-data.json yet — local dev or first deploy */ });

})();

