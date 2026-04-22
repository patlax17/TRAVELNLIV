/**
 * site-defaults.js — Travel & LIV Collective
 * Static fallback destination data for all site visitors.
 * Admin changes override these via localStorage (DESTINATIONS_LIST).
 * Update this file when new trips are added so the defaults stay current.
 */
window.SITE_DEST_DEFAULTS = [
    {
        slug: 'bali',
        name: 'Bali, Indonesia',
        emoji: '🏝️',
        url: '/upcomingtrips/bali',
        status: 'booking_open',
        dates: 'July 30 – Aug 5, 2026',
        price: 'Starting at $2,350',
        badge: '🟢 Booking Open',
        tagline: 'Sacred rice terraces, rooftop infinity pools, volcanic sunrises, and nights you will never forget.',
        teaserDesc: '7 days of luxury, culture and connection in Bali.',
        description: 'Your journey begins the moment you arrive, where you will be seamlessly welcomed and transported into nature. Throughout the trip, you will stay in hand-selected 5-star luxury local resorts and private villas, each chosen for their setting, serenity, and wow factor.',
        squadtrip: 'https://travelnlivcollective.squadtrip.com/trip/travel-liv-collective-signature-mystery-trip-where-luxury-meets-relaxation-and-connection-13016?color=abcca8',
        includes: [
            { icon: '🏨', title: 'Accommodation / Lodging', desc: 'Luxury private villa stays and curated boutique accommodations.' },
            { icon: '🎭', title: 'Events & Activities', desc: '7 carefully curated mystery experiences unveiled throughout the trip.' },
            { icon: '🚐', title: 'Transportation', desc: 'Private transfers and curated transportation for all scheduled group activities.' },
            { icon: '📸', title: 'Professional Photographer', desc: "Liv shoots everything — Sony camera, DJI Osmo Pocket, DJI Mini 3 drone." },
            { icon: '🍽️', title: 'Food & Beverages', desc: 'Welcome drinks, all breakfasts, 2 lunches, and 3 curated group dinners.' },
            { icon: '🥂', title: 'Alcohol', desc: 'Welcome drink on Travel & LIV Collective.' },
            { icon: '🤝', title: 'Community & Connections', desc: 'You may just find your next bestie or boo on this trip.' }
        ],
        rooms: [
            { title: 'Double Occupancy (Bringing a friend/couple)', price: '$2,350', deposit: '$500 deposit · Payment plan available', badge: '' },
            { title: 'Double Occupancy (Solo / roommate matching)', price: '$2,400', deposit: '$530 deposit · 3 payments of $623 · No credit check', badge: 'Only 4 remaining!' },
            { title: 'Single Occupancy (Private room)', price: '$2,850', deposit: '$500 deposit · Your own private room', badge: '' }
        ],
        days: [
            { title: 'Arrival, Connect & Seafood Welcome Dinner by the Beach', body: 'Warmly welcomed and transferred into nature. Settle into your 5-star luxury villa, explore your surroundings, then gather for an intimate seafood welcome dinner by the beach.', highlights: ['🛬 Airport Transfer', '🏨 Villa Check-in', '🦞 Welcome Seafood Dinner'] },
            { title: 'Waterfalls & Wonders of Bali', body: 'Private guide from 9:30 AM to Tegenungan Waterfall — cascading waters surrounded by lush jungle. Continue to the historic Elephant Cave (Goa Gajah).', highlights: ['🍳 Breakfast Included', '💧 Tegenungan Waterfall', '🐘 Elephant Cave (Goa Gajah)', '📸 Photo Moments'] },
            { title: 'Sunset in a Landscape Shaped by Time', body: 'Guide meets you at 2:00 PM. Journey to Mount Batur Geopark for a Black Lava Jeep tour at 4:00 PM with panoramic views. Sunset viewpoint at 6:00 PM.', highlights: ['🍳 Breakfast Included', '🚙 Black Lava Jeep Tour', '🌋 Mount Batur Geopark', '🌅 Sunset Viewpoint'] },
            { title: 'Rice Terraces & Village Life', body: 'Early pickup at 7:30 AM. Guided e-bike tour through Jatiluwih Rice Terraces (UNESCO World Heritage site). Ride through agro farm, bee farm, bamboo forest, and Jatiluwih Village. Afternoon check-in at Pullman Bali Legian Beach.', highlights: ['🍳 Breakfast, Lunch & Dinner Included', '🚲 UNESCO E-Bike Tour', '🌾 Jatiluwih Village', '🏨 Hotel Move: Pullman Bali'] },
            { title: 'Yacht Day in Bali', body: 'Pickup at 6:30 AM to Sanur Pier. Board at 7:30 AM to Nusa Lembongan. Utopia Catamaran cruise 8:30 AM–1:30 PM with snorkeling, GoPro photos, curated lunch, and welcome drinks.', highlights: ['🍳 Breakfast & Dinner Included', '⛵ Utopia Catamaran Cruise', '🤿 Snorkeling Included', '🎥 GoPro Photos & Video', '🍹 Welcome Drinks'] },
            { title: "Asia's Hottest Beach Club", body: "Relaxed morning, then transfer to Finns Beach Club — one of Bali's most iconic beachfront destinations. Pool, cocktails, oceanfront sunset.", highlights: ['🍳 Breakfast Included', '🏖️ Finns Beach Club', '🌅 Sunset by the Ocean', '🍹 Oceanfront Cocktails'] },
            { title: 'This Is Not Goodbye — See You Next Time!', body: 'Final breakfast at the hotel, leisure morning — last pool dip or beach stroll. Transfer to Ngurah Rai International Airport for departure.', highlights: ['🍳 Final Breakfast', '🏖️ Leisure Morning', '🚐 Airport Transfer', '✈️ Ngurah Rai International'] }
        ]
    },
    {
        slug: 'puntacana',
        name: 'Punta Cana, Dominican Republic',
        emoji: '🌴',
        url: '/upcomingtrips/puntacana',
        status: 'coming_soon',
        dates: 'October 2026',
        price: 'TBA',
        badge: '✈️ Coming Soon',
        tagline: 'White-sand beaches, crystal-clear waters, and the warmth of the Caribbean.',
        teaserDesc: 'White-sand beaches, crystal-clear waters, and the warmth of the Caribbean — Punta Cana is the perfect backdrop for an unforgettable collective experience. Full details dropping soon.',
        description: '',
        squadtrip: '',
        includes: [
            { icon: '🏖️', title: 'Beachfront Accommodations', desc: 'Hand-selected beachfront resorts.' },
            { icon: '🍹', title: 'Group Experiences', desc: 'Curated activities and cultural experiences.' },
            { icon: '💳', title: 'Flexible Payments', desc: 'Secure your spot with a deposit.' },
            { icon: '🧳', title: 'Solo-Friendly', desc: 'Roommate matching available.' }
        ],
        rooms: [],
        days: []
    },
    {
        slug: 'rio',
        name: 'Rio de Janeiro, Brazil',
        emoji: '🎉',
        url: '/upcomingtrips/rio',
        status: 'coming_soon',
        dates: 'December 2026',
        price: 'TBA',
        badge: '✈️ Coming Soon',
        tagline: 'Carnival energy, iconic beaches, and Christ the Redeemer.',
        teaserDesc: "End 2026 right. Carnival energy, iconic beaches, Christ the Redeemer, and samba nights — Rio is electric, and we're bringing the collective there for a December experience you won't forget.",
        description: '',
        squadtrip: '',
        includes: [
            { icon: '🌊', title: 'Iconic Locations', desc: 'Ipanema, Copacabana, and beyond.' },
            { icon: '🎶', title: 'Cultural Experiences', desc: 'Samba, cuisine, and local culture.' },
            { icon: '💳', title: 'Flexible Payments', desc: 'Secure your spot with a deposit.' },
            { icon: '🧳', title: 'Solo-Friendly', desc: 'Roommate matching available.' }
        ],
        rooms: [],
        days: []
    }
];

// Seed localStorage on first visit if no admin data exists
(function seedIfEmpty() {
    try {
        if (!localStorage.getItem('DESTINATIONS_LIST')) {
            localStorage.setItem('DESTINATIONS_LIST', JSON.stringify(window.SITE_DEST_DEFAULTS));
            window.SITE_DEST_DEFAULTS.forEach(function (d) {
                localStorage.setItem('DEST_' + d.slug, JSON.stringify(d));
            });
        }
    } catch (e) { }
})();
