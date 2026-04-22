/**
 * dest-sync.js — Travel & LIV Collective
 * Runs on every page after DOM load.
 * Reads DESTINATIONS_LIST from the admin localStorage config and:
 *   1. Updates footer trip links automatically
 *   2. Updates the nav dropdown (if dynamic-dropdown element exists)
 */
(function () {
    'use strict';

    function getDestinations() {
        try {
            return JSON.parse(localStorage.getItem('DESTINATIONS_LIST') || '[]');
        } catch (e) { return []; }
    }

    function destUrl(d) {
        return d.url || ('/upcomingtrips/' + d.slug);
    }

    // ── 1. FOOTER TRIP LINKS ──────────────────────────────────────────
    // Any <ul class="footer-trips-list"> on the page gets auto-populated
    function updateFooter() {
        var lists = document.querySelectorAll('.footer-trips-list');
        if (!lists.length) return;
        var dests = getDestinations().filter(function (d) {
            return d.status !== 'concluded';
        });
        if (!dests.length) return;
        var html = dests.map(function (d) {
            return '<li><a href="' + destUrl(d) + '">' + (d.emoji || '') + ' ' + d.name + '</a></li>';
        }).join('') + '<li><a href="upcoming.html">View All Trips →</a></li>';
        lists.forEach(function (ul) { ul.innerHTML = html; });
    }

    // ── 2. NAV DROPDOWN (dynamic-dropdown element) ────────────────────
    // Only updates if the element exists (currently only trip.html uses it dynamically)
    // All static pages have hardcoded nav (covered by Issue 1 if/when needed)
    function updateNavDropdown() {
        var dd = document.getElementById('dynamic-dropdown');
        if (!dd) return;
        var dests = getDestinations().filter(function (d) {
            return d.status !== 'concluded';
        });
        if (!dests.length) return;
        dd.innerHTML = dests.map(function (d) {
            var badge = d.status === 'booking_open'
                ? '<span class="dd-badge">Open</span>' : '';
            return '<a href="' + destUrl(d) + '"><span class="dd-icon">' +
                (d.emoji || '✈️') + '</span>' + d.name + badge + '</a>';
        }).join('') +
            '<div class="nav-dropdown-divider"></div>' +
            '<a href="upcoming.html"><span class="dd-icon">✈️</span>View All Trips</a>';
    }

    // ── 3. UPCOMING.HTML dynamic trip cards (trips 2+) ─────────────────
    function renderDynamicTrips() {
        var container = document.getElementById('dynamic-trips-container');
        if (!container) return;
        var dests = getDestinations();
        // Skip index 0 (Bali — hardcoded featured card with expansion block)
        var extraTrips = dests.slice(1).filter(function (d) {
            return d.status !== 'concluded';
        });
        if (!extraTrips.length) {
            container.innerHTML = '';
            return;
        }
        container.innerHTML = extraTrips.map(function (d, i) {
            var isOpen = d.status === 'booking_open';
            var badgeClass = isOpen ? 'tag-gold' : 'tag-teal';
            var badgeText = isOpen ? 'Booking Open' : 'Coming Soon';
            if (d.badge) badgeText = d.badge.replace(/^[🟢✈️🔴🏁]\s*/, '');

            var desc = d.description || d.teaserDesc || d.tagline || 'Details coming soon.';
            // Trim to ~200 chars
            if (desc.length > 220) desc = desc.substring(0, 217) + '…';

            var priceHtml = isOpen
                ? '<span class="price-amount" style="font-size:1.4rem;">' + (d.price || 'TBA') + '</span>'
                : '<span class="price-amount" style="font-size:1.4rem;">TBA</span>';

            var ctaHtml = isOpen
                ? '<a href="' + destUrl(d) + '#trip-book" class="btn btn-gold">' +
                'Secure Your Spot <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>'
                : '<button onclick="showMailerLiteForm()" class="btn btn-gold">' +
                'Get Notified When Booking Opens <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>';

            // Build a small includes preview from admin data (first 4)
            var includesHtml = '';
            if (d.includes && d.includes.length) {
                includesHtml = '<div class="upcoming-includes">' +
                    d.includes.slice(0, 4).map(function (inc) {
                        return '<div class="upcoming-include"><span>' + (inc.icon || '✅') + '</span> ' + inc.title + '</div>';
                    }).join('') + '</div>';
            }

            // Dates tag
            var datesTag = d.dates && d.dates !== 'TBA'
                ? '<span class="tag tag-teal">' + d.dates + '</span>'
                : '<span class="tag tag-teal">Dates TBA</span>';

            // Hero image — use first photo from photos array or fallback gradient box
            var heroImg = (d.photos && d.photos.length)
                ? '<img src="' + d.photos[0] + '" alt="' + d.name + '" />'
                : '<div style="width:100%;height:100%;background:linear-gradient(135deg,#181818,#1a2e1f);display:flex;align-items:center;justify-content:center;font-size:4rem;">' + (d.emoji || '✈️') + '</div>';

            return '<div class="upcoming-trip-row reveal" id="trip-row-' + d.slug + '" style="margin-top:80px;">' +
                '<div class="upcoming-trip-img-wrap">' +
                heroImg +
                '<div class="upcoming-trip-img-overlay">' +
                '<span class="tag ' + badgeClass + '">' + badgeText + '</span>' +
                '</div>' +
                '</div>' +
                '<div class="upcoming-trip-details">' +
                '<div class="upcoming-trip-meta-row">' + datesTag + '</div>' +
                '<h2 class="display-md" style="margin-top:20px;">' + d.name + '</h2>' +
                '<p class="text-muted" style="font-size:1rem;line-height:1.8;margin:16px 0 24px;">' + desc + '</p>' +
                includesHtml +
                '<div class="upcoming-departures"><div class="upcoming-departure">' +
                '<span class="dep-date">' + (d.dates || 'To Be Announced') + '</span>' +
                (isOpen ? '<span class="tag tag-gold" style="font-size:0.7rem;">Spots Limited</span>' : '<span class="tag tag-teal" style="font-size:0.7rem;">Details Coming Soon</span>') +
                '</div></div>' +
                '<div class="upcoming-price-row">' +
                '<div><span class="price-from">Price</span> ' + priceHtml + '</div>' +
                '<div style="display:flex;flex-direction:column;gap:10px;align-items:flex-end;">' +
                ctaHtml +
                '<a href="' + destUrl(d) + '" class="btn btn-outline" style="font-size:0.85rem;padding:10px 20px;">View Full Trip Details →</a>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        }).join('');
    }

    // ── RUN EVERYTHING ON DOM READY ───────────────────────────────────
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            updateFooter();
            updateNavDropdown();
            renderDynamicTrips();
        });
    } else {
        updateFooter();
        updateNavDropdown();
        renderDynamicTrips();
    }
})();
