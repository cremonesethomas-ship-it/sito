import { esc, attr, url, productUrl, placeholder, figure, audienceLabel, pad2 } from '../lib/utils.mjs';

export function home(ctx) {
  const { dict, products } = ctx;
  const t = dict.home;
  const featured = products.slice(0, 6);
  const marqueeNames = [...products, ...products].map(p => p.name);

  return `
${heroSection(dict, t)}
${statsSection(dict, t, products)}
${manifestoSection(dict, t)}
${marqueeSection(marqueeNames)}
${featuredSection(dict, t, featured)}
${trioSection(dict, t)}
${anatomySection(dict, t)}
${quoteSection(t)}
${lookbookSection(dict, t)}
${retailersSection(dict, t)}
${newsletterSection(dict, t)}
`;
}

/* ─────────────────────────────────────────────── */

function heroSection(dict, t) {
  return `<section class="hero" id="hero">
  <div class="hero__fallback" data-parallax="0.3"></div>
  <canvas class="hero__canvas" id="heroCanvas" aria-hidden="true"></canvas>
  <div class="hero__noise"></div>
  <div class="hero__line"></div>

  <div class="hero__content">
    <span class="hero__eyebrow" data-hero="1">${esc(t.heroEyebrow)}</span>
    <h1 class="hero__title" data-split>${esc(t.heroTitle)}</h1>
    <span class="hero__accent" data-hero="2">${esc(t.heroAccent)}</span>
    <p class="hero__sub" data-hero="3">${esc(t.heroSub)}</p>
    <a class="btn-line" href="${attr(url(dict, 'collection'))}" data-hero="4">
      <span class="btn-line__line"></span>${esc(t.heroCta)}<span class="btn-line__line"></span>
    </a>
  </div>

  <div class="hero__scroll" data-hero="5">
    <span>${esc(dict.common.scroll)}</span>
    <div class="hero__ticker"></div>
  </div>
</section>`;
}

function statsSection(dict, t, products) {
  const colors = products.reduce((n, p) => n + p.colors.length, 0);
  const items = [
    [products.length, t.statModels],
    [3, t.statCollections],
    [colors, t.statColors],
    ['∞', t.statElegance],
  ];
  return `<div class="stats">
  ${items.map(([n, l]) => `<div class="stats__item" data-reveal>
    <div class="stats__n"${typeof n === 'number' ? ` data-count="${n}"` : ''}>${typeof n === 'number' ? '0' : esc(n)}</div>
    <div class="stats__l">${esc(l)}</div>
  </div>`).join('\n  ')}
</div>`;
}

function manifestoSection(dict, t) {
  return `<section class="section" id="manifesto">
  <div class="wrap manifesto">
    <div class="manifesto__left" data-reveal>
      <span class="eyebrow">${esc(t.manifestoEyebrow)}</span>
      <h2 class="h-section">${t.manifestoTitle}</h2>
      <div class="rule" style="margin-top:1.5rem"></div>
    </div>
    <div class="manifesto__right">
      <p class="lead" data-reveal style="margin-bottom:1.75rem">${t.manifestoP1}</p>
      <p class="lead" data-reveal>${t.manifestoP2}</p>
      <div class="manifesto__list" data-reveal>
        ${t.manifestoList.map(i => `<div class="manifesto__item"><i></i>${esc(i)}</div>`).join('\n        ')}
      </div>
    </div>
  </div>
</section>`;
}

function marqueeSection(names) {
  return `<div class="marquee" aria-hidden="true">
  <div class="marquee__track" id="marquee">
    ${names.map(n => `<span>${esc(n)}</span><span class="dot">·</span>`).join('')}
  </div>
</div>`;
}

