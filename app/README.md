# Site

One Next.js app serves every Event Page. The terms are in `docs/glossary.md`.

## Layout

- `app/(<slug>)/`: one route group per Event Page, with its own root layout, so one page's design system never reaches another. It holds the page's design system copy (`_design/`), components, assets and `event.ts`, the Event's facts.
- `app/(<slug>)/<slug>/page.tsx`: the page itself.
- `app/(legal)/`: pages that speak for One House Project rather than one Event, such as `/privacy`. It has its own root layout and plain styles, and no design system.
- `app/global-not-found.tsx`: the 404 for every unmatched address.
- `next.config.ts`: redirects the bare address to one Slug.

Event Pages share nothing. Start a new one by copying the closest existing group; issue 3 records when to revisit that.

## Before writing code

- Next.js here is newer than most training data. Read the matching guide in `node_modules/next/dist/docs/` first.
- A page uses exactly one design system. Read `_design/README.md` in its group, the design system's own README copied unchanged, and apply its hard rules and finish checklist.
- Ticket buttons come from `_components/givebutter.tsx`. The reasons are in `docs/research/2026-11-14-givebutter-embedded-checkout.md`.

## Check

Run `npm run lint`, `npx tsc --noEmit` and `npm run build`, then open the page with the `site` launch configuration.
