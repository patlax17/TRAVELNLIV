/**
 * TRAVEL & LIV COLLECTIVE — AD TRACKING INJECTOR (Supabase Enabled)
 */

(function () {
    // ── CONFIG ──
    const SUPABASE_URL = "https://ziejdpdrhpxqxrhkwpew.supabase.co";
    const SUPABASE_KEY = "sb_publishable_raXNn8hTDaSHzkSeD1R3SQ_0EPZzUPX";

    // ── MAILERLITE UNIVERSAL ──
    (function (w, d, e, u, f, l, n) {
        w[f] = w[f] || function () { (w[f].q = w[f].q || []).push(arguments); };
        l = d.createElement(e); l.async = 1; l.src = u;
        n = d.getElementsByTagName(e)[0]; n.parentNode.insertBefore(l, n);
    })(window, document, 'script', 'https://assets.mailerlite.com/js/universal.js', 'ml');
    ml('account', '2007153');

    async function initTracking() {
        let metaId, tiktokId, gtmId;

        // Try Supabase first
        try {
            // Check if supabase is already loaded by content-loader.js
            if (typeof supabase === 'undefined') {
                // Fallback to local storage if supabase isn't here yet
                metaId = localStorage.getItem('tnliv_pixel_meta');
                tiktokId = localStorage.getItem('tnliv_pixel_tiktok');
                gtmId = localStorage.getItem('tnliv_pixel_gtm');
            } else {
                const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
                const { data, error } = await client.from('site_config').select('*').eq('section_key', 'marketing').single();
                if (data && data.data) {
                    metaId = data.data.metaId;
                    tiktokId = data.data.tiktokId;
                    gtmId = data.data.gtmId;
                }
            }
        } catch (e) {
            console.warn("Tracking: Supabase fail, using local", e);
            metaId = localStorage.getItem('tnliv_pixel_meta');
            tiktokId = localStorage.getItem('tnliv_pixel_tiktok');
            gtmId = localStorage.getItem('tnliv_pixel_gtm');
        }

        /* ── INJECT SCRIPTS ── */
        if (metaId) {
            !function (f, b, e, v, n, t, s) {
                if (f.fbq) return; n = f.fbq = function () {
                    n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
                };
                if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
                n.queue = []; t = b.createElement(e); t.async = !0;
                t.src = v; s = b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t, s);
            }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
            window.fbq('init', metaId);
            window.fbq('track', 'PageView');
        }

        if (tiktokId) {
            !function (w, d, t) {
                w.TiktokAnalyticsObject = t;
                var ttq = w[t] = w[t] || [];
                ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie", "holdConsent", "revokeConsent", "grantConsent"];
                ttq.setAndDefer = function (t, e) { t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments, 0))) } };
                for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
                ttq.load = function (e, n) {
                    var r = "https://analytics.tiktok.com/i18n/pixel/events.js";
                    ttq._i = ttq._i || {}; ttq._i[e] = []; ttq._i[e]._u = r;
                    ttq._t = ttq._t || {}; ttq._t[e] = +new Date;
                    ttq._o = ttq._o || {}; ttq._o[e] = n || {};
                    var s = document.createElement("script"); s.type = "text/javascript"; s.async = !0; s.src = r + "?sdkid=" + e + "&lib=" + t;
                    var a = document.getElementsByTagName("script")[0]; a.parentNode.insertBefore(s, a);
                };
                ttq.load(tiktokId);
                ttq.page();
            }(window, document, 'ttq');
        }

        if (gtmId) {
            (function (w, d, s, l, i) {
                w[l] = w[l] || []; w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
                var f = d.getElementsByTagName(s)[0], j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : '';
                j.async = true; j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
            })(window, document, 'script', 'dataLayer', gtmId);
        }
    }

    // Wait for Supabase to potentially load via other scripts
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTracking);
    } else {
        setTimeout(initTracking, 500); // Small delay to let Supabase library load
    }
})();
