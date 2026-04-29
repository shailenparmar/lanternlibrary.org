# Lantern Library — Style Guide

This is the source of truth for design and copy decisions. Before touching
UI, color, animation, or user-facing copy, read this file. After making a
decision worth codifying, update this file.

Last updated: 2026-04-29

---

## Voice & tone

- Quiet, literary, present. Closer to a thoughtful friend over coffee than
  to a clinician or a marketer.
- First-person beats second-person for anything the reader might say to us
  ("I'm losing my hair," not "your hair loss"). Reserve second-person for
  invitations to act ("Made it through something hard?").
- No emoji. No exclamation points. No "I'm so sorry to hear that." No
  "Sounds like…" Don't perform empathy; demonstrate attention by echoing
  specific language.
- Honest about what isn't there yet: "An independent archive" — not
  "nonprofit" until 501(c)(3) is filed.
- Time-honest CTAs: name the commitment ("Ten minute reflection") rather
  than a generic "Get started."

---

## Typography

- **Body / display**: `font-serif` — EB Garamond.
- **UI chrome / labels / status / nav**: `font-sans` — Inter.
- Italic is reserved for accent, not paragraphs. Avoid italicizing
  reflector tiles, prompt questions, or live ephemeral text — italic body
  text reads heavy at large sizes. Italic is fine for:
  - The flame-colored accent clause in headlines
  - Pull quotes inside stories
  - Cycling sample placeholders in the search bar
  - Empty-state hints
- Headings use `leading-[1.05]` to keep them tight; body `leading-relaxed`
  or explicit `lineHeight: 1.5` for the live ephemeral display.

---

## Color & lighting

CSS variables in `app/globals.css`:

| Token             | Hex        | Use                                              |
| ----------------- | ---------- | ------------------------------------------------ |
| `--background`    | `#0b0f1a`  | Deep blue-black page background                  |
| `--foreground`    | `#ece1c8`  | Warm cream — primary text                        |
| `--muted`         | `#8a8676`  | Status text, footer chrome, low-emphasis labels  |
| `--rule`          | `#1b1f2c`  | Borders, dividers, subtle bg fills (e.g. `bg-rule/30`) |
| `--flame`         | `#f4a23c`  | Lantern accent — used sparingly for emphasis     |

Rules:

- The page is dark. Text is cream. Flame is the only color, and it's used
  sparingly — accent, not theme.
- For interactive flame elements, prefer `bg-flame/[0.05]` to `bg-flame/[0.10]`
  with a `border-flame/30..50`. Never solid flame buttons.
- Flame glow on lit dots: `shadow-[0_0_8px_2px_rgba(244,162,60,0.6)]`. Use
  consistently for "lantern-lit" affordances (mic active, release-button
  bullet, light-the-lantern, share-yours button bullet).
- Selection is flame-on-bg: `::selection { background: var(--flame); color: var(--background); }`.

---

## Layout patterns

### Header / back navigation

Every non-home page has the same top-left affordance: a single combined
back-and-wordmark link. No duplicate Wordmark component beside it.

```tsx
<header>
  <Link
    href="/"
    className="font-sans text-sm tracking-[0.18em] uppercase text-muted hover:text-foreground transition-colors inline-flex items-center gap-2"
  >
    <span aria-hidden="true">←</span>
    <span>Lantern Library</span>
  </Link>
</header>
```

Home uses a plain `<Wordmark />` (no arrow).

### Footer

Always at the bottom, minimal. Three lines, in this order:

1. `hello@lanternlibrary.org` — clickable mailto
2. `An independent archive.`
3. `Not medical advice.`

`font-sans text-xs text-muted/80`. No nav links in the footer; navigation
is integrated where it belongs (top-left back, share button on home).

### Lantern field backdrop