function featuredSection(dict, t, featured) {
  return `<section class="section hscroll" id="featured">
  <div class="wrap">
    <div class="shead" data-reveal>
      <div>
        <span class="eyebrow">${esc(t.featuredEyebrow)}</span>
        <h2 class="h-section">${t.featuredTitle}</h2>
      </div>
      <a class="btn-line" href="${attr(url(dict, 'collection'))}">
        ${esc(dict.common.viewAll)}<span class="btn-line__line"></span>
      </a>
    </div>
  </div>

  <div class="hscroll__viewport" id="hscrollViewport">
    <div class="hscroll__track" id="hscrollTrack">
      ${featured.map((p, i) => `<a class="hitem" href="${attr(productUrl(dict, p.id))}">
        <div class="hitem__media">
          <span class="hitem__idx">${pad2(i + 1)}</span>
          ${p.images.main ? figure(p.images.main, p.name, 'hitem__img', '', '340px') : placeholder(dict.common.imageComing)}
        </div>
        <div class="hitem__name">${esc(p.name)}</div>
        <div class="hitem__sub">${esc(audienceLabel(dict, p.audience))} · ${esc(dict.shapes[p.shape])}</div>
      </a>`).join('\n      ')}
    </div>
  </div>
  <div class="hint-drag">${esc(dict.common.drag)}</div>
</section>`;
}

function trioSection(dict, t) {
  const cards = [
    ['uomo', dict.common.men, t.collectionMen],
    ['donna', dict.common.women, t.collectionWomen],
    ['unisex', dict.common.unisex, t.collectionUnisex],
  ];
  return `<section class="section" id="collections">
  <div class="wrap">
    <div class="shead" data-reveal>
      <div>
        <span class="eyebrow">${esc(t.collectionsEyebrow)}</span>
        <h2 class="h-section">${t.collectionsTitle}</h2>
      </div>
    </div>
  </div>
  <div class="trio">
    ${cards.map(([key, name, text]) => `<a class="trio__card" href="${attr(url(dict, 'collection'))}?gender=${attr(key)}" data-reveal>
      <div class="trio__bg">${placeholder('')}</div>
      <h3 class="trio__name">${esc(name)}</h3>
      <p class="trio__text">${esc(text)}</p>
      <span class="btn-line"><span class="btn-line__line"></span>${esc(dict.common.discover)}</span>
    </a>`).join('\n    ')}
  </div>
</section>`;
}

function anatomySection(dict, t) {
  const rows = [
    ['calibre', dict.specs.calibre, t.anatomyCalibre],
    ['bridge', dict.specs.bridge, t.anatomyBridge],
    ['front', dict.specs.front, t.anatomyFront],
    ['temple', dict.specs.temple, t.anatomyTemple],
  ];
  return `<section class="section" id="anatomy" style="background:var(--c-surface);border-block:1px solid var(--c-border)">
  <div class="wrap">
    <div class="shead" data-reveal>
      <div>
        <span class="eyebrow">${esc(t.anatomyEyebrow)}</span>
        <h2 class="h-section">${t.anatomyTitle}</h2>
        <p class="lead" style="margin-top:1.25rem;font-size:1rem">${esc(t.anatomyText)}</p>
      </div>
    </div>
    <div class="anatomy">
      <div class="anatomy__figure" data-reveal>
        ${anatomySvg()}
      </div>
      <div class="anatomy__list" data-reveal>
        ${rows.map(([key, k, v]) => `<div class="anatomy__row" data-dim="${attr(key)}" tabindex="0" role="button" aria-pressed="false">
          <div class="anatomy__k">${esc(k)}</div>
          <div class="anatomy__v">${esc(v)}</div>
        </div>`).join('\n        ')}
      </div>
    </div>
  </div>
</section>`;
}

