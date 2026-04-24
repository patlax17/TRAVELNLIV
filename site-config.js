// =============================================================
// TRAVEL & LIV COLLECTIVE — SITE CONFIGURATION
// Admin Dashboard writes changes to localStorage.
// All pages read from localStorage (falls back to these defaults).
// =============================================================

const TNLIV_DEFAULTS = {
    version: "1.2",

    // ── HERO SECTION ──────────────────────────────────────────────
    hero: {
        eyebrow: "Travel & LIV Collective",
        heading: "Where destinations",
        headingItalic: "become connections",
        subtitle: "Group trips for people who actually make it out of the group chat. Curated experiences. Real connections. Unforgettable destinations.",
        stat1Number: "4–5★",
        stat1Label: "Stays Only",
        stat2Number: "Global",
        stat2Label: "Destinations",
        stat3Number: "💳",
        stat3Label: "Flexible Payment Plans Available",
        ctaPrimaryText: "Join the Next Experience",
        ctaSecondaryText: "Explore Upcoming Trips",
        image: "zanzibar_hero.png",
    },

    // ── MARQUEE TICKER ────────────────────────────────────────────
    ticker: [
        "Pre-Trip Meet & Greets",
        "Welcome Dinners",
        "4–5 Star Stays Only",
        "Curated Experiences",
        "Flexible Payment Plans",
        "Real Connections",
        "Farewell Dinners Included",
        "Come Solo. Leave With More.",
    ],

    // ── WHO WE ARE / IDENTITY ─────────────────────────────────────
    identity: {
        eyebrow: "Who We Are",
        heading: "This isn't a travel group.",
        headingItalic: "It's your kind of people.",
        para1: "You know that feeling when everyone talks about traveling... but no one actually books it?",
        para2: "We built Travel & LIV Collective for the ones who do.",
        para3: "The ones who crave more than just a trip — but a shared experience with people who get it.",
    },

    // ── SOCIAL PROOF ─────────────────────────────────────────────
    socialProof: {
        eyebrow: "Social Proof",
        heading: "We already took",
        headingBold: "20+ strangers",
        headingEnd: "across the world...",
        headingGold: "and they didn't want to leave.",
        body: "From rooftop nights in Shanghai to once-in-a-lifetime experiences, our travelers came as strangers — and left as a community.",
        stat1Number: "20+",
        stat1Label: "Strangers Connected",
        stat2Number: "100%",
        stat2Label: "Would Go Again",
        stat3Number: "∞",
        stat3Label: "Memories Made",
    },

    // ── HOW IT WORKS (4 steps) ────────────────────────────────────
    howItWorks: {
        eyebrow: "The Process",
        heading: "It's easier than you think.",
        steps: [
            { icon: "🌍", title: "Pick Your Trip", body: "Browse our curated lineup of upcoming international escapes. Something always vibes." },
            { icon: "🔐", title: "Secure Your Spot", body: "Lock in your space with a deposit. Flexible payment plans available via Affirm, Klarna & Afterpay." },
            { icon: "💬", title: "Join the Group Chat", body: "Meet your future travel crew before you even board the plane. Pre-trip meet & greets included." },
            { icon: "🛫", title: "Show Up — We Handle the Rest", body: "Logistics, activities, welcome dinner, farewell dinner — everything is curated so you just arrive and live." },
        ],
    },

    // ── WHY TRAVEL & LIV (4 cards) ───────────────────────────────
    whyUs: {
        eyebrow: "The Travel & LIV Way",
        heading: "Why Travel & LIV?",
        body: "This is a curated collective of like-minded people who value experience, connection, and the finer things in life.",
        cards: [
            { title: "Curated, Not Generic", body: "Every trip is meticulously crafted. No cookie-cutter packages — every detail, from venues to activities, is handpicked for quality and authenticity. You won't find these on Google." },
            { title: "Community First", body: "You're not just booking a trip — you're joining a collective. Pre-trip meet & greets, welcome dinners, farewell dinners. Connection is built in from day one." },
            { title: "Mid-Luxury Standards", body: "4–5 star stays only. We don't compromise on where you rest your head. Premium without the pretension — just quality that matches the moment." },
            { title: "Flexible Payments", body: "Secure your spot with a deposit, then spread the rest with Affirm, Klarna, or Afterpay. No stress, just wanderlust. The experience you deserve, at a pace that works." },
        ],
    },

    // ── FINAL CTA ─────────────────────────────────────────────────
    finalCta: {
        eyebrow: "Make Your Move",
        heading: "You'll either be on the next trip...",
        headingItalic: "or watching it on Instagram.",
        body: "The collective is growing. The next trip is being planned. Your seat is waiting.",
        ctaText: "Join Travel & LIV Collective",
        image: "snorkeling_mnemba.png",
    },

    // ── SOCIAL LINKS (used site-wide in nav, footer, CTAs) ───────
    social: {
        instagram: "https://www.instagram.com/travelnlivcollective",
        tiktok: "https://www.tiktok.com/@travelnlivcollective",
        facebook: "https://www.facebook.com/Travelnlivcollective",
        whatsappChannel: "https://whatsapp.com/channel/0029VbBQk77CsU9WUplHdr1k",
        whatsappGroup: "https://chat.whatsapp.com/Ii7bQKfuOZoLcWfmj8C1Q5?mode=gi_t",
        email: "Info@travelnliv.com",
    },

    // ── GLOBAL NAV CTA ────────────────────────────────────────────
    navCta: {
        text: "Reserve Your Spot",
        url: "upcoming.html",
    },

    // ── UPCOMING EVENT (Homepage Section 6) ──────────────────────
    // mode: "coming-soon" | "live" | "hidden"
    event: {
        mode: "coming-soon",
        bgImage: "zanzibar_hero.png",
        eyebrow: "Upcoming Event",
        // --- coming-soon fields ---
        heading: "The next event is coming...",
        headingItalic: "stay tuned.",
        description: "We're putting together something special for the collective.",
        subDescription: "Details will be announced soon. Drop your email below to be the first to know when tickets go live.",
        badgeText: "Next Event Coming Soon",
        // --- live event fields ---
        liveEventName: "",
        liveEventDate: "",
        liveEventVenue: "",
        liveTicketUrl: "#",
        liveTicketBtn: "Get Tickets",
        livePriceDisplay: "",
    },

    // ── NEXT TRIP CARD (Homepage) ─────────────────────────────────
    nextTrip: {
        badge: "Booking Open",
        destination: "Bali, Indonesia",
        dates: "July 30 – August 5, 2026",
        duration: "7 Days",
        description: "Sacred rice terraces, rooftop infinity pools, temple sunrises, and nights the group chat will never let you forget. This is Bali with the collective.",
        image: "bali_hero.png",
        ctaText: "Reserve Your Spot",
        squadtripUrl: "https://travelnlivcollective.squadtrip.com/trip/travel-liv-collective-signature-mystery-trip-where-luxury-meets-relaxation-and-connection-13016?color=abcca8",
        priceFrom: "",
    },

    // ── PAST EVENT RECAP (Homepage) ───────────────────────────────
    pastEvent: {
        visible: true,
        city: "NYC",
        date: "April 2025",
        title: "The Launch Party",
        titleItalic: "it was a vibe.",
        description: "We kicked off Travel & LIV Collective in New York City and the energy was unmatched. Red carpet, Mix & Bingo, good people — this is what happens when the collective shows up.",
    },

    // ── UPCOMING TRIPS (upcoming.html — 3 trip rows) ─────────────
    trips: [
        {
            id: "trip1",
            status: "booking-open",   // "booking-open" | "coming-soon" | "hidden"
            destination: "Bali, Indonesia",
            monthYear: "July–August 2026",
            dates: "July 30 – August 5, 2026",
            duration: "7 Days",
            region: "Indonesia",
            description: "Seven days in the Island of the Gods. From sacred rice terraces and volcanic sunrises to rooftop infinity pools, traditional ceremonies, and nights you'll never forget — Bali is where the soul gets recharged and strangers become lifelong friends.",
            image: "bali_hero.png",
            priceDisplay: "Starting at $2,350",
            ctaText: "Secure Your Spot",
            ctaUrl: "https://chat.whatsapp.com/Ii7bQKfuOZoLcWfmj8C1Q5?mode=gi_t",
        },
        {
            id: "trip2",
            status: "coming-soon",
            destination: "Punta Cana, Dominican Republic",
            monthYear: "October 2026",
            dates: "October 2026",
            duration: "",
            region: "Dominican Republic",
            description: "White-sand beaches, crystal-clear waters, and the warmth of the Caribbean — Punta Cana is the perfect backdrop for an unforgettable collective experience. Full details dropping soon.",
            image: "punta_cana_hero.png",
            priceDisplay: "TBA",
            ctaText: "Get Notified",
            ctaUrl: "https://chat.whatsapp.com/Ii7bQKfuOZoLcWfmj8C1Q5?mode=gi_t",
        },
        {
            id: "trip3",
            status: "coming-soon",
            destination: "Rio de Janeiro, Brazil",
            monthYear: "December 2026",
            dates: "December 2026",
            duration: "",
            region: "Brazil",
            description: "End 2026 right. Carnival energy, iconic beaches, Christ the Redeemer, and samba nights — Rio is electric, and we're bringing the collective there for a December experience you won't forget. Full details dropping soon.",
            image: "rio_hero.png",
            priceDisplay: "TBA",
            ctaText: "Get Notified",
            ctaUrl: "https://chat.whatsapp.com/Ii7bQKfuOZoLcWfmj8C1Q5?mode=gi_t",
        },
    ],

    // ── ABOUT PAGE ────────────────────────────────────────────────
    aboutBio: {
        founderQuote: "You arrive as a stranger. You leave as a community.",
        para1: "Travel & LIV started two years ago when I was solo traveling and realized something so many people feel: we want to see the world, but we don't always have the right people to go with.",
        para2: "Most group trip ideas stay stuck in the chat, and planning everything alone can feel overwhelming. As I became a travel agent, I realized my gift wasn't just planning trips — it was bringing people together. Turning strangers into friends, and creating experiences where destinations become connections and unforgettable memories.",
        para3: "I started small — a few trips with couples and friends, then a 20-person trip to Jamaica, then hosting for one of NYC's largest run clubs. And most recently, our sold-out China trip in March 2026, where strangers became friends and shared some of the most life-changing experiences together.",
        para4: "At Travel & LIV Collective, we don't do large, impersonal tour groups. Each destination is intentionally curated and thoughtfully designed to create an environment where real connections can happen naturally. Because at the end of the day, travel feels different when it's shared.",
        para5: "And my goal is simple: To build a community where connection is at the center of every journey.",
    },

    // ── PAST TRIPS (About page) ───────────────────────────────────
    pastTrips: [
        {
            id: "china-2026",
            label: "China",
            title: "China 2026",
            description: "14 unforgettable days across Shanghai, Xi'an, Beijing, and beyond. 20+ travelers. A sold-out debut that turned strangers into lifelong friends.",
            monthYear: "March 2026",
            duration: "14 Days",
            travelerCount: "20+ Travelers",
            videoSrc: "worldstallestelevator.mp4",
            heroImage: "",
            autoArchived: false,
            sourceSlug: "",
        },
    ],

    // ── GALLERY STATS ─────────────────────────────────────────────
    gallery: {
        photoCount: 50,
        destinationCount: 2,
        tripCount: 1,
    },

    // ── FAQs ──────────────────────────────────────────────────────
    // Admin can edit question/answer text and add/remove items
    faqs: {
        general: [
            { q: "✈️ What is Travel & LIV Collective?", a: "Travel & LIV Collective is a community-driven travel experience designed for people who want more than just a trip. We bring together like-minded individuals to explore the world, build real connections, and turn destinations into unforgettable shared experiences." },
            { q: "🧳 Do I have to know anyone to join?", a: "Not at all! Most of our travelers come solo—and that's the whole point. We create intentional spaces and experiences so you can easily connect with others and leave with friendships you didn't even expect." },
            { q: "👯‍♀️ What kind of people join these trips?", a: "Our travelers are typically Gen Z & Millennials who are open-minded, social, and curious. If you love experiences, good energy, and meaningful connections—you'll fit right in." },
        ],
        trips: [
            { q: "🌴 What's included in the trip?", a: "Each trip is slightly different, but generally includes: Accommodations, Curated group experiences & excursions, Welcome events & activities, On-ground support throughout the trip, and Travel & LIV Collective goodie bags. Full details are always provided on each trip page." },
            { q: "💸 What's NOT included?", a: "Typically: Flights, Some meals, and Personal expenses. We'll always clearly outline what's included so there are no surprises." },
            { q: "🛫 Can you help with flights?", a: "While flights are not included, we're happy to guide you on best times to book, recommended routes, and general travel tips." },
            { q: "🛟 Is this safe?", a: "Yes—your safety is a top priority. All trips are carefully planned with trusted partners, and you'll have support throughout the entire experience." },
            { q: "📸 Will there be content opportunities?", a: "Absolutely. Whether you're a content creator or just want amazing memories, our trips are designed with experiences you'll want to capture and share." },
            { q: "🤔 What makes this different from other group trips?", a: "We don't just plan trips—we create intentional experiences. Our focus is on real connection (not surface-level), curated moments that bring people together, and turning strangers into lifelong travel friends." },
        ],
        booking: [
            { q: "💳 Do you offer payment plans?", a: "Yes! We offer our own Stripe-powered payment plan — no credit check, fixed scheduled payment dates, and a deposit to lock in your spot. Affirm, Klarna, and Afterpay are also available (subject to eligibility)." },
            { q: "🔒 Is my deposit refundable?", a: "Deposits are non-refundable, as they secure your spot and go toward trip planning and vendor commitments. However, in some cases, they may be transferable to another trip—just reach out and we'll do our best to work with you." },
            { q: "🚨 What if the trip doesn't reach the minimum number of travelers?", a: "Each trip requires a minimum number of travelers to run. If that number isn't reached, you will receive a full refund or the option to transfer your payment to a future trip." },
            { q: "📅 When should I book?", a: "The earlier, the better. Spots are limited and once we're sold out, we're sold out. We also release early pricing, so booking sooner usually means a better rate." },
            { q: "🌐 How do I secure my spot?", a: "Once you're ready: Choose your trip, Submit your deposit, and you'll receive next steps + payment plan details. Spots are first come, first served." },
        ],
        contact: [
            { q: "💬 Who do I contact if I have more questions?", a: "You can reach out anytime via DM on Instagram (@travelnlivcollective) or by email at Info@travelnliv.com. We're always happy to help!" },
        ],
    },
};

