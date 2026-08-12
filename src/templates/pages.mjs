import { esc, attr, url, productUrl, placeholder, pad2 } from '../lib/utils.mjs';

function head(dict, { eyebrow, title, intro, crumbs = [] }) {
  return `<header class="phead">
  <div class="phead__glow"></div>
  <div class="phead__inner">
    <nav class="breadcrumb" aria-label="breadcrumb">
      <a href="${attr(url(dict, 'home'))}">Home</a>
      ${crumbs.map(c => `<span>/</span> <span>${esc(c)}</span>`).join(' ')}
    </nav>
    <span class="eyebrow">${esc(eyebrow)}</span>
    <h1 class="h-section">${title}</h1>
    ${intro ? `<p class="phead__intro">${esc(intro)}</p>` : ''}
  </div>
</header>`;
}

/* ── BRAND ───────────────────────────────────────────────── */
export function brand(ctx) {
  const { dict, products } = ctx;
  const t = dict.brand;
  const h = dict.home;

  return `
${head(dict, { eyebrow: t.eyebrow, title: t.title, crumbs: [dict.nav.brand] })}

<section class="section">
  <div class="wrap manifesto">
    <div class="manifesto__left" data-reveal>
      <span class="eyebrow">${esc(h.manifestoEyebrow)}</span>
      <h2 class="h-sub">${h.manifestoTitle}</h2>
      <div class="rule" style="margin-top:1.5rem"></div>
    </div>
    <div class="manifesto__right">
      <p class="lead" data-reveal style="margin-bottom:1.75rem">${h.manifestoP1}</p>
      <p class="lead" data-reveal>${h.manifestoP2}</p>
      <div class="manifesto__list" data-reveal>
        ${h.manifestoList.map(i => `<div class="manifesto__item"><i></i>${esc(i)}</div>`).join('\n        ')}
      </div>
    </div>
  </div>
</section>

<section class="section" style="background:var(--c-surface);border-block:1px solid var(--c-border)">
  <div class="wrap">
    <div class="shead" data-reveal>
      <div>
        <span class="eyebrow">${esc(t.mapTitle)}</span>
        <h2 class="h-section">${esc(t.mapTitle)}</h2>
        <p class="lead" style="font-size:1rem;margin-top:1rem">${esc(t.mapText)}</p>
      </div>
    </div>
    <div class="pgrid" style="grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:1px;background:var(--c-border)">
      ${products.map((p, i) => `<a class="pcard" href="${attr(productUrl(dict, p.id))}" data-reveal style="background:var(--c-surface-2)">
        <div class="pcard__body">
          <div class="pcard__aud">${pad2(i + 1)}</div>
          <h3 class="pcard__name">${esc(p.name)}</h3>
          <p class="pcard__tag">${esc(p.tagline[dict.lang])}</p>
        </div>
      </a>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="quote">
  <div class="quote__glow"></div>
  <div class="wrap">
    <blockquote class="quote__text" data-reveal>${esc(h.quote)}</blockquote>
    <div class="rule" style="margin:0 auto 1.25rem"></div>
    <div class="quote__attr">${esc(h.quoteAttr)}</div>
  </div>
</section>
`;
}

/* ── ARTIGIANALITÀ ───────────────────────────────────────── */
export function craft(ctx) {
  const { dict } = ctx;
  const t = dict.craft;

  const steps = {
    it: [
      ['Disegno', 'Ogni modello parte da un luogo e da una misura, non da un moodboard.'],
      ['Prototipo', 'Il primo pezzo si prova su volti reali: le proporzioni si correggono lì.'],
      ['Taglio', "Le lastre di acetato vengono fresate a controllo numerico, poi rifinite a mano."],
      ['Cerniere', 'Inserimento a caldo, per una tenuta che non si allenta nel tempo.'],
      ['Burattatura', 'Giorni di lucidatura progressiva: è ciò che dà all\'acetato la sua profondità.'],
      ['Controllo', 'Ogni montatura viene misurata e registrata prima di lasciare il laboratorio.'],
    ],
    en: [
      ['Drawing', 'Every model starts from a place and a measurement, not from a moodboard.'],
      ['Prototype', 'The first piece is tried on real faces: that is where proportions get corrected.'],
      ['Cutting', 'Acetate sheets are CNC-milled, then finished by hand.'],
      ['Hinges', 'Heat-set insertion, for a hold that does not loosen over time.'],
      ['Tumbling', 'Days of progressive polishing: this is what gives acetate its depth.'],
      ['Inspection', 'Every frame is measured and recorded before it leaves the workshop.'],
    ],
    es: [
      ['Dibujo', 'Cada modelo parte de un lugar y de una medida, no de un moodboard.'],
      ['Prototipo', 'La primera pieza se prueba en caras reales: ahí se corrigen las proporciones.'],
      ['Corte', 'Las planchas de acetato se fresan por control numérico y se rematan a mano.'],
      ['Bisagras', 'Inserción en caliente, para una sujeción que no se afloja con el tiempo.'],
      ['Pulido', 'Días de pulido progresivo: es lo que da al acetato su profundidad.'],
      ['Control', 'Cada montura se mide y se registra antes de salir del taller.'],
    ],
  }[dict.lang];

  return `
${head(dict, { eyebrow: t.eyebrow, title: t.title, crumbs: [dict.nav.craft] })}

<section class="section hscroll">
  <div class="wrap">
    <div class="shead" data-reveal>
      <h2 class="h-sub">${esc(t.processTitle)}</h2>
      <span class="label">${esc(dict.common.drag)}</span>
    </div>
  </div>
  <div class="hscroll__viewport" id="hscrollViewport">
    <div class="hscroll__track" id="hscrollTrack">
      ${steps.map((s, i) => `<div class="hitem">
        <div class="hitem__media">
          <span class="hitem__idx">${pad2(i + 1)}</span>
          ${placeholder('')}
        </div>
        <div class="hitem__name">${esc(s[0])}</div>
        <div class="hitem__sub" style="text-transform:none;letter-spacing:0;font-size:.8125rem;line-height:1.7;color:var(--c-text-3)">${esc(s[1])}</div>
      </div>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="section" style="background:var(--c-surface);border-block:1px solid var(--c-border)">
  <div class="wrap manifesto">
    <div class="manifesto__left" data-reveal>
      <span class="eyebrow">${esc(t.materialsTitle)}</span>
      <h2 class="h-sub">${esc(t.materialsTitle)}</h2>
      <div class="rule" style="margin-top:1.5rem"></div>
    </div>
    <div class="manifesto__right" data-reveal>
      <p class="lead">${esc({
        it: "L'acetato di cellulosa non è plastica: è un materiale di origine vegetale che invecchia, si scalda al contatto con la pelle e restituisce colori che nessuno stampo può imitare. È più costoso e più lento da lavorare. È anche l'unico modo per ottenere quello che vogliamo.",
        en: 'Cellulose acetate is not plastic: it is a plant-based material that ages, warms against the skin and returns colours no mould can imitate. It is more expensive and slower to work. It is also the only way to get what we want.',
        es: 'El acetato de celulosa no es plástico: es un material de origen vegetal que envejece, se calienta al contacto con la piel y devuelve colores que ningún molde puede imitar. Es más caro y más lento de trabajar. También es la única manera de conseguir lo que queremos.',
      }[dict.lang])}</p>
      <div class="manifesto__list">
        ${[dict.materials.acetate, dict.materials.metal, dict.materials['metal-acetate']].map(m =>
          `<div class="manifesto__item"><i></i>${esc(m)}</div>`).join('\n        ')}
      </div>
    </div>
  </div>
</section>
`;
}

/* ── LOOKBOOK ────────────────────────────────────────────── */
export function lookbook(ctx) {
  const { dict } = ctx;
  const t = dict.lookbook;
  return `
${head(dict, { eyebrow: t.eyebrow, title: t.title, crumbs: [dict.nav.lookbook] })}

<section class="section">
  <div class="wrap">
    <div class="pgrid" style="grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:var(--sp-4)" id="lbGrid">
      ${Array.from({ length: 9 }, (_, i) => `<figure class="lbteaser__item" data-reveal style="aspect-ratio:${i % 3 === 1 ? '3/4' : '4/5'}">
        ${placeholder(dict.common.imageComing)}
      </figure>`).join('\n      ')}
    </div>
  </div>
</section>
`;
}

/* ── RIVENDITORI ─────────────────────────────────────────── */
export function retailers(ctx) {
  const { dict, retailers: list } = ctx;
  const t = dict.retailers;

  return `
${head(dict, { eyebrow: t.eyebrow, title: t.title, crumbs: [dict.nav.retailers] })}

<section class="section">
  <div class="wrap">
    <form class="news__form" style="max-width:34rem;margin-bottom:var(--sp-7)" data-retailer-search onsubmit="return false" data-reveal>
      <div class="field">
        <label class="field__label" for="rsearch">${esc(t.searchPlaceholder)}</label>
        <input class="field__input" id="rsearch" type="search" placeholder="${attr(t.searchPlaceholder)}" autocomplete="off">
      </div>
      <button class="btn" type="submit">${esc(t.searchCta)}</button>
    </form>

    <div class="pgrid" style="grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1px;background:var(--c-border)" id="rlist">
      ${list.map(r => `<article class="pcard" data-retailer data-city="${attr(r.city.toLowerCase())}" data-zip="${attr(r.zip)}" style="background:var(--c-surface-2)">
        <div class="pcard__body">
          <div class="pcard__aud">${esc(r.city)}${r.placeholder ? ' · demo' : ''}</div>
          <h2 class="pcard__name" style="font-size:1.35rem">${esc(r.name)}</h2>
          <p class="pcard__tag" style="font-style:normal;font-family:var(--f-body);font-size:.8125rem">
            ${esc(r.address)}<br>${esc(r.zip)} ${esc(r.city)}<br>${esc(r.phone)}
          </p>
          <a class="btn-line" style="margin-top:1rem" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.name + ' ' + r.address + ' ' + r.city)}" target="_blank" rel="noopener">
            ${esc(t.openMap)}<span class="btn-line__line"></span>
          </a>
        </div>
      </article>`).join('\n      ')}
    </div>
    <p class="lead" id="rEmpty" hidden style="padding-block:3rem">${esc(t.noResults)}</p>
  </div>
</section>

<section class="section" style="background:var(--c-surface);border-top:1px solid var(--c-border)">
  <div class="wrap">
    <div class="shead" data-reveal>
      <div>
        <span class="eyebrow">B2B</span>
        <h2 class="h-sub">${esc(t.becomeTitle)}</h2>
        <p class="lead" style="font-size:1rem;margin-top:1rem;max-width:44ch">${esc(t.becomeText)}</p>
      </div>
    </div>
    ${b2bForm(dict)}
  </div>
</section>
`;
}

