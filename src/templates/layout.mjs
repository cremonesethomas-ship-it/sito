import { esc, attr, url, LANGS } from '../lib/utils.mjs';

/**
 * Shell HTML comune a tutte le pagine.
 * ctx = { dict, dicts, site, page, title, desc, ogImage, jsonLd, body, bodyClass, scripts }
 */
export function layout(ctx) {
  const { dict, dicts, site, page } = ctx;
  const canonical = site.domain + ctx.path;

  const alternates = LANGS.map(l => {
    const d = dicts[l];
    const href = site.domain + (ctx.altPath ? ctx.altPath(d) : url(d, page));
    return `<link rel="alternate" hreflang="${attr(l)}" href="${attr(href)}">`;
  }).join('\n  ');

  const xDefault = `<link rel="alternate" hreflang="x-default" href="${attr(site.domain + (ctx.altPath ? ctx.altPath(dicts.it) : url(dicts.it, page)))}">`;

  return `<!DOCTYPE html>
<html lang="${attr(dict.lang)}" dir="${attr(dict.dir)}" class="no-js">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(ctx.title)}</title>
  <meta name="description" content="${attr(ctx.desc)}">
  <link rel="canonical" href="${attr(canonical)}">
  ${alternates}
  ${xDefault}

  <meta property="og:type" content="${attr(ctx.ogType || 'website')}">
  <meta property="og:site_name" content="${attr(site.name)}">
  <meta property="og:locale" content="${attr(dict.locale.replace('-', '_'))}">
  <meta property="og:title" content="${attr(ctx.title)}">
  <meta property="og:description" content="${attr(ctx.desc)}">
  <meta property="og:url" content="${attr(canonical)}">
  <meta property="og:image" content="${attr(site.domain + (ctx.ogImage || '/assets/img/og/default.jpg'))}">
  <meta name="twitter:card" content="summary_large_image">

  <meta name="theme-color" content="#080808">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">

  <link rel="preload" href="/assets/fonts/cormorant-garamond-300.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/assets/fonts/inter-300.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/assets/css/main.css">

  <script>document.documentElement.classList.remove('no-js');</script>
  ${ctx.jsonLd ? `<script type="application/ld+json">${JSON.stringify(ctx.jsonLd)}</script>` : ''}
</head>
<body class="${attr(ctx.bodyClass || '')}">

<a class="skip-link" href="#main">${esc(dict.common.skipToContent)}</a>

<div class="preloader" id="preloader" role="status" aria-live="polite">
  <div class="preloader__logo">Venezia Eyewear</div>
  <div class="preloader__track"><div class="preloader__bar" id="preBar"></div></div>
  <div class="preloader__num" id="preNum">0%</div>
  <span class="sr-only">${esc(dict.common.loading)}</span>
</div>

<div class="cursor" id="cursor" aria-hidden="true"></div>
<div class="cursor-follow" id="cursorFollow" aria-hidden="true"></div>

${nav(ctx)}
${mobileMenu(ctx)}

<main id="main">
${ctx.body}
</main>

${footer(ctx)}

<script src="/assets/js/vendor.js" defer></script>
<script type="module" src="/assets/js/main.js"></script>
${(ctx.scripts || []).map(s => `<script type="module" src="${attr(s)}"></script>`).join('\n')}
</body>
</html>`;
}

function navItems(dict) {
  return [
    ['collection', dict.nav.collection],
    ['brand', dict.nav.brand],
    ['craft', dict.nav.craft],
    ['lookbook', dict.nav.lookbook],
    ['retailers', dict.nav.retailers],
    ['contact', dict.nav.contact],
  ];
}

function langSwitcher(ctx, cls = 'langs') {
  const { dicts, dict } = ctx;
  return `<div class="${attr(cls)}" role="group" aria-label="${attr(dict.nav.language)}">
    ${LANGS.map((l, i) => {
      const d = dicts[l];
      const href = ctx.altPath ? ctx.altPath(d) : url(d, ctx.page);
      const cur = l === dict.lang;
      return `${i ? '<span class="langs__sep">/</span>' : ''}<a class="langs__item" href="${attr(href)}" hreflang="${attr(l)}" lang="${attr(l)}"${cur ? ' aria-current="true"' : ''}>${esc(l)}</a>`;
    }).join('')}
  </div>`;
}

