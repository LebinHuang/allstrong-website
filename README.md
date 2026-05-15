# Allstrong Restaurant Equipment — Website Redesign

A modern, dark-themed redesign of [allstrong.com](https://allstrong.com) — commercial Chinese kitchen equipment manufacturer based in South El Monte, CA.

🔗 **Live preview:** https://lebinhuang.github.io/allstrong-website/

---

## ✨ Featured Modules

The homepage tells the story of **stainless steel as the material**, with creative modules inspired by Apple Mac Pro, Bang & Olufsen and Tesla Cybertruck pages:

- **Cinematic hero** — giant outlined brand wordmark, light-sweep reveal animation, hairline brushed-steel texture overlay, and a slow specular shimmer drifting across the dark background
- **Industrial spec ticker** — Apple-style scrolling marquee of precision specs (`304 Grade` · `16 GA` · `NSF/ANSI 4` · `TIG Welded` · `#4 Finish` · `±0.005"` · `4" Upturn` · `Made in South El Monte CA`) with chrome-gradient numerals
- **Forged in Stainless** — material-science section with blueprint grid background and red ambient glow, featuring:
  - **Steel grade comparison cards** (201 / 304 / 316) with chrome-gradient grade chips; the **304 card is centered and flagged "Our Standard"**, with a hover light-sweep
  - **5-step fabrication process bar** — Sheet Stock → CNC Cut → Brake Form → TIG Weld → #4 Finish, with silver-gradient step numbers and dashed dividers
- **8 product detail pages** with full specs, features and CTAs
- **Faucet catalog** with category filtering (14 products)
- **Fully responsive** for desktop, tablet, and mobile

---

## 🚀 Performance Optimization

All product images have been **extracted from Base64 data URIs** and moved to the `/images/` folder. This dramatically improves load performance:

| Page | Before | After | Reduction |
|------|--------|-------|-----------|
| `index.html` | 1465 KB | 19 KB | -99% |
| `mongolian-bbq-range.html` | 236 KB | 29 KB | -87% |
| `steamer-cabinets.html` | 309 KB | 25 KB | -92% |
| `faucets.html` | 176 KB | 28 KB | -84% |

**Total HTML size reduced by ~2.4 MB.** Browsers can now cache images independently for instant repeat-page loads.

---

## 📁 Project Structure

```
allstrong-website/
├── .github/workflows/pages.yml     # GitHub Pages auto-deploy
├── README.md
└── allstrong-website-final-v5/
    ├── index.html                  # Homepage (hero, spec ticker, Forged in Stainless...)
    ├── style.css                   # Shared stylesheet (~42 KB)
    ├── script.js                   # Slider, reveal animations, card tilt + sparks
    │
    ├── chinese-wok-range.html      # ARE Series wok ranges
    ├── bbq-oven.html               # EQ Series BBQ ovens
    ├── mongolian-bbq-range.html    # ARE-MBG Series Mongolian grills
    ├── steamer-cabinets.html       # 3-compartment steamers
    ├── noodle-pasta-broiler.html   # ARE-1 dual-function broiler
    ├── rice-noodle-range.html      # ARE-1 rice noodle range
    ├── thawing-machine.html        # Frozen meat defrosting tub
    ├── faucets.html                # 14-product faucet catalog
    ├── tables-and-counters.html    # Work tables overview + 8 detail pages
    │
    └── images/                     # All product photos (~1.2 MB total)
```

---

## 🎨 Design System

| Element | Value |
|---------|-------|
| Primary Color | `#c0392b` (Allstrong Red) |
| Background | `#0a0a0a` (Black) / `#fafaf8` (Cream) |
| Steel Gradient | `#f5f7f9 → #b8bdc2 → #6b7075` (chrome) |
| Font | Montserrat (300–900) |
| Material Texture | Hairline brushed steel via CSS `repeating-linear-gradient` |

---

## 🌐 Live Preview (GitHub Pages)

The site is auto-deployed to GitHub Pages on every push to `main` via `.github/workflows/pages.yml`.

**Live URL:** https://lebinhuang.github.io/allstrong-website/

### First-time setup

If Pages is not yet enabled on the repo, do this once:

1. Go to **Settings → Pages**
2. Under **Build and deployment → Source**, select **GitHub Actions**
3. Push to `main` (or run the `Deploy to GitHub Pages` workflow manually from the **Actions** tab)
4. Wait ~1 minute for the workflow to complete — the live URL will appear in the workflow run summary

### How it works

- On push to `main`, the workflow uploads the contents of `allstrong-website-final-v5/` to GitHub Pages
- No build step required — pure static HTML / CSS / JS
- The deploy environment URL appears as a check on each commit

---

## 💻 Local Preview

```bash
# From the repository root:
cd allstrong-website-final-v5
python3 -m http.server 8000
# Then visit http://localhost:8000
```

Or with Node:

```bash
npx serve allstrong-website-final-v5
```

Opening `index.html` directly in a browser works too, but a local server is recommended so relative image paths behave correctly.

---

## 📞 Contact

Allstrong Restaurant Equipment Inc.
1839 Durfee Ave, South El Monte, CA 91733
📞 (626) 448-7878
🌐 [allstrong.com](https://allstrong.com)

---

## 📜 License

All rights reserved © 2024 Allstrong Restaurant Equipment Inc.