function b2bForm(dict) {
  const c = dict.contact;
  return `<form class="grid" style="grid-template-columns:1fr 1fr;gap:var(--sp-5);max-width:52rem"
    name="rivenditori" method="POST" data-netlify="true" netlify-honeypot="bot-field" data-form data-reveal
    data-required="${attr(c.required)}" data-success="${attr(c.formSuccess)}" data-error="${attr(c.formError)}">
  <input type="hidden" name="form-name" value="rivenditori">
  <input type="hidden" name="lang" value="${attr(dict.lang)}">
  <p class="field--hp"><label>Bot<input name="bot-field" tabindex="-1" autocomplete="off"></label></p>

  <div class="field"><label class="field__label" for="b-company">${esc(c.formCompany)}</label>
    <input class="field__input" id="b-company" name="company" required autocomplete="organization"></div>
  <div class="field"><label class="field__label" for="b-vat">${esc(c.formVat)}</label>
    <input class="field__input" id="b-vat" name="vat" required></div>
  <div class="field"><label class="field__label" for="b-name">${esc(c.formName)}</label>
    <input class="field__input" id="b-name" name="name" required autocomplete="name"></div>
  <div class="field"><label class="field__label" for="b-email">${esc(c.formEmail)}</label>
    <input class="field__input" id="b-email" name="email" type="email" required autocomplete="email"></div>
  <div class="field"><label class="field__label" for="b-city">${esc(c.formCity)}</label>
    <input class="field__input" id="b-city" name="city" required autocomplete="address-level2"></div>
  <div class="field"><label class="field__label" for="b-phone">${esc(c.formPhone)}</label>
    <input class="field__input" id="b-phone" name="phone" type="tel" autocomplete="tel"></div>
  <div class="field" style="grid-column:1/-1"><label class="field__label" for="b-msg">${esc(c.formMessage)}</label>
    <textarea class="field__textarea" id="b-msg" name="message" rows="4"></textarea></div>
  <label class="checkbox" style="grid-column:1/-1">
    <input type="checkbox" name="privacy" required> <span>${esc(c.formPrivacy)}</span>
  </label>
  <div style="grid-column:1/-1"><button class="btn btn--solid" type="submit">${esc(c.formSend)}</button></div>
  <div class="form-note" style="grid-column:1/-1" data-form-note hidden></div>
</form>`;
}