function nav(ctx) {
  const { dict, page } = ctx;
  return `<nav class="nav" id="nav" aria-label="${attr(dict.nav.menu)}">
  <a class="nav__logo" href="${attr(url(dict, 'home'))}">Venezia <span>Eyewear</span></a>
  <ul class="nav__links">
    ${navItems(dict).map(([key, label]) =>
      `<li><a class="nav__link" href="${attr(url(dict, key))}"${page === key ? ' aria-current="page"' : ''}>${esc(label)}</a></li>`
    ).join('\n    ')}
  </ul>
  <div class="nav__right">
    ${langSwitcher(ctx)}
    <button class="burger" id="burger" aria-label="${attr(dict.nav.menu)}" aria-expanded="false" aria-controls="menu">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>`;
}

function mobileMenu(ctx) {
  const { dict } = ctx;
  return `<div class="menu" id="menu" hidden>
  ${navItems(dict).map(([key, label]) =>
    `<a class="menu__link" href="${attr(url(dict, key))}">${esc(label)}</a>`
  ).join('\n  ')}
  ${langSwitcher(ctx, 'langs menu__langs')}
</div>`;
}

function footer(ctx) {
  const { dict, site } = ctx;
  return `<footer class="footer">
  <div class="wrap">
    <div class="footer__grid">
      <div>
        <div class="footer__logo">Venezia <span>Eyewear</span></div>
        <p class="footer__tagline">${esc(dict.footer.tagline)}</p>
      </div>
      <div class="footer__col">
        <h2>${esc(dict.footer.colCollection)}</h2>
        <ul>
          <li><a href="${attr(url(dict, 'collection'))}?gender=uomo">${esc(dict.common.men)}</a></li>
          <li><a href="${attr(url(dict, 'collection'))}?gender=donna">${esc(dict.common.women)}</a></li>
          <li><a href="${attr(url(dict, 'collection'))}?gender=unisex">${esc(dict.common.unisex)}</a></li>
          <li><a href="${attr(url(dict, 'collection'))}">${esc(dict.footer.allModels)}</a></li>
        </ul>
      </div>
      <div class="footer__col">
        <h2>${esc(dict.footer.colBrand)}</h2>
        <ul>
          <li><a href="${attr(url(dict, 'brand'))}">${esc(dict.footer.story)}</a></li>
          <li><a href="${attr(url(dict, 'craft'))}">${esc(dict.footer.craft)}</a></li>
          <li><a href="${attr(url(dict, 'lookbook'))}">${esc(dict.nav.lookbook)}</a></li>
          <li><a href="${attr(url(dict, 'contact'))}">${esc(dict.nav.contact)}</a></li>
        </ul>
      </div>
      <div class="footer__col">
        <h2>${esc(dict.footer.colInfo)}</h2>
        <ul>
          <li><a href="${attr(url(dict, 'retailers'))}">${esc(dict.footer.retailers)}</a></li>
          <li><a href="${attr(url(dict, 'privacy'))}">${esc(dict.footer.privacy)}</a></li>
          <li><a href="${attr(url(dict, 'cookie'))}">${esc(dict.footer.cookie)}</a></li>
          <li><a href="${attr(url(dict, 'legal'))}">${esc(dict.footer.legal)}</a></li>
        </ul>
      </div>
    </div>
    <div class="footer__bottom">
      <div class="footer__copy">
        © ${site.year} ${esc(site.name)}. ${esc(dict.footer.rights)}
        &nbsp;·&nbsp; <a href="${attr(site.credits.url)}" rel="noopener">${esc(site.credits.agency)}</a>
      </div>
      <div class="footer__sign">${esc(dict.footer.signature)}</div>
    </div>
  </div>
</footer>`;
}
