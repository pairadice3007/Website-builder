# Website Selector — AI Prompt Builder

A single-page tool in the Voss Systems brand. Visitors describe the site they
need, pick a business type, a visual style, and the page sections in order,
and the tool assembles a structured, build-ready prompt to paste into Lovable,
Bolt, v0, Claude, or any AI website builder.

Everything runs client-side. No account, no email gate, nothing stored or sent.

## Stack

Plain HTML, CSS, and vanilla JavaScript. No build step, no dependencies.

- `index.html` — page structure
- `styles.css` — Voss Systems theme: deep slate rgb(29,78,120) and muted
  electric blue rgb(43,108,176) on white
- `app.js` — chip selection, style cards, section reorder (drag on desktop,
  buttons on mobile), live prompt assembly, copy to clipboard

## Run

Open `index.html` in a browser, or serve the folder with any static server:

```
python3 -m http.server 8000
```

## Before publishing

- Set the newsletter URL on the "Read Voss Systems" button in `index.html`
  (`#newsletter-link`, currently `#`).
