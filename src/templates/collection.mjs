import { esc, attr, url, productUrl, placeholder, figure, audienceLabel, colorName } from '../lib/utils.mjs';

export function productCard(dict, p) {
  return `<article class="pcard" data-product
    data-gender="${attr(p.audience)}"
    data-shape="${attr(p.shape)}"
    data-material="${attr(p.material)}"
    data-name="${attr(p.name)}"
    data-calibre="${attr(p.specs.calibre)}">
  <a href="${attr(productUrl(dict, p.id))}" class="pcard__link" aria-label="${attr(p.name)}">
    <div class="pcard__media">
      ${p.images.main ? figure(p.images.main, p.name, 'pcard__img', '', '(max-width:560px) 100vw, (max-width:960px) 50vw, 33vw') : placeholder(dict.common.imageComing)}
      <div class="pcard__hint"><span>${esc(dict.common.details)}</span><i></i></div>
    </div>
    <div class="pcard__body">
      <div class="pcard__aud">${esc(audienceLabel(dict, p.audience))} · ${esc(dict.shapes[p.shape])}</div>
      <h3 class="pcard__name">${esc(p.name)}</h3>
      <p class="pcard__tag">${esc(p.tagline[dict.lang])}</p>
      <div class="pcard__swatches" aria-hidden="true">
        ${p.colors.map(c => `<span class="swatch" style="background:linear-gradient(135deg, ${attr(c.hex[0])}, ${attr(c.hex[1])})" title="${attr(colorName(c, dict.lang))}"></span>`).join('')}
      </div>
      <div class="pcard__specs">
        <span class="pcard__spec">${esc(dict.specs.calibre)} <b>${p.specs.calibre}</b></span>
        <span class="pcard__spec">${esc(dict.specs.bridge)} <b>${p.specs.bridge}</b></span>
        <span class="pcard__spec">${esc(dict.specs.front)} <b>${p.specs.front}</b></span>
      </div>
    </div>
  </a>
</article>`;
}

export function collection(ctx) {
  const { dict, products } = ctx;
  const t = dict.collection;

  const shapes = [...new Set(products.map(p => p.shape))];
  const materials = [...new Set(products.map(p => p.material))];

  return `
<header class="phead">
  <div class="phead__glow"></div>
  <div class="phead__inner">
    <nav class="breadcrumb" aria-label="breadcrumb">
      <a href="${attr(url(dict, 'home'))}">Home</a> <span>/</span> <span>${esc(dict.nav.collection)}</span>
    </nav>
    <span class="eyebrow">${esc(t.eyebrow)}</span>
    <h1 class="h-section">${t.title}</h1>
    <p class="phead__intro">${esc(t.intro)}</p>
  </div>
</header>

<div class="wrap">
  <div class="filters" role="region" aria-label="${attr(t.filterGender)}">
    <div class="filters__group">
      <span class="filters__legend">${esc(t.filterGender)}</span>
      <button class="chip is-on" data-filter="gender" data-value="all">${esc(t.filterAll)}</button>
      <button class="chip" data-filter="gender" data-value="uomo">${esc(dict.common.men)}</button>
      <button class="chip" data-filter="gender" data-value="donna">${esc(dict.common.women)}</button>
      <button class="chip" data-filter="gender" data-value="unisex">${esc(dict.common.unisex)}</button>
    </div>
    <div class="filters__group">
      <span class="filters__legend">${esc(t.filterShape)}</span>
      <button class="chip is-on" data-filter="shape" data-value="all">${esc(t.filterAll)}</button>
      ${shapes.map(s => `<button class="chip" data-filter="shape" data-value="${attr(s)}">${esc(dict.shapes[s])}</button>`).join('\n      ')}
    </div>
    <div class="filters__group">
      <span class="filters__legend">${esc(t.sortBy)}</span>
      <label class="sr-only" for="sort">${esc(t.sortBy)}</label>
      <select class="field__select" id="sort" data-sort style="width:auto;padding-inline:.5rem">
        <option value="default">${esc(t.sortDefault)}</option>
        <option value="name">${esc(t.sortName)}</option>
        <option value="calibre">${esc(t.sortCalibre)}</option>
      </select>
      <span class="filters__count" data-count-label data-one="${attr(t.resultsOne)}" data-many="${attr(t.resultsMany)}"></span>
    </div>
  </div>

  <div class="pgrid" id="pgrid">
    ${products.map(p => productCard(dict, p)).join('\n    ')}
  </div>

  <p class="lead" id="noResults" hidden style="padding-block:4rem;text-align:center">
    ${esc(t.noResults)}
    <button class="btn btn--ghost" data-reset style="margin-left:1rem">${esc(t.reset)}</button>
  </p>
</div>

<div style="height:var(--section-y)"></div>
`;
}