/* ── CONTATTI ────────────────────────────────────────────── */
export function contact(ctx) {
  const { dict, site } = ctx;
  const c = dict.contact;

  return `
${head(dict, { eyebrow: c.eyebrow, title: c.title, crumbs: [dict.nav.contact] })}

<section class="section">
  <div class="wrap" style="display:grid;grid-template-columns:1.4fr 1fr;gap:clamp(2rem,6vw,5rem);align-items:start">
    <form class="grid" style="grid-template-columns:1fr 1fr;gap:var(--sp-5)"
      name="contatti" method="POST" data-netlify="true" netlify-honeypot="bot-field" data-form data-reveal
      data-required="${attr(c.required)}" data-success="${attr(c.formSuccess)}" data-error="${attr(c.formError)}">
      <input type="hidden" name="form-name" value="contatti">
      <input type="hidden" name="lang" value="${attr(dict.lang)}">
      <p class="field--hp"><label>Bot<input name="bot-field" tabindex="-1" autocomplete="off"></label></p>

      <div class="field"><label class="field__label" for="c-name">${esc(c.formName)}</label>
        <input class="field__input" id="c-name" name="name" required autocomplete="name"></div>
      <div class="field"><label class="field__label" for="c-email">${esc(c.formEmail)}</label>
        <input class="field__input" id="c-email" name="email" type="email" required autocomplete="email"></div>
      <div class="field" style="grid-column:1/-1"><label class="field__label" for="c-subject">${esc(c.formSubject)}</label>
        <select class="field__select" id="c-subject" name="subject">
          <option>${esc(c.subjectInfo)}</option>
          <option>${esc(c.subjectRetailer)}</option>
          <option>${esc(c.subjectPress)}</option>
          <option>${esc(c.subjectOther)}</option>
        </select></div>
      <div class="field" style="grid-column:1/-1"><label class="field__label" for="c-msg">${esc(c.formMessage)}</label>
        <textarea class="field__textarea" id="c-msg" name="message" rows="6" required></textarea></div>
      <label class="checkbox" style="grid-column:1/-1">
        <input type="checkbox" name="privacy" required> <span>${esc(c.formPrivacy)}</span>
      </label>
      <div style="grid-column:1/-1"><button class="btn btn--solid" type="submit">${esc(c.formSend)}</button></div>
      <div class="form-note" style="grid-column:1/-1" data-form-note hidden></div>
    </form>

    <aside data-reveal>
      <div class="manifesto__list" style="margin-top:0">
        <div class="manifesto__item" style="text-transform:none;letter-spacing:0"><i></i>
          <a href="mailto:${attr(site.email)}">${esc(site.email)}</a></div>
        <div class="manifesto__item" style="text-transform:none;letter-spacing:0"><i></i>
          <a href="tel:${attr(site.phone.replace(/\s/g, ''))}">${esc(site.phone)}</a></div>
        <div class="manifesto__item" style="text-transform:none;letter-spacing:0"><i></i>
          ${esc(site.address.city)}, ${esc(site.address.country)}</div>
      </div>
    </aside>
  </div>
</section>
`;
}

