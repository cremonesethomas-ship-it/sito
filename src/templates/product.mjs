import { esc, attr, url, productUrl, placeholder, figure, audienceLabel, colorName } from '../lib/utils.mjs';
import { productCard } from './collection.mjs';

export function product(ctx) {
  const { dict, p, products } = ctx;
  const t = dict.product;

  const related = products
    .filter(x => x.id !== p.id)
    .sort((a, b) => (a.audience === p.audience ? -1 : 1) - (b.audience === p.audience ? -1 : 1))
    .slice(0, 3);

  const specs = [
    [dict.specs.calibre, p.specs.calibre],
    [dict.specs.bridge, p.specs.bridge],
    [dict.specs.front, p.specs.front],
    [dict.specs.temple, p.specs.temple],
  ];

  return `
<header class="phead" style="padding-bottom:var(--sp-6)">
  <div class="phead__glow"></div>
  <div class="phead__inner">
    <nav class="breadcrumb" aria-label="breadcrumb">
      <a href="${attr(url(dict, 'home'))}">Home</a> <span>/</span>
      <a href="${attr(url(dict, 'collection'))}">${esc(dict.nav.collection)}</a> <span>/</span>
      <span>${esc(p.name)}</span>
    </nav>
  </div>
</header>

<section class="section" style="padding-top:var(--sp-7)">
  <div class="wrap pdp">
    <div class="pdp__media" data-reveal>
      <div class="pdp__stage" id="pdpStage">
        ${p.images.main ? figure(p.images.main, p.name, '', '', '(max-width:900px) 100vw, 55vw') : placeholder(dict.common.imageComing)}
      </div>
      ${p.images.gallery.length ? `<div class="pdp__thumbs">
        ${p.images.gallery.map((g, i) => `<button class="pdp__thumb${i === 0 ? ' is-on' : ''}" data-thumb="${attr(g)}" aria-label="${attr(p.name)} ${i + 1}"></button>`).join('\n        ')}
      </div>` : ''}
    </div>

    <div class="pdp__info">
      <div class="pcard__aud" data-reveal>${esc(audienceLabel(dict, p.audience))} · ${esc(dict.shapes[p.shape])} · ${esc(dict.materials[p.material])}</div>
      <h1 class="pdp__title" data-reveal>${esc(p.name)}</h1>
      <p class="pdp__tag" data-reveal>${esc(p.tagline[dict.lang])}</p>

      <p class="pdp__insp" data-reveal>${esc(p.inspiration[dict.lang])}</p>

      <div class="pdp__specs" data-reveal>
        ${specs.map(([k, v]) => `<div class="pdp__spec">
          <div class="pdp__spec-k">${esc(k)}</div>
          <div class="pdp__spec-v">${v}<span class="pdp__spec-u">${esc(dict.common.mm)}</span></div>
        </div>`).join('\n        ')}
      </div>

      <div data-reveal>
        <div class="filters__legend" style="margin-bottom:.75rem">${esc(t.colorsAvailable)}</div>
        <div class="pdp__colors">
          ${p.colors.map((c, i) => `<button class="pdp__color${i === 0 ? ' is-on' : ''}" data-color="${attr(c.id)}">
            <span class="swatch" style="background:linear-gradient(135deg, ${attr(c.hex[0])}, ${attr(c.hex[1])})"></span>
            ${esc(colorName(c, dict.lang))}
          </button>`).join('\n          ')}
        </div>
      </div>

      <div class="pdp__actions" data-reveal>
        <a class="btn btn--solid" href="${attr(url(dict, 'contact'))}?model=${attr(p.id)}">${esc(t.requestInfo)}</a>
        <a class="btn btn--ghost" href="${attr(url(dict, 'retailers'))}">${esc(t.findOptician)}</a>
      </div>

      <div style="margin-top:var(--sp-7);padding-top:var(--sp-6);border-top:1px solid var(--c-border)" data-reveal>
        <h2 class="h-sub" style="font-size:1.4rem;margin-bottom:.75rem">${esc(t.fitTitle)}</h2>
        <p class="lead" style="font-size:.9rem">${esc(t.fitText)}</p>
        <p class="label" style="margin-top:1rem;color:var(--c-gold)">${p.specs.calibre} □ ${p.specs.bridge} — ${p.specs.temple}</p>
      </div>
    </div>
  </div>
</section>

<section class="section" style="border-top:1px solid var(--c-border)">
  <div class="wrap">
    <div class="shead" data-reveal>
      <h2 class="h-sub">${esc(t.related)}</h2>
      <a class="btn-line" href="${attr(url(dict, 'collection'))}">${esc(t.backToCollection)}<span class="btn-line__line"></span></a>
    </div>
    <div class="pgrid">
      ${related.map(r => productCard(dict, r)).join('\n      ')}
    </div>
  </div>
</section>
`;
}

/** JSON-LD del prodotto */
export function productJsonLd(ctx) {
  const { dict, p, site } = ctx;
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${p.name} — ${site.name}`,
    brand: { '@type': 'Brand', name: site.name },
    category: 'Eyewear',
    material: dict.materials[p.material],
    description: p.inspiration[dict.lang],
    url: site.domain + productUrl(dict, p.id),
    color: p.colors.map(c => colorName(c, dict.lang)),
    additionalProperty: [
      { '@type': 'PropertyValue', name: dict.specs.calibre, value: p.specs.calibre, unitCode: 'MMT' },
      { '@type': 'PropertyValue', name: dict.specs.bridge, value: p.specs.bridge, unitCode: 'MMT' },
      { '@type': 'PropertyValue', name: dict.specs.front, value: p.specs.front, unitCode: 'MMT' },
      { '@type': 'PropertyValue', name: dict.specs.temple, value: p.specs.temple, unitCode: 'MMT' },
    ],
  };
}
