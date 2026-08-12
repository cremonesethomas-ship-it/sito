/* ============================================================
   Collezione — filtri, ordinamento, animazione FLIP, URL condivisibili
   ============================================================ */

const grid = document.getElementById('pgrid');
if (grid) init();

function init() {
  const cards = [...grid.querySelectorAll('[data-product]')];
  const chips = [...document.querySelectorAll('.chip[data-filter]')];
  const sortSel = document.querySelector('[data-sort]');
  const countEl = document.querySelector('[data-count-label]');
  const empty = document.getElementById('noResults');
  const resetBtn = document.querySelector('[data-reset]');

  const hasFlip = typeof window.Flip !== 'undefined';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const state = { gender: 'all', shape: 'all', sort: 'default' };
  const order = new Map(cards.map((c, i) => [c, i]));

  /* Stato iniziale dall'URL */
  const params = new URLSearchParams(location.search);
  if (params.get('gender')) state.gender = params.get('gender');
  if (params.get('shape')) state.shape = params.get('shape');
  if (params.get('sort')) state.sort = params.get('sort');

  function syncChips() {
    chips.forEach(c => {
      c.classList.toggle('is-on', state[c.dataset.filter] === c.dataset.value);
    });
    if (sortSel) sortSel.value = state.sort;
  }

  function matches(card) {
    return (state.gender === 'all' || card.dataset.gender === state.gender)
        && (state.shape === 'all' || card.dataset.shape === state.shape);
  }

  function sorted(list) {
    const arr = [...list];
    if (state.sort === 'name') arr.sort((a, b) => a.dataset.name.localeCompare(b.dataset.name));
    else if (state.sort === 'calibre') arr.sort((a, b) => a.dataset.calibre - b.dataset.calibre);
    else arr.sort((a, b) => order.get(a) - order.get(b));
    return arr;
  }

  function updateUrl() {
    const p = new URLSearchParams();
    if (state.gender !== 'all') p.set('gender', state.gender);
    if (state.shape !== 'all') p.set('shape', state.shape);
    if (state.sort !== 'default') p.set('sort', state.sort);
    const q = p.toString();
    history.replaceState(null, '', q ? `?${q}` : location.pathname);
  }

  function apply(animate = true) {
    const flipState = (hasFlip && animate && !reduced) ? Flip.getState(cards) : null;

    const visible = sorted(cards.filter(matches));
    cards.forEach(c => { c.style.display = 'none'; });
    visible.forEach(c => { c.style.display = ''; grid.appendChild(c); });

    if (flipState) {
      Flip.from(flipState, {
        duration: 0.55,
        ease: 'power2.inOut',
        stagger: 0.02,
        absolute: true,
        onEnter: els => gsap.fromTo(els, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.4 }),
        onLeave: els => gsap.to(els, { opacity: 0, scale: 0.96, duration: 0.25 }),
      });
    }

    if (countEl) {
      const n = visible.length;
      countEl.textContent = n === 1
        ? countEl.dataset.one
        : (countEl.dataset.many || '{n}').replace('{n}', n);
    }
    if (empty) empty.hidden = visible.length > 0;

    updateUrl();
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      state[chip.dataset.filter] = chip.dataset.value;
      syncChips();
      apply();
    });
  });

  sortSel?.addEventListener('change', () => { state.sort = sortSel.value; apply(); });

  resetBtn?.addEventListener('click', () => {
    state.gender = 'all'; state.shape = 'all'; state.sort = 'default';
    syncChips(); apply();
  });

  syncChips();
  apply(false);
}