// ── HELPERS ───────────────────────────────────────────────────
window.TNLIV_DEFAULTS = TNLIV_DEFAULTS;

window.getSiteConfig = function () {
    try {
        var stored = localStorage.getItem("tnliv_config");
        if (stored) {
            var parsed = JSON.parse(stored);
            // Deep-merge: start with a fresh copy of ALL defaults, then
            // overwrite top-level keys that exist in the stored config.
            // This ensures new fields added after a user's first save
            // always have default values (prevents "undefined" in the DOM).
            var merged = JSON.parse(JSON.stringify(TNLIV_DEFAULTS));
            Object.keys(parsed).forEach(function (key) {
                // For object keys (not arrays), merge one level deep so
                // new sub-keys inside existing objects also get defaults.
                if (
                    parsed[key] !== null &&
                    typeof parsed[key] === 'object' &&
                    !Array.isArray(parsed[key]) &&
                    merged[key] !== null &&
                    typeof merged[key] === 'object' &&
                    !Array.isArray(merged[key])
                ) {
                    merged[key] = Object.assign({}, merged[key], parsed[key]);
                } else {
                    merged[key] = parsed[key];
                }
            });
            return merged;
        }
    } catch (e) { }
    return JSON.parse(JSON.stringify(TNLIV_DEFAULTS));
};

window.saveSiteConfig = function (config) {
    try {
        localStorage.setItem("tnliv_config", JSON.stringify(config));
        return true;
    } catch (e) { return false; }
};

window.resetSiteConfig = function () {
    localStorage.removeItem("tnliv_config");
};
