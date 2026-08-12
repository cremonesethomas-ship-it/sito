/* ============================================================
   VENEZIA EYEWEAR — comportamenti comuni
   Dipende da vendor.js (gsap, ScrollTrigger, Flip, Lenis)
   ============================================================ */

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE_POINTER = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

const hasGsap = typeof window.gsap !== 'undefined';
if (hasGsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

/* ── Memoria della lingua scelta ─────────────────────────── */
(function rememberLang() {
  const lang = document.documentElement.lang;
  try { localStorage.setItem('ve-lang', lang); } catch (e) {}
  $$('.langs__item').forEach(a => a.addEventListener('click', () => {
    try { localStorage.setItem('ve-lang', a.getAttribute('hreflang')); } catch (e) {}
  }));
})();

/* ── Smooth scroll ───────────────────────────────────────── */
let lenis = null;
function initLenis() {
  if (REDUCED || typeof window.Lenis === 'undefined') return;
  lenis = new Lenis({ duration: 1.05, smoothWheel: true, wheelMultiplier: 0.9, touchMultiplier: 1.6 });
  if (hasGsap) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  } else {
    const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
  // Ancore interne
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = $(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -80 });
    });
  });
}

/* ── Preloader: progresso reale ──────────────────────────── */
function initPreloader() {
  const pre = $('#preloader');
  if (!pre) return Promise.resolve();
  const bar = $('#preBar');
  const num = $('#preNum');

  const imgs = $$('img');
  const total = imgs.length + 1; // +1 = evento load della pagina
  let done = 0;

  const update = () => {
    const pct = Math.min(100, Math.round((done / total) * 100));
    if (bar) bar.style.width = pct + '%';
    if (num) num.textContent = pct + '%';
  };
  update();

  const tick = () => { done++; update(); };
  imgs.forEach(img => {
    if (img.complete) tick();
    else { img.addEventListener('load', tick, { once: true }); img.addEventListener('error', tick, { once: true }); }
  });

  return new Promise(resolve => {
    const finish = () => {
      done = total; update();
      setTimeout(() => {
        pre.classList.add('is-done');
        setTimeout(() => { pre.remove(); resolve(); }, 650);
      }, 220);
    };
    if (document.readyState === 'complete') finish();
    else window.addEventListener('load', finish, { once: true });
    // rete di sicurezza: non bloccare mai il sito
    setTimeout(() => { if (document.body.contains(pre)) finish(); }, 6000);
  });
}

/* ── Cursore ─────────────────────────────────────────────── */
function initCursor() {
  if (!FINE_POINTER || REDUCED) return;
  const dot = $('#cursor');
  const ring = $('#cursorFollow');
  if (!dot || !ring) return;

  let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;

  addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
  addEventListener('mouseleave', () => { dot.classList.add('is-hidden'); ring.classList.add('is-hidden'); });
  addEventListener('mouseenter', () => { dot.classList.remove('is-hidden'); ring.classList.remove('is-hidden'); });

  (function loop() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    dot.style.transform  = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  })();

  const activate   = () => { dot.classList.add('is-active'); ring.classList.add('is-active'); };
  const deactivate = () => { dot.classList.remove('is-active'); ring.classList.remove('is-active'); };
  document.addEventListener('mouseover', e => {
    if (e.target.closest('a, button, [role="button"], input, select, textarea, .pcard, .hitem')) activate();
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest('a, button, [role="button"], input, select, textarea, .pcard, .hitem')) deactivate();
  });
}

