// =====================================================================
// TRAVEL & LIV COLLECTIVE — AD TRACKING INJECTOR
// Reads pixel / tag IDs stored by the Admin Dashboard from localStorage
// and injects the official vendor base scripts asynchronously.
// Include in <head> on every page:  <script src="tracking.js"></script>
// Scripts only fire when an ID has been saved — zero performance cost
// when no ID is configured.
// =====================================================================

/* ── MAILERLITE UNIVERSAL SCRIPT ────────────────────────────────────
   Initialises MailerLite for any dashboard-configured auto-popups.
   Account: 2007153  |  Form: 175168034363671920
────────────────────────────────────────────────────────────────────── */
(function (w, d, e, u, f, l, n) {
    w[f] = w[f] || function () { (w[f].q = w[f].q || []).push(arguments); };
    l = d.createElement(e); l.async = 1; l.src = u;
    n = d.getElementsByTagName(e)[0]; n.parentNode.insertBefore(l, n);
})(window, document, 'script', 'https://assets.mailerlite.com/js/universal.js', 'ml');
ml('account', '2007153');


(function () {
    'use strict';

    var metaId = (localStorage.getItem('tnliv_pixel_meta') || '').trim();
    var tiktokId = (localStorage.getItem('tnliv_pixel_tiktok') || '').trim();
    var gtmId = (localStorage.getItem('tnliv_pixel_gtm') || '').trim();

    /* ── META / FACEBOOK PIXEL ──────────────────────────────────────── */
    if (metaId) {
        /* eslint-disable */
        !function (f, b, e, v, n, t, s) {
            if (f.fbq) return; n = f.fbq = function () {
                n.callMethod ?
                    n.callMethod.apply(n, arguments) : n.queue.push(arguments)
            };
            if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
            n.queue = []; t = b.createElement(e); t.async = !0;
            t.src = v; s = b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t, s);
        }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
        /* eslint-enable */
        window.fbq('init', metaId);
        window.fbq('track', 'PageView');
    }

    /* ── TIKTOK PIXEL ───────────────────────────────────────────────── */
    if (tiktokId) {
        /* eslint-disable */
        !function (w, d, t) {
            w.TiktokAnalyticsObject = t;
            var ttq = w[t] = w[t] || [];
            ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once",
                "ready", "alias", "group", "enableCookie", "disableCookie",
                "holdConsent", "revokeConsent", "grantConsent"];
            ttq.setAndDefer = function (t, e) {
                t[e] = function () {
                    t.push([e].concat(Array.prototype.slice.call(arguments, 0)))
                }
            };
            for (var i = 0; i < ttq.methods.length; i++)ttq.setAndDefer(ttq, ttq.methods[i]);
            ttq.instance = function (t) {
                for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++)
                    ttq.setAndDefer(e, ttq.methods[n]);
                return e
            };
            ttq.load = function (e, n) {
                var r = "https://analytics.tiktok.com/i18n/pixel/events.js";
                ttq._i = ttq._i || {}; ttq._i[e] = []; ttq._i[e]._u = r;
                ttq._t = ttq._t || {}; ttq._t[e] = +new Date;
                ttq._o = ttq._o || {}; ttq._o[e] = n || {};
                var s = document.createElement("script");
                s.type = "text/javascript"; s.async = !0;
                s.src = r + "?sdkid=" + e + "&lib=" + t;
                var a = document.getElementsByTagName("script")[0];
                a.parentNode.insertBefore(s, a);
            };
            ttq.load(tiktokId);
            ttq.page();
        }(window, document, 'ttq');
        /* eslint-enable */
    }

    /* ── GOOGLE TAG MANAGER ─────────────────────────────────────────── */
    if (gtmId) {
        /* eslint-disable */
        (function (w, d, s, l, i) {
            w[l] = w[l] || [];
            w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
            var f = d.getElementsByTagName(s)[0],
                j = d.createElement(s),
                dl = l != 'dataLayer' ? '&l=' + l : '';
            j.async = true;
            j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
            f.parentNode.insertBefore(j, f);
        })(window, document, 'script', 'dataLayer', gtmId);
        /* eslint-enable */
    }

})();
