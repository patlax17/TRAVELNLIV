# Travel & LIV Collective — Client Acceptance Test Plan
**Meeting Date:** April 24, 2026
**Prepared for:** Olivia
**Site URL (local):** Open `index.html` directly, or use a local server

---

## Overview

This document is your walkthrough checklist for today's handoff meeting. Go through each item with Olivia — have her interact with everything herself so she feels confident managing the site post-launch.

---

## ✅ TEST BLOCK 1: Landing Page & Navigation

**Estimated time: 8 minutes**

| # | Test | What to Do | Expected Result | Pass? |
|---|------|-----------|-----------------|-------|
| 1.1 | Homepage loads correctly | Open `index.html` | Dark luxury design loads; hero image visible, logo in nav | ☐ |
| 1.2 | Nav scroll behavior | Scroll down slowly | Nav bar gains frosted glass background after ~50px scroll | ☐ |
| 1.3 | Desktop nav dropdown | Hover "Upcoming Trips" in nav | Dropdown appears with Bali (🟢 Open badge), Punta Cana, Rio | ☐ |
| 1.4 | Mobile nav opens | Resize browser to ~375px width, tap ☰ hamburger | Full-screen mobile menu slides in with all links | ☐ |
| 1.5 | Mobile nav accordion | In mobile menu, tap "Upcoming Trips" | Accordion expands to show all 3 destinations | ☐ |
| 1.6 | Mobile nav closes | Tap ✕ or tap any link | Menu closes, body scrolls normally | ☐ |
| 1.7 | Nav logo links home | Click the logo from any page | Returns to `index.html` | ☐ |

---

## ✅ TEST BLOCK 2: "Reserve Your Spot" CTA Flow

**Estimated time: 10 minutes**
> This is the most important user flow — the full path from hero to booking.

| # | Test | What to Do | Expected Result | Pass? |
|---|------|-----------|-----------------|-------|
| 2.1 | Hero CTA → scroll to trip card | Click "Join the Next Experience" in hero | Page smoothly scrolls to the Bali "Where We're Going Next" card | ☐ |
| 2.2 | Nav "Reserve Your Spot" button | Click the gold "Reserve Your Spot" button in the nav | Page scrolls to trip card AND the Squadtrip booking widget drops down | ☐ |
| 2.3 | Trip card "Reserve Your Spot" | Click the "Reserve Your Spot" button on the Bali card | Squadtrip booking widget expands below the card | ☐ |
| 2.4 | Booking widget loads | Wait 2–3 seconds after clicking | Squadtrip iframe appears with the Bali booking form | ☐ |
| 2.5 | Close booking widget | Click "Close Booking Widget" (red button) | Widget collapses back up; page returns to normal | ☐ |
| 2.6 | Mobile booking widget | On mobile (375px), click "Reserve Your Spot" | Widget opens and is scrollable — booking form is usable | ☐ |
| 2.7 | "View Trip Details" button | Click the "View Trip Details" outline button | Navigates to `bali.html` | ☐ |
| 2.8 | Final CTA section | Scroll to the bottom "You'll either be on the next trip..." section | Gold CTA button is visible; clicking it scrolls back to the trip card | ☐ |

---

## ✅ TEST BLOCK 3: Admin Panel — Live Demo

**Estimated time: 12 minutes**
> Have Olivia log in and make a real change. This builds her confidence.

| # | Test | What to Do | Expected Result | Pass? |
|---|------|-----------|-----------------|-------|
| 3.1 | Admin access | Go to `/admin.html` | Login screen shows with logo and password field | ☐ |
| 3.2 | Wrong password | Type anything wrong, click Sign In | Red error appears: "Incorrect password. Please try again." | ☐ |
| 3.3 | Correct login | Enter `travelnliv2026`, click Sign In | Admin Dashboard loaded; sidebar with all navigation items visible | ☐ |
| 3.4 | **Live test: Update a Coming Soon trip** | Click "Destinations & Trips" → Trip 2 (Punta Cana) → change Status to "🟢 Booking Open" → update the Exact Dates → click "Save Changes" | Green toast confirmation appears | ☐ |
| 3.5 | Verify update on live page | Open a new tab with `upcoming.html` | Punta Cana card now shows "Booking Open" badge with updated dates | ☐ |
| 3.6 | Revert the change | Back in Admin → Destinations & Trips → Trip 2 → set Status back to "🟡 Coming Soon" → Save | Punta Cana returns to Coming Soon status | ☐ |
| 3.7 | Update Squadtrip URL | Admin → Homepage → paste a new Squadtrip URL → Save | Booking widget on homepage now loads the new URL | ☐ |
| 3.8 | Past Event Recap toggle | Admin → Homepage → Past Event section → change "Show This Section?" to No → Save → check index.html | Launch party photo grid is hidden | ☐ |
| 3.9 | Restore Past Event | Admin → Homepage → set it back to Yes → Save | Launch party section reappears | ☐ |
| 3.10 | Change Admin Password | Admin → Settings → enter and confirm a new password → click Update Password | Password updated; logging out and logging in with new password works | ☐ |
| 3.11 | Pixel ID entry | Admin → Marketing & Analytics → type `TEST123` in Meta Pixel field → Save | Green "Active" badge appears next to Meta Pixel | ☐ |
| 3.12 | Export Config backup | Admin → Settings → Export Config JSON | A `.json` file downloads to computer — verify it's not empty | ☐ |

---

