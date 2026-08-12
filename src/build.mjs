#!/usr/bin/env node
/* ============================================================
   VENEZIA EYEWEAR — generatore statico
   node src/build.mjs   →   dist/
   ============================================================ */

import { readFile, writeFile, mkdir, rm, cp, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { LANGS, DEFAULT_LANG, url, productUrl, fill, stripTags } from './lib/utils.mjs';
import { layout } from './templates/layout.mjs';
import { home } from './templates/home.mjs';
import { collection } from './templates/collection.mjs';
import { product, productJsonLd } from './templates/product.mjs';
import { brand, craft, lookbook, retailers, contact, legal, notFound } from './templates/pages.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SRC = join(ROOT, 'src');
const DIST = join(ROOT, 'dist');

const json = async p => JSON.parse(await readFile(p, 'utf8'));

/* ── Dati ─────────────────────────────────────────────────── */
const site = await json(join(SRC, 'data/site.json'));
const { products } = await json(join(SRC, 'data/products.json'));
const { retailers: retailerList } = await json(join(SRC, 'data/retailers.json'));

const dicts = {};
for (const l of LANGS) dicts[l] = await json(join(SRC, `data/i18n/${l}.json`));

/* ── Utility di scrittura ─────────────────────────────────── */
async function write(relPath, content) {
  const full = join(DIST, relPath);
  await mkdir(dirname(full), { recursive: true });
  await writeFile(full, content, 'utf8');
}

/** Scrive una pagina come cartella/index.html (URL puliti) */
async function writePage(pathname, html) {
  const clean = pathname.replace(/^\/|\/$/g, '');
  await write(join(clean, 'index.html'), html);
}

const pages = []; // per la sitemap

/* ── CSS ──────────────────────────────────────────────────── */
async function buildCss() {
  const dir = join(SRC, 'styles');
  const files = (await readdir(dir)).filter(f => f.endsWith('.css')).sort();
  const parts = [];
  for (const f of files) parts.push(`/* ===== ${f} ===== */\n` + await readFile(join(dir, f), 'utf8'));
  await write('assets/css/main.css', parts.join('\n\n'));
  console.log(`  css      ${files.length} file uniti`);
}

/* ── Asset statici ────────────────────────────────────────── */
async function copyStatic() {
  const staticDir = join(SRC, 'static');
  if (existsSync(staticDir)) await cp(staticDir, join(DIST, 'assets'), { recursive: true });
  const scriptsDir = join(SRC, 'scripts');
  if (existsSync(scriptsDir)) await cp(scriptsDir, join(DIST, 'assets/js'), { recursive: true });
  console.log('  static   copiati');
}

/* ── Pagine ───────────────────────────────────────────────── */
async function buildPages() {
  for (const lang of LANGS) {
    const dict = dicts[lang];
    const base = { dict, dicts, site, products, retailers: retailerList };

    /* HOME */
    {
      const path = url(dict, 'home');
      const html = layout({
        ...base, page: 'home', path,
        title: dict.meta.homeTitle,
        desc: dict.meta.homeDesc,
        bodyClass: 'page-home',
        jsonLd: organizationJsonLd(dict),
        body: home(base),
        scripts: ['/assets/js/hero.js'],
      });
      await writePage(path, html);
      pages.push({ path, priority: '1.0' });
    }

    /* COLLEZIONE */
    {
      const path = url(dict, 'collection');
      const html = layout({
        ...base, page: 'collection', path,
        title: dict.meta.collectionTitle,
        desc: dict.meta.collectionDesc,
        bodyClass: 'page-collection',
        jsonLd: breadcrumbJsonLd(dict, [[dict.nav.collection, path]]),
        body: collection(base),
        scripts: ['/assets/js/collection.js'],
      });
      await writePage(path, html);
      pages.push({ path, priority: '0.9' });
    }

    /* SCHEDE PRODOTTO */
    for (const p of products) {
      const path = productUrl(dict, p.id);
      const ctx = { ...base, p };
      const vars = {
        name: p.name,
        shape: dict.shapes[p.shape],
        audience: dict.common[p.audience === 'uomo' ? 'men' : p.audience === 'donna' ? 'women' : 'unisex'],
        calibre: p.specs.calibre, bridge: p.specs.bridge, front: p.specs.front,
        tagline: p.tagline[lang],
      };
      const html = layout({
        ...ctx, page: 'collection', path,
        altPath: d => productUrl(d, p.id),
        title: fill(dict.meta.productTitle, vars),
        desc: stripTags(fill(dict.meta.productDesc, vars)),
        ogType: 'product',
        bodyClass: 'page-product',
        jsonLd: productJsonLd(ctx),
        body: product(ctx),
        scripts: ['/assets/js/product.js'],
      });
      await writePage(path, html);
      pages.push({ path, priority: '0.8' });
    }

    /* PAGINE STATICHE */
    const simple = [
      ['brand', brand, dict.meta.brandTitle, dict.meta.brandDesc, '0.7'],
      ['craft', craft, dict.meta.craftTitle, dict.meta.craftDesc, '0.7'],
      ['lookbook', lookbook, dict.meta.lookbookTitle, dict.meta.lookbookDesc, '0.6'],
      ['retailers', retailers, dict.meta.retailersTitle, dict.meta.retailersDesc, '0.7'],
      ['contact', contact, dict.meta.contactTitle, dict.meta.contactDesc, '0.6'],
    ];
    for (const [key, tpl, title, desc, priority] of simple) {
      const path = url(dict, key);
      const html = layout({
        ...base, page: key, path, title, desc,
        bodyClass: `page-${key}`,
        jsonLd: breadcrumbJsonLd(dict, [[dict.nav[key] || key, path]]),
        body: tpl(base),
        scripts: key === 'retailers' ? ['/assets/js/retailers.js'] : [],
      });
      await writePage(path, html);
      pages.push({ path, priority });
    }

    /* LEGALI */
    for (const kind of ['privacy', 'cookie', 'legal']) {
      const path = url(dict, kind);
      const html = layout({
        ...base, page: kind, path,
        title: `${dict.footer[kind]} | ${site.name}`,
        desc: dict.footer[kind],
        body: legal({ ...base, kind }),
      });
      await writePage(path, html);
      pages.push({ path, priority: '0.2' });
    }
  }

  /* 404 unico, in lingua di default */
  const d = dicts[DEFAULT_LANG];
  await write('404.html', layout({
    dict: d, dicts, site, products, retailers: retailerList,
    page: 'home', path: '/404',
    title: d.meta.notFoundTitle, desc: d.meta.notFoundDesc,
    body: notFound({ dict: d }),
  }));

  console.log(`  pagine   ${pages.length} generate (+404)`);
}

/* ── JSON-LD ──────────────────────────────────────────────── */
function organizationJsonLd(dict) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    url: site.domain,
    email: site.email,
    telephone: site.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      postalCode: site.address.zip,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    sameAs: Object.values(site.social).filter(Boolean),
  };
}

