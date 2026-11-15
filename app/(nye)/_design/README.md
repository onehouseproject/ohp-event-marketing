Casino Night is a sub-brand of One House Project (OHP) for a series of fundraising events. OHP is a nonprofit focused on housing: transitional living, crisis housing and access to affordable housing. This system keeps OHP's geometry, type families and component anatomy, and moves the brand moments into a neon, after-dark, card-room mood.

Version 1.1, 15 November 2026. It inherits from the One House Project design system, version 1.1.

The working name is "Casino Night", presented by One House Project.

## Scope

- **Covers:** every piece that belongs to the Casino Night fundraising event series, presented by One House Project.
- **Use the One House Project system instead** for everything else that speaks as One House Project, including a One House Project piece that only mentions Casino Night.
- **One piece, one system:** build a piece entirely from this system. The OHP marks a Casino Night piece needs are already here, in `assets/Parent/` and `assets/Programs/`.
- **Inherited from the parent:** spacing, radii, layout, font families, the type styles from `display-m` down, UI motion, the focus pattern and the voice. Color values, shadows and the weights of `display-xl` and `display-l` are overridden here, and neon, glow and the marquee exist only here. The table below lists each one.

## Hard rules

These rules decide how a piece looks. Where a section below seems looser, the rule wins.

1. **Headlines.** Set display headlines, h1 and h2 in Montserrat, sentence case, with `display-xl` to `display-s`, `h1` and `h2`, and set h3 and h4 in Comfortaa with `h3` and `h4`, which the stylesheet renders lowercase. *Why:* This is the parent's headline split, and it keeps the event recognizably OHP's. The styles carry the weights (900 for `display-xl` and `display-l`, 800 for the rest), so the style name is all you set.
2. **Neon restraint.** Light at most two signs per viewport, each one to three words set with `NeonSign` (`.neon-sign` with a `tone-*` class), and set body copy, prices and form labels in the display and text styles. *Why:* Neon reads as light only in a dark, quiet room. When everything glows nothing leads, and glowing type is hard to read past a few words.
3. **Neon motion.** Use the shipped motion as it is: `is-flicker` (the `flicker` prop) on one sign per page, and `.bulb-row` (the `bulbs` prop) for a marquee frame. *Why:* The ignition dips twice and settles, and the bulb chase comes to rest after 4.8 seconds. A faster, longer or looping effect can harm people who are sensitive to flashing, and it pulls every eye off the content.
4. **Role tokens and tones.** Build every color from a `color-*` role token, and give a sign, chip, badge or card its neon with a `tone-*` class chosen by job: `tone-pink` leads, `tone-gold` is money and checkout, `tone-blue` is links and info, `tone-green` is success and money raised, `tone-orange` is an occasional accent. *Why:* The roles and tones carry the contrast and glow decisions for the night ground, and a neon that keeps one job stays readable as a signal. The `neon-*`, `night-*` and `ink-*` palette and all hex values stay inside `tokens.json`.
5. **Words on night.** Set text in `color-fg`, `color-fg-2` or `color-fg-3`, put `color-fg-on-primary` on every filled neon (`btn-primary`, `btn-gold`, `badge-solid`), and keep `color-fg-mute` for disabled text. *Why:* The neons are bright, so a filled neon needs the dark label: white on `btn-primary` reaches only 2.86:1. `color-fg-mute` reaches 3.29:1 on the page ground, too faint for anything a guest must read.
6. **Focus.** Keep the keyboard focus outline that `components/bundle.css` sets on `:focus-visible` (2px solid in `color-focus-ring`, 2px offset) on every interactive element, and give the same outline to any control you build yourself. *Why:* People who move through a page by keyboard need to see where they are. The solid blue ring holds 8.42:1 on the night ground, and `.input` adds its soft blue glow on top of the ring, never in place of it.
7. **Casing.** Type labels in sentence case and leave the uppercase to `.btn`, `.eyebrow` and `.marquee`. *Why:* The stylesheet applies the uppercase, so copy typed in sentence case stays correct wherever it is reused.
8. **Icons.** Use Phosphor regular for every UI icon, card suits included (`spade`, `club`, `diamond`, `heart`): on a web page load `https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/style.css`, and inside a Claude artifact inline the Phosphor SVG of each icon you use. *Why:* One icon family keeps the parent's geometry, where emoji and hand-drawn icons break it. A Claude artifact blocks third-party stylesheets, so the icon font, and the `icon` props on `Button` and `Input` that rely on it, show nothing there.
9. **Logos.** Build the event lockup from `assets/Glyphs/symbol-neon-outline.svg` beside "casino night" set as a `NeonSign`, credit the parent with `assets/Parent/ohp-logo-white.svg` after a "PRESENTED BY" `overline`, and place every file exactly as it is. *Why:* The glyph keeps OHP's geometry, so the event stays recognizably OHP's, and the credit says who runs the night. Artwork that is redrawn or recolored is no longer the mark.
10. **Components.** Start each component from the example in its `components/<Name>/README.md`, as a React component from `window.OHPCasinoNight` (`components/bundle.js`) or as the same classes in plain HTML, and use `btn-primary` for one action per view. *Why:* The classes in `components/bundle.css` already carry the padding, radius, casing, glow and focus decisions. One primary action tells the guest what to do next.

