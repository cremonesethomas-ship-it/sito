/* ============================================================
   Rivenditori — ricerca per città o CAP
   ============================================================ */

const input = document.getElementById('rsearch');
const list = document.getElementById('rlist');
const empty = document.getElementById('rEmpty');

if (input && list) {
  const items = [...list.querySelectorAll('[data-retailer]')];

  const run = () => {
    const q = input.value.trim().toLowerCase();
    let visible = 0;
    items.forEach(el => {
      const hit = !q || el.dataset.city.includes(q) || el.dataset.zip.startsWith(q);
      el.style.display = hit ? '' : 'none';
      if (hit) visible++;
    });
    if (empty) empty.hidden = visible > 0;
  };

  input.addEventListener('input', run);
  input.closest('form')?.addEventListener('submit', e => { e.preventDefault(); run(); });
}
