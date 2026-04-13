/* ============================================
   TRAVELNLIV — Shared JavaScript
   Navigation, Scroll Effects, Animations, FAQs
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ================================================
     1. NAV — scroll-aware background
     ================================================ */
  const nav = document.getElementById('nav');
  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 48) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ================================================
     2. MOBILE NAV — hamburger toggle
     ================================================ */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const mobileClose = document.getElementById('mobileNavClose');

  const openMobileNav = () => {
    if (!mobileNav) return;
    mobileNav.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileNav = () => {
    if (!mobileNav) return;
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  };

  hamburger && hamburger.addEventListener('click', openMobileNav);
  mobileClose && mobileClose.addEventListener('click', closeMobileNav);

  // Close on link click
  if (mobileNav) {
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileNav);
    });
  }

  /* ================================================
     3. SCROLL REVEAL — .reveal elements
     ================================================ */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger sibling reveals
          const siblings = entry.target.parentElement
            ? Array.from(entry.target.parentElement.querySelectorAll('.reveal'))
            : [];
          const idx = siblings.indexOf(entry.target);
          const delay = Math.min(idx * 80, 400);
          entry.target.style.transitionDelay = `${delay}ms`;
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    reveals.forEach(el => observer.observe(el));
  }

  /* ================================================
     4. FAQ ACCORDIONS — any page
     ================================================ */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-q');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all others
      faqItems.forEach(other => other.classList.remove('open'));
      // Toggle this one
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ================================================
     5. STICKY CTA (Zanzibar page)
     ================================================ */
  const stickyCta = document.getElementById('stickyCta');
  if (stickyCta) {
    let showThreshold = window.innerHeight * 0.6;
    const onScrollSticky = () => {
      if (window.scrollY > showThreshold) {
        stickyCta.classList.add('visible');
      } else {
        stickyCta.classList.remove('visible');
      }
    };
    window.addEventListener('scroll', onScrollSticky, { passive: true });
  }

  /* ================================================
     6. PAGE NAV LINKS — active state (Zanzibar)
     ================================================ */
  const pageNavLinks = document.querySelectorAll('.page-nav-link');
  if (pageNavLinks.length > 0) {
    const sections = Array.from(pageNavLinks)
      .map(l => document.getElementById(l.dataset.section))
      .filter(Boolean);

    const onScrollNav = () => {
      let current = '';
      sections.forEach(sec => {
        const top = sec.getBoundingClientRect().top;
        if (top < 200) current = sec.id;
      });
      pageNavLinks.forEach(l => {
        l.classList.toggle('active', l.dataset.section === current);
      });
    };

    window.addEventListener('scroll', onScrollNav, { passive: true });
  }

  /* ================================================
     7. ITINERARY IMAGE SWITCHER (Zanzibar page)
     ================================================ */
  const itinDays = document.querySelectorAll('.itin-day');
  const itinImg = document.getElementById('itinImg');
  const itinCapDay = document.getElementById('itinCaptionDay');
  const itinCapText = document.getElementById('itinCaptionText');

  const dayImages = {
    1: { src: 'zanzibar_hero.png', caption: 'Welcome to Zanzibar' },
    2: { src: 'stone_town.png', caption: 'Spice Farm & Stone Town' },
    3: { src: 'zanzibar_hero.png', caption: 'Prison Island & Sandbank' },
    4: { src: 'group_travel.png', caption: 'Move to Kiwengwa' },
    5: { src: 'snorkeling_mnemba.png', caption: 'Jozani Forest & Turtle Cave' },
    6: { src: 'snorkeling_mnemba.png', caption: 'Mnemba Island Catamaran' },
    7: { src: 'group_travel.png', caption: 'Leisure Day & Farewell Dinner' },
    8: { src: 'zanzibar_hero.png', caption: 'Departure Day' },
  };

  if (itinImg && itinDays.length > 0) {
    const itinObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const day = parseInt(entry.target.dataset.day, 10);
          const data = dayImages[day];
          if (data) {
            itinImg.style.opacity = '0';
            setTimeout(() => {
              itinImg.src = data.src;
              itinImg.alt = data.caption;
              itinCapDay.textContent = `Day ${day}`;
              itinCapText.textContent = data.caption;
              itinImg.style.opacity = '1';
            }, 250);
          }
        }
      });
    }, { threshold: 0.5 });

    itinDays.forEach(day => itinObserver.observe(day));
  }

  /* ================================================
     8. DEPARTURE PILLS (Zanzibar booking section)
     ================================================ */
  const depPills = document.querySelectorAll('.departure-pill');
  const bookBtns = document.querySelectorAll('[id^="book-"]');

  const week1BookLink = 'https://outofofficecollective.wetravel.com/trips/out-of-office-collective-to-zanzibar-out-of-office-collective-0378633529';
  const week2BookLink = 'https://outofofficecollective.wetravel.com/trips/out-of-office-collective-to-zanzibar-week-2-out-of-office-collective-4348417120';

  if (depPills.length > 0) {
    depPills.forEach(pill => {
      pill.addEventListener('click', () => {
        depPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        const isWeek2 = pill.id === 'dep-week2';
        const link = isWeek2 ? week2BookLink : week1BookLink;
        const label = isWeek2 ? 'Book Now — Week 2' : 'Book Now — Week 1';

        // Update all booking anchor buttons on the price cards
        document.querySelectorAll('.price-card a.btn').forEach(btn => {
          const svg = btn.querySelector('svg');
          btn.href = link;
          btn.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) node.textContent = label + ' ';
          });
        });
      });
    });
  }

  /* ================================================
     9. SMOOTH SCROLL for anchor links
     ================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ================================================
     10. FAQs SIDEBAR — active link on scroll
     ================================================ */
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  if (sidebarLinks.length > 0) {
    const faqSections = Array.from(sidebarLinks)
      .map(l => document.getElementById(l.dataset.target))
      .filter(Boolean);

    const onScrollSidebar = () => {
      let current = faqSections[0]?.id || '';
      faqSections.forEach(sec => {
        if (sec.getBoundingClientRect().top < 180) current = sec.id;
      });
      sidebarLinks.forEach(l => {
        l.classList.toggle('active', l.dataset.target === current);
      });
    };

    window.addEventListener('scroll', onScrollSidebar, { passive: true });
  }

  /* ================================================
     11. HERO SCROLL HINT — hide on scroll
     ================================================ */
  const scrollHint = document.getElementById('scrollHint');
  if (scrollHint) {
    window.addEventListener('scroll', () => {
      scrollHint.style.opacity = window.scrollY > 120 ? '0' : '0.6';
    }, { passive: true });
  }

  /* ================================================
     12. WHO WE ARE — video play / pause
     ================================================ */
  const whoVideo = document.getElementById('whoVideo');
  const videoPlayBtn = document.getElementById('videoPlayBtn');
  const playIcon = document.getElementById('playIcon');
  const pauseIcon = document.getElementById('pauseIcon');
  const videoWrap = whoVideo ? whoVideo.closest('.about-video-wrap') : null;

  if (whoVideo && videoPlayBtn && videoWrap) {
    const setPlaying = (isPlaying) => {
      playIcon.style.display = isPlaying ? 'none' : 'block';
      pauseIcon.style.display = isPlaying ? 'block' : 'none';
      videoWrap.classList.toggle('playing', isPlaying);
      videoWrap.classList.toggle('paused', !isPlaying);
    };

    videoPlayBtn.addEventListener('click', () => {
      if (whoVideo.paused) {
        whoVideo.muted = false; // ensure audio is on
        whoVideo.play().then(() => setPlaying(true)).catch(() => { });
      } else {
        whoVideo.pause();
        setPlaying(false);
      }
    });

    whoVideo.addEventListener('ended', () => setPlaying(false));
    whoVideo.addEventListener('pause', () => setPlaying(false));
    whoVideo.addEventListener('play', () => setPlaying(true));
  }

});


/* ================================================
   GLOBAL — Event Notify Form Handler
   ================================================ */
function handleEventNotify(e) {
  e.preventDefault();
  const form = document.getElementById('event-notify-form');
  const success = document.getElementById('event-notify-success');
  if (form && success) {
    form.style.display = 'none';
    success.style.display = 'block';
  }
}