/* ── LEGALI ──────────────────────────────────────────────── */
export function legal(ctx) {
  const { dict, kind, site } = ctx;
  const titles = {
    privacy: dict.footer.privacy,
    cookie: dict.footer.cookie,
    legal: dict.footer.legal,
  };
  const body = {
    it: 'Testo da completare con il consulente legale prima del lancio. La struttura della pagina è pronta.',
    en: 'Text to be completed with legal counsel before launch. The page structure is ready.',
    es: 'Texto pendiente de completar con el asesor legal antes del lanzamiento. La estructura de la página está lista.',
  }[dict.lang];

  return `
${head(dict, { eyebrow: dict.footer.colInfo, title: esc(titles[kind]), crumbs: [titles[kind]] })}
<section class="section">
  <div class="wrap">
    <div class="lead" data-reveal>
      <p style="margin-bottom:1.5rem">${esc(body)}</p>
      <p class="label">${esc(site.legalName)} — P.IVA ${esc(site.vat)}</p>
    </div>
  </div>
</section>
`;
}

/* ── 404 ─────────────────────────────────────────────────── */
export function notFound(ctx) {
  const { dict } = ctx;
  const t = dict.notFound;
  return `
<section class="nf">
  <div>
    <h1 class="h-section">${t.title}</h1>
    <p class="lead" style="margin:1.5rem auto 2.5rem">${esc(t.text)}</p>
    <a class="btn" href="${attr(url(dict, 'home'))}">${esc(t.cta)}</a>
  </div>
</section>
`;
}
