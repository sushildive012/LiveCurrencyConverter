![Live Currency Converter](assets/banner_title.svg)

A live currency converter built with **HTML, CSS, and vanilla JavaScript** — real-time rates via the Frankfurter API, no frameworks.

🔗 **Live Demo:** [Click here to View](#https://sushildive012.github.io/LiveCurrencyConverter/) <!-- replace with your GitHub Pages link -->

<!--![Preview](assets/preview.png) -->

---

![Features](assets/banner_features.svg)
- 🔁 Bidirectional conversion — type in either box, the other updates (reverse rate handled automatically)
- ⏱️ **Debounced API calls** (1s delay) so conversion doesn't fire on every keystroke
- 💾 Currency list cached in `sessionStorage` — no repeat API call on every refresh
- 🌗 Dark/light theme via `data-theme` attribute + CSS custom properties, persisted in `localStorage`, defaults to system preference on first visit
- 🔃 Swap button flips currencies, flags, and re-converts in one click
- 🏳️ Flags fetched dynamically from ISO currency code → country flag mapping

![Tech Stack](assets/banner_tech.svg)
`HTML5` · `CSS3` (custom properties, `data-theme` theming) · `Vanilla JS` (`async/await`, `fetch`, debounce, `sessionStorage`/`localStorage`)

![What I Learned](assets/banner_learned.svg)
- **`async/await` + `fetch`** — real API integration instead of static/mock data, with `try/catch` for failed requests
- **Debouncing from scratch** — wrote my own `debounce()` closure wrapping the conversion call, instead of importing one, so I understand *why* it prevents API spam
- **Cache-first loading** — check `sessionStorage` before hitting the network, so the currency list only calls the API once per session
- **Theming without a framework** — `data-theme="dark"/"light"` on `<html>` + CSS variables, with a pre-paint inline `<script>` in `<head>` to avoid a white-flash before JS loads, seperate `theme.js` & `converter.js` for best practice
- **Event delegation on forms** — single `input`/`change` listener on `#form` handles both amount fields and both dropdowns, filtered by `e.target`

![Run Locally](assets/banner_run.svg)
```bash
git clone https://github.com/sushildive012/LiveCurrencyConverter.git
cd repo-name
# open index.html in your browser
```

![Structure](assets/banner_structure.svg)
```
├── index.html
├── style.css
├── script.js
└── assets/
    └── rupee.png
```
