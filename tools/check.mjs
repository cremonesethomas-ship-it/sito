import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
const PORT = 4321;

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2',
  '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.avif': 'image/avif',
  '.xml': 'application/xml', '.txt': 'text/plain',
};

const server = createServer(async (req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  let file = join(DIST, p);
  try {
    const s = await stat(file).catch(() => null);
    if (!s || s.isDirectory()) file = join(file, 'index.html');
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end(await readFile(join(DIST, '404.html')).catch(() => '404'));
  }
});
await new Promise(r => server.listen(PORT, r));

const browser = await chromium.launch();
const problems = [];

const targets = [
  ['home',       '/it/',                     1440, 900,  true],
  ['collezione', '/it/collezione/',          1440, 900,  true],
  ['prodotto',   '/it/collezione/fenice/',   1440, 900,  true],
  ['brand',      '/it/brand/',               1440, 900,  false],
  ['artigian',   '/it/artigianalita/',       1440, 900,  false],
  ['rivenditori','/it/rivenditori/',         1440, 900,  false],
  ['contatti',   '/it/contatti/',            1440, 900,  false],
  ['home-en',    '/en/',                     1440, 900,  false],
  ['home-es',    '/es/',                     1440, 900,  false],
  ['home-mob',   '/it/',                     390,  844,  true],
  ['404',        '/it/pagina-inesistente/',  1440, 900,  false],
];

for (const [name, path, w, h, shot] of targets) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const errs = [];
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));
  page.on('requestfailed', r => errs.push('404? ' + r.url()));

  await page.goto(`http://localhost:${PORT}${path}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2600); // preloader + intro

  if (shot) {
    await page.screenshot({ path: `tools/shots/${name}.png` });
    if (name === 'home') {
      await page.evaluate(() => window.scrollTo(0, 2200));
      await page.waitForTimeout(1400);
      await page.screenshot({ path: 'tools/shots/home-scroll.png' });
      await page.evaluate(() => window.scrollTo(0, 5200));
      await page.waitForTimeout(1400);
      await page.screenshot({ path: 'tools/shots/home-scroll2.png' });
    }
  }

  const title = await page.title();
  const h1 = await page.locator('h1').first().textContent().catch(() => null);
  const preloaderGone = await page.locator('#preloader').count() === 0;

  if (errs.length) problems.push({ name, errs: [...new Set(errs)].slice(0, 6) });
  console.log(`${preloaderGone ? '✓' : '✗'} ${name.padEnd(12)} ${String(title).slice(0, 46).padEnd(48)} h1="${String(h1).trim().slice(0, 28)}"`);
  await page.close();
}

console.log('\n── Problemi ──');
if (!problems.length) console.log('nessuno');
else problems.forEach(p => console.log(p.name, JSON.stringify(p.errs, null, 1)));

await browser.close();
server.close();
