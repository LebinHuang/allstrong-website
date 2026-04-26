# Allstrong Restaurant Equipment — Website Redesign

A modern, dark-themed redesign of [allstrong.com](https://allstrong.com) — commercial Chinese kitchen equipment manufacturer based in South El Monte, CA.

🔗 **Live preview:** https://lebinhuang.github.io/allstrong-website/

---

## 🚀 Performance Optimization (v2)

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
├── index.html                    # Homepage with cinematic hero
├── style.css                     # Shared stylesheet (~30 KB)
├── script.js                     # Slider + animations
│
├── chinese-wok-range.html        # ARE Series wok ranges
├── bbq-oven.html                 # EQ Series BBQ ovens
├── mongolian-bbq-range.html      # ARE-MBG Series Mongolian grills
├── steamer-cabinets.html         # 3-compartment steamers
├── noodle-pasta-broiler.html     # ARE-1 dual-function broiler
├── rice-noodle-range.html        # ARE-1 rice noodle range
├── thawing-machine.html          # Frozen meat defrosting tub
├── faucets.html                  # 14-product faucet catalog
│
└── images/                       # All product photos (~1.2 MB total)
    ├── wok-range.png
    ├── bbq-oven.png
    ├── mongolian-bbq-range.png
    ├── steamer-cabinets.png
    ├── noodle-pasta-broiler.jpg
    ├── rice-noodle-range.png
    ├── thawing-machine.jpg
    ├── about-bg.jpg
    ├── faucet-aa-wall-mount.jpg
    ├── faucet-aa-deck-mount.jpg
    ├── faucet-fisher-wall.jpg
    ├── faucet-fisher-deck.jpg
    ├── ... (14 faucet images)
```

---

## 🎨 Design System

| Element | Value |
|---------|-------|
| Primary Color | `#c0392b` (Allstrong Red) |
| Background | `#0a0a0a` (Black) |
| Accent | `#fafaf8` (Cream) |
| Font | Montserrat (300–900) |

---

## ✨ Features

- **Cinematic hero** with light-sweep brand reveal animation
- **8 product detail pages** with full specs, features, and CTAs
- **Faucet catalog** with category filtering (14 products)
- **Responsive design** for desktop, tablet, mobile
- **External image files** for fast loading and browser caching

---

## 🚀 How to Run Locally

```bash
# Option 1 — Open directly
open index.html       # macOS
start index.html      # Windows

# Option 2 — Run a local server (recommended for proper image loading)
python3 -m http.server 8000
# Then visit http://localhost:8000
```

---

## 📞 Contact

Allstrong Restaurant Equipment Inc.
1839 Durfee Ave, South El Monte, CA 91733
📞 (626) 448-7878
🌐 [allstrong.com](https://allstrong.com)

---

## 📜 License

All rights reserved © 2024 Allstrong Restaurant Equipment Inc.
