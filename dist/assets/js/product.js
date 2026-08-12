/* ============================================================
   Scheda prodotto — selettore colore e miniature
   ============================================================ */

const stage = document.getElementById('pdpStage');
const colorBtns = [...document.querySelectorAll('[data-color]')];
const thumbs = [...document.querySelectorAll('[data-thumb]')];

colorBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    colorBtns.forEach(b => b.classList.toggle('is-on', b === btn));
    swapImage(btn.dataset.color);
  });
});

thumbs.forEach(btn => {
  btn.addEventListener('click', () => {
    thumbs.forEach(b => b.classList.toggle('is-on', b === btn));
    swapImage(null, btn.dataset.thumb);
  });
});

/**
 * Cambia l'immagine dello stage.
 * Finché non ci sono le foto reali per variante colore, l'immagine resta
 * la stessa: la struttura è pronta e si attiva da sola quando i file esistono.
 */
function swapImage(colorId, explicitSrc) {
  if (!stage) return;
  const img = stage.querySelector('img');
  if (!img) return;

  const base = explicitSrc || (colorId ? img.dataset.base && `${img.dataset.base}-${colorId}` : null);
  if (!base) return;

  const probe = new Image();
  probe.onload = () => {
    if (window.gsap) {
      gsap.to(img, {
        opacity: 0, duration: 0.2,
        onComplete: () => { img.src = probe.src; gsap.to(img, { opacity: 1, duration: 0.3 }); },
      });
    } else {
      img.src = probe.src;
    }
  };
  probe.src = `${base}-800.jpg`;
}