function breadcrumbJsonLd(dict, items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: site.domain + url(dict, 'home') },
      ...items.map(([name, path], i) => ({
        '@type': 'ListItem', position: i + 2, name, item: site.domain + path,
      })),
    ],
  };
}

/* ── Root: redirect di lingua ─────────────────────────────── */
async function buildRoot() {
  const html = `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<title>Venezia Eyewear</title>
<meta name="robots" content="noindex">
<link rel="canonical" href="${site.domain}/it/">
${LANGS.map(l => `<link rel="alternate" hreflang="${l}" href="${site.domain}/${l}/">`).join('\n')}
<link rel="alternate" hreflang="x-default" href="${site.domain}/it/">
<script>
(function () {
  var supported = ${JSON.stringify(LANGS)};
  var saved = null;
  try { saved = localStorage.getItem('ve-lang'); } catch (e) {}
  var nav = (navigator.language || 'it').slice(0, 2).toLowerCase();
  var lang = supported.indexOf(saved) > -1 ? saved
           : supported.indexOf(nav) > -1 ? nav
           : '${DEFAULT_LANG}';
  location.replace('/' + lang + '/');
})();
</script>
<meta http-equiv="refresh" content="0;url=/${DEFAULT_LANG}/">
</head>
<body style="background:#080808"><a href="/${DEFAULT_LANG}/" style="color:#c9a84c;font-family:sans-serif;padding:2rem;display:block">Venezia Eyewear</a></body>
</html>`;
  await write('index.html', html);
}

/* ── Sitemap, robots, Netlify ─────────────────────────────── */
async function buildMeta() {
  const urls = pages.map(p => `  <url>
    <loc>${site.domain}${p.path}</loc>
    <changefreq>monthly</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n');

  await write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`);

  await write('robots.txt', `User-agent: *
Allow: /

Sitemap: ${site.domain}/sitemap.xml
`);

  await write('_headers', `/*
  X-Frame-Options: SAMEORIGIN
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/assets/fonts/*
  Cache-Control: public, max-age=31536000, immutable
  Access-Control-Allow-Origin: *
`);

  await write('_redirects', `# Redirect di cortesia dai vecchi percorsi senza lingua
/collezione/*   /it/collezione/:splat   301
/collection/*   /en/collection/:splat   301
/coleccion/*    /es/coleccion/:splat    301
`);

  await write('netlify.toml', `[build]
  publish = "."

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
`);

  await write('site.webmanifest', JSON.stringify({
    name: site.name,
    short_name: 'Venezia',
    start_url: '/',
    display: 'standalone',
    background_color: '#080808',
    theme_color: '#080808',
    icons: [{ src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' }],
  }, null, 2));

  await write('favicon.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="#080808"/>
  <g fill="none" stroke="#c9a84c" stroke-width="3">
    <circle cx="21" cy="34" r="12"/>
    <circle cx="47" cy="34" r="12"/>
    <path d="M33 31c2-2 5-2 7 0"/>
  </g>
</svg>`);

  console.log('  meta     sitemap, robots, headers, netlify.toml');
}

/* ── Esecuzione ───────────────────────────────────────────── */
console.log('\n▸ Venezia Eyewear — build\n');
await rm(DIST, { recursive: true, force: true });
await mkdir(DIST, { recursive: true });
await buildCss();
await copyStatic();
await buildPages();
await buildRoot();
await buildMeta();
console.log(`\n✓ dist/ pronta — ${LANGS.length} lingue, ${products.length} modelli\n`);
