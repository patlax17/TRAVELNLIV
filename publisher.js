/**
 * TravelNLiv Publisher - Redirection to Supabase
 * Directly interacts with Supabase client initialized in admin.html
 */

(function () {
    // Check for Supabase client
    const getClient = () => {
        if (typeof supabaseClient !== 'undefined') return supabaseClient;
        if (typeof window.supabaseClient !== 'undefined') return window.supabaseClient;
        return null;
    };

    // ── PUBLISH CONFIG ───────────────────────────────────────
    window.publishConfig = async function (config) {
        const client = getClient();
        if (!client) return console.warn("Supabase client not found for publishConfig");

        try {
            const sections = Object.keys(config);
            for (const s of sections) {
                if (config[s]) {
                    await client.from('site_config').upsert({
                        section_key: s,
                        data: config[s],
                        updated_at: new Date()
                    }, { onConflict: 'section_key' });
                }
            }
            console.log("Supabase: Config synced.");
            return true;
        } catch (e) {
            console.error("Supabase Config sync failed:", e);
            return false;
        }
    };

    // ── PUBLISH IMAGE ────────────────────────────────────────
    window.publishImage = async function (key, dataUrl) {
        const client = getClient();
        if (!client) return console.warn("Supabase client not found for publishImage");

        try {
            const { error } = await client.from('images').upsert({
                image_key: key,
                url: dataUrl,
                updated_at: new Date()
            }, { onConflict: 'image_key' });

            if (error) throw error;
            console.log("Supabase: Image synced - " + key);
            return true;
        } catch (e) {
            console.error("Supabase Image sync failed:", e);
            return false;
        }
    };

    // ── STATUS CHECK ─────────────────────────────────────────
    window.checkPublishStatus = async function () {
        return !!getClient();
    };

})();
