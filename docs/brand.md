# Brand

## The mark

A speech bubble holding three dots, and the last one never left.

`apps/web/src/components/Logo.tsx` is the only version that should appear in the
product. The bubble takes `currentColor`, so it inherits the type colour beside
it; the two grey dots are knocked out to `--color-paper`, which is the page
behind them. That is what lets one asset invert correctly between themes instead
of shipping a light and a dark file that drift apart.

The third dot is coral. It is the only warm mark in the entire interface, and it
should stay that way — the moment a second thing is coral, the dot stops meaning
anything.

| File | Use |
|---|---|
| `src/components/Logo.tsx` | Everywhere inside the product |
| `src/app/icon.svg` | Favicon. At 16px the bubble turns to mush, so it reduces to the three dots |
| `public/mark.svg` | Square mark for anything outside the app |
| `public/logo.svg` | Horizontal lockup. Wordmark is live text in a serif stack — convert to outlines before sending it to a printer |

Clear space is the height of one dot on every side. Do not recolour the bubble,
do not add a gradient, and do not set the wordmark in the sans.

## Palette

The orange edition: a newspaper front page in cream newsprint and warm-black
ink, with orange from the OMX Lab Coral scale as the one loud colour. There is
no blue or teal anywhere. One theme only — see below.

| Token | Value | Role |
|---|---|---|
| `paper` / `paper-raised` / `paper-tint` | `#F8F5EF` / `#FFFFFF` / `#F1EBE2` | Ground, cards, bands |
| `ink` / `ink-soft` / `ink-faint` | `#1A1410` / `#57483F` / `#6B5B50` | Type (16.8 / 8.0 / 6.0 : 1) |
| `line` / `rule` / `field` | `#E4DCD2` / `#1A1410` / `#8A786C` | Hairlines, heavy rules, control borders |
| `brand` | `#FF7942` Coral 500 | Fills. The label on it is ink (7.0:1) |
| `brand-bright` | `#D16336` Coral 600 | Hover fill, ink label (4.8:1) |
| `brand-strong` | `#C2410C` | Orange **text** and links (4.8:1) |
| `brand-display` | `#E8571F` | Headline words, 24px and up only (3.3:1) |
| `brand-wash` / `accent-wash` | `#FFE7DD` / `#FFCFBB` | Icon tiles; the highlighter |
| `night` / `night-raised` / `night-line` | `#1A1410` / `#2A211B` / `#3D3229` | The on-chain band and footer |
| `ember` | `#B42318` | Errors — red, so it never reads as brand |
| `safe` / `caution` | `#2F6B3A` / `#A34D2A` | Privacy Centre: sealed vs visible |

Coral 500 as text is 2.4:1 and is never used that way — that is the reason
`brand` and `brand-strong` are separate tokens.

Type: Archivo at heavy weights for headlines, Fraunces for the nameplate and
wordmark (still a serif), Inter for the interface, JetBrains Mono for
ciphertext and hashes. All self-hosted by `next/font`.

Icons: `src/components/Icon.tsx`, one inline-SVG set at one stroke weight. No
emoji anywhere in the product or the deck.

Visuals are drawn in code (`src/components/visuals/`): a phone running the
real flow, and a block-explorer view of the consent ledger under the real
program id. No stock photography, so the page makes no request to an image
host.

**Loudness is rationed by surface.** Marketing pages and the deck get orange
buttons and the highlighter. Inside the vault buttons are ink and there is no
highlighter.

## Motion and performance

Motion carries the explanation here — the pipelines, the enclave, the chain —
so it has rules, measured on a phone profile (390px, 4× CPU slowdown):

- **Loops pause off screen.** Every timer-driven scene takes `useInView`
  (`src/lib/useInView.ts`) and stops while scrolled away. A long page used to
  keep six timers re-rendering unseen.
- **Prefer CSS to timers.** The headline ticker, step-card art and chip pulses
  are pure CSS keyframes in server components: no JavaScript, nothing to
  hydrate.
- **Nothing in the first screen waits on an animation.** Reveal-on-scroll is
  for below the fold only. A fade on the deck's slide container held its
  Largest Contentful Paint at 4.9 s; removing it brought it to ~0.3 s.
- **Animate cheaply.** The hero phone types a word per tick (8 renders, not
  38) and starts after first paint.
- **Fonts carry only the axes we use.** Dropping Fraunces' optical-size and
  softness axes and Archivo's width axis took font bytes per page from 294 KB
  to 158 KB.
- **Server by default.** Charts are server components; only the bar hover is a
  client island. A server component must not import a value from a client
  module (it receives a reference, not the value) — shared constants live in
  plain modules such as `src/lib/chain.ts`.
- Everything honours `prefers-reduced-motion` and shows its end state.

## Themes

There is one theme, a Tailwind `@theme` block in
`apps/web/src/app/globals.css`, and `color-scheme: light` on the root.

If a dark theme ever comes back, do not nest a second `@theme` inside a
`prefers-color-scheme` media query. Tailwind v4 hoists **every** `@theme` block
to the root and the last one wins, so a nested dark block replaces the light
palette for everyone. Override plain custom properties on `:root` inside the
media query instead — that is how the retired dark palette was wired.
