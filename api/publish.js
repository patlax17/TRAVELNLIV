// ============================================================
// /api/publish.js — Vercel Serverless Function
// GitHub Publish Proxy for TravelNLiv Admin Portal
//
// GH_TOKEN is set as a Vercel Environment Variable (server-side).
// The admin panel never needs a token — this endpoint handles it.
// Called from publisher.js in the admin portal.
// ============================================================

const GH_OWNER = 'patlax17';
const GH_REPO = 'TRAVELNLIV';
const GH_BRANCH = 'main';
const GH_API = 'https://api.github.com';

// Vercel passes the token via environment variable — never exposed to browser
function getToken() {
    return process.env.GH_TOKEN || '';
}

// Fetch the current SHA of a file (needed to update existing files via GitHub API)
async function getFileSha(path, token) {
    const res = await fetch(
        `${GH_API}/repos/${GH_OWNER}/${GH_REPO}/contents/${path}?ref=${GH_BRANCH}`,
        { headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github.v3+json' } }
    );
    if (res.ok) {
        const data = await res.json();
        return data.sha || null;
    }
    return null;
}

// Commit a single file to the GitHub repo
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
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `GitHub API error ${res.status}`);
    }
    return res.json();
}

// ── MAIN HANDLER ─────────────────────────────────────────────
export default async function handler(req, res) {
    // CORS — allow requests from same origin / admin panel
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const token = getToken();
    if (!token) {
        return res.status(500).json({
            error: 'GH_TOKEN environment variable not set. Add it in Vercel Dashboard → Settings → Environment Variables.'
        });
    }

    try {
        const { type, data, key, base64, imageExt } = req.body;

        // ── Publish config (site-data.json) ──────────────────
        if (type === 'config') {
            if (!data) return res.status(400).json({ error: 'Missing data' });
            const content = Buffer.from(JSON.stringify(data, null, 2)).toString('base64');
            await commitFile('site-data.json', content, 'Admin: update site config', token);
            return res.status(200).json({ ok: true, type: 'config' });
        }

        // ── Publish image ─────────────────────────────────────
        if (type === 'image') {
            if (!key || !base64) return res.status(400).json({ error: 'Missing key or base64' });
            const ext = (imageExt || 'jpg').replace('jpeg', 'jpg');
            const filename = `uploads/${key}.${ext}`;

            await commitFile(filename, base64, `Admin: upload image ${key}`, token);

            const publicUrl = `/${filename}`;

            // Also update the images map in site-data.json
            const siteDataRes = await fetch(
                `${GH_API}/repos/${GH_OWNER}/${GH_REPO}/contents/site-data.json?ref=${GH_BRANCH}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            let siteData = {};
            if (siteDataRes.ok) {
                const raw = await siteDataRes.json();
                try { siteData = JSON.parse(Buffer.from(raw.content, 'base64').toString('utf8')); } catch (e) { }
            }
            if (!siteData.images) siteData.images = {};
            siteData.images[key] = publicUrl;
            const siteDataContent = Buffer.from(JSON.stringify(siteData, null, 2)).toString('base64');
            await commitFile('site-data.json', siteDataContent, `Admin: register image path ${key}`, token);

            return res.status(200).json({ ok: true, url: publicUrl });
        }

        // ── Remove image from registry ────────────────────────
        if (type === 'remove-image') {
            if (!key) return res.status(400).json({ error: 'Missing key' });
            const siteDataRes = await fetch(
                `${GH_API}/repos/${GH_OWNER}/${GH_REPO}/contents/site-data.json?ref=${GH_BRANCH}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (siteDataRes.ok) {
                const raw = await siteDataRes.json();
                let siteData = {};
                try { siteData = JSON.parse(Buffer.from(raw.content, 'base64').toString('utf8')); } catch (e) { }
                if (siteData.images) delete siteData.images[key];
                const content = Buffer.from(JSON.stringify(siteData, null, 2)).toString('base64');
                await commitFile('site-data.json', content, `Admin: remove image ${key}`, token);
            }
            return res.status(200).json({ ok: true });
        }

        // ── Health / token check ──────────────────────────────
        if (type === 'ping') {
            return res.status(200).json({ ok: true, repo: `${GH_OWNER}/${GH_REPO}` });
        }

        return res.status(400).json({ error: `Unknown type: ${type}` });

    } catch (err) {
        console.error('[api/publish] Error:', err.message);
        return res.status(500).json({ error: err.message });
    }
}