## Before you call a piece done

Check each line against the finished piece.

- The piece uses this system only, on the night ground (`color-bg`).
- Every color in your own CSS is a `var(--color-*)` or comes from a `tone-*` class. Search for `#` and resolve each hit.
- Each viewport has two lit signs at most, and the page has one `is-flicker`.
- Display headlines, h1 and h2 are Montserrat in sentence case. h3, h4 and signs are Comfortaa in lowercase.
- Every filled neon carries `color-fg-on-primary`, and small print is `color-fg-3`.
- Tab through the piece: every link, button and field shows the focus outline.
- Logos are the files from `assets/`, and every icon renders.

## What is inherited, overridden and added

| | From the parent, unchanged | Overridden here | Only in Casino Night |
|---|---|---|---|
| Color | The role names (`color-bg`, `color-fg`, `color-primary`, and so on) | Every role value: night grounds, light ink, pink primary | `neon-*`, `night-*`, `ink-*`, `bulb`, `suit-*` |
| Type | Font families, `display-m`, `display-s`, `h1` to `h4`, text and accent styles | `display-xl` and `display-l` are weight 900 | `neon-xl` to `neon-s`, `marquee` |
| Spacing, radius, layout | All of it | | |
| Motion | `--ease-out`, `--ease-spring`, `--dur-fast`, `--dur-base`, `--dur-slow` | | `--dur-flicker` and the three neon animations |
| Shadows and focus | The focus pattern: a solid 2px outline | `shadow-sm`, `shadow-md`, `shadow-lg`, the focus color | `glow-box-*`, `bloom-*`, `--glow-text-*` |
| Voice | Warm, plainspoken, *we* and *you* | | A wink of card-room swagger |

Token usage notes say "Inherited from the parent" on every value that must stay equal to the parent's. Change those in the parent first.

| | Core OHP | Casino Night |
|---|---|---|
| Ground | Off-white | Night `night-950` |
| Palette | Seven flat hues | The same five hues pushed to neon, with glow |
| Display moment | Montserrat 800 with one Fuzzy Bubbles word | Comfortaa lowercase as neon tubing |
| Logo | The full-color wordmark leads | The neon glyph and the event name lead; the OHP wordmark drops to "presented by" |
| Cards | White, shadow, a 6px program stripe | `color-surface` with a hairline; a neon tube edge when hovered, selected or featured |

## Content fundamentals

Inherit OHP's voice: warm, plainspoken, *we* and *you*. Add a wink of card-room swagger. Fun is in service of the cause, and gambling is never glamorized.

- **Casing:** neon signs, h3 and h4 are lowercase ("casino night", "high roller"). Display headlines are sentence case ("Pick your table."). Eyebrows, marquee lines and buttons are uppercase.
- **Headlines:** short, punny where it is earned, always tied back to impact: "The house always gives back." / "Buy in." / "Every chip builds a home."
- **Marquee lines:** facts only, separated by middots: "DOORS 7 PM · TABLES 7:30".
- **Buttons:** verb first. Get tickets, Buy chips, Sponsor a table, Add to calendar.
- **Microcopy:** "you're in" (confirmation) · "that card didn't go through. nothing was charged." (error) · "only 12 vip seats left" (warning).
- **Avoid:** the word "Vegas", "gamble" or "bet your money", talk of odds or winnings, and pity framing of the people OHP serves.
- **Emoji:** not used. Card suits come from Phosphor icons, not ♠ characters, except as decorative text inside a neon sign.

## Visual foundations

