# Venezia Eyewear — sito web

Sito statico multipagina in tre lingue (IT / EN / ES). Nessun framework, nessun backend, nessun database.
Costruito da **Kinetix Lab**.

---

## Struttura

```
venezia-eyewear/
├── dist/          ← IL SITO PRONTO. Questa cartella si carica su Netlify.
├── src/           ← i sorgenti. Si modifica qui, poi si ricompila.
│   ├── data/      ← contenuti: prodotti, traduzioni, rivenditori, dati aziendali
│   ├── templates/ ← struttura HTML delle pagine
│   ├── styles/    ← CSS (4 file, uniti automaticamente)
│   ├── scripts/   ← JavaScript
│   ├── static/    ← font e immagini
│   └── build.mjs  ← il generatore
├── tools/         ← script di verifica con browser headless
└── LEGGIMI.md
```

**Regola d'oro:** non modificare mai i file dentro `dist/`. Vengono sovrascritti a ogni build.

---

## Ricompilare il sito

Serve Node.js 18 o superiore.

```bash
node src/build.mjs
```

In due secondi rigenera tutte le 63 pagine dentro `dist/`.

Per vedere il sito in locale:

```bash
npx serve dist
```

---

## Modificare i contenuti

### Aggiungere o cambiare un modello di occhiale
`src/data/products.json`. Ogni modello ha:

- `id` — usato nell'URL, minuscolo e senza spazi
- `audience` — `uomo`, `donna` o `unisex`
- `shape` — `round`, `square`, `rectangle`, `panthos`, `cat-eye`, `oversize`, `double-bridge`
- `material` — `acetate`, `metal`, `metal-acetate`
- `specs` — calibro, ponte, frontale, asta (numeri, in millimetri)
- `colors` — ogni colore ha due valori `hex` per la pastiglia sfumata e il nome nelle tre lingue
- `tagline` e `inspiration` — testi nelle tre lingue
- `images` — vedi sotto

> ⚠️ I campi `shape` e `material` sono al momento **dedotti da nome e misure**: vanno verificati sulle foto reali.

### Cambiare un testo dell'interfaccia
`src/data/i18n/it.json`, `en.json`, `es.json`. Le tre strutture sono identiche: se aggiungi una chiave in una, aggiungila in tutte e tre.

Gli **slug degli URL** sono in `slugs` dentro ogni file: cambiando `"collection": "collezione"` cambia l'indirizzo di tutte le pagine di quella sezione, in quella lingua.

### Dati aziendali
`src/data/site.json`. Tutti i valori marcati `TODO` vanno sostituiti prima del lancio: partita IVA, indirizzo, telefono, email, dominio, profili social.

### Rivenditori
`src/data/retailers.json`. Quelli attuali hanno `"placeholder": true` e sono di esempio: vanno sostituiti.

---

## Inserire le immagini

Le foto vanno in `src/static/img/products/` con questa convenzione:

```
murano-400.jpg   murano-400.webp   murano-400.avif
murano-800.jpg   murano-800.webp   murano-800.avif
murano-1600.jpg  murano-1600.webp  murano-1600.avif
```

Poi in `products.json` si imposta:

```json
"images": { "main": "/assets/img/products/murano", "gallery": [] }
```

Senza estensione e senza misura: ci pensa il template a costruire il `srcset`.
Finché `main` resta `null`, la card mostra il segnaposto elegante con la scritta "immagine in arrivo".

Comando di riferimento per generare i tre formati (richiede ImageMagick):

```bash
for s in 400 800 1600; do
  magick originale.jpg -resize ${s}x -quality 82 murano-$s.jpg
  magick originale.jpg -resize ${s}x -quality 78 murano-$s.webp
  magick originale.jpg -resize ${s}x -quality 55 murano-$s.avif
done
```

---

## Cosa manca ancora

| Elemento | Stato |
|---|---|
| Foto dei prodotti | ⏳ da mappare e ottimizzare |
| Scatti lookbook | ⏳ |
| Modello 3D dell'occhiale rotante | ⏳ fase F3 |
| Traduzioni EN / ES dei testi lunghi | ✅ presenti, da far revisionare |
| Dati aziendali reali | ⏳ segnaposto in `site.json` |
| Elenco rivenditori | ⏳ 3 esempi finti |
| Testi legali | ⏳ struttura pronta, contenuto da consulente |
| Immagini Open Graph | ⏳ `/assets/img/og/default.jpg` |

---

## Note tecniche

- **Smooth scroll**: Lenis. Si disattiva da solo con `prefers-reduced-motion`.
- **Animazioni**: GSAP + ScrollTrigger + Flip. Bundle unico in `assets/js/vendor.js`.
- **3D**: Three.js, caricato **solo sulla home** e solo su dispositivi con abbastanza risorse.
- **Font**: self-hosted, sottoinsieme latino, precaricati i due pesi critici.
- **Accessibilità**: focus visibile ovunque, skip link, focus trap nel menu, cursore custom disattivato su touch, `alt` su tutte le immagini.
- **Il cursore personalizzato** compare solo con mouse vero (`pointer: fine`): su tablet e telefono resta il comportamento nativo.
