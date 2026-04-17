/* ============================================
   GALLERY PAGE — Lightbox & Filter JavaScript
   ============================================ */

(function () {
    'use strict';

    /* ——— ELEMENTS ——— */
    const grid = document.getElementById('galleryGrid');
    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightboxImg');
    const lbTitle = document.getElementById('lightboxTitle');
    const lbDesc = document.getElementById('lightboxDesc');
    const lbDownload = document.getElementById('lightboxDownload');
    const lbClose = document.getElementById('lightboxClose');
    const lbBackdrop = document.getElementById('lightboxBackdrop');
    const lbPrev = document.getElementById('lightboxPrev');
    const lbNext = document.getElementById('lightboxNext');
    const lbCurrent = document.getElementById('lightboxCurrent');
    const lbTotal = document.getElementById('lightboxTotal');
    const noResults = document.getElementById('noResults');
    const filterBtns = document.querySelectorAll('.filter-btn');

    /* ——— STATE ——— */
    let visibleCards = [];
    let currentIndex = 0;

    /* ——— FILTER LOGIC ——— */
    function getCards() {
        return Array.from(grid.querySelectorAll('.gallery-card:not(#noResults)'));
    }

    function applyFilter(filter) {
        const cards = getCards();
        visibleCards = [];

        cards.forEach(card => {
            const cats = (card.dataset.category || '').toLowerCase();
            const show = filter === 'all' || cats.includes(filter);
            if (show) {
                card.classList.remove('hidden');
                visibleCards.push(card);
            } else {
                card.classList.add('hidden');
            }
        });

        // Update count display
        const countEl = document.getElementById('photoCount');
        if (countEl) countEl.textContent = visibleCards.length;

        // No results
        if (noResults) {
            noResults.style.display = visibleCards.length === 0 ? 'block' : 'none';
        }
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyFilter(btn.dataset.filter || 'all');
        });
    });

    // Init with all
    applyFilter('all');

    /* ——— LIGHTBOX OPEN ——— */
    function openLightbox(card) {
        const src = card.dataset.src || '';
        const title = card.dataset.title || '';
        const desc = card.dataset.desc || '';

        // Find index in visible cards
        currentIndex = visibleCards.indexOf(card);
        if (currentIndex === -1) currentIndex = 0;

        loadImage(src, title, desc);
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
        updateCounter();
        lbClose.focus();
    }

    function closeLightbox() {
        lightbox.classList.remove('open', 'loading');
        document.body.style.overflow = '';
    }

    /* ——— IMAGE LOAD ——— */
    function loadImage(src, title, desc) {
        lightbox.classList.add('loading');
        lbImg.src = '';

        const img = new Image();
        img.onload = () => {
            lbImg.src = src;
            lbImg.alt = title;
            lightbox.classList.remove('loading');
        };
        img.onerror = () => {
            lightbox.classList.remove('loading');
        };
        img.src = src;

        lbTitle.textContent = title;
        lbDesc.textContent = desc;

        // Build a clean filename from title
        const filename = title
            .replace(/[✦&;]/g, '')
            .trim()
            .replace(/\s+/g, '-')
            .toLowerCase();

        lbDownload.href = src;
        lbDownload.setAttribute('download', `travelnliv-${filename}`);
    }

    /* ——— NAVIGATE ——— */
    function goTo(index) {
        if (!visibleCards.length) return;
        currentIndex = (index + visibleCards.length) % visibleCards.length;
        const card = visibleCards[currentIndex];
        loadImage(card.dataset.src || '', card.dataset.title || '', card.dataset.desc || '');
        updateCounter();
    }

    function updateCounter() {
        if (lbCurrent) lbCurrent.textContent = currentIndex + 1;
        if (lbTotal) lbTotal.textContent = visibleCards.length;
    }

    /* ——— EVENT LISTENERS ——— */

    // Delegate clicks on view buttons
    grid.addEventListener('click', e => {
        const viewBtn = e.target.closest('.view-btn');
        const card = e.target.closest('.gallery-card');

        if (!card) return;

        // Don't open lightbox when clicking the download link or view btn
        if (e.target.closest('.download-btn')) return;

        if (viewBtn || card) {
            e.preventDefault();
            openLightbox(card);
        }
    });

    lbClose.addEventListener('click', closeLightbox);
    lbBackdrop.addEventListener('click', closeLightbox);

    lbPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        goTo(currentIndex - 1);
    });

    lbNext.addEventListener('click', (e) => {
        e.stopPropagation();
        goTo(currentIndex + 1);
    });

    // Keyboard navigation
    document.addEventListener('keydown', e => {
        if (!lightbox.classList.contains('open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') goTo(currentIndex - 1);
        if (e.key === 'ArrowRight') goTo(currentIndex + 1);
    });

    // Touch swipe support
    let touchStartX = 0;
    lightbox.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    lightbox.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 50) {
            dx < 0 ? goTo(currentIndex + 1) : goTo(currentIndex - 1);
        }
    }, { passive: true });

})();
