# Deploy su Netlify

## Metodo veloce (30 secondi)

1. Vai su [app.netlify.com/drop](https://app.netlify.com/drop)
2. Trascina la cartella **`dist`** (solo quella, non tutto il progetto)
3. Il sito è online su un indirizzo tipo `random-name-123.netlify.app`

Fatto. I form funzionano già.

---

## Metodo con dominio e aggiornamenti automatici

1. Su Netlify: **Add new site → Deploy manually**, trascina `dist`
2. **Site settings → Domain management → Add custom domain** → inserisci `veneziaeyewear.com`
3. Netlify ti dà i record DNS da inserire dal registrar del dominio
4. Il certificato HTTPS si attiva da solo entro qualche minuto

Se invece colleghi un repository Git:

- **Build command**: `node src/build.mjs`
- **Publish directory**: `dist`

Così a ogni push il sito si ricompila da solo.

---

## Form

Il sito ha tre form, già configurati per **Netlify Forms**:

| Form | Dove | Nome interno |
|---|---|---|
| Newsletter | Home | `newsletter` |
| Diventa rivenditore | Rivenditori | `rivenditori` |
| Contatti | Contatti | `contatti` |

Dopo il primo deploy compaiono in **Netlify → Forms**. Per ricevere una email a ogni invio:
**Forms → Settings and usage → Form notifications → Add notification → Email notification**.

Ogni form ha già un campo trappola anti-spam (honeypot) invisibile all'utente.

---

## Prima di andare online — checklist

- [ ] Sostituire i valori `TODO` in `src/data/site.json` (P.IVA, indirizzo, email, telefono, dominio)
- [ ] Inserire le foto reali dei prodotti
- [ ] Sostituire i 3 rivenditori di esempio con quelli veri
- [ ] Far scrivere privacy policy, cookie policy e note legali
- [ ] Creare l'immagine social `dist/assets/img/og/default.jpg` (1200 × 630 px)
- [ ] Verificare le traduzioni EN e ES con un madrelingua
- [ ] Ricompilare (`node src/build.mjs`) e ricaricare `dist`
- [ ] Inviare la sitemap a Google Search Console: `https://veneziaeyewear.com/sitemap.xml`

---

## Redirect di lingua

La root `/` reindirizza automaticamente a `/it/`, `/en/` o `/es/` in base alla lingua del browser,
e ricorda la scelta dell'utente in `localStorage`. Il file `_redirects` gestisce anche i vecchi
indirizzi senza prefisso di lingua.
