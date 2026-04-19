// =============================================================
// TRAVEL & LIV COLLECTIVE — CONTENT LOADER
// Reads site config from localStorage and injects into the DOM.
// Include AFTER site-config.js on every page.
// =============================================================

(function () {
    const cfg = window.getSiteConfig ? window.getSiteConfig() : window.TNLIV_DEFAULTS;
    const page = document.body.getAttribute("data-page");

    // ── Image helper: returns admin-uploaded base64 OR falls back to filename ───
    function getImg(key, fallback) {
        var stored = localStorage.getItem("tnliv_img_" + key);
        return stored || fallback;
    }

    function setImgSrc(id, key, fallback) {
        var el = document.getElementById(id);
        if (el) el.src = getImg(key, fallback);
    }

    // ── Utility ─────────────────────────────────────────────────
    function set(id, html) {
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

    // ── GLOBAL: site-wide social / nav CTA ──────────────────────
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

        // --- Upcoming Event Section ---
        const eventSection = document.getElementById("event");
        if (eventSection) {
            if (cfg.event.mode === "hidden") {
                eventSection.style.display = "none";
            } else {
                eventSection.style.display = "";
                // Background image (checks for admin-uploaded override)
                const bgImg = eventSection.querySelector(".event-bg img");
                if (bgImg) bgImg.src = getImg("event_bg", cfg.event.bgImage);

                if (cfg.event.mode === "coming-soon") {
                    const csEl = document.getElementById("event-coming-soon-view");
                    const liveEl = document.getElementById("event-live-view");
                    if (csEl) csEl.style.display = "";
                    if (liveEl) liveEl.style.display = "none";
                    set("event-eyebrow", cfg.event.eyebrow);
                    set("event-heading", cfg.event.heading + '<br/><em>' + cfg.event.headingItalic + '</em>');
                    set("event-desc", cfg.event.description);
                    set("event-sub-desc", cfg.event.subDescription);
                    set("event-badge-text", cfg.event.badgeText);
                } else if (cfg.event.mode === "live") {
                    const csEl = document.getElementById("event-coming-soon-view");
                    const liveEl = document.getElementById("event-live-view");
                    if (csEl) csEl.style.display = "none";
                    if (liveEl) liveEl.style.display = "";
                    set("event-live-name", cfg.event.liveEventName);
                    set("event-live-date", cfg.event.liveEventDate);
                    set("event-live-venue", cfg.event.liveEventVenue);
                    set("event-live-price", cfg.event.livePriceDisplay);
                    const ticketBtn = document.getElementById("event-live-ticket-btn");
                    if (ticketBtn) { ticketBtn.textContent = cfg.event.liveTicketBtn; ticketBtn.href = cfg.event.liveTicketUrl; }
                }
            }
        }

        // --- Next Trip Card ---
        set("next-trip-badge", cfg.nextTrip.badge);
        set("next-trip-destination", cfg.nextTrip.destination);
        set("next-trip-dates", cfg.nextTrip.dates + (cfg.nextTrip.duration ? " · " + cfg.nextTrip.duration : ""));
        set("next-trip-desc", cfg.nextTrip.description);
        setImgSrc("next-trip-img", "next_trip", cfg.nextTrip.image);
        setAttr("next-trip-cta", "href", cfg.nextTrip.ctaUrl);
        set("next-trip-cta", cfg.nextTrip.ctaText + ' <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>');

        // --- Past Event Recap ---
        const pastSection = document.getElementById("past-event");
        if (pastSection) {
            pastSection.style.display = cfg.pastEvent.visible ? "" : "none";
            set("past-event-location", cfg.pastEvent.city + " &mdash; " + cfg.pastEvent.date);
            set("past-event-title", cfg.pastEvent.title + ' <em>&mdash; ' + cfg.pastEvent.titleItalic + '</em>');
            set("past-event-desc", cfg.pastEvent.description);
            // Apply admin-uploaded past event photos (0-6)
            for (var pi = 0; pi < 7; pi++) {
                var pEl = document.getElementById("lp-photo-" + pi);
                var stored = localStorage.getItem("tnliv_img_lp_photo_" + pi);
                if (pEl && stored) pEl.src = stored;
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
                imgEl.src = getImg("trip" + (i + 1), trip.image);
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
                ctaEl.textContent = trip.ctaText;
                ctaEl.href = trip.ctaUrl;
                ctaEl.className = "btn " + (trip.status === "booking-open" ? "btn-gold" : "btn-outline");
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

})();
