# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

Personal portfolio (UX / product designer) built with Angular 21 (CLI 21.2), Tailwind CSS v4 and Outfit (self-hosted).
**Done**: foundations (tree, tokens, base CSS, i18n, lazy routing, custom cursor), **header**, **search dialog**, **home hero**, **skills marquee band**, **home about preview**, **home services preview**, **home portfolio (selected projects)**, **home gallery**, **home contact (form + WhatsApp + socials)**, **footer**, **About page (intro + gallery + experience timeline + awards + contact)**, **Services page (complete)**, **Projects list page**, **Behance-style project viewer** (case study modal + share), **custom scrollbar**, **scroll-reveal animations** (all pages).
**The home page is complete.** Home order: hero → skills marquee → about preview → services preview → portfolio → gallery → contact. (The planned concrete-example and awards-preview sections were dropped.)
Every other page and section is still a **skeleton** (a standalone component that only shows its class name).

## Commands

Run all commands from this directory (the Angular workspace root, not the parent folder).

- `npm install`: with npm 10.8.3 it crashes (`Cannot read properties of null (reading 'edgesOut')`, an arborist bug on jsdom's optional peer). Use `npx npm@11 install` instead.
- `npm start` (`ng serve`): dev server at http://localhost:4200
- `npm run build` (`ng build`): production build to `dist/`, with output hashing and size budgets
- `npm run watch`: development build in watch mode
- `npm test` (`ng test`): **Vitest** + jsdom via `@angular/build:unit-test` (not Karma). For a single run: `npx ng test --watch=false`
- Single spec: `ng test --include src/app/app.spec.ts`
- Generate: `ng generate component <path/name>` (selector prefix `app`)
- Format: `npx prettier --write .`. No ESLint is configured.

## Tree

```
src/
  index.html                 lang="en", base meta tags
  styles.css                 entry point: Outfit @fontsource (300-700) → tailwindcss → styles/*
  styles/
    tokens.css               design tokens (@theme static + :root). ONLY file with raw hex
    base.css                 reset complements, html/body, headings, links, lists, media, focus, selection, reduced-motion
    utilities.css            @utility container-site, grid-site, section-y
    animations.css           @keyframes marquee, fade-in, fade-in-up + animate-* tokens
  assets/
    i18n/en.json, fr.json    translations (bundled through static imports, not copied to dist)
    images/, icons/          static assets, copied to /assets (hero-portrait.webp, about-portrait.webp, services-process.webp, services-pillars-portrait.webp, services/example-*.webp, hero-pattern.webp, projects/<slug>.png + projects/<slug>/slide-NN.webp, gallery/gallery-NN.webp, awards/<id>.webp)
    documents/               cv-serigne-khalifa-ababacar-sy-nguirane.pdf (About "My CV")
  app/
    app.ts|html              root: header + <main> router-outlet + footer + custom cursor
    app.config.ts            router (component input binding, scroll restoration)
    app.routes.ts            lazy routes
    core/
      services/i18n.ts       I18n service (signals)
      services/contact.ts    Contact service (EmailJS REST, fetch)
      services/search.ts     keyword search
      services/project-viewer.ts  Behance-style viewer state (open/close, URL sync)
      pipes/translate-pipe.ts
      models/                project, service, award, experience, nav-item, social-link, language, search-entry (+ index.ts barrel)
      constants/             nav-items, footer-links, social-links, languages, search-index, skills, gallery, contact, cv
      data/                  services (4 entries), projects (Samba App, SenGame, Doctor App, Waterflow), experiences (4, from the CV), awards (EDACY valedictorian, Google UX Design certificate, Docsen e-health hackathon)
    layout/                  header, footer, language-switch, search-dialog, project-viewer (overlay)
    shared/
      ui/                    button (a[appButton]), social-icon-button, logo, marquee, project-card, share-menu (done); section-heading, container, chip (shells)
      cursor/custom-cursor/
    features/
      home/                  home.ts + sections/{hero, skills-marquee, about-preview, services-preview,
                             selected-projects, gallery, contact-cta}-section
      about/                 about.ts (intro + reused home Gallery/ContactCta sections) + sections/{experience, awards}-section
      contact/  articles/ (skeleton)  not-found/
      services/              services.ts: sections/{intro, method, example}-section + reused home ServicesPreview/ContactCta sections
      projects/              project-list/, project-detail/ (route `projects/:slug` = list + viewer open)
```

Routes (all `loadComponent`, lazy): `''`, `about`, `services`, `projects`, `projects/:slug`, `articles`, `contact`, `**` (404).

Docs: `docs/emailjs-setup.md` (contact form setup, in French, for the site owner).

## Conventions

- **Angular 21 naming**: `foo.ts` / `foo.html` / `foo.css`, class `Foo`, with no `.component` or `.service` suffix. Pipes use `translate-pipe.ts` / `TranslatePipe`. Sections are suffixed `-section` (`hero-section.ts` / `HeroSection`).
- Standalone components only, `ChangeDetectionStrategy.OnPush`, state in **signals**, and the new control flow (`@if`/`@for`). Zoneless app (Angular 21 default).
- **Path aliases** (tsconfig): `@core/*`, `@layout/*`, `@shared/*`, `@features/*` → `src/app/...`, and `@assets/*` → `src/assets/*`. Use them instead of long relative imports. Relative imports are fine inside one feature.
- Semantic HTML: `<header>`, `<main>`, `<footer>`, and **exactly one `<h1>` per page**. On Home, the h1 lives in the hero section.
- **No hardcoded text in templates**: every string goes through an i18n key (`{{ 'nav.home' | translate }}`), and this includes `aria-label` and `alt`. Keys are grouped by section: `common`, `nav`, `hero`, `skills`, `home`, `about`, `services`, `projects`, `contact`, `notFound`, `footer`, `search`. Add each key to **both** `en.json` and `fr.json`. Unwritten copy is `"TODO"`. Models and data reference i18n keys (`titleKey`, `labelKey`...), not text. The only temporary exception is the class names shown by the skeletons.
- **No hardcoded hex (or rgb/hsl) in components or any other CSS**: use semantic tokens through Tailwind utilities (`bg-primary`, `text-ink`, `rounded-pill`, `font-sans`...) or `var(--color-*)`. New colors go in `tokens.css` only.
- **Section anchors**: every section exposes `id="<name>"`, which is its file name without `-section` (`#services-preview`, `#faq`...). Router `anchorScrolling` is enabled. Keep these ids stable, because search depends on them.
- **Search**: see the "Search" section below.
- **Projects dropdown** in the header is generated from `PROJECTS` (`core/data/projects.ts`): one link per project to `/projects/:slug`. Adding a project adds it to the menu.
- No logic in skeletons, and no fake data: `AWARDS` holds the real awards only (EDACY valedictorian, Google UX Design certificate, Docsen e-health hackathon). `PROJECTS` holds the real projects only (Samba App, SenGame, Doctor App, Waterflow). `SERVICES` holds 4 services whose copy (`services.items.*`) is a **proposal awaiting validation** (the mock-up only had lorem ipsum). `SOCIAL_LINKS` holds the real LinkedIn + Behance URLs (an empty url would render the button without `href`).
- TypeScript strict (`strictTemplates`, `noPropertyAccessFromIndexSignature`, `strictInputAccessModifiers`).
- Production budgets: initial bundle warns at 500kB and errors at 1MB. **Per-component styles warn at 4kB and error at 8kB**. Prefer Tailwind utilities in templates. Shared CSS goes in `src/styles/`.
- Component CSS files are NOT processed by Tailwind's entry. If a component stylesheet needs `@apply`/theme functions, add `@reference "../../../styles.css";` (relative path) at its top. Otherwise use `var(--token)`.
- Prettier: 100-char lines, single quotes, Angular parser for `.html`.
- Never commit unless asked.

## Design tokens (`src/styles/tokens.css`)

Declared in `@theme static` (generates Tailwind utilities and is always emitted as CSS variables):

Colors were sampled from the Figma mock-ups.

| Token | Value | Utility examples |
|---|---|---|
| `--color-primary` | `#7f011f` | `bg-primary`, `text-primary`, `border-primary` |
| `--color-primary-contrast` | `#ffe5e5` | text on primary (pale pink) |
| `--color-primary-hover` | `color-mix(oklab, primary 86%, white)` | lighter burgundy for hovered fills: **derived** from primary, not a second shade |
| `--color-primary-soft` | `#e2aca0` | greeting pill background |
| `--color-primary-bright` | `#c9103c` | crimson end of the services gradient (`primary → primary-bright`), **gradient only** |
| `--color-background` | `#f5ebd0` | page background (cream) |
| `--color-paper` | `#fffdf9` | case-study sheet in the project viewer (= the slides background) |
| `--color-surface` | `#fbf5e6` | cards, menus (not in the mock-up yet) |
| `--color-ink` / `--color-muted` | `#000000` / `#6e5d58` | main / secondary text |
| `--color-faint` | `#989281` | faint grey-beige: footer copyright (`text-faint`) |
| `--color-heading` | `#2b2f38` | dark slate section headings on cream (about name) |
| `--color-line` | primary at 19% (`#dfbfae` on cream) | hairlines (`border-line`), e.g. the header bottom border |
| `--color-logo-ink` | `#1b3626` | dark green "bn" of the logo, **logo only** |
| `--font-sans` | Outfit | `font-sans` (default on body) |
| `--radius-pill` / `--radius-card` | `9999px` / `1.5rem` | `rounded-pill`, `rounded-card` |
| `--spacing-gutter` | `clamp(1rem, 6.95vw, 6.25rem)` | page side margin (100px at 1440) |
| `--spacing-section(-lg)` | 5 / 8rem | `py-section`... |
| `--ease-out-soft`, `--ease-in-out-soft` | cubic-bezier | `ease-out-soft` |
| `--animate-marquee`, `--animate-fade-in(-up)` | in `animations.css` | `animate-marquee` |

CSS-only (`:root`): `--container-max` (77.5rem = 1240px content width), `--grid-columns` (4 → 8 at md → 12 at lg), `--grid-gutter` (`clamp(1rem, 1.4vw, 1.25rem)`), `--duration-{fast,base,slow}`, `--duration-hover` (400ms, button hover/press), `--duration-marquee` (40s per loop), and the cursor tokens `--cursor-ring-size`, `--cursor-dot-size`, `--cursor-ring-border`, `--cursor-hover-scale`, `--cursor-press-scale`, `--cursor-lag`.

### Layout grid

The background is **plain cream** (`--color-background`). The vertical bands visible in the Figma captures are the **Figma layout grid overlay**: they are not part of the design and must not be reproduced. That grid (12 columns at 1440, 100px margins, ~20px gutters) is still the layout reference:
- `container-site`: centered column, `width: min(100% - 2 × gutter, --container-max)`.
- `grid-site`: `--grid-columns` columns with a `--grid-gutter` gap. Place children with `col-span-*`.
- There is **one single burgundy**: `--color-primary` (`#7f011f`) for text and fills alike. Do not add a second shade. Hover states use the derived `--color-primary-hover`.

Other utilities: `section-y` (vertical section padding), and `btn-primary`: filled primary control, used by `a[appButton]` and the social buttons. Its hover is smooth (400ms ease-out-soft): lighter burgundy, a 2px lift and a soft shadow. It applies only under `@media (hover: hover)` to avoid sticky hover on touch, with a slight scale-down on `:active`. **Reuse it for any filled primary button.** `chip` is a filter pill: hairline border, burgundy on hover, filled burgundy when `aria-pressed="true"`. `app-social-icon-button` takes `size="md"` (52px `btn-primary`, hero) or `size="sm"` (40px `btn-outline`). `btn-outline` is the outlined variant (transparent, 1.5px primary border). On hover the border and icon lighten and it lifts 2px; when `:disabled` it fades to 30%. `btn-light` is the same control in reverse (cream fill, burgundy text, hovers to `surface`) for burgundy backgrounds. The `a[appButton]` component (52px, `px-7`, semibold 14px, `gap-2.5` for a trailing arrow icon) takes `variant="primary" | "light"`. Width comes from its content, so the hero CTA adds `min-w-[12.875rem]`. Marquee: the track must contain its content **twice** (`animate-marquee` translates to −50%).

## Header (`layout/header`)

Matches the Figma navbar at 1440:
- **Bar**: **sticky** (`sticky top-0 z-40`), 80px tall (`h-header`, token `--spacing-header`), cream background, 1px `border-line` at the bottom, content in `container-site`.
- **Left**: logo, then the nav 80px further (`ml-20`). Links are Outfit 16px in ink with a 24px gap. The active link is primary, weight 500, underlined (1.5px, offset 5px) through `.nav-link.is-active` in `header.css`.
- **Projects**: a disclosure button with a chevron, opening a dropdown (surface card) that lists `PROJECTS` plus an "All projects" link. It closes on outside click, on Escape and after navigation.
- **Right**: search button (icon + label, opens the search dialog), a 2px vertical separator, then the language switch: a 88×32 pill with a primary border, where the active language is filled primary (`aria-pressed` variants).
- **Below lg**: logo + burger. The menu opens as a panel under the bar (stacked links, Projects sub-list, search and language switch).
- The **logo** (`shared/ui/logo`) is a TEMPORARY Outfit text wordmark until the official SVG is provided.

## Home hero (`features/home/sections/hero-section`)

Matches the Figma hero at 1440: **600px tall** below the header (`lg:h-[37.5rem]`), `grid-site`, with elements placed by top padding (not centered) to match the mock-up.
- **Text** (`lg:col-span-7`): greeting pill (`bg-primary-soft text-primary`, rotated −4°), h1 name (Outfit Bold, `clamp(2.25rem, 3.34vw, 3rem)`, line-height 1.6 on desktop and 1.25 on mobile, `text-wrap` to avoid the global `balance` so the line break matches the design), tagline 16px/1.6 max 40rem, then CTA `a[appButton]` → `/contact` and the round `app-social-icon-button`s (52px, 10px gap).
- **Portrait** (`lg:col-span-5`, 107% wide so it overflows the container like in Figma, `lg:pt-9`): `assets/images/hero-portrait.webp`. The tilted frame and dashed outline **are part of the image**. It was extracted from a capture flattened on black: background removed by flood-fill + edge un-premultiply. Replace it with the original transparent export if available. `NgOptimizedImage` + `priority` (LCP), and a burgundy `drop-shadow` in `hero-section.css`.
- **Background**: `hero-pattern.webp` is the Figma mandala texture (a ~9% white layer) **flattened on black**. `background-blend-mode: screen` over `--color-background` restores it exactly (cream + 9% white = `#f6edd5`). Do not use it without the blend mode.

## Skills marquee (`features/home/sections/skills-marquee-section` + `shared/ui/marquee`)

A full-bleed `bg-primary` band under the hero: 44px tall (`py-3` + 14px/20px text), `primary-contrast` text, diamond bullets, ~128px between items on desktop (`--marquee-gap`, 4rem on mobile). Items come from `SKILL_KEYS` (`core/constants/skills.ts`, i18n keys). `<app-marquee [items]="keys">` is generic.

Built for performance, and verified in Chrome: 0 layout during scrolling, animation composited (no `compositeFailed`), 0 work off-screen.
- **Pure CSS** `translate3d` keyframe animation (`animate-marquee`). It is compositor-only: no JS per frame, no layout or paint. The track has `will-change: transform`, and the host has `contain: content`.
- **Seamless loop**: the list is rendered 4×, each copy ends with one gap, and the track moves by −50% (2 copies). Each copy is ≈1355px at 1440, so viewports up to ~2700px have no hole.
- **Paused off-screen** by an `IntersectionObserver`, which toggles an `is-paused` class directly with no change detection. It is static under `prefers-reduced-motion`.
- Only the first copy is exposed to assistive tech (the others get `aria-hidden`). The section is labelled by `skills.label`.

## Home about preview (`features/home/sections/about-preview-section`)

Cream section (`py-16 lg:py-32`) with a centered 2-column grid (`max-w-[70.25rem]`, `lg:grid-cols-[21.4375rem_1fr]`, 69px gap, items centered).
- **Portrait**: `assets/images/about-portrait.webp` (343px wide). The rounded frame and dashed outline are part of the image, cut out from a black-flattened capture like the hero one. It has a very soft burgundy drop-shadow and is lazy-loaded through `NgOptimizedImage`. The source photo contains a small ✦ AI watermark at the bottom right.
- **Text**: the h2 is the name (reuses `hero.name`, `text-heading`, Bold `clamp(1.75rem, 2.78vw, 2.5rem)`), then the bio `home.aboutPreview.text` (16px/1.65), then a primary "See more →" button **centered** under the text → `/about`.

## Home services preview (`features/home/sections/services-preview-section`)

A full-bleed band whose background is `linear-gradient(95deg, primary, primary-bright)` with `hero-pattern.webp` over it in `screen` blend (see `services-preview-section.css`). All text is white.
- Centered h2 `home.servicesPreview.title` (same size as the about h2), then the intro (16px/1.65, left-aligned in a centered max-w 55.625rem block).
- 4 cards from `SERVICES.slice(0, 4)` (`max-w-[66.375rem]`, 30px gap, 4 cols at lg, 2 at sm). Each card is transparent with a 25% white border, 10px radius, a centered inline line icon (`ServiceIcon`: mobile, web, research, prototype, switched in the template), an h3 16px semibold and a 14px description at 90% white. On hover it gets a smooth lift and a light wash.
- A light "See more →" button (`variant="light"`) → `/services`. Input `showMore` (default `true`): the Services page reuses this band with `[showMore]="false"`.

## Home portfolio (`features/home/sections/selected-projects-section`)

Cream section, id `selected-projects`, h2 "My portfolio" / "Mon portfolio" (`home.selectedProjects.title`, `text-heading`, same size as the other h2s).
- **Header row**: h2 on the left. On the right, a primary text link "See more →" → `/projects` (16px, `.see-more-link`, the arrow slides on hover).
- **Grid**: 2 × 2 cards at lg (`gap-x-7 gap-y-[1.875rem]`), 1 column below.
- **Cards** (shared `app-project-card`, `shared/ui/project-card`, also used by the Projects page): each card is a whole `<a>` to `/projects/:slug`, with a 1px `border-line`, 2rem radius and `p-5`.
  - The cover is `assets/images/<project.cover>`, 237×147 at sm+ and full width on mobile, lazy-loaded through `NgOptimizedImage`. The cover image includes its own white rounded backdrop, with alpha.
  - Then the title (24px bold ink), centered over the summary (14px/20px, max 14rem).
  - Then a decorative 40px `btn-primary` circle with a ↗ arrow.
  - Hover: lift, surface wash, stronger border, the arrow nudges up-right and the circle lightens.
- **Slots**: the grid always shows **4 slots**. The featured projects are repeated to fill them (`fillSlots`), as a TEMPORARY measure while there are fewer than 4 projects, and real projects replace the repeats automatically. A card shows only real `PROJECTS` data. There are no fake entries, and the header dropdown lists each project once.
- **Adding a project**: add the image to `assets/images/projects/`, an entry to `PROJECTS` (`slug`, `titleKey`, `summaryKey`, `cover`, `coverAltKey`, `tagKeys`, optional `year`, `featured`) and EN + FR copy in `projects.items.<id>`.
- Lazy images only start loading on real scrolling. A headless screenshot that jumps with `scrollIntoView` shows them empty, which is not a bug.

## Home gallery (`features/home/sections/gallery-section`)

A full-bleed photo strip (id `gallery`, labelled `home.gallery.label`) that **advances one position every 10s** with native smooth scrolling, plus pagination below.
- **Photos**: `GALLERY_PHOTOS` (`core/constants/gallery.ts`: `src`, `width`, `height`, `altKey`), images in `assets/images/gallery/`. The rounded corners and the alternating tilt are **part of the images** (alpha WebP, 18 to 81 KB).
  - Tilted photos (01, 03, 05, 07) were cut out from black-flattened captures by flood-fill. Photo 07 used a strict threshold (only pure black removed) because dark clothing touched the edge.
  - Photos 06 to 08 were replaced (SPOTS event portrait, SPOTS conversation, sofa photo).
  - Straight ones (02, 04, 06, 08) were cut with an anti-aliased `roundRect` clip (2px black frame removed, radius 46), because flood-fill leaked into dark clothing.
  - Each item's width is `--gallery-card × (naturalWidth / 696)`, so tilted and straight photos keep the same visual scale. `--gallery-card` is `clamp(14rem, 23.3vw, 21.5rem)`, with a 48px gap at lg.
- **Layout (Figma)**: the strip starts at the viewport's left edge, not the container, and the 4th photo is cut on the right. It uses native horizontal scroll with `scroll-snap` and a hidden scrollbar, so swipe and trackpad work out of the box.
- **Stops**: the reachable scroll positions are measured from the real layout (one dot each, re-measured by a `ResizeObserver`). The last stop is the scroll end, so the last photo ends flush right with no empty space. There are 5 stops at 1440.
- **Pagination**: prev/next `btn-outline` circles (40px, 1.5px burgundy border, **no fill**) and dots. The arrows are **strictly directional**: ‹ always goes back and is disabled at the first stop, › always goes forward and is disabled at the last stop (`atStart` / `atEnd`). Only the autoplay wraps from the last stop back to the first (`advance()`). The active dot stretches to a 24px pill, and each dot has an aria-label `home.gallery.goTo` with `{n}`/`{total}`.
- **Autoplay**: `setTimeout` restarted after every move, manual or automatic. It pauses on pointer hover, on **keyboard** focus inside (`:focus-visible`, so a mouse click on an arrow does not stop it), off-screen (`IntersectionObserver`), in a hidden tab (`visibilitychange`), and is disabled under `prefers-reduced-motion` (instant jumps). The active dot follows manual scrolling, rAF-throttled and ignored during programmatic smooth scrolls (`scrollend` clears the flag).
- Verified in Chrome: next, dots, end stop and wrap, autoplay after 10s, and hover pause.

## Home contact (`features/home/sections/contact-cta-section` + `core/services/contact.ts`)

Cream section (id `contact-cta`) right under the gallery, as a `grid-site` with 5 + 7 columns at lg (stacked on mobile).
- **Left**: an "eyebrow" pill (same style as the hero greeting), h2 `contact.section.title` (`text-heading`), and an intro. Then a primary WhatsApp button (`a[appButton]` → `wa.me` link with a pre-filled message in the current language). Then "Or find me on" with the **small** social buttons (`app-social-icon-button size="sm"`: 40px `btn-outline`).
- **Right**: a form card (`bg-surface`, `border-line`, 2rem radius). Fields: name, email, subject (optional) and message, as Reactive Forms (`NonNullableFormBuilder`). The validators are required, email, `minLength(10)` and `maxLength`.
  - Errors show after blur or after a submit attempt, in burgundy, wired with `aria-invalid` / `aria-describedby`. On submit, focus moves to the first invalid field.
  - Fields use cream inputs with a burgundy focus ring (`contact-cta-section.css`, 16px text so iOS does not zoom).
  - A hidden `website` **honeypot** field: if it is filled, the component fakes a success and sends nothing.
  - States: `sending` (spinner, disabled button), `success` (a panel replacing the form, focus moves to its title, "Send another message"), and `error` (`role="alert"` + a WhatsApp fallback hint).
- **Email without a back-end: EmailJS** (the first provider, FormSubmit, answered `500 Server Error` and was dropped). The `Contact` service POSTs to the EmailJS REST API (`EMAILJS_ENDPOINT`) with `fetch`, no SDK. It makes **two calls**:
  1. `ownerTemplateId`: the message goes to the owner. The address is set in the EmailJS template, **not in the code**, and reply-to is the visitor. This call must succeed.
  2. `autoReplyTemplateId`: the acknowledgement goes to the visitor (`{{email}}`). This call is best effort: a failure is only `console.warn`ed.
  - The template params are `name`, `email`, `subject`, `message`, `language`, `owner_subject`, `reply_subject` and `reply_message`. The last three come from `contact.mail.*` in the **visitor's** UI language.
  - Config: `EMAILJS_CONFIG` (`publicKey`, `serviceId`, `ownerTemplateId`, `autoReplyTemplateId`) in `core/constants/contact.ts`, provided through the `CONTACT_CONFIG` InjectionToken so tests can override it. The values are public by design. **It is still empty**: until it is filled, submitting shows the error alert and logs "not configured". Setup steps and ready-to-paste HTML templates are in `docs/emailjs-setup.md`.
  - Every failure is logged as `console.error('[Contact] Sending failed:', error)` with the EmailJS reason.
- `WHATSAPP_NUMBER` = `221773782956` (the phone number from the CV).
- Tests (`contact-cta-section.spec.ts`) mock `fetch` and provide a test `CONTACT_CONFIG`, so no email is ever sent. They cover: validation blocks sending, both EmailJS payloads (FR subjects + reply message), success when only the acknowledgement fails, the error alert, the not-configured state and the honeypot.

## About page (`features/about`)

Matches the Figma About page.
- **Intro** (`#about-intro`): a centered block (`max-w-[54rem]`, text left-aligned). The page **h1** is the name (`hero.name`, `text-heading`, Bold `clamp(2rem, 3.34vw, 3rem)`). Then the bio `about.intro` (18px/1.75 from sm up, 16px on mobile). Then a primary **"My CV"** button centered under the text.
- **CV**: `CV_URL` (`core/constants/cv.ts`) = `assets/documents/cv-serigne-khalifa-ababacar-sy-nguirane.pdf`, copied from the owner's `Desktop/Diplomes et cv/lettre et cv/Curriculum vitae.pdf`. To update the CV, replace the file and keep the same name. It opens in a new tab and its aria-label is `about.cvLabel`.
- **Gallery**: the home `GallerySection` is reused as is, imported from `@features/home/...` (same photos, autoplay and pagination).
- **Experience timeline** (`sections/experience-section`, id `experience`, search entry `/about#experience`): h2 `about.experience.title` (no intro text, at the owner’s request), then a **vertical branch**: oldest at the top, current role at the bottom, with an arrow tip pointing down.
  - Cards are **compact**: period, role (h3) and company only. There are no description bullets (the owner asked to remove them).
  - Data: `EXPERIENCES` (`core/data/experiences.ts`), taken from the CV: MTN → Niane → ETP4 → Jant Tech. Each entry has `start`/`end` as `YYYY-MM` (`end: null` = ongoing) and the keys `about.experience.items.<id>.role|company`.
  - Periods are formatted with `Intl.DateTimeFormat` in the UI language and capitalized ("Novembre 2024 – Aujourd’hui"). The ongoing role gets a filled pulsing node and a "Current role" pill.
  - Layout: an `<ol>` (max-w 56rem, centered).
    - **Mobile**: each `li.xp` is a 2-column grid, rail on the left and card on the right.
    - **Desktop (lg)**: each `li.xp` is a `1fr 3rem 1fr` grid with the rail in the middle. Cards alternate (`xp--left` on even indexes; left cards are right-aligned) and are joined to their node by a horizontal stem.
    - The rail segments run into the next item, so they form one continuous branch.
  - Reveal: the host gets `is-revealed` **once**, through an `IntersectionObserver` with `rootMargin: 0px 0px -15% 0px` (the host is `display: block`, required for the observer). Then the branch draws itself (scaleY), the nodes pop and the cards slide in from their side, staggered by `--i`. It is instant under reduced motion. Headless screenshots that jump to the section must add the class themselves.

- **Awards & events** (`sections/awards-section`, id `awards`, search entry `/about#awards`): h2 `about.awards.title` (no intro text), then a row of **expanding photo cards**.
  - Data: `AWARDS` (`core/data/awards.ts`, model `Award`): `titleKey`, `descriptionKey`, `issuerKey`, `date` (optional `YYYY-MM`, shown as a localized "Month YYYY"; when missing only the issuer shows — the Docsen hackathon date is still TODO), `image {src, width, height, altKey}`, and an optional `url`. Images are in `assets/images/awards/`.
  - **3 slots**: awards are repeated to fill them (`fillSlots`), as a TEMPORARY measure while fewer than 3 awards exist (the owner asked to duplicate them). Real awards take the slots automatically.
  - Desktop (lg), matching Figma: a row 20.25rem tall with a 24px gap. **One card is open** (`active` signal, the first by default): its `flex-grow` is 1.69, so 546px vs 323px at 1440, measured in Chrome. **Hovering**, focusing (`tabindex="0"`) or clicking/tapping another card opens it and closes the previous one; the state stays on mouse leave.
  - Animations: the `flex-grow` transition takes 700ms ease-in-out-soft. The text fades in after a 250ms delay; it has a fixed **open width** (container query `100cqw` on `.awards`), so it never reflows while the card grows. The active photo zooms slightly and inactive ones are slightly desaturated.
  - Each card: a `NgOptimizedImage` `fill` photo with `object-fit: cover`, then a burgundy bottom fade (`.award__shade`), then white text: issuer · date, title (h3) and description.
  - Mobile: the cards are stacked and all open.

- **Contact**: the home `ContactCtaSection` is reused as is (same form, WhatsApp and socials; id `contact-cta`), under the awards. The About order is: intro → gallery → experience → awards → contact.

## Services page (`features/services`)

Order: header (`intro-section`, id `intro`) → the home services band (`ServicesPreviewSection` with `[showMore]="false"`) → **4 pillars** (`method-section`, id `method`) → **concrete example** (`example-section`, id `example`) → **contact** (the home `ContactCtaSection`, reused). **The page is complete.** The planned offer / deliverables / collaboration / faq skeletons were deleted, along with their search entries and i18n keys.
- **Header**, matching Figma (crème background, `grid-site`, `lg:min-h-[41.75rem]`, items centered):
  - **Left** (`lg:col-span-5`): `assets/images/services-process.webp`, the Samba app user-flow card. The tilt, dashed outline and soft shadow are part of the image, a **real alpha PNG** converted to WebP (126 KB, no cut-out needed). It is loaded with `priority` and sized at 90% of the column.
  - **Right** (`lg:col-span-7 lg:pl-10`): a "My process" pill (same style as the hero greeting), then the page **h1** in primary bold on two `block` lines (`services.intro.titleLine1/2`, `clamp(1.75rem, 2.78vw, 2.5rem)`, line-height 1.6 on desktop). Then the pitch `services.intro.text` (18px/1.75) and a centered primary button **"My process ↓"** → `routerLink="/services" fragment="method"`, which scrolls to the 4 pillars section.

- **4 pillars** (`method-section`, id `method`, search entry `/services#method`): a centered h2 `services.method.title` in `text-ink`, then a circular portrait in the middle (`services-pillars-portrait.webp`, 394px at lg; the dashed ring is part of the image, flood-fill cut from a black-flattened capture). Two pillars sit on each side: 01 Understand and 02 Listen on the left, 03 Test and 04 Deliver on the right (`services.method.items.<id>.title|text`).
  - Desktop (lg), matching Figma: a `1fr 24.625rem 1fr` grid, 24.625rem tall. Each pillar is absolutely placed with `--top`, so its title centers 47px and 277px below the circle top.
  - Each pillar shows a title "0n – Title" (18px bold primary, 14rem column) and a description (14px ink, max 12.75rem, so the line breaks match Figma).
  - A **dashed 1.5px line** (primary at 70%) runs from the title to the circle edge. It overlaps the circle column by `--reach` (4rem on row 1, 0.75rem on row 2) and has an arrow tip on the text side.
  - Pillar 02 is indented (3.3rem vs 2.5rem) to follow the curve. Right pillars are mirrored, and their description starts at the title's left edge.
  - Reveal: `is-revealed` is added once by an `IntersectionObserver` (same pattern as the About timeline). The lines grow from the circle outward (scaleX) and the texts fade in.
  - Mobile: the h2, then the circle, then the 4 pillars as a list (2 columns from 40rem). There are no lines.

- **Concrete example** (`example-section`, id `example`, search entry `/services#example`): a centered h2 `services.example.title` ("Exemple concret", singular, fixing the Figma "Exemple concrets") and the text `services.example.text` (16px/1.7, max 57rem). Then the **design journey**, an `<ol class="journey">` with 3 image steps joined by 2 dashed curved SVG arrows (primary at 80%):
  1. **Persona** `services/example-persona.webp` (276px): Problem / Awa / Hypothesis. It is a real alpha PNG and its text is part of the image (English, as in Figma), so the alt text `personaAlt` carries the full problem + hypothesis text, translated.
  2. **Sketches** `services/example-sketches.webp` (343px): the source had light strokes flattened on black. It was **rebuilt** as dark pencil strokes on transparent (alpha = luminance), so it reads as pencil on paper on any background.
  3. **Screens** `services/example-screens.webp` (394px): the two final Samba screens, flood-fill cut. The phone bezels are intact.
  - Desktop: one row (`justify-between`, items centered). Mobile: stacked, with the arrows rotated to point down.

## Projects page (`features/projects/project-list`)

There is no Figma for it, so it is built from the site's patterns.
- **Header** `#projects-intro`: centered "Portfolio" pill (hero-greeting style), the page **h1** "My projects" / "Mes projets" (`text-heading`, same size as the About h1), and an intro (18px/1.75). Copy is in `projects.list.*`.
- **List** `#projects`:
  - Filter chips: "All" plus the **distinct `tagKeys` of all projects**, as skill i18n keys, so they appear automatically as projects are added. State is a `filter` signal and `visible` is computed from it.
  - A live count: `projects.list.countOne|countOther` with `{n}`.
  - A 2-column grid of `app-project-card` showing **each real project once** (no slot filling, unlike the home grid), with an `@empty` message.
- Then the shared `ContactCtaSection`.

## Project viewer (Behance-style case study)

Files: `core/services/project-viewer.ts` (state), `layout/project-viewer` (overlay, mounted in `app.html`), `shared/ui/share-menu`.
- **Data**: `Project.caseStudy` = `{ roleKey, fieldKey, slides: ProjectSlide[] }`, where each slide is `{ src, width, height, altKey }`. The Samba slides are 19 WebP at **2400px wide** (2.2 MB total) in `assets/images/projects/samba-app/`, converted from 5760px Figma PNG exports (67 MB) with a high-quality resize. Each slide has a translated alt text in `projects.items.samba.slides.sN`. The slide text itself is in English, as in Figma. **SenGame** (`sengame-app`): 21 WebP slides at 2400px (1.8 MB) from 5443px exports, copy in `projects.items.sengame.*`, and its cover `projects/sengame-app.webp` is a 474×294 crop of the three-phone slide with rounded alpha corners (2× the card size). **Doctor App** (`doctor-app`, 7 slides 2400×1800, cover from the three-phone "Thanks" slide) and **Waterflow** (`waterflow`, 13 slides 2400×1350 from 5760px exports, Fama persona placed before Amadou; cover from the owner-provided "Waterflow" title + Dispensers & Dashboard image, cropped to the card ratio). Neither has a `year` yet.
- **Opening**: `app-project-card` is a real `<a href="/projects/:slug">`.
  - A plain click calls `ProjectViewer.open(slug)`. The overlay opens **over the current page**, and the URL becomes `/projects/:slug` through `Location.go`: no router navigation, so the page underneath stays as is.
  - **Closing** (X button, Esc, click outside the sheet, or the browser Back button) restores the previous URL: `Location.back()`, and a `Location.subscribe` listener handles Back.
  - Ctrl/⌘/Shift/middle click keep the default browser behaviour.
  - Any router navigation (e.g. "Contact me" inside the viewer) closes it.
- **Direct link / reload** (`/projects/:slug` route = `ProjectDetail`): it renders the Projects page and calls `open(slug, false)`. Closing then navigates to `/projects`, and an unknown slug redirects to `/projects`.
- **Overlay**:
  - Fixed, `z-60`, dark blurred backdrop (ink at 82%). The overlay itself scrolls; focus moves to it so arrow keys and space scroll the case study, and page scroll is locked.
  - The fixed close button sits top-right.
  - The paper sheet (max 87.5rem, radius 1.25rem) contains: a header (label, h2 title, "by" + name, Role / Field / Year `<dl>`, Share), the **slides edge to edge**, and an end block (title, thanks, Share + "Contact me").
  - At ≥96rem a sticky side rail holds a round Share button.
  - A 3px reading **progress bar** (`--color-primary-bright`) uses a CSS scroll-driven animation (`animation-timeline: scroll()`, no JS; hidden where unsupported).
  - The first 2 slides load eagerly, the others lazily.
- **Share menu** (`app-share-menu`, inputs `url`, `title`, `text`, `compact`, `placement` down|up|left, `variant` outline|light):
  - Options: native share sheet ("Share via…", when `navigator.share` exists), Copy link (Clipboard API with a `execCommand` fallback, plus a "Link copied!" toast and `role="status"`), LinkedIn, WhatsApp and e-mail.
  - It closes on outside click or Esc. Copy is in `projects.viewer.*`.
- Verified in Chrome: card click opens it and changes the URL; Esc, Back and the X button all close it and restore the URL; a direct link opens it; it works on mobile.

## Splash loader (`core/services/app-loader.ts` + `styles/loader.css`)

`#app-loader` in `index.html` (cream screen, pulsing "bn" logo, sliding bar) covers the first load so the half-built page (header + footer stacked while the lazy route loads) is never seen. `<html class="is-loading">` locks scroll and pauses entrance animations in `<main>`. `AppLoader.hideWhenReady()` (called from `App`) waits for the first navigation end, a frame, `document.fonts.ready` and the decode of `main img[fetchpriority=high]` (LCP), capped at 5s, then fades it out and removes it. CSS failsafe: it hides itself after 8s if JS never runs.

## Custom scrollbar

In `base.css`: thin, with a burgundy thumb (primary at 55%) on the cream track. It uses `scrollbar-width`/`scrollbar-color` (Firefox, Chrome 121+) and `::-webkit-scrollbar` (Safari; the thumb turns full primary on hover). The viewer overlay uses a translucent white thumb on its dark backdrop.

## Footer (`layout/footer`)

Matches the Figma footer: a 2px `border-line` on top, then `container-site` with `py-8`.
- **Left**: the logo (→ `/`) then `FOOTER_LINKS` (`core/constants/footer-links.ts`: About, Projects, Articles). Links are 14px ink with a 32px gap; hover and active state are primary.
- **Right**: `footer.copyright` = `{year} {name}` (the current year, plus `hero.name`) in `text-faint`, 14px medium.
- **Mobile**: stacked and centered.
- `/articles` is a lazy **skeleton** page for now (`features/articles`). It has a search entry, and it is not in the header nav (the Figma header has no Articles link).

## Search (`core/services/search.ts` + `layout/search-dialog`)

Keyword search that **suggests and redirects to pages and sections**, not full-text.
- `SEARCH_INDEX` (`core/constants/search-index.ts`) lists `SearchEntry` items `{ id, titleKey, pageKey, keywordsKey, path, fragment? }`. Pages come first; they are the suggestions shown for an empty query. Titles live in `search.entries.*` and keywords in `search.keywords.*` (comma-separated). **When you add a section or page, add its entry and its EN + FR keywords.**
- `Search.find(query)` is case- and accent-insensitive. Every term must match the title or a keyword. Keywords from **all languages** are matched, whatever the UI language. Ranking order: title prefix, then title, then keyword prefix, then keyword substring. Max 8 results.
- `SearchDialog` is mounted in `app.html` and opened from the header button or with **Ctrl/⌘+K**. It is a custom modal, not `<dialog>.showModal()`, so the custom cursor stays above it. It follows the combobox + listbox ARIA pattern: ↑/↓ move the selection, Enter navigates, Esc / backdrop close. Focus returns to the trigger and page scroll is locked while open.
- Navigation goes to `path#fragment`. If that URL is already active, it calls `ViewportScroller.scrollToAnchor` because the router ignores same-URL navigations. Anchors land below the sticky header thanks to `scroll-padding-top` (base.css) and `ViewportScroller.setOffset` (app.config.ts).

## i18n (`core/services/i18n.ts`)

Home-made, dependency-free, signal-based. `I18n.lang` is a read-only signal (`'en' | 'fr'`). `setLang(lang)` switches language and `t('a.b.c', params?)` resolves a dotted key (`{name}` placeholders are replaced from `params`; in templates: `'key' | translate: { n: 2 }`), falling back to EN and then to the key itself. `tAll(key)` returns the value in every language. The default is English. The choice is stored in `localStorage` (`portfolio.lang`) and mirrored on `<html lang>` through an `effect`. Both JSON files are imported statically (no HTTP, no flash of untranslated keys, SSR-safe). `TranslatePipe` (`| translate`) is impure, so it re-renders on language change. Language list: `core/constants/languages.ts`.

## Custom cursor (`shared/cursor/custom-cursor`)

Mounted once in `app.html`. The **ring** (1.5px primary border) follows the pointer exactly. The **dot** (filled primary) follows it with a lerp (`pos += (mouse − pos) × --cursor-lag`, default 0.15). The native cursor stays visible.
- The rAF loop and listeners run in `NgZone.runOutsideAngular`, and position is set through `transform: translate3d` with direct DOM writes, so it never triggers change detection.
- State lives in host classes: `is-visible` (hidden when the pointer leaves the window or on blur), `is-hover` (over `a`, `button`, `[data-cursor="hover"]`, where the ring scales by `--cursor-hover-scale`), and `is-pressed` (on mousedown, scale `--cursor-press-scale`). Scaling is done on an inner element, so the CSS transition never fights the per-frame translate.
- Enabled only for `(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)`, in both CSS and JS. The media query is watched live.
- SSR-safe: `isPlatformBrowser` + `afterNextRender`. Nothing runs if `matchMedia` is missing (jsdom tests).
- To make a non-link element enlarge the ring, add `data-cursor="hover"`.
- The rAF loop **stops once the dot has caught up** with the pointer and restarts on the next move, so there is no idle 60fps work.

## Scroll reveal (`core/services/scroll-reveal.ts`)

Every page section (`main section`) fades in on scroll: 550ms fade plus a 24px rise, `opacity`/`transform` only. The CSS is `.reveal` / `.reveal.is-revealed` in `animations.css`.
- Started once from `App` (`afterNextRender`).
- **One** `IntersectionObserver` for the whole site (`rootMargin` −10% at the bottom); each section is unobserved once revealed.
- A `MutationObserver` on `<main>` (rAF-batched) picks up sections rendered later (route changes, `@if`), so **new pages and sections are animated automatically**.
- Sections already in the viewport when they are found (top of the page) are left untouched: no flash and no layout shift.
- Once revealed, a section's transform goes back to `none`, so it keeps no containing block or stacking context.
- Opt out with `data-reveal="off"` on the `<section>`. It is disabled under `prefers-reduced-motion` and on the server.
- Verified in Chrome with wheel scrolling on Home, About, Services, Projects and after an SPA navigation. Headless screenshots that jump with `scrollTo` must wait for the observer or add `is-revealed` themselves.
