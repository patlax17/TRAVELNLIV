/**
 * TravelNLiv Publisher - Supabase Storage & DB Integration
 */

(function () {
    const BUCKET = 'site-assets';

    const getClient = () => {
        if (typeof supabaseClient !== 'undefined') return supabaseClient;
        if (typeof window.supabaseClient !== 'undefined') return window.supabaseClient;
        return null;
    };

    // ── PUBLISH CONFIG ───────────────────────────────────────
    window.publishConfig = async function (config) {
        const client = getClient();
        if (!client) return false;
        try {
            const sections = Object.keys(config);
            for (const s of sections) {
                if (config[s]) {
                    await client.from('site_config').upsert({
                        section_key: s, data: config[s], updated_at: new Date()
                    }, { onConflict: 'section_key' });
                }
            }
            return true;
        } catch (e) { return false; }
    };

    // ── PUBLISH IMAGE (Upload to Storage + DB) ────────────────
    window.publishImage = async function (key, dataUrlOrFile) {
        const client = getClient();
        if (!client) return null;

        try {
            let fileToUpload = dataUrlOrFile;

            // If it's a data URL, convert to Blob
            if (typeof dataUrlOrFile === 'string' && dataUrlOrFile.startsWith('data:')) {
                const arr = dataUrlOrFile.split(',');
                const mime = arr[0].match(/:(.*?);/)[1];
                const bstr = atob(arr[1]);
                let n = bstr.length;
                const u8arr = new Uint8Array(n);
                while (n--) u8arr[n] = bstr.charCodeAt(n);
                fileToUpload = new Blob([u8arr], { type: mime });
            }

            const fileName = `${key}-${Date.now()}.${fileToUpload.type === 'image/jpeg' ? 'jpg' : 'png'}`;
            const { data, error: uploadError } = await client.storage
                .from(BUCKET)
                .upload(fileName, fileToUpload, { cacheControl: '3600', upsert: true });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = client.storage.from(BUCKET).getPublicUrl(fileName);

            // Update images table
            await client.from('images').upsert({
                image_key: key,
                url: publicUrl,
                updated_at: new Date()
            }, { onConflict: 'image_key' });

            return publicUrl;
        } catch (e) {
            console.error("Upload failed:", e);
            return null;
        }
    };

    // ── DELETE IMAGE ──────────────────────────────────────────
    window.removeImage = async function (key) {
        const client = getClient();
        if (!client) return false;

        try {
            // 1. Get current URL to find filename
            const { data: row } = await client.from('images').select('url').eq('image_key', key).single();
            if (row && row.url) {
                const parts = row.url.split('/');
                const fileName = parts[parts.length - 1];
                // 2. Remove from storage
                await client.storage.from(BUCKET).remove([fileName]);
            }

            // 3. Set URL to null in DB
            await client.from('images').upsert({
                image_key: key,
                url: null,
                updated_at: new Date()
            }, { onConflict: 'image_key' });

            return true;
        } catch (e) { return false; }
    };

    window.checkPublishStatus = async function () { return !!getClient(); };
})();