## ✅ TEST BLOCK 4: High-Res Gallery & Photo Download

**Estimated time: 6 minutes**

| # | Test | What to Do | Expected Result | Pass? |
|---|------|-----------|-----------------|-------|
| 4.1 | Gallery loads | Click "Gallery" in nav | Gallery page loads with all China trip photos visible | ☐ |
| 4.2 | Photo hover effect | Hover over any photo | Overlay appears with destination label and download icon | ☐ |
| 4.3 | **Photo download** | Click the download (⬇) icon on any photo | High-res image downloads to computer | ☐ |
| 4.4 | Lightbox / zoom | Click the expand (⛶) icon or click the photo itself | Full-screen photo lightbox opens | ☐ |
| 4.5 | Lightbox close | Click ✕ or click outside the photo | Lightbox closes, returns to gallery grid | ☐ |
| 4.6 | Gallery stat numbers | Check the hero stats at the top of the gallery | Correct numbers displayed (50 photos, 2 destinations, 1 trip) | ☐ |

---

## ✅ TEST BLOCK 5: Social Hub Links (Mobile-Critical)

**Estimated time: 5 minutes**
> Test these on Olivia's actual phone for the most realistic result.

| # | Test | What to Do | Expected Result | Pass? |
|---|------|-----------|-----------------|-------|
| 5.1 | Instagram link | Click 📷 Instagram icon in footer | Opens `@travelnlivcollective` on Instagram | ☐ |
| 5.2 | TikTok link | Click 🎵 TikTok icon in footer | Opens `@travelnlivcollective` on TikTok | ☐ |
| 5.3 | Facebook link | Click 📘 Facebook icon in footer | Opens the Travel & LIV Facebook page | ☐ |
| 5.4 | WhatsApp Channel | Click 💬 WhatsApp icon in footer | Opens the WhatsApp Channel link | ☐ |
| 5.5 | WhatsApp Group (CTA section) | Scroll to "Make Your Move" section, click 💬 | Opens the WhatsApp Group invite link | ☐ |
| 5.6 | Email link | Click "Contact Us" in footer | Opens email client addressed to `Info@travelnliv.com` | ☐ |
| 5.7 | **On Olivia's phone** | Repeat 5.1–5.5 on a real iOS/Android device | All links open the correct apps without redirecting to browser | ☐ |

---

## ✅ TEST BLOCK 6: Individual Trip Pages

**Estimated time: 6 minutes**

| # | Test | What to Do | Expected Result | Pass? |
|---|------|-----------|-----------------|-------|
| 6.1 | Bali page loads | Go to `bali.html` | Full Bali trip page loads with hero, itinerary, pricing | ☐ |
| 6.2 | Bali itinerary days | Click through each Day in the itinerary | Hero image updates to match the day's content | ☐ |
| 6.3 | Bali "Reserve Your Spot" | Click the Bali booking button | Squadtrip widget drops down with the correct Bali booking form | ☐ |
| 6.4 | Punta Cana page | Go to `puntacana.html` | "Coming Soon" page loads with tease content and notify CTA | ☐ |
| 6.5 | Rio page | Go to `rio.html` | "Coming Soon" page loads correctly | ☐ |
| 6.6 | About page | Go to `about.html` | Olivia's bio, photo, China trip photos, and upcoming trip preview all load | ☐ |
| 6.7 | FAQs page | Go to `faqs.html` | All 4 FAQ categories visible; clicking a question expands the answer | ☐ |

---

## ✅ TEST BLOCK 7: Content Accuracy Check

**Estimated time: 5 minutes**
> Cross-check against Olivia's feedback document.

| # | Item | Check | Pass? |
|---|------|-------|-------|
| 7.1 | Bali dates | Verify: "July 30 – August 5, 2026 · 7 Days" | ☐ |
| 7.2 | Bali pricing | Verify room prices match: $2,350 / $2,400 / $2,850 | ☐ |
| 7.3 | Punta Cana dates | Verify: "October 2026" | ☐ |
| 7.4 | Rio dates | Verify: "December 2026" | ☐ |
| 7.5 | Founder bio | Read through `about.html` bio — matches Olivia's written version | ☐ |
| 7.6 | FAQ answers | Spot-check 3 FAQs — content is accurate and up-to-date | ☐ |
| 7.7 | Copyright year | Footer shows "© 2025 Travel & LIV Collective" | ☐ |
| 7.8 | Email address | All "Contact Us" links go to `Info@travelnliv.com` | ☐ |

---

## Post-Meeting Action Items

| # | Action | Owner | Notes |
|---|--------|-------|-------|
| A | Change admin password from default | Olivia | Do immediately after handoff |
| B | Enter live Meta Pixel ID | Olivia | Once Meta Business Manager is ready |
| C | Enter TikTok Pixel ID | Olivia | Once TikTok Ads Manager is ready |
| D | Push repo to GitHub | Olivia / Dev | Refer to READ_ME.md Section 4 |
| E | Deploy on Vercel | Olivia / Dev | Refer to READ_ME.md Section 4 |
| F | Update DNS to point travelnliv.com → Vercel | Olivia / Dev | Refer to READ_ME.md Section 5 |
| G | Cancel Squarespace subscription | Olivia | Only AFTER confirming travelnliv.com points to new site |
| H | Update Squadtrip URL in Admin when next trip opens | Olivia | Admin → Homepage → Squadtrip URL field |

---

*All tests above should be completed before site goes live. Score: ___/47 checks passed.*
