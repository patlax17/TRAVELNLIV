# Travel & LIV Collective — Website Documentation
*Last updated: April 24, 2026*

---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Core Functionalities](#2-core-functionalities)
3. [How to Use the Admin Panel](#3-how-to-use-the-admin-panel)
4. [Deployment: GitHub → Vercel](#4-deployment-github--vercel)
5. [Domain Migration: Squarespace → Vercel](#5-domain-migration-squarespace--vercel)
6. [File Structure Reference](#6-file-structure-reference)

---

## 1. Project Overview

**Travel & LIV Collective** is a fully static, self-hosted website built with HTML, CSS, and JavaScript. It requires **no server, no database, and no monthly platform fees**. The site is deployed via [Vercel](https://vercel.com) and connects to your custom domain `travelnliv.com`.

All editable content (trip details, social links, pixel IDs) is controlled through a password-protected **Admin Dashboard** (`/admin.html`) that stores changes in your browser's localStorage and applies them site-wide in real time.

---

## 2. Core Functionalities

### 🏠 Landing Page (`index.html`)
- **Hero section** with the Zanzibar photo and animated headline.
- **Marquee ticker** displaying brand values (curated experiences, flexible payments, etc.).
- **"Who We Are"** section with the brand video (`travelnliv_who.mp4`).
- **Social Proof** photo grid — 10 real China trip photos.
- **Launch Party Recap** — cinematic 7-photo grid, fully admin-controllable.
- **"Where We're Going Next"** featured trip card — pulls live from the Admin Panel.
- **Squadtrip Inline Booking Widget** — drops down directly on the page when a visitor clicks "Reserve Your Spot." No redirect needed.
- **"Why Travel & LIV"** trust-building section (4 value cards).
- **Final CTA** with social links (Instagram, TikTok, Facebook, WhatsApp).

### 🌍 Community Hub & Upcoming Trips (`upcoming.html`)
- Displays all 3 upcoming trips (Bali, Punta Cana, Rio).
- Each trip card shows its current status: **Booking Open**, **Coming Soon**, or **Hidden**.
- The Bali card includes the inline Squadtrip booking widget.
- Status badges and content controlled entirely through the Admin Panel.

### 🔐 Admin Dashboard (`admin.html`)
- Password-protected (default: `travelnliv2026` — change immediately after launch).
- Manage: homepage next trip card, past event recap, all 3 upcoming trips, events section, FAQs, gallery stats, social/contact links, and ad tracking pixels.
- Changes save to `localStorage` and apply site-wide instantly.
- Export/import config as JSON for backup.

### 📸 High-Res Gallery (`gallery.html`)
- Showcases all China trip photos plus launch party photos.
- Each photo has a **high-res download button** — visitors can download the full-quality file.
- Gallery stats (photo count, destinations, trips) are editable from the Admin Panel under **Gallery**.

### 📊 Marketing & Ad Tracking (`tracking.js`)
- Reads Pixel IDs from localStorage (set in Admin Panel → Marketing & Analytics).
- **Meta (Facebook/Instagram) Pixel** — tracks PageView on every page automatically.
- **TikTok Pixel** — same behavior.
- **Google Tag Manager** — injects your GTM container on every page.
- **MailerLite** — newsletter signups powered by your MailerLite account (ID: `2007153`).
- All scripts load **asynchronously** — zero impact on page speed.
- To activate: go to Admin Panel → Marketing & Analytics → paste your Pixel IDs → Save.

### ℹ️ About Page (`about.html`)
- Olivia's founder bio (editable from Admin → About Page).
- Community photo block (cinematic 3-column layout).
- Past Trips section (China 2026 with 11 photos + video).
- Upcoming trips preview (Bali, Punta Cana, Rio cards).

### ❓ FAQs Page (`faqs.html`)
- 4 FAQ categories: General, Trips, Booking, Contact.
- Accordion expand/collapse — all questions editable from Admin → FAQs.

### 🤝 Partnerships Page (`partnerships.html`)
- Static partner pitch page — update content directly in the HTML file.

---

## 3. How to Use the Admin Panel

### Accessing the Admin Panel
1. Go to `https://travelnliv.com/admin.html`
2. Enter the admin password (`travelnliv2026` by default — **change this first!**)
3. You're in. Changes save automatically to your browser on that device.

> ⚠️ **Important:** The Admin Panel stores data in your browser's localStorage. If you clear your browser data, changes will reset to defaults. Use **Settings → Export Config JSON** to back up your settings before clearing your browser.

---

### Updating a Trip (e.g., flipping Punta Cana to "Booking Open")

1. Click **Destinations & Trips** in the left sidebar.
2. Find the trip card (Trip 1 = Bali, Trip 2 = Punta Cana, Trip 3 = Rio).
3. Change the **Status** dropdown from `🟡 Coming Soon` to `🟢 Booking Open`.
4. Update the **Exact Dates**, **Price Display**, and **CTA Button URL** with the Squadtrip link.
5. Click **Save Changes** (top right).

The trip page, upcoming page, and homepage card will all update instantly.

---

### Updating the Squadtrip Booking Widget URL

When a new trip goes on sale via Squadtrip:
1. Go to Admin → **Homepage** panel.
2. Find the **Squadtrip Booking URL** field.
3. Paste the new Squadtrip `https://` link.
4. Click **Save Changes**.

The "Reserve Your Spot" booking iframe on the homepage will now load the new trip automatically.

---

### Setting/Changing Pixel IDs

1. Go to Admin → **Marketing & Analytics**.
2. Paste your ID into the correct field:
   - **Meta Pixel ID** — numeric only (e.g., `1234567890123456`)
   - **TikTok Pixel ID** — alphanumeric (e.g., `C9ABCDE12345`)
   - **Google Tag Manager** — with prefix (e.g., `GTM-XXXXXXX`)
3. Click **💾 Save Configuration**.

Tracking fires on every page visit from that point forward.

---

### Changing the Admin Password

1. Go to Admin → **Settings**.
2. Enter and confirm your new password.
3. Click **Update Password**.

The new password is stored in localStorage. If you forget it, you can reset it from the browser console: `localStorage.removeItem('tnliv_admin_pass');` and the default `travelnliv2026` will apply again.

---

## 4. Deployment: GitHub → Vercel

### Step 1: Push to GitHub

If you haven't already set up Git:
```bash
# Open Terminal, navigate to the project folder
cd ~/Desktop/TRAVELNLIV

# Initialize git (if not already done)
git init

# Connect to your GitHub repository
git remote add origin https://github.com/YOUR-USERNAME/TRAVELNLIV.git

# Stage, commit, and push
git add .
git commit -m "Initial launch commit"
git push -u origin main
```

If you've already connected and just want to push updates:
```bash
cd ~/Desktop/TRAVELNLIV
git add .
git commit -m "Update content"
git push
```

---

### Step 2: Deploy on Vercel

1. Go to [https://vercel.com](https://vercel.com) and sign in with your GitHub account.
2. Click **"Add New Project"**.
3. Select your **TRAVELNLIV** repository from the list.
4. Vercel will auto-detect it as a static site. **No build settings needed.**
   - Framework Preset: **Other**
   - Build Command: *(leave blank)*
   - Output Directory: *(leave blank / use `.`)*
5. Click **Deploy**.

Your site will be live at a `vercel.app` URL within ~30 seconds.

---

### Step 3: Future Updates

Every time you push to GitHub, Vercel will automatically re-deploy. No manual action needed.

```bash
git add .
git commit -m "Updated Bali trip dates"
git push
```

---

## 5. Domain Migration: Squarespace → Vercel

> This process moves your `travelnliv.com` domain from Squarespace to point at your new Vercel site. DNS changes typically take **15 minutes to 2 hours** to propagate worldwide.

---

### Step 1: Add Your Domain to Vercel

1. In your Vercel dashboard, open the **TRAVELNLIV** project.
2. Go to **Settings → Domains**.
3. Click **"Add Domain"** and enter: `travelnliv.com`
4. Also add `www.travelnliv.com` (Vercel will redirect it to the apex domain automatically).
5. Vercel will show you the DNS records you need to add. Copy them — you'll need them in Step 3.

---

### Step 2: Unlock the Domain in Squarespace

1. Log in to [Squarespace](https://account.squarespace.com).
2. Go to **Domains** → click `travelnliv.com`.
3. Go to **DNS Settings** (not Transfer!). You're NOT transferring the domain registrar — just changing where it points.

---

### Step 3: Update DNS Records

In your Squarespace DNS settings (or your domain registrar's DNS panel), you need to:

**Delete or replace any existing A records / CNAME for `@` and `www`**, then add:

| Type  | Name | Value |
|-------|------|-------|
| `A`   | `@`  | `76.76.21.21` *(Vercel's IP)* |
| `CNAME` | `www` | `cname.vercel-dns.com` |

> **If Squarespace manages your DNS** (likely), you edit these records directly in Squarespace → Domains → DNS Settings → Custom Records.

> **If your domain is registered elsewhere** (GoDaddy, Namecheap, etc.) but connected to Squarespace, log in to that registrar and update DNS there.

---

### Step 4: Verify in Vercel

1. Return to **Vercel → Settings → Domains**.
2. Within 5–30 minutes, both `travelnliv.com` and `www.travelnliv.com` should show a green ✅ checkmark.
3. Vercel will also automatically provision an **SSL certificate** (HTTPS) — no action needed.

---

### Step 5: Disconnect from Squarespace (After Vercel is confirmed live)

Once `travelnliv.com` loads your new site correctly:
1. In Squarespace, go to **Pages** and verify no Squarespace content is showing at your domain.
2. You may **cancel your Squarespace subscription** to stop billing.
3. Your domain registration will continue to auto-renew through whatever registrar you used — this is independent of Squarespace's hosting product.

---

## 6. File Structure Reference

```
TRAVELNLIV/
├── index.html          # Homepage (Landing Page)
├── about.html          # Founder story, past trips, upcoming preview
├── upcoming.html       # All 3 upcoming trips with booking toggle
├── gallery.html        # High-res photo gallery (download-enabled)
├── faqs.html           # FAQ accordion page
├── partnerships.html   # Partner/sponsor pitch page
├── admin.html          # Password-protected Admin Dashboard
├── bali.html           # Bali individual trip page
├── puntacana.html      # Punta Cana individual trip page
├── rio.html            # Rio de Janeiro individual trip page
├── zanzibar.html       # Zanzibar trip page (archived/reference)
├── trip.html           # Legacy trip template
│
├── styles.css          # ★ Global design system (colors, fonts, layout)
├── home.css            # Homepage-specific styles
├── about.css           # About page styles
├── gallery.css         # Gallery page styles
├── faqs.css            # FAQs page styles
├── admin.css           # Admin dashboard styles
├── upcoming.css        # Upcoming trips page styles
├── zanzibar.css        # Zanzibar page styles
│
├── main.js             # Shared JS (nav, scroll, mobile menu, video, modals)
├── site-config.js      # ★ All default content + Admin Panel save/load helpers
├── site-defaults.js    # Destination data defaults (Bali, Punta Cana, Rio)
├── content-loader.js   # Reads localStorage config and applies it to the DOM
├── dest-sync.js        # Syncs destination localStorage → individual trip pages
├── tracking.js         # ★ Ad pixel injector (Meta, TikTok, GTM, MailerLite)
├── gallery.js          # Gallery lightbox + download logic
│
├── logo.jpg            # Brand logo
├── olivia_photo.jpg    # Founder photo (About page)
├── travelnliv_who.mp4  # "Who We Are" brand video
├── bali_hero.png       # Bali hero image
├── punta_cana_hero.png # Punta Cana hero image
├── rio_hero.png        # Rio hero image
├── zanzibar_hero.png   # Zanzibar hero image
├── video_poster.jpg    # Video thumbnail/poster
│
├── social_proof/       # China trip + collective photos (10 images)
├── china_trip/         # China 2026 gallery photos (11 images)
├── launch_party/       # NYC Launch Party photos (39 images)
├── bali/               # Bali additional assets
│
└── vercel.json         # Vercel routing config
```

---

*For any technical support, contact the developer. For content updates, use the Admin Panel at `/admin.html`.*
