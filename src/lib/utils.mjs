/* Helper condivisi dal generatore statico */

export const LANGS = ['it', 'en', 'es'];
export const DEFAULT_LANG = 'it';

/** Escape per contenuto HTML */
export function esc(s = '') {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Escape per attributi (alias esplicito, stessa logica) */
export const attr = esc;

/** Rimuove i tag consentiti nei microcopy (<em>, <strong>) per usarli nei meta */
export function stripTags(s = '') {
  return String(s).replace(/<[^>]+>/g, '');
}

/** Costruisce un URL interno assoluto rispetto alla root del sito */
export function url(dict, key, ...parts) {
  const slug = dict.slugs[key] ?? '';
  const segs = [dict.lang, slug, ...parts].filter(Boolean);
  return '/' + segs.join('/') + '/';
}

/** URL della scheda prodotto */
export function productUrl(dict, id) {
  return url(dict, 'collection', id);
}

/** Sostituisce i segnaposto {chiave} in una stringa */
export function fill(tpl = '', vars = {}) {
  return String(tpl).replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? ''));
}

/** Numero con zero iniziale */
export function pad2(n) {
  return String(n).padStart(2, '0');
}

/** Segnaposto immagine: usato finché non arrivano le foto reali */
export function placeholder(label = '') {
  return `<div class="ph" aria-hidden="true">
      <svg class="ph__glasses" viewBox="0 0 200 64" fill="none" stroke="currentColor" stroke-width="1.2" style="color:var(--c-gold)">
        <ellipse cx="52" cy="32" rx="34" ry="24"/>
        <ellipse cx="148" cy="32" rx="34" ry="24"/>
        <path d="M86 28c5-4 23-4 28 0"/>
        <path d="M18 26 2 20"/>
        <path d="M182 26 198 20"/>
      </svg>
      ${label ? `<span class="ph__label">${esc(label)}</span>` : ''}
    </div>`;
}

/**
 * Figura immagine con fallback al segnaposto.
 * src: percorso base senza estensione (es. /assets/img/products/murano)
 */
export function figure(src, alt, cls = '', label = '', sizes = '(max-width: 900px) 100vw, 33vw') {
  if (!src) return placeholder(label);
  return `<picture>
      <source type="image/avif" srcset="${attr(src)}-400.avif 400w, ${attr(src)}-800.avif 800w, ${attr(src)}-1600.avif 1600w" sizes="${attr(sizes)}">
      <source type="image/webp" srcset="${attr(src)}-400.webp 400w, ${attr(src)}-800.webp 800w, ${attr(src)}-1600.webp 1600w" sizes="${attr(sizes)}">
      <img class="${attr(cls)}" src="${attr(src)}-800.jpg" alt="${attr(alt)}" loading="lazy" decoding="async" width="800" height="600">
    </picture>`;
}

/** Etichetta pubblico tradotta */
export function audienceLabel(dict, audience) {
  return dict.common[audience === 'uomo' ? 'men' : audience === 'donna' ? 'women' : 'unisex'];
}

/** Colori nella lingua corrente */
export function colorName(color, lang) {
  return color[lang] ?? color.it;
}