/* ── Navigazione ─────────────────────────────────────────── */
function initNav() {
  const nav = $('#nav');
  if (!nav) return;
  let last = 0;
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 40);
    nav.classList.toggle('is-hidden', y > 400 && y > last && !$('#menu.is-open'));
    last = y;
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Menu mobile con gestione del focus */
  const burger = $('#burger');
  const menu = $('#menu');
  if (!burger || !menu) return;

  let lastFocus = null;
  const open = () => {
    lastFocus = document.activeElement;
    menu.hidden = false;
    requestAnimationFrame(() => menu.classList.add('is-open'));
    burger.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('is-locked');
    lenis && lenis.stop();
    $('.menu__link', menu)?.focus();
  };
  const close = () => {
    menu.classList.remove('is-open');
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('is-locked');
    lenis && lenis.start();
    setTimeout(() => { menu.hidden = true; }, 400);
    lastFocus?.focus();
  };
  burger.addEventListener('click', () => (menu.classList.contains('is-open') ? close() : open()));
  menu.addEventListener('click', e => { if (e.target.closest('a')) close(); });
  addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) close();
    if (e.key === 'Tab' && menu.classList.contains('is-open')) {
      const f = $$('a, button', menu);
      if (!f.length) return;
      const first = f[0], lastEl = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); lastEl.focus(); }
      else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); first.focus(); }
    }
  });
}

/* ── Reveal allo scroll ──────────────────────────────────── */
function initReveal() {
  const els = $$('[data-reveal]');
  if (!els.length) return;
  if (REDUCED || !hasGsap) { els.forEach(e => (e.style.opacity = 1)); return; }

  els.forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 30, clipPath: 'inset(0% 0% 12% 0%)' },
      {
        opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
  });
}

/* ── Intro hero ──────────────────────────────────────────── */
function heroIntro() {
  const title = $('[data-split]');
  const items = $$('[data-hero]').sort((a, b) => a.dataset.hero - b.dataset.hero);

  if (title) {
    const text = title.textContent.trim();
    title.innerHTML = text.split('').map(c =>
      `<span class="char">${c === ' ' ? '&nbsp;' : c}</span>`).join('');
  }
  if (REDUCED || !hasGsap) { items.forEach(i => (i.style.opacity = 1)); return; }

  gsap.set(items, { opacity: 0, y: 22 });
  gsap.set('.char', { yPercent: 115 });

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.to(items[0] || {}, { opacity: 1, y: 0, duration: 0.7 }, 0.1)
    .to('.char', { yPercent: 0, stagger: 0.045, duration: 0.9 }, 0.25)
    .to(items[1] || {}, { opacity: 1, y: 0, duration: 0.7 }, 0.7)
    .to(items[2] || {}, { opacity: 1, y: 0, duration: 0.6 }, 0.95)
    .to(items[3] || {}, { opacity: 1, y: 0, duration: 0.6 }, 1.1)
    .to(items[4] || {}, { opacity: 1, duration: 0.6 }, 1.35);
}

/* ── Contatori ───────────────────────────────────────────── */
function initCounters() {
  $$('[data-count]').forEach(el => {
    const target = +el.dataset.count;
    if (!hasGsap || REDUCED) { el.textContent = target; return; }
    ScrollTrigger.create({
      trigger: el, start: 'top 92%', once: true,
      onEnter: () => {
        const o = { v: 0 };
        gsap.to(o, {
          v: target, duration: 1.4, ease: 'power2.out',
          onUpdate: () => (el.textContent = Math.floor(o.v)),
          onComplete: () => (el.textContent = target),
        });
      },
    });
  });
}

/* ── Marquee reattivo alla direzione dello scroll ────────── */
function initMarquee() {
  const track = $('#marquee');
  if (!track || REDUCED || !hasGsap) return;
  const half = track.scrollWidth / 2;
  if (!half) return;

  const tween = gsap.to(track, {
    x: -half, duration: 34, ease: 'none', repeat: -1,
    modifiers: { x: gsap.utils.unitize(x => parseFloat(x) % half) },
  });

  ScrollTrigger.create({
    onUpdate: self => {
      const dir = self.direction;
      gsap.to(tween, { timeScale: dir === 1 ? 1 : -1, overwrite: true, duration: 0.4 });
    },
  });
}

