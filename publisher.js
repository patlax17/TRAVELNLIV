// ============================================================
// TRAVELNLIV — GITHUB PUBLISH ENGINE
// ============================================================
// Commits site config + uploaded images to the GitHub repo.
// Vercel auto-deploys on every commit (~30s), so changes
// become visible to ALL visitors — not just the admin's browser.
// ============================================================

(function () {
    const GH_OWNER = 'patlax17';
    const GH_REPO = 'TRAVELNLIV';
    const GH_BRANCH = 'main';
    const GH_API = 'https://api.github.com';
    const TOKEN_KEY = 'tnliv_gh_token';

    // ── Token helpers ────────────────────────────────────────
    window.getGhToken = function () {
        return localStorage.getItem(TOKEN_KEY) || '';
    };
    window.saveGhToken = function (token) {
        if (token) localStorage.setItem(TOKEN_KEY, token.trim());
        else localStorage.removeItem(TOKEN_KEY);
    };

    // Encode string to base64 (GitHub API requires base64 content)
    function toBase64(str) {
        return btoa(unescape(encodeURIComponent(str)));
    }

    // Get current file SHA (needed to update existing files)
    async function getFileSha(path, token) {
        try {
            const res = await fetch(
                `${GH_API}/repos/${GH_OWNER}/${GH_REPO}/contents/${path}?ref=${GH_BRANCH}`,
                { headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github.v3+json' } }
            );
            if (res.ok) {
                const data = await res.json();
                return data.sha || null;
            }
        } catch (e) { /* file doesn't exist yet */ }
        return null;
    }

    // Commit a single file to the repo
    async function commitFile(path, contentBase64, message, token) {
        const sha = await getFileSha(path, token);
        const body = { message, content: contentBase64, branch: GH_BRANCH };
        if (sha) body.sha = sha;

        const res = await fetch(
            `${GH_API}/repos/${GH_OWNER}/${GH_REPO}/contents/${path}`,
            {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/vnd.github.v3+json',
                },
                body: JSON.stringify(body),
            }
        );
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || 'GitHub API error');
        }
        return res.json();
    }

    // ── PUBLISH CONFIG ───────────────────────────────────────
    // Call this after saveAll() to push the config to GitHub.
    // Merges in the current image URL map so content-loader
    // knows which images to load from the repo.
    window.publishConfig = async function (cfg) {
        const token = getGhToken();
        if (!token) {
            console.warn('[Publisher] No GitHub token — changes saved locally only.');
            return false;
        }

        try {
            // Build the site-data.json payload
            const existing = window._siteDataCache || {};
            const siteData = Object.assign({}, cfg, {
                _published: new Date().toISOString(),
                _version: '1.1',
                images: existing.images || {},
            });

            const content = toBase64(JSON.stringify(siteData, null, 2));
            await commitFile('site-data.json', content, 'Admin: update site config', token);
            window._siteDataCache = siteData;
            return true;
        } catch (e) {
            console.error('[Publisher] Config publish failed:', e);
            throw e;
        }
    };

    // ── PUBLISH IMAGE ────────────────────────────────────────
    // Uploads an image file to uploads/<key>.<ext> in the repo.
    // Returns the public URL of the committed image.
    window.publishImage = async function (key, dataUrl) {
        const token = getGhToken();
        if (!token) {
            console.warn('[Publisher] No GitHub token — image stored locally only.');
            return null;
        }

        try {
            // Extract mime type and extension
            const match = dataUrl.match(/^data:image\/(.*?);base64,(.+)$/s);
            if (!match) throw new Error('Invalid image data URL');
            const ext = match[1] === 'jpeg' ? 'jpg' : match[1];
            const base64 = match[2];
            const filename = `uploads/${key}.${ext}`;

            await commitFile(filename, base64, `Admin: upload image ${key}`, token);

            // Public URL via Vercel deployment (cache-busted)
            const publicUrl = `/${filename}`;

            // Update the images map in site-data.json
            const existing = window._siteDataCache || {};
            if (!existing.images) existing.images = {};
            existing.images[key] = publicUrl;

            const content = toBase64(JSON.stringify(existing, null, 2));
            await commitFile('site-data.json', content, `Admin: register image path ${key}`, token);
            window._siteDataCache = existing;

            return publicUrl;
        } catch (e) {
            console.error('[Publisher] Image publish failed:', e);
            throw e;
        }
    };

    // ── DELETE IMAGE ─────────────────────────────────────────
    window.unpublishImage = async function (key) {
        const token = getGhToken();
        if (!token) return;
        const existing = window._siteDataCache || {};
        if (!existing.images) return;
        delete existing.images[key];
        try {
            const content = toBase64(JSON.stringify(existing, null, 2));
            await commitFile('site-data.json', content, `Admin: remove image ${key}`, token);
            window._siteDataCache = existing;
        } catch (e) {
            console.error('[Publisher] Image removal failed:', e);
        }
    };

    // ── STATUS CHECK ─────────────────────────────────────────
    // Verifies the token works and returns the repo info.
    window.checkGhToken = async function (token) {
        const res = await fetch(
            `${GH_API}/repos/${GH_OWNER}/${GH_REPO}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return res.ok;
    };

    // ── LOAD SITE DATA ───────────────────────────────────────
    // Fetches site-data.json from the live site (not localStorage).
    // content-loader.js calls this first to get the global config.
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