- **Color:** the night neutrals are the room and neon is the light. Five neons map one to one to the OHP hues (pink, blue, gold, orange, green). Each has a tube color (`neon-pink`), a core (`neon-pink-core`, the near-white text color of lit type) and a deep tint (`neon-pink-deep`, for tonal fills). Pink is primary. Gold is money and checkout. Blue is links, focus and info. Green is success.
- **Type:** the same three OHP families. Comfortaa 700 lowercase is neon signage: its round terminals read as bent glass (`neon-xl` to `neon-s`). Montserrat 900 and 800 carry headlines and numbers. Montserrat carries body. Montserrat 800 caps at `tracking-marquee` is the marquee. Fuzzy Bubbles is one scribble per screen.
- **Glow:** `--glow-text-*` lights type (a white core and three rings in the tube color). `glow-box-*` is a tube around a surface. `bloom-*` sits behind filled buttons. Two lit signs per viewport at most; everything else stays unlit (core color, no glow) until hover.
- **Backgrounds:** solid night with a soft radial room glow behind the hero sign (`--room-glow-pink`, `--room-glow-blue`). No full gradients, no purple-to-blue sweeps, no textures. A row of marquee bulbs (`--bulbs-gold`, `--bulbs-pink`) may frame a hero edge or a sign.
- **Imagery:** low-light, warm and candid: people laughing at tables, chips, hands, bokeh. Never stock casino glitz.
- **Motion:** the neon ignition flickers twice on load, then settles into a slow buzz. Marquee bulbs chase for four cycles (4.8 seconds) and come to rest. UI motion uses the parent's easing and a press scale of 97%. Animation and transitions switch off under `prefers-reduced-motion`.
- **Hover:** cards and chips light up: the hairline becomes a neon tube and the title gains glow. Buttons lift 1px and lighten.
- **Borders:** decorative hairlines use `color-line`. Inputs, selects, chips and secondary buttons are outlined in `color-border-input`, which is strong enough to show where the control ends.
- **Shadows:** black and deep (`shadow-sm`, `shadow-md`, `shadow-lg`). On night, lift comes mostly from a lighter surface: `color-bg-raised`, then `color-surface`, then `color-surface-2`.
- **Transparency and blur:** the sticky nav only (night at 82% with a 12px blur).
- **Radii:** the parent's scale. Cards `radius-lg`, inputs and alerts `radius-md`, buttons `radius-pill`.
- **Cards:** `color-surface`, `radius-lg`, 28px of padding and a hairline, with a neon edge when featured, hovered or selected. No left-border accents.
- **Layout:** `content-max` wide, `space-6` of side padding, `space-9` between sections, a sticky nav `nav-h` tall, forms up to `form-max`. Sections are split by hairlines, not color blocks.

Glow text, glow filters, bulb rows, room glows and motion are custom properties in `components/bundle.css`, because the token file has no slot for them.

## Iconography

- **Phosphor, regular weight,** the same as the parent. The casino set: spade, club, diamond, heart, poker-chip, dice-five, cards, crown, ticket, martini, champagne, gift.
- Icons are unlit by default, in ink or a core color. Glow them with `--glow-text-*` only in headline moments or on hover.
- **Brand glyph:** OHP's four-quadrant mark with its geometry unchanged, recolored in `assets/Glyphs/`: `symbol-neon-outline.svg` (stroked neon tubes, the hero mark), `symbol-neon.svg` (filled neon) and `symbol-neon-outline-bulb.svg` (one warm white). Add glow with `filter: var(--glow-filter-pink)` or `var(--glow-filter-multi)`.
- No emoji and no hand-drawn SVG icons.

## Logo usage

- **Event lockup:** the neon outline glyph beside "casino night" set as a `NeonSign`. This is type, not a new logo.
- **OHP wordmark:** `assets/Parent/ohp-logo-white.svg`, small, at about 75% opacity, after a "PRESENTED BY" overline. It belongs near the nav or in the footer.
- **Program marks:** `assets/Programs/program-*-on-dark.svg` illustrate "where your chips go".

## Components

- **Button:** primary, gold, outline, secondary and ghost, in three sizes.
- **Chip:** a selectable pill.
- **Input** and **Select.**
- **Alert** and **Badge.**
- **TierCard:** ticket and sponsorship tiers. It replaces the parent's program card as the event's main card.
- **StatCard:** a fundraising or impact number.
- **NeonSign:** the brand moment, in one canonical implementation so glow and flicker stay consistent.

## Using this system

- `tokens.json` holds every color, type style, spacing step, radius, shadow, tracking and layout value. Each token is a CSS custom property of the same name (`color-primary` is `var(--color-primary)`), and each type style is a class (`.h1`, `.marquee`).
- `components/bundle.css` holds the component classes, the glow and motion properties, the keyframes and the helper classes (`.neon`, `.neon-pink`, `.marquee`, `.eyebrow`, `.hand`).
- `components/bundle.js` exposes the nine React 18 components as `window.OHPCasinoNight`. Every component is a thin wrapper over the same classes, so a static HTML page can use the classes directly.
- `components/<Name>/README.md` says when to use each component, with one canonical example.
- `assets/` holds the neon glyphs and the parent marks this sub-brand places on a page.
- `CHANGELOG.md` records what changed from the earlier export of this system.