function anatomySvg() {
  return `<svg class="anatomy__svg" id="anatomySvg" viewBox="0 0 420 200" role="img" aria-label="Diagramma delle misure di una montatura">
    <g class="frame">
      <ellipse class="frame-line" cx="128" cy="96" rx="62" ry="44"/>
      <ellipse class="frame-line" cx="292" cy="96" rx="62" ry="44"/>
      <path class="frame-line" d="M190 86c12-9 28-9 40 0"/>
      <path class="frame-line" d="M66 84 20 68"/>
      <path class="frame-line" d="M354 84 400 68"/>
    </g>
    <g class="dims">
      <g class="dim-line" data-dim="calibre">
        <path d="M66 152h124M66 146v12M190 146v12"/>
        <text x="128" y="172" fill="currentColor" font-size="11" text-anchor="middle" style="fill:var(--c-gold);font-family:var(--f-body);letter-spacing:.1em">CAL</text>
      </g>
      <g class="dim-line" data-dim="bridge">
        <path d="M190 46h40M190 40v12M230 40v12"/>
        <text x="210" y="32" fill="currentColor" font-size="11" text-anchor="middle" style="fill:var(--c-gold);font-family:var(--f-body);letter-spacing:.1em">PON</text>
      </g>
      <g class="dim-line" data-dim="front">
        <path d="M20 186h380M20 180v12M400 180v12"/>
        <text x="210" y="200" fill="currentColor" font-size="11" text-anchor="middle" style="fill:var(--c-gold);font-family:var(--f-body);letter-spacing:.1em">FRONT</text>
      </g>
      <g class="dim-line" data-dim="temple">
        <path d="M354 84 400 68M400 68l6 14"/>
        <text x="392" y="52" fill="currentColor" font-size="11" text-anchor="middle" style="fill:var(--c-gold);font-family:var(--f-body);letter-spacing:.1em">AST</text>
      </g>
    </g>
  </svg>`;
}

function quoteSection(t) {
  return `<section class="quote">
  <div class="quote__glow"></div>
  <div class="quote__mark" aria-hidden="true">&ldquo;</div>
  <div class="wrap">
    <blockquote class="quote__text" data-reveal>${esc(t.quote)}</blockquote>
    <div class="rule" style="margin:0 auto 1.25rem"></div>
    <div class="quote__attr">${esc(t.quoteAttr)}</div>
  </div>
</section>`;
}

function lookbookSection(dict, t) {
  return `<section class="section" id="lookbook-teaser">
  <div class="wrap">
    <div class="shead" data-reveal>
      <div>
        <span class="eyebrow">${esc(t.lookbookEyebrow)}</span>
        <h2 class="h-section">${t.lookbookTitle}</h2>
      </div>
      <a class="btn-line" href="${attr(url(dict, 'lookbook'))}">
        ${esc(t.lookbookCta)}<span class="btn-line__line"></span>
      </a>
    </div>
    <div class="lbteaser">
      ${[1, 2, 3, 4].map(i => `<div class="lbteaser__item" data-reveal data-parallax="0.08">${placeholder('')}</div>`).join('\n      ')}
    </div>
  </div>
</section>`;
}

function retailersSection(dict, t) {
  return `<section class="section section--tight">
  <div class="wrap">
    <div class="ctaband" data-reveal>
      <div>
        <span class="eyebrow">${esc(t.retailersEyebrow)}</span>
        <h2 class="h-sub">${t.retailersTitle}</h2>
      </div>
      <div>
        <p class="lead" style="font-size:1rem;margin-bottom:2rem">${esc(t.retailersText)}</p>
        <a class="btn" href="${attr(url(dict, 'retailers'))}">${esc(t.retailersCta)}</a>
      </div>
    </div>
  </div>
</section>`;
}

function newsletterSection(dict, t) {
  return `<section class="section section--tight" id="newsletter">
  <div class="wrap news">
    <div data-reveal>
      <h2 class="h-sub">${esc(t.newsletterTitle)}</h2>
      <p class="lead" style="font-size:1rem;margin-top:1rem">${esc(t.newsletterText)}</p>
    </div>
    <form class="news__form" name="newsletter" method="POST" data-netlify="true" netlify-honeypot="bot-field" data-form data-reveal
      data-required="${attr(dict.contact.required)}" data-success="${attr(dict.contact.formSuccess)}" data-error="${attr(dict.contact.formError)}">
      <input type="hidden" name="form-name" value="newsletter">
      <input type="hidden" name="lang" value="${attr(dict.lang)}">
      <p class="field--hp"><label>Bot<input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
      <div class="field">
        <label class="field__label" for="nl-email">${esc(dict.contact.formEmail)}</label>
        <input class="field__input" type="email" id="nl-email" name="email" required placeholder="${attr(t.newsletterPlaceholder)}" autocomplete="email">
      </div>
      <button class="btn" type="submit">${esc(t.newsletterCta)}</button>
    </form>
  </div>
</section>`;
}
