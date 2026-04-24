

        // ============================================================
        // ADMIN PANEL — CORE LOGIC
        // ============================================================

        const DEFAULT_PASS_KEY = "tnliv_admin_pass";
        const DEFAULT_PASS = "travelnliv2026";

        // ── FEATURED TRIP (Homepage) ─────────────────────────────────────
        function populateFeaturedTripSelect() {
            var sel = document.getElementById('featured-trip-slug');
            if (!sel) return;
            var dests = getDestinations();
            var current = localStorage.getItem('FEATURED_TRIP_SLUG') || '';
            sel.innerHTML = '<option value="">— Auto (first Booking Open trip) —</option>' +
                dests.map(function (d) {
                    return '<option value="' + d.slug + '"' + (d.slug === current ? ' selected' : '') + '>' +
                        (d.emoji || '✈️') + ' ' + d.name + ' (' + (d.status === 'booking_open' ? 'Booking Open' : 'Coming Soon') + ')</option>';
                }).join('');
            // Update preview
            var d = dests.find(function (x) { return x.slug === current; });
            if (!d && dests.length) d = dests.find(function (x) { return x.status === 'booking_open'; }) || dests[0];
            var preview = document.getElementById('featured-trip-preview');
            if (preview && d) {
                preview.style.display = 'block';
                document.getElementById('featured-trip-preview-name').textContent = (d.emoji || '') + ' ' + d.name;
                document.getElementById('featured-trip-preview-dates').textContent = d.dates || 'Dates TBA';
                var lnk = document.getElementById('featured-trip-preview-link');
                if (lnk) { lnk.href = d.url || ('/upcomingtrips/' + d.slug); }
            }
        }
        function saveFeaturedTrip() {
            var sel = document.getElementById('featured-trip-slug');
            var slug = sel ? sel.value : '';
            localStorage.setItem('FEATURED_TRIP_SLUG', slug);
            populateFeaturedTripSelect();
            toast('✓ Homepage featured trip updated!');
        }

        // ── AUTH ─────────────────────────────────────────────────────
        function checkLogin() {
            if (localStorage.getItem("tnliv_authed") === "1") showApp();
        }

        function handleLogin() {
            const pass = document.getElementById("login-password").value;
            const saved = localStorage.getItem(DEFAULT_PASS_KEY) || DEFAULT_PASS;
            if (pass === saved) {
                localStorage.setItem("tnliv_authed", "1");
                showApp();
            } else {
                document.getElementById("login-error").style.display = "block";
            }
        }

        document.getElementById("login-password").addEventListener("keydown", e => {
            if (e.key === "Enter") handleLogin();
        });

        function showApp() {
            document.getElementById("login-screen").style.display = "none";
            document.getElementById("admin-app").style.display = "flex";
            loadAllFields();
            loadMarketingFields();
            renderPastEventPhotoGrid();
            addGallerySlot(); // start with one empty slot
            populateFeaturedTripSelect();
            loadGhStatusPanel(); // check GitHub publish connection
        }


        function changePassword() {
            const np = document.getElementById("new-pass").value;
            const cp = document.getElementById("confirm-pass").value;
            if (!np) return toast("Please enter a new password.", "error");
            if (np !== cp) return toast("Passwords don't match.", "error");
            localStorage.setItem(DEFAULT_PASS_KEY, np);
            toast("Password updated ✓");
        }

        // ── PUBLISH STATUS (server-managed, no token in browser) ─────
        function renderGhStatus(connected) {
            const bar = document.getElementById("gh-status-bar");
            if (!bar) return;
            if (connected === null) {
                bar.style.background = "rgba(196,160,96,0.08)";
                bar.style.borderColor = "rgba(196,160,96,0.2)";
                bar.innerHTML = "🔍 Checking publish connection...";
            } else if (connected) {
                bar.style.background = "rgba(110,198,160,0.1)";
                bar.style.borderColor = "rgba(110,198,160,0.3)";
                bar.innerHTML = "✅ <strong style='color:#8FBF9F'>Connected</strong> — all saves and image uploads go live for everyone in ~30 seconds. Works on any device automatically.";
            } else {
                bar.style.background = "rgba(224,90,78,0.08)";
                bar.style.borderColor = "rgba(224,90,78,0.2)";
                bar.innerHTML = "⚠ <strong style='color:#e05a4e'>Not connected</strong> — GH_TOKEN not set in Vercel environment variables. Contact your developer.";
            }
        }

        // No token needed — just ping the server
        async function testAndSaveToken() { await loadGhStatusPanel(); }

        async function loadGhStatusPanel() {
            renderGhStatus(null);
            const ok = window.checkPublishStatus ? await window.checkPublishStatus() : false;
            renderGhStatus(ok);
        }

        // ── NAVIGATION ───────────────────────────────────────────────
        const PANELS = {
            home: { title: "Homepage", sub: "Edit next trip card and past event recap" },
            about: { title: "About Page", sub: "Edit founder bio, manage past trips, and auto-archive concluded upcoming trips" },
            destinations: { title: "Destinations & Trips", sub: "Add new trips, edit existing ones, manage itinerary, inclusions, rooms, and booking links" },
            trips: { title: "[Legacy] Upcoming Trips", sub: "Legacy panel — use Destinations & Trips instead" },
            events: { title: "Events", sub: "Control the homepage event section" },
            faqs: { title: "FAQs", sub: "Add, edit, or remove FAQ questions" },
            gallery: { title: "Gallery", sub: "Update gallery stats and add new photos" },
            social: { title: "Links & Contact", sub: "Update social links and contact info site-wide" },
            marketing: { title: "Marketing & Analytics", sub: "Manage ad pixels — Meta, TikTok, and Google Tag Manager" },
            settings: { title: "Settings", sub: "Password, image resets, and backup settings" },
        };

        function showPanel(id) {
            document.querySelectorAll(".admin-panel").forEach(p => p.classList.remove("active"));
            document.querySelectorAll(".sidebar-link").forEach(l => l.classList.remove("active"));
            var panel = document.getElementById("panel-" + id);
            var navBtn = document.getElementById("nav-" + id);
            if (panel) panel.classList.add("active");
            if (navBtn) navBtn.classList.add("active");
            document.getElementById("panel-title").textContent = (PANELS[id] || {}).title || id;
            document.getElementById("panel-sub").textContent = (PANELS[id] || {}).sub || "";
        }

        // ── LOAD FIELDS ───────────────────────────────────────────────
        function loadAllFields() {
            const cfg = getSiteConfig();
            const nt = cfg.nextTrip, pe = cfg.pastEvent, ev = cfg.event,
                gl = cfg.gallery, tr = cfg.trips, sc = cfg.social, nCta = cfg.navCta;

            // ── HERO ──
            const hr = cfg.hero || {};
            v('hero-eyebrow-val', hr.eyebrow); v('hero-heading-val', hr.heading);
            v('hero-heading-italic-val', hr.headingItalic); v('hero-subtitle-val', hr.subtitle);
            v('hero-stat1-num-val', hr.stat1Number); v('hero-stat1-label-val', hr.stat1Label);
            v('hero-stat2-num-val', hr.stat2Number); v('hero-stat2-label-val', hr.stat2Label);
            v('hero-stat3-num-val', hr.stat3Number); v('hero-stat3-label-val', hr.stat3Label);
            v('hero-cta-primary-val', hr.ctaPrimaryText);
            restoreZone('hero_img');

            // ── TICKER ──
            const tk = cfg.ticker || [];
            v('ticker-items-val', tk.join('\n'));

            // ── IDENTITY ──
            const id = cfg.identity || {};
            v('identity-eyebrow-val', id.eyebrow); v('identity-heading-val', id.heading);
            v('identity-heading-italic-val', id.headingItalic);
            v('identity-para1-val', id.para1); v('identity-para2-val', id.para2); v('identity-para3-val', id.para3);

            // ── SOCIAL PROOF ──
            const sp = cfg.socialProof || {};
            v('sp-eyebrow-val', sp.eyebrow); v('sp-body-val', sp.body);
            v('sp-stat1-num-val', sp.stat1Number); v('sp-stat1-label-val', sp.stat1Label);
            v('sp-stat2-num-val', sp.stat2Number); v('sp-stat2-label-val', sp.stat2Label);
            v('sp-stat3-num-val', sp.stat3Number); v('sp-stat3-label-val', sp.stat3Label);

            // ── HOW IT WORKS ──
            const hiw = cfg.howItWorks || {};
            v('hiw-eyebrow-val', hiw.eyebrow); v('hiw-heading-val', hiw.heading);
            renderHiwStepsEditor(hiw.steps || []);

            // ── NEXT TRIP ──
            v('nt-destination', nt.destination); v('nt-badge', nt.badge);
            v('nt-dates', nt.dates); v('nt-duration', nt.duration);
            v('nt-desc', nt.description); v('nt-price', nt.priceFrom);
            v('nt-cta-text', nt.ctaText); v('nt-squadtrip-url', nt.squadtripUrl);

            // ── PAST EVENT ──
            v('pe-visible', String(pe.visible)); v('pe-city', pe.city);
            v('pe-date', pe.date); v('pe-title', pe.title);
            v('pe-italic', pe.titleItalic); v('pe-desc', pe.description);

            // ── WHY US ──
            const wu = cfg.whyUs || {};
            v('why-eyebrow-val', wu.eyebrow); v('why-heading-val', wu.heading); v('why-body-val', wu.body);
            renderWhyCardsEditor(wu.cards || []);

            // ── FINAL CTA ──
            const fc = cfg.finalCta || {};
            v('cta-eyebrow-val', fc.eyebrow); v('cta-heading-val', fc.heading);
            v('cta-heading-italic-val', fc.headingItalic); v('cta-body-val', fc.body);
            v('cta-btn-text-val', fc.ctaText);
            restoreZone('cta_bg');

            // Event fields
            const modeEl = document.querySelector('input[name="event-mode"][value="' + ev.mode + '"]');
            if (modeEl) { modeEl.checked = true; toggleEventMode(ev.mode); }
            v('ev-eyebrow', ev.eyebrow); v('ev-badge', ev.badgeText);
            v('ev-heading', ev.heading); v('ev-heading-italic', ev.headingItalic);
            v('ev-desc', ev.description); v('ev-sub-desc', ev.subDescription);
            v('ev-live-name', ev.liveEventName); v('ev-live-date', ev.liveEventDate);
            v('ev-live-venue', ev.liveEventVenue); v('ev-live-price', ev.livePriceDisplay);
            v('ev-live-btn', ev.liveTicketBtn); v('ev-live-url', ev.liveTicketUrl);

            // Gallery
            v('gallery-photos', gl.photoCount); v('gallery-dests', gl.destinationCount); v('gallery-trips', gl.tripCount);

            // Trips
            tr.forEach(function (trip, i) {
                const p = 'trip' + (i + 1);
                v(p + '-status', trip.status, true); v(p + '-destination', trip.destination);
                v(p + '-month', trip.monthYear); v(p + '-dates', trip.dates);
                v(p + '-duration', trip.duration); v(p + '-region', trip.region);
                v(p + '-price', trip.priceDisplay); v(p + '-desc', trip.description);
                v(p + '-cta-text', trip.ctaText); v(p + '-cta-url', trip.ctaUrl);
                restoreZone(p);
            });

            // Social
            v('s-email', sc.email); v('s-instagram', sc.instagram);
            v('s-tiktok', sc.tiktok); v('s-facebook', sc.facebook);
            v('s-wa-group', sc.whatsappGroup); v('s-wa-channel', sc.whatsappChannel);
            v('s-nav-cta-text', nCta.text); v('s-nav-cta-url', nCta.url);

            restoreZone('next_trip'); restoreZone('event_bg');
            // Bali page image zones
            restoreZone('bali_hero');
            for (var _bi = 0; _bi < 10; _bi++) restoreZone('bali_g_' + _bi);
            for (var _ri = 0; _ri < 3; _ri++) restoreZone('bali_room_' + _ri);

            // FAQs
            renderFaqEditor(cfg.faqs || TNLIV_DEFAULTS.faqs);

            // Mode toggle listeners
            document.querySelectorAll('input[name="event-mode"]').forEach(r => {
                r.addEventListener('change', () => toggleEventMode(r.value));
            });
        }

        function v(id, val, isSelect) {
            const el = document.getElementById(id);
            if (!el) return;
            if (isSelect) { el.value = val || ""; }
            else { "value" in el ? (el.value = val || "") : (el.innerHTML = val || ""); }
        }

        function g(id) {
            const el = document.getElementById(id);
            return el ? el.value.trim() : "";
        }

        // ── SAVE ALL ─────────────────────────────────────────────────
        function saveAll() {
            const cfg = getSiteConfig();

            // ── HERO ──
            cfg.hero = {
                eyebrow: g('hero-eyebrow-val'), heading: g('hero-heading-val'),
                headingItalic: g('hero-heading-italic-val'), subtitle: g('hero-subtitle-val'),
                stat1Number: g('hero-stat1-num-val'), stat1Label: g('hero-stat1-label-val'),
                stat2Number: g('hero-stat2-num-val'), stat2Label: g('hero-stat2-label-val'),
                stat3Number: g('hero-stat3-num-val'), stat3Label: g('hero-stat3-label-val'),
                ctaPrimaryText: g('hero-cta-primary-val'),
                image: (cfg.hero || {}).image || 'zanzibar_hero.png',
            };

            // ── TICKER ──
            const tickerRaw = (document.getElementById('ticker-items-val') || {}).value || '';
            cfg.ticker = tickerRaw.split('\n').map(s => s.trim()).filter(Boolean);

            // ── IDENTITY / WHO WE ARE ──
            cfg.identity = {
                eyebrow: g('identity-eyebrow-val'), heading: g('identity-heading-val'),
                headingItalic: g('identity-heading-italic-val'),
                para1: g('identity-para1-val'), para2: g('identity-para2-val'), para3: g('identity-para3-val'),
            };

            // ── SOCIAL PROOF ──
            cfg.socialProof = {
                eyebrow: g('sp-eyebrow-val'), body: g('sp-body-val'),
                stat1Number: g('sp-stat1-num-val'), stat1Label: g('sp-stat1-label-val'),
                stat2Number: g('sp-stat2-num-val'), stat2Label: g('sp-stat2-label-val'),
                stat3Number: g('sp-stat3-num-val'), stat3Label: g('sp-stat3-label-val'),
            };

            // ── HOW IT WORKS ──
            cfg.howItWorks = {
                eyebrow: g('hiw-eyebrow-val'), heading: g('hiw-heading-val'),
                steps: collectHiwSteps(),
            };

            // ── NEXT TRIP ──
            cfg.nextTrip = {
                badge: g("nt-badge"), destination: g("nt-destination"), dates: g("nt-dates"),
                duration: g("nt-duration"), description: g("nt-desc"),
                image: cfg.nextTrip.image,
                priceFrom: g("nt-price"), ctaText: g("nt-cta-text"),
                squadtripUrl: g("nt-squadtrip-url"),
            };

            // ── PAST EVENT ──
            cfg.pastEvent = {
                visible: g("pe-visible") === "true", city: g("pe-city"), date: g("pe-date"),
                title: g("pe-title"), titleItalic: g("pe-italic"), description: g("pe-desc"),
            };

            // ── WHY US ──
            cfg.whyUs = {
                eyebrow: g('why-eyebrow-val'), heading: g('why-heading-val'), body: g('why-body-val'),
                cards: collectWhyCards(),
            };

            // ── FINAL CTA ──
            cfg.finalCta = {
                eyebrow: g('cta-eyebrow-val'), heading: g('cta-heading-val'),
                headingItalic: g('cta-heading-italic-val'), body: g('cta-body-val'),
                ctaText: g('cta-btn-text-val'),
                image: (cfg.finalCta || {}).image || 'snorkeling_mnemba.png',
            };

            const mode = document.querySelector('input[name="event-mode"]:checked');
            cfg.event = {
                mode: mode ? mode.value : "coming-soon",
                bgImage: cfg.event.bgImage,
                eyebrow: g("ev-eyebrow"), heading: g("ev-heading"), headingItalic: g("ev-heading-italic"),
                description: g("ev-desc"), subDescription: g("ev-sub-desc"), badgeText: g("ev-badge"),
                liveEventName: g("ev-live-name"), liveEventDate: g("ev-live-date"), liveEventVenue: g("ev-live-venue"),
                livePriceDisplay: g("ev-live-price"), liveTicketBtn: g("ev-live-btn"), liveTicketUrl: g("ev-live-url"),
            };

            cfg.gallery = {
                photoCount: parseInt(g("gallery-photos")) || 0,
                destinationCount: parseInt(g("gallery-dests")) || 0,
                tripCount: parseInt(g("gallery-trips")) || 0,
            };

            cfg.trips = cfg.trips.map(function (trip, i) {
                const p = "trip" + (i + 1);
                return {
                    id: trip.id, image: trip.image,
                    status: g(p + "-status"), destination: g(p + "-destination"), monthYear: g(p + "-month"),
                    dates: g(p + "-dates"), duration: g(p + "-duration"), region: g(p + "-region"),
                    priceDisplay: g(p + "-price"), description: g(p + "-desc"),
                    ctaText: g(p + "-cta-text"), ctaUrl: g(p + "-cta-url"),
                    badge: g(p + "-status") === "booking-open" ? "Booking Open" : "Coming Soon",
                };
            });

            cfg.social = {
                email: g("s-email"), instagram: g("s-instagram"), tiktok: g("s-tiktok"),
                facebook: g("s-facebook"), whatsappGroup: g("s-wa-group"), whatsappChannel: g("s-wa-channel"),
            };

            cfg.navCta = { text: g("s-nav-cta-text"), url: g("s-nav-cta-url") };
            cfg.faqs = collectFaqs();

            // 1️⃣ Save locally immediately (instant preview for admin)
            saveSiteConfig(cfg);
            toast("✓ Saved locally. Publishing to live site...");

            // 2️⃣ Push to GitHub → triggers Vercel redeploy → visible to everyone
            if (window.publishConfig) {
                window.publishConfig(cfg)
                    .then(function (ok) {
                        if (ok) toast("✅ Published! Live site updates in ~30 seconds.");
                        else toast("✓ Saved locally. Add GitHub token in Settings to publish globally.", "warn");
                    })
                    .catch(function (e) {
                        toast("⚠ Local save OK, but publish failed: " + e.message, "error");
                    });
            }
        }

        // ── HOW IT WORKS STEPS EDITOR ─────────────────────────────────
        function renderHiwStepsEditor(steps) {
            const editor = document.getElementById('hiw-steps-editor');
            if (!editor) return;
            editor.innerHTML = steps.map((step, i) => `
              <div style="background:var(--bg-2,#1a1a1a);border:1px solid var(--border-color,#2a2a2a);border-radius:12px;padding:18px 20px;">
                <div style="font-size:0.72rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-muted);margin-bottom:12px;">Step ${i + 1}</div>
                <div style="display:grid;grid-template-columns:64px 1fr 1fr;gap:12px;">
                  <div class="form-group" style="margin-bottom:0">
                    <label>Icon</label>
                    <input type="text" class="form-control" id="hiw-step-icon-${i}" value="${escapeAttr(step.icon || '')}" />
                  </div>
                  <div class="form-group" style="margin-bottom:0">
                    <label>Title</label>
                    <input type="text" class="form-control" id="hiw-step-title-${i}" value="${escapeAttr(step.title || '')}" />
                  </div>
                  <div class="form-group" style="margin-bottom:0">
                    <label>Body</label>
                    <input type="text" class="form-control" id="hiw-step-body-${i}" value="${escapeAttr(step.body || '')}" />
                  </div>
                </div>
              </div>`).join('');
        }

        function collectHiwSteps() {
            const steps = []; let i = 0;
            while (document.getElementById('hiw-step-title-' + i)) {
                steps.push({
                    icon: (document.getElementById('hiw-step-icon-' + i) || {}).value || '',
                    title: (document.getElementById('hiw-step-title-' + i) || {}).value || '',
                    body: (document.getElementById('hiw-step-body-' + i) || {}).value || '',
                });
                i++;
            }
            return steps;
        }

        // ── WHY US CARDS EDITOR ───────────────────────────────────────
        function renderWhyCardsEditor(cards) {
            const editor = document.getElementById('why-cards-editor');
            if (!editor) return;
            editor.innerHTML = cards.map((card, i) => `
              <div style="background:var(--bg-2,#1a1a1a);border:1px solid var(--border-color,#2a2a2a);border-radius:12px;padding:18px 20px;">
                <div style="font-size:0.72rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-muted);margin-bottom:12px;">Card ${i + 1}</div>
                <div class="form-group" style="margin-bottom:10px;">
                  <label>Card Title</label>
                  <input type="text" class="form-control" id="why-card-title-${i}" value="${escapeAttr(card.title || '')}" />
                </div>
                <div class="form-group" style="margin-bottom:0">
                  <label>Card Body</label>
                  <textarea class="form-control" id="why-card-body-${i}" rows="2">${escHtml(card.body || '')}</textarea>
                </div>
              </div>`).join('');
        }

        function collectWhyCards() {
            const cards = []; let i = 0;
            while (document.getElementById('why-card-title-' + i)) {
                cards.push({
                    title: (document.getElementById('why-card-title-' + i) || {}).value || '',
                    body: (document.getElementById('why-card-body-' + i) || {}).value || '',
                });
                i++;
            }
            return cards;
        }

        // ── EVENT MODE ────────────────────────────────────────────────
        function toggleEventMode(mode) {
            document.getElementById("cs-fields").style.display = mode === "coming-soon" ? "" : "none";
            document.getElementById("live-fields").style.display = mode === "live" ? "" : "none";
        }


        // ============================================================
        // IMAGE UPLOAD SYSTEM
        // ============================================================

        // Opens the hidden file input for a given key
        function openPicker(key) {
            const f = document.getElementById("file-" + key);
            if (f) f.click();
        }

        // File selected via file input
        function handleFilePick(event, key) {
            const file = event.target.files[0];
            if (file) processImage(file, key);
        }

        // File dropped onto zone
        function handleDrop(event, key) {
            event.preventDefault();
            const zone = document.getElementById("zone-" + key);
            if (zone) zone.classList.remove("drag-over");
            const file = (event.dataTransfer.files || [])[0];
            if (file && file.type.startsWith("image/")) processImage(file, key);
        }

        // Convert file to base64, store, refresh zone
        // Convert file to base64, store locally + publish to GitHub
        function processImage(file, key) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const base64 = e.target.result;
                // 1️⃣ Store locally for instant admin preview
                localStorage.setItem("tnliv_img_" + key, base64);
                refreshZone(key, base64);
                toast("✓ Photo saved. Publishing to live site...");

                // 2️⃣ Commit to GitHub → visible to ALL visitors after ~30s deploy
                if (window.publishImage) {
                    window.publishImage(key, base64)
                        .then(function (url) {
                            if (url) toast("✅ Photo published! Live site updates in ~30 seconds.");
                            else toast("✓ Photo saved locally. Add GitHub token in Settings to publish globally.", "warn");
                        })
                        .catch(function (e) {
                            toast("⚠ Photo saved locally, publish failed: " + e.message, "error");
                        });
                }
            };
            reader.readAsDataURL(file);
        }

        // Remove image for a key (local + global)
        function removeImage(event, key) {
            event.stopPropagation();
            localStorage.removeItem("tnliv_img_" + key);
            refreshZone(key, null);
            toast("Image removed.");
            // Also remove from GitHub site-data.json
            if (window.unpublishImage) window.unpublishImage(key);
        }


        // Re-render a zone with new image or empty state
        function refreshZone(key, base64) {
            const zone = document.getElementById("zone-" + key);
            if (!zone) return;
            if (base64) {
                zone.classList.add("has-image");
                zone.innerHTML = `
      <img class="img-upload-preview" src="${base64}" alt="Preview" />
      <button class="img-remove-btn" onclick="removeImage(event,'${key}')" title="Remove image">✕</button>`;
            } else {
                zone.classList.remove("has-image");
                zone.innerHTML = `
      <div class="img-upload-placeholder">
        <span class="img-upload-icon">🖼️</span>
        <span class="img-upload-text">Drop image or <strong>click to browse</strong></span>
        <span class="img-upload-hint">PNG · JPG · WebP accepted</span>
      </div>`;
            }
            // Reset file input so same file can be reselected
            const fi = document.getElementById("file-" + key);
            if (fi) fi.value = "";
        }

        // Restore a zone's preview from stored base64
        function restoreZone(key) {
            const stored = localStorage.getItem("tnliv_img_" + key);
            if (stored) refreshZone(key, stored);
        }

        // ── PAST EVENT PHOTO GRID ─────────────────────────────────────
        const LP_LABELS = ["Welcome", "The Crew", "The Collective", "Mix & Bingo", "The Night", "Vibes", "The Community"];

        function renderPastEventPhotoGrid() {
            const grid = document.getElementById("pe-photo-grid");
            if (!grid) return;
            grid.innerHTML = LP_LABELS.map(function (label, i) {
                const key = "lp_photo_" + i;
                const stored = localStorage.getItem("tnliv_img_" + key);
                return `<div>
      <div class="img-upload-zone ${stored ? 'has-image' : ''}" id="zone-${key}"
        onclick="openPicker('${key}')"
        ondragover="event.preventDefault();this.classList.add('drag-over')"
        ondragleave="this.classList.remove('drag-over')"
        ondrop="handleDrop(event,'${key}')">
        ${stored
                        ? `<img class="img-upload-preview" src="${stored}" alt="${label}" />
             <button class="img-remove-btn" onclick="removeImage(event,'${key}')" title="Remove">✕</button>`
                        : `<div class="img-upload-placeholder">
               <span class="img-upload-icon">📷</span>
               <span class="img-upload-text" style="font-size:0.7rem;">Upload</span>
             </div>`
                    }
      </div>
      <input type="file" id="file-${key}" accept="image/*" style="display:none"
        onchange="handleFilePick(event,'${key}');renderPastEventPhotoGrid()" />
      <p class="pe-photo-label">${label}</p>
    </div>`;
            }).join("");
        }

        // ── GALLERY UPLOAD SLOTS ──────────────────────────────────────
        let gallerySlotCount = 0;

        function addGallerySlot() {
            const idx = gallerySlotCount++;
            const key = "gallery_pending_" + idx;
            const list = document.getElementById("gallery-add-list");
            const div = document.createElement("div");
            div.id = "gallery-slot-" + idx;
            div.className = "gallery-add-row";
            div.innerHTML = `
    <div>
      <div class="img-upload-zone" id="zone-${key}"
        onclick="openPicker('${key}')"
        ondragover="event.preventDefault();this.classList.add('drag-over')"
        ondragleave="this.classList.remove('drag-over')"
        ondrop="handleDrop(event,'${key}')">
        <div class="img-upload-placeholder">
          <span class="img-upload-icon">📷</span>
          <span class="img-upload-text" style="font-size:0.72rem;">Drop or <strong>browse</strong></span>
        </div>
      </div>
      <input type="file" id="file-${key}" accept="image/*" style="display:none" onchange="handleFilePick(event,'${key}')" />
    </div>
    <div>
      <div class="form-group" style="margin-bottom:10px;">
        <label>Photo Title</label>
        <input type="text" id="gtitle-${idx}" class="form-control" placeholder="e.g. Rooftop Views" />
      </div>
      <div class="form-group" style="margin-bottom:0">
        <label>Description</label>
        <input type="text" id="gdesc-${idx}" class="form-control" placeholder="Short caption..." />
      </div>
    </div>
    <div>
      <div class="form-group" style="margin-bottom:10px;">
        <label>Category (filter tag)</label>
        <select id="gcat-${idx}" class="form-control">
          <option value="community">Community</option>
          <option value="china">China</option>
          <option value="events">Events</option>
        </select>
      </div>
    </div>
    <div style="display:flex;align-items:flex-end;padding-bottom:4px;">
      <button class="btn-danger" onclick="removeGallerySlot(${idx})" style="font-size:0.75rem;padding:8px 14px;">Remove</button>
    </div>`;
            list.appendChild(div);
        }

        function removeGallerySlot(idx) {
            const el = document.getElementById("gallery-slot-" + idx);
            if (el) el.remove();
            localStorage.removeItem("tnliv_img_gallery_pending_" + idx);
        }

        // ── RESET & CLEAR ─────────────────────────────────────────────
        function clearAllImages() {
            if (!confirm("Remove all uploaded images? Site pages will revert to default images.")) return;
            Object.keys(localStorage).forEach(k => { if (k.startsWith("tnliv_img_")) localStorage.removeItem(k); });
            // Reset all visible zones
            document.querySelectorAll(".img-upload-zone").forEach(z => {
                const key = z.id.replace("zone-", "");
                refreshZone(key, null);
            });
            renderPastEventPhotoGrid();
            toast("✓ All image uploads cleared.");
        }

        function resetDefaults() {
            if (!confirm("Reset all content to defaults? This cannot be undone.")) return;
            resetSiteConfig();
            loadAllFields();
            toast("✓ Reset to defaults.");
        }

        // ── EXPORT / IMPORT ───────────────────────────────────────────
        function exportConfig() {
            const cfg = getSiteConfig();
            const blob = new Blob([JSON.stringify(cfg, null, 2)], { type: "application/json" });
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = "travelnliv-config-" + new Date().toISOString().slice(0, 10) + ".json";
            a.click();
        }

        function importConfig(event) {
            const file = event.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = e => {
                try {
                    saveSiteConfig(JSON.parse(e.target.result));
                    loadAllFields();
                    toast("✓ Config imported successfully!");
                } catch { toast("Import failed — invalid JSON.", "error"); }
            };
            reader.readAsText(file);
        }

        // ── FAQs ─────────────────────────────────────────────────────
        const faqGroups = [
            { key: "general", label: "🌍 General" },
            { key: "trips", label: "✈️ Trips & Included" },
            { key: "booking", label: "💳 Booking" },
            { key: "contact", label: "💬 Contact" },
        ];

        function renderFaqEditor(faqs) {
            const editor = document.getElementById("faq-editor");
            editor.innerHTML = faqGroups.map(function (group) {
                const items = (faqs[group.key] || []).map((item, idx) => faqItemHTML(group.key, idx, item)).join("");
                return `<div class="admin-divider"></div>
      <div style="font-size:0.75rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-muted);margin-bottom:14px;">${group.label}</div>
      <div id="faq-group-${group.key}">${items}</div>
      <button class="btn-add-faq" onclick="addFaqItem('${group.key}')">+ Add Question</button>`;
            }).join("");
        }

        function faqItemHTML(groupKey, idx, item) {
            return `<div class="faq-admin-item" id="faq-${groupKey}-${idx}">
    <button class="faq-remove" onclick="removeFaqItem('${groupKey}',${idx})">✕</button>
    <div class="form-group"><label>Question</label><input type="text" class="form-control faq-q-input" value="${escapeAttr(item.q)}" /></div>
    <div class="form-group" style="margin-bottom:0"><label>Answer</label><textarea class="form-control faq-a-input" rows="2">${escHtml(item.a)}</textarea></div>
  </div>`;
        }

        function addFaqItem(groupKey) {
            const cfg = getSiteConfig();
            if (!cfg.faqs[groupKey]) cfg.faqs[groupKey] = [];
            cfg.faqs[groupKey].push({ q: "New Question", a: "Answer goes here." });
            saveSiteConfig(cfg); renderFaqEditor(cfg.faqs);
        }

        function removeFaqItem(groupKey, idx) {
            const cfg = getSiteConfig();
            if (cfg.faqs[groupKey]) cfg.faqs[groupKey].splice(idx, 1);
            saveSiteConfig(cfg); renderFaqEditor(cfg.faqs);
        }

        function collectFaqs() {
            const result = {};
            faqGroups.forEach(function (group) {
                const container = document.getElementById("faq-group-" + group.key);
                if (!container) return;
                result[group.key] = Array.from(container.querySelectorAll(".faq-admin-item")).map(item => ({
                    q: item.querySelector(".faq-q-input").value.trim(),
                    a: item.querySelector(".faq-a-input").value.trim(),
                }));
            });
            return result;
        }

        // ── TOAST ─────────────────────────────────────────────────────
        function toast(msg, type) {
            const el = document.getElementById("toast");
            el.textContent = msg;
            el.style.color = type === "error" ? "var(--danger)" : "var(--gold)";
            el.style.borderColor = type === "error" ? "rgba(224,90,78,0.4)" : "rgba(196,160,96,0.3)";
            el.classList.add("show");
            setTimeout(() => el.classList.remove("show"), 3400);
        }

        // ── UTILS ─────────────────────────────────────────────────────
        function escapeAttr(s) { return (s || "").replace(/"/g, "&quot;"); }
        function escHtml(s) { return (s || "").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

        // ── MARKETING & ANALYTICS ─────────────────────────────────────
        const PIXEL_KEYS = [
            { id: "px-meta", lsKey: "tnliv_pixel_meta", label: "Meta Pixel" },
            { id: "px-tiktok", lsKey: "tnliv_pixel_tiktok", label: "TikTok Pixel" },
            { id: "px-gtm", lsKey: "tnliv_pixel_gtm", label: "GTM" },
        ];

        function loadMarketingFields() {
            PIXEL_KEYS.forEach(function (p) {
                var el = document.getElementById(p.id);
                if (el) el.value = localStorage.getItem(p.lsKey) || "";
            });
            renderTrackingStatus();
        }

        function renderTrackingStatus() {
            var row = document.getElementById("tracking-status-row");
            if (!row) return;
            row.innerHTML = PIXEL_KEYS.map(function (p) {
                var val = (localStorage.getItem(p.lsKey) || "").trim();
                var active = !!val;
                return '<div class="pixel-status-chip' + (active ? " active" : "") + '">' +
                    '<div class="psc-dot"></div>' +
                    p.label + (active ? " ✓ Live" : " — Not configured") +
                    '</div>';
            }).join("");
        }

        function saveMarketing() {
            var anySet = false;
            PIXEL_KEYS.forEach(function (p) {
                var el = document.getElementById(p.id);
                if (!el) return;
                var val = el.value.trim();
                if (val) {
                    localStorage.setItem(p.lsKey, val);
                    anySet = true;
                } else {
                    localStorage.removeItem(p.lsKey);
                }
            });
            renderTrackingStatus();
            toast(anySet
                ? "✓ Tracking IDs saved — scripts are now live on every page!"
                : "Tracking IDs cleared — no scripts will fire.");
        }

        function clearTracking() {
            if (!confirm("Remove all pixel IDs? Tracking will stop on the next page load.")) return;
            PIXEL_KEYS.forEach(function (p) {
                localStorage.removeItem(p.lsKey);
                var el = document.getElementById(p.id);
                if (el) el.value = "";
            });
            renderTrackingStatus();
            toast("All tracking pixels cleared.");
        }


        // ── DESTINATIONS MANAGER ────────────────────────────────────
        var BALI_DAYS = [
            { title: 'Arrival, Connect & Seafood Welcome Dinner by the Beach', body: 'Warmly welcomed and transferred into nature. Settle into your 5-star luxury villa, explore your surroundings, then gather for an intimate seafood welcome dinner by the beach.', highlights: ['🛬 Airport Transfer', '🏨 Villa Check-in', '🦞 Welcome Seafood Dinner'] },
            { title: 'Waterfalls & Wonders of Bali', body: 'Private guide from 9:30 AM. First stop: the breathtaking Tegenungan Waterfall, cascading waters surrounded by lush jungle. Continue to the historic Elephant Cave (Goa Gajah) — ancient carvings and tranquil surroundings.', highlights: ['🍳 Breakfast Included', '💧 Tegenungan Waterfall', '🐘 Elephant Cave (Goa Gajah)', '📸 Photo Moments'] },
            { title: 'Sunset in a Landscape Shaped by Time', body: 'Relaxed breakfast then guide meets you at 2:00 PM. Journey to Mount Batur Geopark for a Black Lava Jeep tour at 4:00 PM — dramatic volcanic landscapes and sweeping panoramic views. Reach the sunset viewpoint around 6:00 PM where the sky transforms into a stunning display of color.', highlights: ['🍳 Breakfast Included', '🚙 Black Lava Jeep Tour', '🌋 Mount Batur Geopark', '🌅 Sunset Viewpoint'] },
            { title: 'Rice Terraces & Village Life', body: 'Early pickup at 7:30 AM. At 9:00 AM begin a guided e-bike tour through Jatiluwih Rice Terraces — a UNESCO World Heritage site. Ride through an agro farm, bee farm, bamboo forest, and Jatiluwih Village. Afternoon: check-in at Pullman Bali Legian Beach.', highlights: ['🍳 Breakfast Included', '🍽️ Lunch & Dinner Included', '🚲 UNESCO E-Bike Tour', '🌾 Jatiluwih Village', '🏨 Hotel Move: Pullman Bali'] },
            { title: 'Yacht Day in Bali', body: 'Pickup at 6:30 AM to Sanur Pier. Board at 7:30 AM and cruise to Nusa Lembongan. Step aboard the Utopia Catamaran (8:30 AM–1:30 PM) — welcome drink, snorkeling with equipment and safety gear, curated lunch, GoPro photos & video. Shaded lounges onboard.', highlights: ['🍳 Breakfast & Dinner Included', '⛵ Utopia Catamaran Cruise', '🤿 Snorkeling Included', '🎥 GoPro Photos & Video', '🍹 Welcome Drinks'] },
            { title: "Asia's Hottest Beach Club", body: 'Relaxed breakfast then half day at leisure. Your guide transfers you to Finns Beach Club — one of Bali\'s most iconic beachfront destinations. Lounge by the pool, sip cocktails by the beach, or catch the sunset over the water.', highlights: ['🍳 Breakfast Included', '🏖️ Finns Beach Club', '🌅 Sunset by the Ocean', '🍹 Oceanfront Cocktails'] },
            { title: "This Is Not Goodbye — See You Next Time!", body: 'Final breakfast at the hotel, then leisure hours — last dip in the pool or a beach stroll. Transfer to Ngurah Rai International Airport for departure. Leave with unforgettable memories, new friendships, and a camera roll that will make everyone wish they came.', highlights: ['🍳 Final Breakfast', '🏖️ Leisure Morning', '🚐 Airport Transfer', '✈️ Ngurah Rai International'] }
        ];
        var BALI_INCLUDES = [
            { icon: '🏨', title: 'Accommodation / Lodging', desc: 'Luxury private villa stays and curated boutique accommodations — kept secret until reveal day.' },
            { icon: '🎭', title: 'Events & Activities', desc: '7 carefully curated mystery experiences unveiled throughout the trip.' },
            { icon: '🚐', title: 'Transportation', desc: 'Private transfers and curated transportation for all scheduled group activities.' },
            { icon: '📸', title: 'Professional Photographer', desc: "Liv shoots everything — Sony digital camera, DJI Osmo Pocket, DJI Mini 3 drone. You'll come home with a full camera roll." },
            { icon: '🍽️', title: 'Food & Beverages', desc: 'Welcome drinks, all breakfasts, 2 lunches, and 3 curated group dinners.' },
            { icon: '🥂', title: 'Alcohol', desc: 'Welcome drink on Travel & LIV Collective.' },
            { icon: '🤝', title: 'Community & Connections', desc: 'You may just find your next bestie or boo on this trip.' }
        ];
        var BALI_ROOMS = [
            { title: 'Mystery Trip — Double Occupancy (Bringing a friend/couple)', price: '$2,350', deposit: '$500 deposit · Payment plan available', badge: '' },
            { title: 'Mystery Trip — Double Occupancy (Solo/roommate matching)', price: '$2,400', deposit: '$530 deposit · 3 payments of $623 · No credit check', badge: 'Only 4 remaining!' },
            { title: 'Mystery Trip — Single Occupancy', price: '$2,850', deposit: '$500 deposit · Your own private room', badge: '' }
        ];
        var DEST_DEFAULTS = [
            { slug: 'bali', name: 'Bali, Indonesia', emoji: '🏝️', url: 'bali.html', status: 'booking_open', dates: 'July 30 – Aug 5, 2026', price: 'Starting at $2,350', badge: '🟢 Booking Open', tagline: 'Sacred rice terraces, rooftop infinity pools, volcanic sunrises, and nights you will never forget.', teaserDesc: '7 days of luxury, culture and connection in Bali.', description: 'Your journey begins the moment you arrive, where you will be seamlessly welcomed and transported into nature. Throughout the trip, you will stay in hand-selected 5-star luxury local resorts and private villas, each chosen for their setting, serenity, and wow factor.', squadtrip: 'https://travelnlivcollective.squadtrip.com/trip/travel-liv-collective-signature-mystery-trip-where-luxury-meets-relaxation-and-connection-13016?color=abcca8', days: BALI_DAYS, includes: BALI_INCLUDES, rooms: BALI_ROOMS },
            { slug: 'puntacana', name: 'Punta Cana, D.R.', emoji: '🌴', url: 'puntacana.html', status: 'coming_soon', dates: 'TBA', price: 'TBA', badge: '✈️ Coming Soon — Details Dropping', tagline: 'All trip information will be revealed soon.', teaserDesc: 'The details are being finalized. Expect the same luxury and community.', description: '', squadtrip: '', days: [], includes: [], rooms: [] },
            { slug: 'rio', name: 'Rio de Janeiro, Brazil', emoji: '🎉', url: 'rio.html', status: 'coming_soon', dates: 'TBA', price: 'TBA', badge: '✈️ Coming Soon — Details Dropping', tagline: 'All trip information will be revealed soon.', teaserDesc: 'The details are being finalized. Expect the same luxury and community.', description: '', squadtrip: '', days: [], includes: [], rooms: [] }
        ];

        function getDestinations() {
            try {
                var stored = JSON.parse(localStorage.getItem('DESTINATIONS_LIST') || 'null');
                if (!stored) {
                    // seed defaults on first load
                    stored = DEST_DEFAULTS;
                    localStorage.setItem('DESTINATIONS_LIST', JSON.stringify(stored));
                    stored.forEach(function (d) { localStorage.setItem('DEST_' + d.slug, JSON.stringify(d)); });
                }
                return stored;
            } catch (e) { return DEST_DEFAULTS; }
        }
        // Always ensure individual DEST_ keys exist for trip pages to read
        (function seedDestKeys() {
            try {
                var list = JSON.parse(localStorage.getItem('DESTINATIONS_LIST') || 'null');
                if (!list) return;
                list.forEach(function (d) { localStorage.setItem('DEST_' + d.slug, JSON.stringify(d)); });
            } catch (e) { }
        })();


        function saveDestinations(list) {
            localStorage.setItem('DESTINATIONS_LIST', JSON.stringify(list));
            // Also write individual DEST_ keys so trip pages always have fresh data
            list.forEach(function (d) { localStorage.setItem('DEST_' + d.slug, JSON.stringify(d)); });
            // also save individual DEST_ keys so trip pages can read them
            list.forEach(function (d) {
                localStorage.setItem('DEST_' + d.slug, JSON.stringify(d));
            });
        }

        var STATUS_LABELS = {
            booking_open: '🟢 Booking Open',
            coming_soon: '✈️ Coming Soon',
            sold_out: '🔴 Sold Out',
            concluded: '🏁 Concluded'
        };

  
         var _isReordering = false;
         function toggleDestReorder() {
             _isReordering = !_isReordering;
             var btn = document.getElementById('reorder-dest-btn');
             btn.textContent = _isReordering ? '✓ Finish Rearranging' : '⇅ Rearrange Trip Order';
             btn.className = _isReordering ? 'btn-admin-primary' : 'btn-secondary';
             renderDestList();
         }

         function moveDest(index, direction) {
             var list = getDestinations();
             if (direction === 'up' && index > 0) {
                 var temp = list[index];
                 list[index] = list[index - 1];
                 list[index - 1] = temp;
             } else if (direction === 'down' && index < list.length - 1) {
                 var temp = list[index];
                 list[index] = list[index + 1];
                 list[index + 1] = temp;
             }
             saveDestinations(list);
             renderDestList();
         }

         function renderDestList() {
             var list = getDestinations();
             var el = document.getElementById('dest-list');
             if (!el) return;
             if (!list.length) {
                 el.innerHTML = '<p style="color:#888;font-style:italic;">No destinations yet. Add one below.</p>';
                 return;
             }
             var html = '';
             list.forEach(function(d, i) {
                 var statusColor = d.status === 'booking_open' ? '#4caf72' : d.status === 'concluded' ? '#888' : '#e8a838';
                 html += '<div style="background:var(--bg-2,#1a1a1a);border:1px solid var(--border-color,#2a2a2a);border-radius:12px;padding:20px 24px;display:flex;align-items:center;gap:16px;flex-wrap:wrap;">';
                 
                 if (_isReordering) {
                     html += '<div style="display:flex;flex-direction:column;gap:4px;margin-right:12px;">' +
                             '<button class="btn-secondary" style="padding:4px 8px;font-size:0.7rem;" onclick="moveDest(' + i + ',\'up\')">▲</button>' +
                             '<button class="btn-secondary" style="padding:4px 8px;font-size:0.7rem;" onclick="moveDest(' + i + ',\'down\')">▼</button>' +
                             '</div>';
                 }
                 
                 html += '<div style="font-size:2rem;">' + (d.emoji || '✈️') + '</div>' +
                         '<div style="flex:1;min-width:200px;">' +
                         '<div style="font-weight:700;font-size:1rem;">' + d.name + '</div>' +
                         '<div style="font-size:0.8rem;color:#888;margin-top:2px;">' + d.dates + ' · ' + d.price + '</div>' +
                         '<div style="display:inline-block;margin-top:6px;font-size:0.72rem;font-weight:700;padding:3px 10px;border-radius:999px;background:' + statusColor + '20;color:' + statusColor + ';border:1px solid ' + statusColor + '40;">' + (STATUS_LABELS[d.status] || d.status) + '</div>' +
                         '</div>' +
                         '<div style="display:flex;gap:8px;flex-wrap:wrap;">' +
                         '<a href="' + (d.url || ('/upcomingtrips/' + d.slug)) + '" target="_blank" class="btn-secondary" style="font-size:0.8rem;padding:8px 14px;">🗺️ View Page</a>' +
                         '<button onclick="openEditDest(' + i + ')" class="btn-secondary" style="font-size:0.8rem;padding:8px 14px;">✏️ Edit</button>' +
                         '<button onclick="deleteDest(' + i + ')" style="background:#c0392b;border:none;border-radius:8px;color:#fff;padding:8px 14px;font-size:0.8rem;cursor:pointer;">🗑️ Delete</button>' +
                         '</div>' +
                         '</div>';
             });
             el.innerHTML = html;
         }

         function openAddDestForm() {
            document.getElementById('add-dest-form').style.display = 'block';
            document.getElementById('add-dest-btn').style.display = 'none';
            closeEditDest();
        }
        function closeAddDestForm() {
            document.getElementById('add-dest-form').style.display = 'none';
            document.getElementById('add-dest-btn').style.display = 'flex';
            ['new-dest-name', 'new-dest-slug', 'new-dest-dates', 'new-dest-price', 'new-dest-tagline', 'new-dest-teaser', 'new-dest-emoji'].forEach(function (id) { var el = document.getElementById(id); if (el) el.value = ''; });
        }

        function saveNewDest() {
            var name = (document.getElementById('new-dest-name').value || '').trim();
            var slug = (document.getElementById('new-dest-slug').value || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
            if (!name || !slug) { toast('Name and slug are required.', 'error'); return; }
            var list = getDestinations();
            if (list.find(function (d) { return d.slug === slug; })) { toast('A destination with that slug already exists.', 'error'); return; }
            var status = document.getElementById('new-dest-status').value;
            var newDest = {
                slug: slug,
                name: name,
                emoji: document.getElementById('new-dest-emoji').value || '✈️',
                url: slug + '.html',
                status: status,
                dates: document.getElementById('new-dest-dates').value || 'TBA',
                price: document.getElementById('new-dest-price').value || 'TBA',
                badge: status === 'booking_open' ? '🟢 Booking Open' : '✈️ Coming Soon — Details Dropping',
                tagline: document.getElementById('new-dest-tagline').value || 'All trip information will be revealed soon.',
                teaserDesc: document.getElementById('new-dest-teaser').value || 'The details are being finalized.',
                squadtrip: ''
            };
            list.push(newDest);
            saveDestinations(list);
            renderDestList();
            closeAddDestForm();
            toast('✓ Destination "' + name + '" created! Update the page URL and Squadtrip link in Edit.');
        }

        /* ── ITINERARY EDITOR HELPERS ── */
        function renderItinEditor(days) {
            var c = document.getElementById('itin-editor-list');
            if (!c) return;
            c.innerHTML = '';
            (days || []).forEach(function (day, i) { _addItinRow(day, i); });
        }
        function _addItinRow(day, i) {
            var c = document.getElementById('itin-editor-list');
            var div = document.createElement('div');
            div.style.cssText = 'background:var(--bg-2,#1a1a1a);border:1px solid var(--border-color,#2a2a2a);border-radius:10px;padding:14px 16px;';
            div.innerHTML =
                '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">' +
                '<strong style="font-size:0.85rem;">Day ' + (i + 1) + '</strong>' +
                '<button onclick="this.parentElement.parentElement.remove()" style="background:none;border:none;color:#c0392b;cursor:pointer;font-size:0.8rem;">✕ Remove</button>' +
                '</div>' +
                '<input type="text" placeholder="Day title (e.g. Arrival & Welcome Dinner)" value="' + (day.title || '').replace(/"/g, '&quot;') + '" class="form-control itin-day-title" style="margin-bottom:8px;" />' +
                '<textarea placeholder="Day description..." class="form-control itin-day-body" rows="3" style="margin-bottom:8px;">' + (day.body || '') + '</textarea>' +
                '<input type="text" placeholder="Highlights (comma separated: 🛬 Airport · 🏨 Villa Check-in)" value="' + (day.highlights || []).join(' · ').replace(/"/g, '&quot;') + '" class="form-control itin-day-hl" />';
            div.setAttribute('data-irow', '1');
            c.appendChild(div);
        }
        function addItinDayField() {
            var rows = document.querySelectorAll('#itin-editor-list [data-irow]').length;
            _addItinRow({ title: '', body: '', highlights: [] }, rows);
        }
        function getItinData() {
            var rows = document.querySelectorAll('#itin-editor-list [data-irow]');
            var days = [];
            rows.forEach(function (row) {
                var title = row.querySelector('.itin-day-title').value.trim();
                var body = row.querySelector('.itin-day-body').value.trim();
                var hl = row.querySelector('.itin-day-hl').value.trim();
                days.push({ title: title, body: body, highlights: hl ? hl.split('·').map(function (x) { return x.trim(); }) : [] });
            });
            return days;
        }

        /* ── INCLUDES EDITOR HELPERS ── */
        function renderIncludesEditor(includes) {
            var c = document.getElementById('includes-editor-list');
            if (!c) return;
            c.innerHTML = '';
            (includes || []).forEach(function (inc) { _addIncludeRow(inc); });
        }
        function _addIncludeRow(inc) {
            var c = document.getElementById('includes-editor-list');
            var div = document.createElement('div');
            div.setAttribute('data-inc-row', '1');
            div.style.cssText = 'display:grid;grid-template-columns:60px 1fr 2fr auto;gap:8px;align-items:center;';
            div.innerHTML =
                '<input type="text" value="' + (inc.icon || '').replace(/"/g, '&quot;') + '" placeholder="Icon" class="form-control inc-icon" style="text-align:center;font-size:1.2rem;" />' +
                '<input type="text" value="' + (inc.title || '').replace(/"/g, '&quot;') + '" placeholder="Title" class="form-control inc-title" />' +
                '<input type="text" value="' + (inc.desc || '').replace(/"/g, '&quot;') + '" placeholder="Description" class="form-control inc-desc" />' +
                '<button onclick="this.parentElement.remove()" style="background:none;border:none;color:#c0392b;cursor:pointer;font-size:1rem;">✕</button>';
            c.appendChild(div);
        }
        function addIncludeField() { _addIncludeRow({ icon: '✅', title: '', desc: '' }); }
        function getIncludesData() {
            var rows = document.querySelectorAll('#includes-editor-list [data-inc-row]');
            var list = [];
            rows.forEach(function (row) {
                list.push({
                    icon: row.querySelector('.inc-icon').value.trim(),
                    title: row.querySelector('.inc-title').value.trim(),
                    desc: row.querySelector('.inc-desc').value.trim()
                });
            });
            return list;
        }

        /* ── ROOMS EDITOR HELPERS ── */
        function renderRoomsEditor(rooms) {
            var c = document.getElementById('rooms-editor-list');
            if (!c) return;
            c.innerHTML = '';
            (rooms || []).forEach(function (r) { _addRoomRow(r); });
        }
        function _addRoomRow(r) {
            var c = document.getElementById('rooms-editor-list');
            var div = document.createElement('div');
            div.setAttribute('data-room-row', '1');
            div.style.cssText = 'display:grid;grid-template-columns:2fr 1fr 2fr 80px auto;gap:8px;align-items:center;background:var(--bg-2,#1a1a1a);border:1px solid var(--border-color,#2a2a2a);border-radius:8px;padding:10px 14px;';
            div.innerHTML =
                '<input type="text" value="' + (r.title || '').replace(/"/g, '&quot;') + '" placeholder="Room name" class="form-control room-title" />' +
                '<input type="text" value="' + (r.price || '').replace(/"/g, '&quot;') + '" placeholder="Price ($2,350)" class="form-control room-price" />' +
                '<input type="text" value="' + (r.deposit || '').replace(/"/g, '&quot;') + '" placeholder="Deposit note" class="form-control room-deposit" />' +
                '<input type="text" value="' + (r.badge || '').replace(/"/g, '&quot;') + '" placeholder="Badge" class="form-control room-badge" />' +
                '<button onclick="this.parentElement.remove()" style="background:none;border:none;color:#c0392b;cursor:pointer;font-size:1rem;">✕</button>';
            c.appendChild(div);
        }
        function addRoomField() { _addRoomRow({ title: '', price: '', deposit: '', badge: '' }); }
        function getRoomsData() {
            var rows = document.querySelectorAll('#rooms-editor-list [data-room-row]');
            var list = [];
            rows.forEach(function (row) {
                list.push({
                    title: row.querySelector('.room-title').value.trim(),
                    price: row.querySelector('.room-price').value.trim(),
                    deposit: row.querySelector('.room-deposit').value.trim(),
                    badge: row.querySelector('.room-badge').value.trim()
                });
            });
            return list;
        }

        /* ── OPEN / SAVE / CLOSE ── */
        function openEditDest(idx) {
            var list = getDestinations();
            var d = list[idx];
            if (!d) return;
            document.getElementById('edit-dest-slug-hidden').value = d.slug;
            document.getElementById('edit-dest-name').value = d.name || '';
            document.getElementById('edit-dest-dates').value = d.dates || '';
            document.getElementById('edit-dest-price').value = d.price || '';
            document.getElementById('edit-dest-badge').value = d.badge || '';
            document.getElementById('edit-dest-tagline').value = d.tagline || '';
            document.getElementById('edit-dest-teaser').value = d.teaserDesc || '';
            document.getElementById('edit-dest-url').value = d.url || '';
            document.getElementById('edit-dest-squadtrip').value = d.squadtrip || '';
            document.getElementById('edit-dest-desc').value = d.description || '';
            var sel = document.getElementById('edit-dest-status');
            if (sel) sel.value = d.status || 'coming_soon';
            renderItinEditor(d.days || []);
            renderIncludesEditor(d.includes || []);
            renderRoomsEditor(d.rooms || []);
            document.getElementById('edit-dest-drawer-title').textContent = 'Edit: ' + d.name;
            document.getElementById('dest-edit-drawer').style.display = 'block';
             renderDestPhotoGrid(d.slug);
            setTimeout(function () { document.getElementById('dest-edit-drawer').scrollIntoView({ behavior: 'smooth' }); }, 100);
        }

        function closeEditDest() {
            document.getElementById('dest-edit-drawer').style.display = 'none';
         }
         function renderDestPhotoGrid(slug) {
             var grid = document.getElementById('dest-gallery-grid');
             var stripGrid = document.getElementById('dest-strip-grid');
             if (!grid || !stripGrid) return;
             
             restoreZoneKey(slug + '_card', 'zone-dest-card');
             restoreZoneKey(slug + '_hero', 'zone-dest-hero');
             
             // 1. Gallery Grid (10 photos)
             grid.innerHTML = '';
             var defaults = DEST_GALLERY_DEFAULTS[slug] || [];
             for (var i = 0; i < 10; i++) {
                 var key = slug + '_g_' + i;
                 var stored = localStorage.getItem('tnliv_img_' + key);
                 var displaySrc = stored || defaults[i] || null;
                 var slot = document.createElement('div');
                 var imgHtml = displaySrc
                     ? '<img src="' + displaySrc + '" style="width:100%;height:100%;object-fit:cover;border-radius:6px;" />' + (stored ? '' : '<div style="position:absolute;bottom:0;left:0;right:0;text-align:center;font-size:0.6rem;color:#fff;background:rgba(0,0,0,0.6);padding:2px;border-radius:0 0 6px 6px;">current</div>')
                     : '<div class="img-upload-placeholder" style="gap:2px;"><span style="font-size:1rem;">📷</span><span style="font-size:0.67rem;">Upload</span></div>';
                 
                 slot.innerHTML = '<p style="font-size:0.68rem;color:#888;margin:0 0 4px;text-align:center;">Photo ' + (i + 1) + '</p>' +
                     '<div class="img-upload-zone" id="zone-dg-' + i + '" onclick="openPickerDg(' + i + ')" style="min-height:90px;border-radius:8px;position:relative;overflow:hidden;cursor:pointer;" ' +
                     'draggable="true" ondragstart="handleDragStart(event, \'gallery\', ' + i + ')" ondragover="handleDragOver(event)" ondrop="handleDropSwap(event, \'gallery\', ' + i + ')">' +
                     imgHtml +
                     '</div>' +
                     '<input type="file" id="file-dg-' + i + '" accept="image/*" style="display:none" onchange="handleDestGalleryPick(event,' + i + ')" />';
                 grid.appendChild(slot);
             }

             // 2. Strip Grid (5 photos)
             stripGrid.innerHTML = '';
             var stripDefaults = DEST_GALLERY_DEFAULTS[slug + "_strip"] || [];
             for (var i = 0; i < 5; i++) {
                 var key = slug + '_strip_' + i;
                 var stored = localStorage.getItem('tnliv_img_' + key);
                 var displaySrc = stored || stripDefaults[i] || null;
                 var slot = document.createElement('div');
                 var imgHtml = displaySrc
                     ? '<img src="' + displaySrc + '" style="width:100%;height:100%;object-fit:cover;border-radius:6px;" />' + (stored ? '' : '<div style="position:absolute;bottom:0;left:0;right:0;text-align:center;font-size:0.6rem;color:#fff;background:rgba(0,0,0,0.6);padding:2px;border-radius:0 0 6px 6px;">current</div>')
                     : '<div class="img-upload-placeholder" style="gap:2px;"><span style="font-size:1rem;">📷</span><span style="font-size:0.67rem;">Upload</span></div>';
                 
                 slot.innerHTML = '<p style="font-size:0.68rem;color:#888;margin:0 0 4px;text-align:center;">Photo ' + (i + 1) + '</p>' +
                     '<div class="img-upload-zone" id="zone-ds-' + i + '" onclick="openPickerDs(' + i + ')" style="min-height:80px;border-radius:8px;position:relative;overflow:hidden;cursor:pointer;" ' +
                     'draggable="true" ondragstart="handleDragStart(event, \'strip\', ' + i + ')" ondragover="handleDragOver(event)" ondrop="handleDropSwap(event, \'strip\', ' + i + ')">' +
                     imgHtml +
                     '</div>' +
                     '<input type="file" id="file-ds-' + i + '" accept="image/*" style="display:none" onchange="handleDestStripPick(event,' + i + ')" />';
                 stripGrid.appendChild(slot);
             }
         }

            document.getElementById('dest-edit-drawer').style.display = 'none';
        }

         // ── DESTINATION DEFAULTS (current live images) ────────────────
         var DEST_CARD_DEFAULTS = { bali: 'bali_hero.png', puntacana: null, rio: null };
         var DEST_HERO_DEFAULTS = { bali: 'bali/kelingking-beach-nusa-penida_c3b4aac4-411f-4131-ab9c-705fc53b648f.jpeg', puntacana: null, rio: null };
         var DEST_GALLERY_DEFAULTS = {
             bali: [
                 'bali/kelingking-beach-nusa-penida_c3b4aac4-411f-4131-ab9c-705fc53b648f.jpeg',
                 'bali/jatiluwih-warisan-budaya_f4caf68e-bd5a-4190-834f-4645784211f5.jpeg',
                 'bali/bali-mount-batur-jeep-sunrise-17370345941_831c16a5-8602-4c8a-b439-bc9251c2b50c.jpeg',
                 'bali/utopia-catamaran-floating-beach-club-aerial-view_7d80a1cd-173f-48cf-94ab-ef690209fa34.jpeg',
                 'bali/bali-tegenungan-waterfall_e16b7917-e41a-4766-829a-abaeeb24a256.jpeg',
                 'bali/MountBaturJeepSunriseComboExperienceinBali-KlookUnitedStates_c593a0b2-3eb4-4973-aa28-3e4128bb7787.jpeg',
                 'bali/Finns_5507ce8c-35bc-4059-9e33-63e9b0f552c0.png',
                 'bali/Bali-Nightlife-Featured-image_a2cd03ed-8904-4a76-a030-fe42501455d7.jpeg',
                 'bali/slide2_afcc89ef-2f18-423d-b9bd-cf88edce1482.jpeg',
                 'bali/DSC08538_a040ac40-a59f-49a5-a2d6-ea0f1853a3a9.jpeg'
             ],
             bali_strip: [
                 'bali/kelingking-beach-nusa-penida_c3b4aac4-411f-4131-ab9c-705fc53b648f.jpeg',
                 'bali/jatiluwih-warisan-budaya_f4caf68e-bd5a-4190-834f-4645784211f5.jpeg',
                 'bali/utopia-catamaran-floating-beach-club-aerial-view_7d80a1cd-173f-48cf-94ab-ef690209fa34.jpeg',
                 'bali/bali-mount-batur-jeep-sunrise-17370345941_831c16a5-8602-4c8a-b439-bc9251c2b50c.jpeg',
                 'bali/bali-tegenungan-waterfall_e16b7917-e41a-4766-829a-abaeeb24a256.jpeg'
             ]
         };

         function openPickerDg(idx) {
             var inp = document.getElementById('file-dg-' + idx);
             if (inp) inp.click();
         }

         function restoreZoneKey(key, zoneId) {
             var stored = localStorage.getItem('tnliv_img_' + key);
             // Determine default src from slug + type
             var parts = key.split('_');
             var slug = parts[0];
             var type = parts[1];
             var defaultSrc = type === 'card' ? (DEST_CARD_DEFAULTS[slug] || null)
                            : type === 'hero' ? (DEST_HERO_DEFAULTS[slug] || null) : null;
             var src = stored || defaultSrc;
             if (!src) return;
             var zone = document.getElementById(zoneId);
             if (!zone) return;
             zone.innerHTML = '<div style="position:relative;width:100%;height:100%;">'
                 + '<img src="' + src + '" style="width:100%;height:100%;object-fit:cover;border-radius:6px;" />'
                 + (stored ? '' : '<div style="position:absolute;bottom:6px;left:0;right:0;text-align:center;font-size:0.62rem;color:#ccc;background:rgba(0,0,0,0.6);padding:2px;">current — click to replace</div>')
                 + '</div>';
         }

         function handleDestPhoto(event, type) {
             var slug = document.getElementById('edit-dest-slug-hidden').value;
             var file = event.target.files[0];
             if (!file) return;
             var key = slug + '_' + type;
             var zoneId = type === 'card' ? 'zone-dest-card' : 'zone-dest-hero';
             var reader = new FileReader();
             reader.onload = function (e) {
                 var dataUrl = e.target.result;
                 localStorage.setItem('tnliv_img_' + key, dataUrl);
                 var zone = document.getElementById(zoneId);
                 if (zone) zone.innerHTML = '<img src="' + dataUrl + '" style="width:100%;height:100%;object-fit:cover;border-radius:6px;" />';
                 toast('Uploading ' + type + ' photo...');
                 if (window.publishImage) {
                     window.publishImage(key, dataUrl)
                         .then(function () { toast('\u2705 ' + (type === 'card' ? 'Card' : 'Hero') + ' photo is now live!'); })
                         .catch(function (err) { toast('Saved locally. ' + err.message, 'error'); });
                 }
             };
             reader.readAsDataURL(file);
         }

   
         // ── DRAG & SWAP FOR PHOTOS ───────────────────────────────
         var _dragSource = null;
         function handleDragStart(e, type, idx) {
             _dragSource = { type: type, idx: idx };
             e.dataTransfer.setData('text/plain', idx);
         }
         function handleDragOver(e) {
             e.preventDefault();
         }
         function handleDropSwap(e, type, targetIdx) {
             e.preventDefault();
             if (!_dragSource || _dragSource.type !== type || _dragSource.idx === targetIdx) return;
             
             var slug = document.getElementById('edit-dest-slug-hidden').value;
             var sourceIdx = _dragSource.idx;
             var keyPart = (type === "gallery" ? "_g_" : "_strip_");
             
             var sourceKey = slug + keyPart + sourceIdx;
             var targetKey = slug + keyPart + targetIdx;
             
             // Swap in local storage
             var sourceVal = localStorage.getItem('tnliv_img_' + sourceKey);
             var targetVal = localStorage.getItem('tnliv_img_' + targetKey);
             
             // Fallback to defaults if null
             if (!sourceVal) sourceVal = (type === "gallery" ? DEST_GALLERY_DEFAULTS[slug][sourceIdx] : DEST_GALLERY_DEFAULTS[slug + "_strip"][sourceIdx]);
             if (!targetVal) targetVal = (type === "gallery" ? DEST_GALLERY_DEFAULTS[slug][targetIdx] : DEST_GALLERY_DEFAULTS[slug + "_strip"][targetIdx]);
             
             localStorage.setItem('tnliv_img_' + sourceKey, targetVal);
             localStorage.setItem('tnliv_img_' + targetKey, sourceVal);
             
             toast('Swapped photos...');
             
             // If we have data URLs, we should probably publish them too
             if (window.publishImage) {
                 Promise.all([
                     window.publishImage(sourceKey, targetVal),
                     window.publishImage(targetKey, sourceVal)
                 ]).then(function() { toast('✅ Order saved to GitHub'); });
             }
             
             renderDestPhotoGrid(slug);
             _dragSource = null;
         }

         function handleDestStripPick(event, idx) {
             var slug = document.getElementById('edit-dest-slug-hidden').value;
             var file = event.target.files[0];
             if (!file) return;
             var key = slug + '_strip_' + idx;
             var reader = new FileReader();
             reader.onload = function (e) {
                 var dataUrl = e.target.result;
                 localStorage.setItem('tnliv_img_' + key, dataUrl);
                 renderDestPhotoGrid(slug);
                 toast('Uploading strip photo ' + (idx + 1) + '...');
                 if (window.publishImage) {
                     window.publishImage(key, dataUrl)
                         .then(function () { toast('\u2705 Strip photo ' + (idx + 1) + ' live!'); });
                 }
             };
             reader.readAsDataURL(file);
         }

         function openPickerDs(idx) {
             var inp = document.getElementById('file-ds-' + idx);
             if (inp) inp.click();
         }

         function handleDestGalleryPick(event, idx) {
             var slug = document.getElementById('edit-dest-slug-hidden').value;
             var file = event.target.files[0];
             if (!file) return;
             var key = slug + '_g_' + idx;
             var reader = new FileReader();
             reader.onload = function (e) {
                 var dataUrl = e.target.result;
                 localStorage.setItem('tnliv_img_' + key, dataUrl);
                 var zone = document.getElementById('zone-dg-' + idx);
                 if (zone) zone.innerHTML = '<img src="' + dataUrl + '" style="width:100%;height:100%;object-fit:cover;border-radius:6px;" />';
                 toast('Uploading gallery photo ' + (idx + 1) + '...');
                 if (window.publishImage) {
                     window.publishImage(key, dataUrl)
                         .then(function () { toast('\u2705 Gallery photo ' + (idx + 1) + ' is now live!'); })
                         .catch(function (err) { toast('Saved locally. ' + err.message, 'error'); });
                 }
             };
             reader.readAsDataURL(file);
         }


        function saveEditDest() {
            var slug = document.getElementById('edit-dest-slug-hidden').value;
            var list = getDestinations();
            var idx = list.findIndex(function (d) { return d.slug === slug; });
            if (idx < 0) { toast('Destination not found.', 'error'); return; }
            list[idx].name = document.getElementById('edit-dest-name').value;
            list[idx].dates = document.getElementById('edit-dest-dates').value;
            list[idx].price = document.getElementById('edit-dest-price').value;
            list[idx].badge = document.getElementById('edit-dest-badge').value;
            list[idx].tagline = document.getElementById('edit-dest-tagline').value;
            list[idx].teaserDesc = document.getElementById('edit-dest-teaser').value;
            list[idx].url = document.getElementById('edit-dest-url').value;
            list[idx].squadtrip = document.getElementById('edit-dest-squadtrip').value;
            list[idx].description = document.getElementById('edit-dest-desc').value;
            list[idx].status = document.getElementById('edit-dest-status').value;
            list[idx].days = getItinData();
            list[idx].includes = getIncludesData();
            list[idx].rooms = getRoomsData();
            saveDestinations(list);
            renderDestList();
            closeEditDest();
            toast('✓ "' + list[idx].name + '" — all changes saved and live!');
        }

        function deleteDest(idx) {
            var list = getDestinations();
            var d = list[idx];
            if (!d) return;
            if (!confirm('Delete "' + d.name + '"? This removes it from admin and the nav dropdown. The .html page stays live but will not appear in the dropdown.')) return;
            list.splice(idx, 1);
            saveDestinations(list);
            localStorage.removeItem('DEST_' + d.slug);
            renderDestList();
            toast('"' + d.name + '" removed from destinations.');
        }

        // Hook into showPanel to render destinations list when opened
        var _origShowPanel = showPanel;
        showPanel = function (id) {
            _origShowPanel(id);
            if (id === 'destinations') renderDestList();
            if (id === 'about') { loadAboutFields(); renderPastTripsAdmin(); renderAutoArchiveCandidates(); }
        };

        // ============================================================
        // ABOUT PAGE ADMIN
        // ============================================================

        // ── Inject the About panel HTML into <main> ──────────────────
        (function injectAboutPanel() {
            var main = document.querySelector('.admin-main');
            if (!main) return;
            var div = document.createElement('div');
            div.className = 'admin-panel';
            div.id = 'panel-about';
            div.innerHTML = `

<!-- ── SECTION: FOUNDER BIO ── -->
<div class="panel-section">
  <div class="panel-section-header">
    <div class="panel-section-icon">✍️</div>
    <div>
      <div class="panel-section-title">Founder Bio (About Page)</div>
      <div class="panel-section-desc">Edit Olivia's story — each paragraph is editable separately</div>
    </div>
  </div>
  <div class="form-group">
    <label>Founder Quote <small style="color:#888">(shown in the floating card on her photo)</small></label>
    <input type="text" id="ab-quote" class="form-control" placeholder="You arrive as a stranger. You leave as a community." />
  </div>
  <div class="form-group">
    <label>Paragraph 1</label>
    <textarea id="ab-p1" class="form-control" rows="3"></textarea>
  </div>
  <div class="form-group">
    <label>Paragraph 2</label>
    <textarea id="ab-p2" class="form-control" rows="3"></textarea>
  </div>
  <div class="form-group">
    <label>Paragraph 3</label>
    <textarea id="ab-p3" class="form-control" rows="3"></textarea>
  </div>
  <div class="form-group">
    <label>Paragraph 4</label>
    <textarea id="ab-p4" class="form-control" rows="3"></textarea>
  </div>
  <div class="form-group">
    <label>Paragraph 5 (Closing / Goal Statement)</label>
    <textarea id="ab-p5" class="form-control" rows="2"></textarea>
  </div>
  <div style="margin-top:8px;"><button class="btn-admin-primary" onclick="saveBio()">💾 Save Bio</button></div>
</div>

<!-- ── SECTION: PAST TRIPS ── -->
<div class="panel-section" style="margin-top:24px;">
  <div class="panel-section-header">
    <div class="panel-section-icon">🏁</div>
    <div>
      <div class="panel-section-title">Past Trips (About Page)</div>
      <div class="panel-section-desc">Add, edit, or remove past trip cards shown in the "Where We've Been" section</div>
    </div>
  </div>

  <div id="past-trips-admin-list" style="display:flex;flex-direction:column;gap:16px;margin-top:16px;"></div>

  <!-- Add New Past Trip Form -->
  <div style="margin-top:20px;">
    <button class="btn-admin-primary" onclick="openAddPastTripForm()" id="add-past-trip-btn" style="display:flex;align-items:center;gap:8px;">➕ Add Past Trip</button>
  </div>
  <div id="add-past-trip-form" style="display:none;margin-top:20px;background:var(--bg-2,#1a1a1a);border:1px solid var(--border-color,#2a2a2a);border-radius:12px;padding:24px;">
    <h3 style="margin-bottom:16px;font-size:1rem;">New Past Trip</h3>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
      <div class="form-group"><label>Tag Label <small style="color:#888">(e.g. China)</small></label><input type="text" id="npt-label" class="form-control" placeholder="China" /></div>
      <div class="form-group"><label>Card Title</label><input type="text" id="npt-title" class="form-control" placeholder="China 2026" /></div>
      <div class="form-group"><label>Month / Year</label><input type="text" id="npt-month" class="form-control" placeholder="March 2026" /></div>
      <div class="form-group"><label>Duration</label><input type="text" id="npt-duration" class="form-control" placeholder="14 Days" /></div>
      <div class="form-group"><label>Traveler Count</label><input type="text" id="npt-travelers" class="form-control" placeholder="20+ Travelers" /></div>
      <div class="form-group"><label>Video File <small style="color:#888">(filename in project, if any)</small></label><input type="text" id="npt-video" class="form-control" placeholder="worldstallestelevator.mp4" /></div>
      <div class="form-group" style="grid-column:span 2;"><label>Description</label><textarea id="npt-desc" class="form-control" rows="3" placeholder="A description of the trip..."></textarea></div>
    </div>
    <div style="display:flex;gap:12px;margin-top:16px;">
      <button class="btn-admin-primary" onclick="saveNewPastTrip()">✓ Add Past Trip</button>
      <button class="btn-secondary" onclick="closeAddPastTripForm()">Cancel</button>
    </div>
  </div>

  <!-- Edit Past Trip Form -->
  <div id="edit-past-trip-form" style="display:none;margin-top:20px;background:var(--bg-2,#1a1a1a);border:1px solid var(--border-color,#2a2a2a);border-radius:12px;padding:24px;">
    <h3 style="margin-bottom:16px;font-size:1rem;">✏️ Edit Past Trip</h3>
    <input type="hidden" id="ept-id" />
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
      <div class="form-group"><label>Tag Label</label><input type="text" id="ept-label" class="form-control" /></div>
      <div class="form-group"><label>Card Title</label><input type="text" id="ept-title" class="form-control" /></div>
      <div class="form-group"><label>Month / Year</label><input type="text" id="ept-month" class="form-control" /></div>
      <div class="form-group"><label>Duration</label><input type="text" id="ept-duration" class="form-control" /></div>
      <div class="form-group"><label>Traveler Count</label><input type="text" id="ept-travelers" class="form-control" /></div>
      <div class="form-group"><label>Video File <small style="color:#888">(filename, optional)</small></label><input type="text" id="ept-video" class="form-control" /></div>
      <div class="form-group" style="grid-column:span 2;"><label>Description</label><textarea id="ept-desc" class="form-control" rows="3"></textarea></div>
    </div>
    <div style="display:flex;gap:12px;margin-top:16px;">
      <button class="btn-admin-primary" onclick="saveEditPastTrip()">✓ Save Changes</button>
      <button class="btn-secondary" onclick="closeEditPastTripForm()">Cancel</button>
    </div>
  </div>
</div>

<!-- ── SECTION: AUTO-ARCHIVE ── -->
<div class="panel-section" style="margin-top:24px;">
  <div class="panel-section-header">
    <div class="panel-section-icon">🔄</div>
    <div>
      <div class="panel-section-title">Auto-Archive: Promote Upcoming → Past Trips</div>
      <div class="panel-section-desc">Upcoming trips whose end date has passed will appear here. Promote them to the Past Trips section with one click — they'll show up on the About page automatically.</div>
    </div>
  </div>
  <div id="auto-archive-candidates" style="margin-top:16px;"></div>
</div>

`;
            main.appendChild(div);
        })();

        // ── Bio load/save ────────────────────────────────────────────
        function loadAboutFields() {
            var cfg = getSiteConfig();
            var bio = cfg.aboutBio || TNLIV_DEFAULTS.aboutBio;
            var set = function (id, val) { var el = document.getElementById(id); if (el) el.value = val || ''; };
            set('ab-quote', bio.founderQuote);
            set('ab-p1', bio.para1); set('ab-p2', bio.para2); set('ab-p3', bio.para3);
            set('ab-p4', bio.para4); set('ab-p5', bio.para5);
        }
        function saveBio() {
            var cfg = getSiteConfig();
            var get = function (id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; };
            cfg.aboutBio = {
                founderQuote: get('ab-quote'),
                para1: get('ab-p1'), para2: get('ab-p2'), para3: get('ab-p3'),
                para4: get('ab-p4'), para5: get('ab-p5'),
            };
            saveSiteConfig(cfg);
            toast('✓ Bio saved! Reload the About page to see the update.');
        }

        // ── Past Trips helpers ───────────────────────────────────────
        function getPastTrips() {
            var cfg = getSiteConfig();
            return Array.isArray(cfg.pastTrips) ? cfg.pastTrips : JSON.parse(JSON.stringify(TNLIV_DEFAULTS.pastTrips));
        }
        function savePastTrips(list) {
            var cfg = getSiteConfig();
            cfg.pastTrips = list;
            saveSiteConfig(cfg);
        }

        function renderPastTripsAdmin() {
            var el = document.getElementById('past-trips-admin-list');
            if (!el) return;
            var list = getPastTrips();
            if (!list.length) {
                el.innerHTML = '<p style="color:#888;font-style:italic;">No past trips yet. Add one below or promote an upcoming trip.</p>';
                return;
            }
            el.innerHTML = list.map(function (t, i) {
                    '<div style="font-size:1.8rem;">🏁</div>' +
                    '<div style="flex:1;min-width:200px;">' +
                    '<div style="font-weight:700;font-size:1rem;">' + (t.title || 'Untitled') + '</div>' +
                    '<div style="font-size:0.8rem;color:#888;margin-top:2px;">' + (t.monthYear || '') + ' · ' + (t.duration || '') + ' · ' + (t.travelerCount || '') + '</div>' +
                    '<div style="font-size:0.78rem;color:#aaa;margin-top:6px;max-width:440px;">' + (t.description || '').slice(0, 120) + (t.description && t.description.length > 120 ? '…' : '') + '</div>' +
                    (t.autoArchived ? '<div style="font-size:0.72rem;color:#8FBF9F;margin-top:4px;">⚡ Auto-archived from upcoming trips</div>' : '') +
                    '</div>' +
                    '<div style="display:flex;gap:8px;flex-wrap:wrap;">' +
                    '<button onclick="openEditPastTripForm(' + i + ')" class="btn-secondary" style="font-size:0.8rem;padding:8px 14px;">✏️ Edit</button>' +
                    '<button onclick="deletePastTrip(' + i + ')" style="background:#c0392b;border:none;border-radius:8px;color:#fff;padding:8px 14px;font-size:0.8rem;cursor:pointer;">🗑️ Delete</button>' +
                    '</div></div>';
            }).join('');
        }

        // ── Add past trip ────────────────────────────────────────────
        function openAddPastTripForm() {
            document.getElementById('add-past-trip-form').style.display = 'block';
            document.getElementById('add-past-trip-btn').style.display = 'none';
            closeEditPastTripForm();
        }
        function closeAddPastTripForm() {
            document.getElementById('add-past-trip-form').style.display = 'none';
            document.getElementById('add-past-trip-btn').style.display = 'flex';
            ['npt-label', 'npt-title', 'npt-month', 'npt-duration', 'npt-travelers', 'npt-video', 'npt-desc'].forEach(function (id) { var el = document.getElementById(id); if (el) el.value = ''; });
        }
        function saveNewPastTrip() {
            var title = (document.getElementById('npt-title').value || '').trim();
            if (!title) { toast('Title is required.', 'error'); return; }
            var list = getPastTrips();
            list.push({
                id: 'pt-' + Date.now(),
                label: (document.getElementById('npt-label').value || '').trim() || title,
                title: title,
                description: (document.getElementById('npt-desc').value || '').trim(),
                monthYear: (document.getElementById('npt-month').value || '').trim(),
                duration: (document.getElementById('npt-duration').value || '').trim(),
                travelerCount: (document.getElementById('npt-travelers').value || '').trim(),
                videoSrc: (document.getElementById('npt-video').value || '').trim(),
                heroImage: '',
                autoArchived: false,
                sourceSlug: '',
            });
            savePastTrips(list);
            renderPastTripsAdmin();
            renderAutoArchiveCandidates();
            closeAddPastTripForm();
            toast('✓ Past trip added! Reload the About page to see it.');
        }

        // ── Edit past trip ───────────────────────────────────────────
        function openEditPastTripForm(idx) {
            var list = getPastTrips();
            var t = list[idx];
            if (!t) return;
            closeAddPastTripForm();
            document.getElementById('ept-id').value = t.id;
            var set = function (id, val) { var el = document.getElementById(id); if (el) el.value = val || ''; };
            set('ept-label', t.label); set('ept-title', t.title);
            set('ept-month', t.monthYear); set('ept-duration', t.duration);
            set('ept-travelers', t.travelerCount); set('ept-video', t.videoSrc);
            set('ept-desc', t.description);
            document.getElementById('edit-past-trip-form').style.display = 'block';
            setTimeout(function () { document.getElementById('edit-past-trip-form').scrollIntoView({ behavior: 'smooth' }); }, 80);
        }
        function closeEditPastTripForm() {
            var f = document.getElementById('edit-past-trip-form');
            if (f) f.style.display = 'none';
        }
        function saveEditPastTrip() {
            var id = (document.getElementById('ept-id').value || '').trim();
            var list = getPastTrips();
            var idx = list.findIndex(function (t) { return t.id === id; });
            if (idx < 0) { toast('Trip not found.', 'error'); return; }
            var get = function (eid) { var el = document.getElementById(eid); return el ? el.value.trim() : ''; };
            list[idx].label = get('ept-label');
            list[idx].title = get('ept-title');
            list[idx].monthYear = get('ept-month');
            list[idx].duration = get('ept-duration');
            list[idx].travelerCount = get('ept-travelers');
            list[idx].videoSrc = get('ept-video');
            list[idx].description = get('ept-desc');
            savePastTrips(list);
            renderPastTripsAdmin();
            closeEditPastTripForm();
            toast('✓ Past trip updated! Reload the About page to see it.');
        }
        function deletePastTrip(idx) {
            var list = getPastTrips();
            var t = list[idx];
            if (!t) return;
            if (!confirm('Delete "' + t.title + '" from past trips?')) return;
            list.splice(idx, 1);
            savePastTrips(list);
            renderPastTripsAdmin();
            toast('"' + t.title + '" removed from past trips.');
        }

        // ── Auto-Archive: eligible upcoming trips ────────────────────
        function renderAutoArchiveCandidates() {
            var el = document.getElementById('auto-archive-candidates');
            if (!el) return;
            var dests = getDestinations();
            var pastTrips = getPastTrips();
            var pastSlugs = pastTrips.map(function (t) { return t.sourceSlug; }).filter(Boolean);
            var today = new Date();
            today.setHours(0, 0, 0, 0);

            // A destination may be manually archived (status 'concluded') or its dates may have passed
            var candidates = dests.filter(function (d) {
                if (pastSlugs.indexOf(d.slug) >= 0) return false; // already archived
                // Check status first — concluded is always a candidate
                if (d.status === 'concluded') return true;
                // Try to parse end date from dates string
                var endDate = parseEndDate(d.dates);
                if (endDate && endDate < today) return true;
                return false;
            });

            if (!candidates.length) {
                el.innerHTML = '<p style="color:#888;font-style:italic;">No concluded or past-date upcoming trips found. When a trip\'s end date passes, it will appear here automatically.</p>';
                return;
            }
            el.innerHTML = '<p style="font-size:0.82rem;color:#888;margin-bottom:16px;">The trips below have either been marked as <strong style="color:#e8a838;">Concluded</strong> or their dates have passed. Promote them to Past Trips with one click.</p>' +
                candidates.map(function (d) {
                        '<div style="font-size:1.6rem;">' + (d.emoji || '✈️') + '</div>' +
                        '<div style="flex:1;min-width:180px;">' +
                        '<div style="font-weight:700;">' + d.name + '</div>' +
                        '<div style="font-size:0.8rem;color:#888;margin-top:2px;">' + d.dates + '</div>' +
                        '<div style="font-size:0.72rem;color:#e8a838;margin-top:4px;">' + (d.status === 'concluded' ? '🏁 Marked as Concluded' : '⏰ Dates have passed') + '</div>' +
                        '</div>' +
                        '<button onclick="promoteToParst(\'' + d.slug + '\')" class="btn-admin-primary" style="font-size:0.82rem;padding:10px 18px;">▶ Promote to Past Trips</button>' +
                        '</div>';
                }).join('');
        }

        // Parse the end date from a dates string like "July 30 – Aug 5, 2026" or "March 2026"
        function parseEndDate(datesStr) {
            if (!datesStr || datesStr === 'TBA') return null;
            try {
                // Try to get the last date mentioned (right side of range, or only date)
                var s = datesStr.replace(/\u2013|\u2014/g, '-').split('-').pop().trim();
                // If it's just "Month Year" like "October 2026"
                var d = new Date(s);
                if (!isNaN(d)) return d;
                // Try prepending the year from datesStr
                var yearMatch = datesStr.match(/(\d{4})/);
                if (yearMatch) { d = new Date(s + ' ' + yearMatch[1]); if (!isNaN(d)) return d; }
            } catch (e) { }
            return null;
        }

        function promoteToParst(slug) {
            var dests = getDestinations();
            var d = dests.find(function (x) { return x.slug === slug; });
            if (!d) { toast('Destination not found.', 'error'); return; }
            var list = getPastTrips();
            // Prevent duplicate
            if (list.find(function (t) { return t.sourceSlug === slug; })) {
                toast('This trip is already in past trips!', 'error'); return;
            }
            var newPast = {
                id: 'pt-' + slug + '-' + Date.now(),
                label: d.emoji ? d.emoji + ' ' + (d.name.split(',')[0]) : d.name.split(',')[0],
                title: d.name.split(',')[0] + ' ' + (d.dates.match(/(\d{4})/) ? d.dates.match(/(\d{4})/)[1] : ''),
                description: d.teaserDesc || d.tagline || '',
                monthYear: d.dates,
                duration: d.duration || '',
                travelerCount: '',
                videoSrc: '',
                heroImage: d.image || '',
                autoArchived: true,
                sourceSlug: slug,
            };
            list.push(newPast);
            savePastTrips(list);
            // Optionally mark source as concluded
            var dIdx = dests.findIndex(function (x) { return x.slug === slug; });
            if (dIdx >= 0 && dests[dIdx].status !== 'concluded') {
                dests[dIdx].status = 'concluded';
                saveDestinations(dests);
            }
            renderPastTripsAdmin();
            renderAutoArchiveCandidates();
            toast('✓ "' + d.name + '" promoted to Past Trips! Edit it to add duration, traveler count, and full description.');
        }

        // ── INIT ──────────────────────────────────────────────────────
        checkLogin();
    