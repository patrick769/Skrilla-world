# SKRILLA HQ — official website

Static site for **SKRILLA** (Skrilla HQ) — Dagoretti, Nairobi. Est. 2021, fully self-owned.
Built as plain HTML/CSS/JS so it runs on GitHub Pages, opens offline from a phone, and needs no build step.

## Pages

| File | What it is |
|---|---|
| `index.html` | Home — hero, ticker, latest release + tracklist, tour preview, videos, merch, about, contact |
| `music.html` | Music — Blood & Prayer EP tracklist and the Spotify / Apple Music players |
| `videos.html` | Videos — the three official music videos, embedded from the channel |
| `tour.html` | Tour — the 2026 dates with one-tap ticket messages |
| `merch.html` | Merch — the drop, sizes, and one-tap WhatsApp ordering |
| `404.html` | Custom "off air" page for broken links (GitHub Pages picks this up automatically) |

## Design system

One palette, one type scale, one set of components across every page. The brand purple from
the original build is kept and now runs through the whole site.

```
--void  #04030a   page base (black-violet)      --purple  #c27aff   brand accent (kept)
--deep  #0a0714   alternating sections          --violet  #8b5cf6   secondary glow
--ink   #f6f3fc   type                          --purple-deep #6b21a8  shadow / depth
--line  rgba(194,122,255,.20)  hairlines        --warm  #f0b368   "on sale" status only
```

* **Type** — Anton for display, Space Grotesk for interface and body, both fluid with `clamp()`.
* **Texture** — fixed violet light bloom + film grain, so photographs and black panels sit in one space.
* **Photography** — every image is desaturated slightly and lit violet, which ties the warm
  Nairobi/studio photography into the brand colour instead of fighting it.
* **Motion** — scroll reveals, hero parallax, marquee, hover sweeps. All of it switches off under
  `prefers-reduced-motion`.

## Editing content

Everything is plain HTML — open the file and edit the text.

* **Tour dates** — copy a `<li class="date-row">` block in `tour.html` (and the 3-row preview in `index.html`).
  Each `Tickets` link is a `wa.me` link with a pre-written message.
* **Merch** — copy an `<article class="product">` block in `merch.html`. The size buttons and the
  WhatsApp order message are wired automatically from `data-order-item` / `data-size`.
* **Tracks** — copy an `<li>` inside `<ol class="tracks">` in `music.html` / `index.html`.
* **Photos** — drop files in `assets/` and point `src` at them (see `assets/README.txt`).

## Deploying (GitHub Pages)

1. Push these files to the repository root.
2. Settings → Pages → Deploy from a branch → `main` → `/ (root)`.
3. The site is live at `https://<user>.github.io/Skrilla-world/`.

Keep the `assets/` folder next to the HTML files — the pages load their artwork from there.
The images are also embedded in `IMG_0548.PNG` at the root if you ever need the original full-resolution portrait.

## Offline / Android

`big-skrilla-github-pages-ready.zip` contains all six pages plus the `assets/` folder they use.
Extract everything into one folder (keeping `assets/` alongside the HTML) and open `index.html`.
