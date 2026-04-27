# Image Migration Proposal — Travel & LIV Collective

> **Author:** Development Team  
> **Date:** April 27, 2026  
> **Status:** Proposal — Awaiting Approval  

---

## The Problem

The TravelNLiv project currently stores **102 media files (~94 MB of images + 26 MB of video)** directly in the Git repository. This creates three issues:

1. **Local disk space** — every clone/pull downloads all media, eating into your laptop's storage
2. **Git repo bloat** — the `.git` history folder is **93 MB** (almost entirely due to binary assets), making pushes/pulls slow
3. **Vercel cold starts** — Vercel re-deploys every image on each push, wasting build minutes

### Current Asset Breakdown

| Folder | Files | Size | Content |
|---|---|---|---|
| `/` (root) | 13 | 34 MB | Hero images, logo, poster, 2 videos |
| `/launch_party/` | 43 | 32 MB | Launch party event photos |
| `/social_proof/` | 10 | 11 MB | Community/group travel photos |
| `/china_trip/` | 11 | 8.5 MB | Past trip gallery photos |
| `/bali/` | 25 | 7.7 MB | Bali destination photos |
| **Total** | **102** | **~94 MB** (images) + **~26 MB** (video) | |

### File Type Distribution

| Format | Count | Notes |
|---|---|---|
| JPG | 68 | Bulk of photos |
| JPEG | 20 | Bali destination photos |
| PNG | 8 | Hero images, logos, beach club |
| AVIF | 4 | Room option photos (already optimized) |
| MP4 | 2 | Hero video (25 MB) + elevator clip (1.3 MB) |

---

## Recommended Solution: Supabase Storage

### Why Supabase Storage?

You're **already using Supabase** for your CMS data (`site_copy`, `trip_pages`, `faqs`). Supabase includes a built-in file storage service with a free-tier CDN. This means:

- ✅ **No new accounts** — use your existing Supabase project
- ✅ **Free at your scale** — 1 GB storage + 2 GB bandwidth/month on free tier (you need ~120 MB)
- ✅ **Global CDN** — assets served from edge locations worldwide, faster than Vercel static
- ✅ **Admin integration** — your admin panel already talks to Supabase, so image uploads can go directly there
- ✅ **Public URLs** — each file gets a permanent URL like `https://ziejdpdrhpxqxrhkwpew.supabase.co/storage/v1/object/public/assets/bali/hero.jpg`

### Comparison of Options

| Criteria | Supabase Storage | Cloudinary | AWS S3 + CloudFront | Vercel Blob |
|---|---|---|---|---|
| **Already in stack** | ✅ Yes | ❌ No | ❌ No | ⚠️ Partial |
| **Free tier** | 1 GB / 2 GB BW | 25 credits/mo | 5 GB / 15 GB BW | 250 MB |
| **Auto-optimization** | ❌ Manual | ✅ Yes (resize, WebP) | ❌ Manual | ❌ No |
| **CDN included** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **Complexity** | Low | Medium | High | Low |
| **Cost at scale** | $25/mo (Pro) | $0–$89/mo | Pay-per-use | $0–$20/mo |
| **Admin upload UI** | Can build in existing admin | Has own dashboard | Own dashboard | API only |

### 🏆 Runner-Up: Cloudinary

If you ever want **automatic image optimization** (auto-WebP, auto-resize, smart cropping), Cloudinary is the gold standard. But for right now, Supabase keeps everything under one roof with zero new dependencies.

---

## Implementation Plan

### Phase 1: Setup Supabase Storage Bucket (15 min)

1. Go to your Supabase dashboard → **Storage** → **New Bucket**
2. Create a public bucket called `assets`
3. Set the bucket policy to **public read** (anyone can view images)

### Phase 2: Upload All Images (30 min)

We'll write a migration script that:

1. Walks each image folder (`bali/`, `social_proof/`, `launch_party/`, `china_trip/`, root)
2. Uploads each file to the matching path in Supabase Storage
3. Logs the old local path → new CDN URL mapping

```
Local:  /bali/kelingking-beach.jpeg
Remote: https://ziejdpdrhpxqxrhkwpew.supabase.co/storage/v1/object/public/assets/bali/kelingking-beach.jpeg
```

### Phase 3: Update All HTML References (1 hour)

A find-and-replace script will:

1. Scan all `.html` files for `src="bali/..."`, `src="social_proof/..."`, etc.
2. Replace each with the full Supabase CDN URL
3. Also update `site-defaults.js` and any JS files referencing image paths
4. Update Supabase `site_copy` and `trip_pages` rows that store photo URLs

### Phase 4: Remove Images from Git (30 min)

1. Delete all image/video files from the repo
2. Add image extensions to `.gitignore`
3. (Optional) Run `git filter-branch` or `BFG Repo Cleaner` to purge images from git history — this would shrink the `.git` folder from **93 MB → ~5 MB**
4. Force push the cleaned history

### Phase 5: Update Admin Panel (30 min)

Update the admin dashboard's image upload functionality to:
- Upload directly to Supabase Storage instead of expecting local files
- Generate and store the CDN URL in the database

---

## Folder Structure After Migration

```
TRAVELNLIV/
├── index.html          ← references CDN URLs
├── bali.html           ← references CDN URLs
├── upcoming.html       ← references CDN URLs
├── about.html          ← references CDN URLs
├── styles.css
├── main.js
├── site-defaults.js    ← CDN URLs in defaults
├── site-sync.js
├── admin.html
├── logo.jpg            ← KEEP locally (tiny, used as favicon too)
├── .gitignore          ← *.jpg, *.jpeg, *.png, *.mp4 etc.
└── (no more image folders!)
```

**Local project size: ~188 MB → ~5 MB**  
**Git repo size: ~93 MB → ~5 MB**

---

## Storage & Bandwidth Estimate

| Metric | Current Usage | Supabase Free Tier |
|---|---|---|
| Total file size | ~120 MB | 1 GB (1,000 MB) ✅ |
| Monthly bandwidth* | ~2–5 GB estimate | 2 GB free** |
| Files | 102 | Unlimited ✅ |

*Based on moderate traffic for a travel collective site.*  
**If you exceed 2 GB bandwidth, Supabase Pro ($25/mo) gives 250 GB bandwidth — more than enough.*

---

## Risk & Rollback

| Risk | Mitigation |
|---|---|
| Supabase CDN downtime | Supabase has 99.9% uptime SLA; images are cached at edge |
| Accidentally delete bucket | Supabase has soft-delete; we keep a local backup before purging |
| URL changes break pages | We do a full find-replace with verification before deploying |
| Git history rewrite | We create a backup branch before cleaning history |

---

## Timeline

| Step | Time | Dependencies |
|---|---|---|
| Bucket setup | 15 min | Supabase dashboard access |
| Upload script + migration | 30 min | Node.js or curl |
| HTML/JS URL replacement | 1 hour | All pages |
| Supabase DB URL updates | 15 min | API calls |
| Git cleanup + push | 30 min | Force push approval |
| Admin panel upload update | 30 min | admin.html |
| **Total** | **~3 hours** | |

---

## Next Steps

1. **Approve this proposal** — confirm Supabase Storage is the preferred approach
2. **I'll execute the migration** — upload everything, update all references, clean git
3. **Verify on live site** — ensure all images load from CDN
4. **Done** — your laptop gets ~180 MB back and deploys become instant

---

*Questions? Let me know if you'd prefer Cloudinary for the auto-optimization benefits, or if Supabase Storage works for you and we'll start the migration.*
