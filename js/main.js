/* ============================================================
   1020 Ranch — Main JS
   ============================================================ */

/* ── Nav Scroll Behavior ── */
const nav = document.getElementById('nav');
const hasHero = document.querySelector('.hero');

function updateNav() {
  if (!nav) return;
  if (!hasHero) {
    nav.className = 'nav no-hero';
    return;
  }
  const scrolled = window.scrollY > 40;
  nav.className = scrolled ? 'nav scrolled' : 'nav hero-transparent';
}

if (nav) {
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();
}

/* ── Active Nav Link ── */
const currentFile = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav__link, .mobile-nav__link').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentFile || (currentFile === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

/* ── Mobile Nav ── */
const hamburger = document.querySelector('.nav__hamburger');
const mobileNav = document.querySelector('.mobile-nav');
const mobileClose = document.querySelector('.mobile-nav__close');

function openMobile() {
  mobileNav?.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMobile() {
  mobileNav?.classList.remove('open');
  document.body.style.overflow = '';
}

hamburger?.addEventListener('click', openMobile);
mobileClose?.addEventListener('click', closeMobile);

/* ── Testimonial Carousel ── */
class Carousel {
  constructor(el) {
    this.el = el;
    this.track = el.querySelector('.testimonial-track');
    this.slides = el.querySelectorAll('.testimonial-slide');
    this.dots = el.querySelectorAll('.testimonial__dot');
    this.current = 0;
    this.total = this.slides.length;

    el.querySelector('.testimonial__btn--prev')?.addEventListener('click', () => this.prev());
    el.querySelector('.testimonial__btn--next')?.addEventListener('click', () => this.next());
    this.dots.forEach((dot, i) => dot.addEventListener('click', () => this.go(i)));

    this.timer = setInterval(() => this.next(), 7000);
    el.addEventListener('mouseenter', () => clearInterval(this.timer));
    el.addEventListener('mouseleave', () => {
      this.timer = setInterval(() => this.next(), 7000);
    });
  }
  go(n) {
    this.current = ((n % this.total) + this.total) % this.total;
    this.track.style.transform = `translateX(-${this.current * 100}%)`;
    this.dots.forEach((d, i) => d.classList.toggle('active', i === this.current));
  }
  next() { this.go(this.current + 1); }
  prev() { this.go(this.current - 1); }
}
document.querySelectorAll('.testimonial-carousel').forEach(el => new Carousel(el));

/* ── Gallery Tabs ── */
document.querySelectorAll('.gallery-tabs').forEach(tabs => {
  const galleryEl = tabs.closest('.gallery-section') || tabs.closest('section') || tabs.parentElement;
  const items = galleryEl.querySelectorAll('.gallery-item');

  tabs.querySelectorAll('.gallery-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.querySelectorAll('.gallery-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;
      items.forEach(item => {
        const show = filter === 'all' || item.dataset.category === filter;
        item.style.display = show ? 'block' : 'none';
      });
    });
  });
});

/* ── Package Toggle (Included / Add-Ons) ── */
document.querySelectorAll('.toggle-tabs').forEach(tabs => {
  const card = tabs.closest('.package-card');

  tabs.querySelectorAll('.toggle-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.querySelectorAll('.toggle-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.target;
      card?.querySelectorAll('.toggle-panel').forEach(panel => {
        panel.classList.toggle('active', panel.dataset.panel === target);
      });
    });
  });

  // Init first active tab
  const firstTab = tabs.querySelector('.toggle-tab');
  if (firstTab) firstTab.click();
});

/* ── Event Type Tabs ── */
document.querySelectorAll('.event-tabs').forEach(tabBar => {
  const section = tabBar.closest('section') || tabBar.parentElement;
  const panels = section.querySelectorAll('.event-tab-panel');

  tabBar.querySelectorAll('.event-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      tabBar.querySelectorAll('.event-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.event;
      panels.forEach(panel => {
        panel.classList.toggle('active', panel.dataset.eventPanel === target);
      });
    });
  });
});

/* ── Counter Animation ── */
function animateCounters() {
  document.querySelectorAll('.counter__number').forEach(counter => {
    if (counter.dataset.animated) return;

    const rect = counter.getBoundingClientRect();
    if (rect.top > window.innerHeight || rect.bottom < 0) return;

    counter.dataset.animated = 'true';
    const target = parseInt(counter.dataset.target, 10);
    const duration = 2000;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.round(target * eased) + '+';
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

window.addEventListener('scroll', animateCounters, { passive: true });
animateCounters();

/* ── FAQ Accordion ── */
document.querySelectorAll('.accordion-trigger').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const item = trigger.closest('.accordion-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.accordion-item.open').forEach(el => el.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

/* ── Lightbox ── */
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lb-img');

document.querySelectorAll('.gallery-item img').forEach(img => {
  img.addEventListener('click', () => {
    if (!lb || !lbImg) return;
    lbImg.src = img.src;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

document.getElementById('lb-close')?.addEventListener('click', closeLb);
lb?.addEventListener('click', (e) => { if (e.target === lb) closeLb(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLb(); });

function closeLb() {
  lb?.classList.remove('open');
  document.body.style.overflow = '';
}

/* ── Smooth scroll for anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