/* ── Scroll orizzontale ──────────────────────────────────── */
function initHScroll() {
  const viewport = $('#hscrollViewport');
  const track = $('#hscrollTrack');
  if (!viewport || !track) return;

  const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);

  if (!REDUCED && hasGsap && window.innerWidth > 720) {
    gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: viewport.closest('section'),
        start: 'top top',
        end: () => '+=' + distance(),
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });
  } else {
    // Su mobile e con movimento ridotto: scroll orizzontale nativo
    viewport.style.overflowX = 'auto';
    viewport.style.scrollSnapType = 'x proximity';
    viewport.setAttribute('data-lenis-prevent', '');
  }

  /* Trascinamento con il mouse */
  let down = false, startX = 0, startScroll = 0;
  viewport.addEventListener('pointerdown', e => {
    if (viewport.style.overflowX !== 'auto') return;
    down = true; startX = e.clientX; startScroll = viewport.scrollLeft;
    viewport.setPointerCapture(e.pointerId);
  });
  viewport.addEventListener('pointermove', e => {
    if (!down) return;
    viewport.scrollLeft = startScroll - (e.clientX - startX) * 1.4;
  });
  viewport.addEventListener('pointerup', () => (down = false));
}

/* ── Parallax leggero ────────────────────────────────────── */
function initParallax() {
  if (REDUCED || !hasGsap) return;
  $$('[data-parallax]').forEach(el => {
    const amount = parseFloat(el.dataset.parallax) || 0.15;
    gsap.to(el, {
      yPercent: amount * 100,
      ease: 'none',
      scrollTrigger: { trigger: el.closest('section') || el, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}

/* ── Diagramma anatomia ──────────────────────────────────── */
function initAnatomy() {
  const rows = $$('.anatomy__row');
  if (!rows.length) return;
  const dims = $$('#anatomySvg .dim-line');

  const show = key => {
    dims.forEach(d => d.classList.toggle('is-on', d.dataset.dim === key));
    rows.forEach(r => {
      const on = r.dataset.dim === key;
      r.classList.toggle('is-on', on);
      r.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  };

  rows.forEach(r => {
    r.addEventListener('mouseenter', () => show(r.dataset.dim));
    r.addEventListener('focus', () => show(r.dataset.dim));
    r.addEventListener('click', () => show(r.dataset.dim));
    r.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(r.dataset.dim); }
    });
  });
  show('calibre');
}

/* ── Tilt 3D sulle card ──────────────────────────────────── */
function initTilt() {
  if (!FINE_POINTER || REDUCED || !hasGsap) return;
  $$('.pcard').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const cx = (e.clientX - r.left) / r.width - 0.5;
      const cy = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(card, { rotateY: cx * 5, rotateX: -cy * 3.5, duration: 0.5, ease: 'power2.out', transformPerspective: 900 });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'power2.out' });
    });
  });
}

/* ── Form: validazione + invio Netlify ───────────────────── */
function initForms() {
  $$('[data-form]').forEach(form => {
    const note = $('[data-form-note]', form);

    form.addEventListener('submit', async e => {
      e.preventDefault();

      // validazione
      let valid = true;
      $$('input, textarea, select', form).forEach(f => {
        const field = f.closest('.field');
        if (!field) return;
        field.classList.remove('has-error');
        $('.field__error', field)?.remove();
        if (f.required && !f.value.trim()) {
          valid = false;
          field.classList.add('has-error');
          field.insertAdjacentHTML('beforeend', `<span class="field__error">${form.dataset.required || '—'}</span>`);
        }
      });
      if (!form.checkValidity()) { form.reportValidity(); valid = false; }
      if (!valid) return;

      const btn = $('button[type="submit"]', form);
      btn && (btn.disabled = true);

      try {
        const data = new FormData(form);
        await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(data).toString(),
        });
        if (note) {
          note.hidden = false;
          note.className = 'form-note is-ok';
          note.textContent = form.dataset.success || '✓';
        }
        form.reset();
      } catch (err) {
        if (note) {
          note.hidden = false;
          note.className = 'form-note is-ko';
          note.textContent = form.dataset.error || '×';
        }
      } finally {
        btn && (btn.disabled = false);
      }
    });
  });
}

/* ── Avvio ───────────────────────────────────────────────── */
async function boot() {
  initCursor();
  initNav();
  initForms();
  initLenis();

  await initPreloader();

  heroIntro();
  initReveal();
  initCounters();
  initMarquee();
  initHScroll();
  initParallax();
  initAnatomy();
  initTilt();

  if (hasGsap) ScrollTrigger.refresh();
  document.dispatchEvent(new CustomEvent('ve:ready'));
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();

export { $, $$, REDUCED, hasGsap };