`<LanternField />` at the top of every full-screen page (home and /reflect).
Drifting amber dots. Quiet, respects `prefers-reduced-motion`. Never on
top of a long-form reading surface (story pages don't use it).

---

## Components

### Search bar (`SearchSurface`)

- `<input type="text">` — never `type="search"` (the native X is noise).
- No "clear" button.
- Native placeholder is empty; cycling samples render as an absolutely-
  positioned overlay that fades.
- Sample queries: 15–20, first-person, mix of named conditions and
  feeling-level phrases. Light on any one cluster (no more than ~1
  hair-loss entry, etc.). See `components/SearchSurface.tsx` `SAMPLE_QUERIES`.
- Loading state is **shimmer skeletons** (3 cards), not verbal "searching."

### Reflect surface (`ContributorSurface`)

- Centered, single column. No two-column draft+tiles split anymore.
- Top: 4 reflector squares (`grid-cols-2 sm:grid-cols-4`, aspect-square).
- Beneath: one prompt question, flame-colored.
- Beneath: live ephemeral display — fixed 3-line height, `lineHeight: 1.5`,
  `height: 4.5em`, gradient mask fades the top edge so older lines fade
  off as new ones come in.
- Live text **does not return after fading**. Each fade resets
  `sessionStart` to current draft length so the next input starts fresh.
- Bottom: mic button (left) + "I'm ready to see my lantern" (right).
- `keep going` flame label appears above the buttons until draft hits the
  release threshold (`RELEASE_THRESHOLD = 600` chars).
- Auto-listen: a window-level keydown listener forwards keystrokes to the
  hidden textarea so the user never has to click to focus.

### Buttons / CTAs

- Primary CTA (e.g., "Ten minute reflection"): flame-bordered, flame text,
  flame bullet dot with glow. Centered with descriptive copy *above* it,
  not generic "Get started."
- Secondary actions (mic, release, etc.): smaller, flame-on-flame-tint
  bg, same shape language.
- Top-right "share yours" tiny link is gone. Real share button goes
  centered below search results.

---

## Animations

All keyframes live in `app/globals.css` and respect `prefers-reduced-motion`.

| Animation            | Where used                                  | Duration  |
| -------------------- | ------------------------------------------- | --------- |
| `lantern-drift`      | Backdrop dots on home and /reflect          | 6s loop   |
| `tile-in`            | Reflector tiles, story result cards, etc.   | 600ms     |
| `floating-word`      | Voice interim words (legacy — may remove)   | 1.4s      |
| `breathing`          | (removed; do not reintroduce as loading)    | —         |
| `sample-cycle`       | Search bar cycling placeholder              | 3.5s      |
| `shimmer-sweep`      | Search loading skeletons                    | 1.8s loop |

**Loading vs. listening rules:**

- Visual feedback only. No "listening", no "searching" verbal text.
- Tiles arriving (animate-tile-in) is sufficient feedback.
- Skeletons shimmer; they don't pulse.

---

## Copy rules (load-bearing)

- **Hero**: "A library of lanterns, real recovery stories *to guide you
  through.*" — flame italic on the trailing clause.
- **Share invitation**: "Made it through something hard? Share a lantern
  to help others in the dark middle." → button "Ten minute reflection".
- **Reflect prompt placeholder**: "start typing" — `font-sans text-sm
  tracking-[0.2em] uppercase text-foreground/55`.
- **Keep-going hint**: short, lowercase tracking-200, flame.
- Sample stories are tagged with `<SampleBadge />`. The "Sample" tag is
  literal honesty, not branding.
- "Recovery" includes both symptom resolution AND a changed relationship
  with the condition. Don't gate share invitations on "fully recovered."

---

## What we don't do

- No nonprofit / 501(c)(3) language until filed.
- No emoji, no exclamation points (except in code comments).
- No "you" anywhere a person is describing their own situation. They say
  "I."
- No verbose loading states. No "Please wait." No spinner.
- No 8-beat scaffold visible to contributors. The eight beats are an
  internal LLM signal only.
- No paragraphs of italic body text. Italic is accent, not register.
- No "interview" framing. The reflection tool is a container the
  contributor uses for their own process.
- No clickable Wordmark *plus* a separate "← back" link. One combined
  affordance on the top-left.
- No `type="search"` — it leaks the browser-native X.

---

## How to update this file

When you make a UI or copy change that establishes (or changes) a pattern,
update the relevant section here in the same commit. If you find yourself
making a one-off decision a second time, that's a sign it should be
codified here. Date the section when you edit it.
