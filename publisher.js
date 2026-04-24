// ============================================================
// TRAVELNLIV — PUBLISH CLIENT (publisher.js)
// ============================================================
// Sends admin changes to /api/publish (Vercel serverless).
// The GitHub token lives on the SERVER in Vercel env vars.
// No token setup needed on any device — works everywhere.
// ============================================================

(function () {

    // ── Post to serverless endpoint ──────────────────────────
    async function callPublishApi(payload) {
        const res = await fetch('/api/publish', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || `Server error ${res.status}`);
        return data;
    }

    // ── PUBLISH CONFIG ───────────────────────────────────────
    // Call after saveAll() — pushes full site config to GitHub.
    window.publishConfig = async function (cfg) {
        try {
            const existing = window._siteDataCache || {};
            const payload = Object.assign({}, cfg, {
                _published: new Date().toISOString(),
                _version: '1.1',
                images: existing.images || {},
            });
            await callPublishApi({ type: 'config', data: payload });
            window._siteDataCache = payload;
            return true;
        } catch (e) {
            console.error('[Publisher] Config publish failed:', e);
            throw e;
        }
    };

    // ── PUBLISH IMAGE ────────────────────────────────────────
    // Uploads an image to uploads/<key>.<ext> via the API.
    // Returns the public URL of the committed image.
    window.publishImage = async function (key, dataUrl) {
        try {
            const match = dataUrl.match(/^data:image\/(.*?);base64,(.+)$/s);
            if (!match) throw new Error('Invalid image data URL');
            const ext = match[1] === 'jpeg' ? 'jpg' : match[1];
            const base64 = match[2];

            const result = await callPublishApi({ type: 'image', key, base64, imageExt: ext });
            if (result.url) {
                // Cache the image URL
                if (!window._siteDataCache) window._siteDataCache = {};
                if (!window._siteDataCache.images) window._siteDataCache.images = {};
                window._siteDataCache.images[key] = result.url;
            }
            return result.url || null;
        } catch (e) {
            console.error('[Publisher] Image publish failed:', e);
            throw e;
        }
    };

    // ── REMOVE IMAGE ─────────────────────────────────────────
    window.unpublishImage = async function (key) {
        try {
            await callPublishApi({ type: 'remove-image', key });
            if (window._siteDataCache && window._siteDataCache.images) {
                delete window._siteDataCache.images[key];
            }
        } catch (e) {
            console.error('[Publisher] Image removal failed:', e);
        }
    };

    // ── PING / STATUS CHECK ──────────────────────────────────
    // Checks if /api/publish is reachable and GH_TOKEN is set.
    window.checkPublishStatus = async function () {
        try {
            const res = await callPublishApi({ type: 'ping' });
            return res.ok === true;
        } catch (e) {
            return false;
        }
    };

    // Keep old name as alias for backward compat
    window.checkGhToken = async function () { return window.checkPublishStatus(); };
    window.getGhToken = function () { return 'server-managed'; };
    window.saveGhToken = function () { /* no-op — token is on server now */ };

    // ── LOAD SITE DATA ───────────────────────────────────────
    // Fetches site-data.json from live site for the global image map.
    window.fetchSiteData = async function () {
        try {
            const res = await fetch('/site-data.json?_=' + Date.now(), { cache: 'no-store' });
            if (!res.ok) return null;
            const data = await res.json();
            window._siteDataCache = data;
            return data;
        } catch (e) {
            return null;
        }
    };

})();
