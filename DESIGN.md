# Design

Visual system as implemented (ported from the minimal-mistakes Jekyll dark skin, 2026-04 Astro migration). Source of truth: `src/styles/global.css`.

## Theme

Single dark theme. No light mode, no theme switching.

## Color

| Token | Value | Role |
|---|---|---|
| `--bg` | `#1f2330` | body background |
| `--html-bg` / `--surface` | `#252a34` | page frame, masthead, code blocks, panels |
| `--bg-soft` | `#1a1f2e` | tooltips, pagefind tags (darker inset surface) |
| `--text` | `#eaeaea` | body text |
| `--text-muted` | `#ccc` | nav links, excerpts |
| `--text-soft` | `#bdbdbd` | metadata, labels, footer |
| `--text-strong` | `#f3f3f3` | headings, titles |
| `--link` | `#8cd1d4` | links (desaturated teal), the one accent hue |
| `--link-hover` | `#a9dcdf` | link hover |
| `--accent` | `var(--link)` | anchor icons, small accents |
| `--border` | `rgba(255,255,255,0.08)` | all rules and borders |

Strategy: restrained. One teal accent on a dark neutral field. Do not add hues.

## Typography

- System sans stack (`--font-sans`). No webfonts, deliberately.
- Root: 16px, stepping to 18px at 64em and 20px at 80em.
- Scale: h1 1.953em / h2 1.563em / h3 1.25em (x1.25 modular). Weight 700, line-height 1.2.
- Body line-height 1.5; prose measure capped at 72ch inside posts.
- Voice rule: all UI text is lowercase at rest. Title Case only via the cap-toggle.

## Layout

- `--max-w: 80rem` centered shell; 200px author sidebar + content grid at >=64em, single column below; sidebar hidden under 48em.
- Rhythm from 1px `--border` rules between entries and sections, not cards.
- Small radii (3-4px) on chips, code, buttons. No shadows.

## Components

- **Masthead**: site title + nav + search icon + cap-toggle. Collapses to `.nav-toggle` hamburger under 48em.
- **AuthorProfile**: avatar (110px circle), name, bio, icon links. Sidebar only.
- **CapToggle** (`Aa`): the signature interaction. Rewrites text nodes to Title/sentence case via JS; `linkedin` mode uppercases via CSS. Tooltip labels: "switch to lowerchaos" / "lol LINKEDIN YEAH".
- **Entry list**: title, calendar/clock meta with inline icons, excerpt, `#tag` links.
- **Tag chips** (`.tag-link`): 1px border, 3px radius, teal text.
- **Post nav**: prev/next bordered panels; stacks to one column under 30em.
- **Icons**: inline FontAwesome-path SVGs via `Icon.astro`, `currentColor`, 14px default.
- **Heading anchors**: hover-reveal link icon, click copies URL, "link copied" affordance.

## Motion

Near-none, on purpose. Opacity fade on heading anchors (0.15s), Astro view transitions for navigation. No entrance animation, no scroll effects. Keep it that way.

## Don'ts

- No webfonts, no light theme, no cards-with-shadows, no second accent color.
- Don't title-case anything at rest; casing belongs to the toggle.
- Don't add imagery for its own sake; this is a text site.
