# Meta Pixel, giveaway leads and HighLevel for the NYE Event Page

Research memo for issue 15 (the plan) and its sub-issues 16 to 24, written 2026-11-27. Every source was read on 2026-11-27 unless a date says otherwise.

## Short answer

The Meta Pixel is a small code change, and purchase tracking is mostly free. The Givebutter widget already calls the host page's `fbq` with `AddToCart`, `InitiateCheckout` and `Purchase` (value, currency, and an event ID equal to the Givebutter transaction number). Loading the Pixel on the Event Page switches that on, with no checkout code of our own.

Two things must come first. One is a privacy notice: Meta's Business Tools Terms require one on every page that runs the Pixel, and neither events.onehouseproject.com nor www.onehouseproject.com publishes a policy. The other is the owner's account setup, including a check of the Pixel's data category, because Meta restricts datasets it files under personal or economic hardship.

UTMs for purchases need no code: the Givebutter widget captures `utm_*` and `fbclid` and shows them on each transaction. Leads need HighLevel custom fields later.

The pop-up the owner asked for is already being prototyped as a giveaway (branch `nye-giveaway-prototypes`). The recommended wiring is our own form, posting to our server, which calls HighLevel API v2 with a Private Integration Token. Its consent wording, its official rules, and the casino night's tiered chips toward a prize need counsel before ads promote them.

Buyers can be tagged in HighLevel automatically from a Givebutter webhook, which ends the hand cleanup before each sales email.

Nothing here was built or clicked through. The live purchase test is part of issue 19.

## How this was researched

A multi-agent workflow ran six researchers in parallel: Meta Pixel and Conversions API, Givebutter tracking, HighLevel lead capture, pop-up UX, privacy and ad policy, and a codebase readiness audit. Four fact-checkers then tried to refute the claims that most change what gets built, using primary sources. Their corrections are folded into this memo and listed under "Corrections from the fact-check".

Status words follow the earlier memos. **Confirmed**: a primary source says it, or the shipped code does. **Inferred**: reasoning from sources. **Unconfirmed**: no support found. Meta's Business Help Center pages often returned only a title to automated reads, so several Meta facts rest on Meta's developer docs or on secondary sources, and are marked so.

The full reports, with every source, are outside git in the owner's checkout: `tmp/meta-pixel-ghl-research-2026-11-27/` (files `01` to `06`, plus `-verify` files for 01, 02, 03 and 05).

## Meta Pixel

### Installing it in this app

- **Confirmed (Meta developer docs).** The base code is the `fbevents.js` loader, `fbq('init', ID)`, `fbq('track', 'PageView')`, and a `<noscript>` image. https://developers.facebook.com/documentation/meta-pixel/get-started.md
- **Confirmed (Next.js 16.4.6 docs and source in `node_modules/next`).** An inline `next/script` needs an `id`. With the default `afterInteractive` strategy in a layout, it runs once per document, even under React Strict Mode, because `next/script` caches by id. `@next/third-parties` has no Meta component. Files: `node_modules/next/dist/docs/01-app/02-guides/scripts.md`, `.../02-guides/third-party-libraries.md`.
- **Where:** `app/(nye)/layout.tsx`, beside `<Analytics />`, as a component inside the NYE group, because Event Pages share nothing (`app/README.md`).
- **Confirmed (fbevents.js source, v2.9.441).** The Pixel wraps `history.pushState` and `replaceState` and listens for `popstate`. It fires an automatic PageView whenever `location.href` changes, hash included, and on a back/forward cache restore. Meta's docs do not mention this. The fact-checker saw Chromium fire `popstate` on a same-page `#tickets` click on the live page. So the page's `#tickets` and `#win` anchors, and the giveaway's `#giveaway`, would each add a PageView. Setting `fbq.disablePushState = true` before `init` stops it. The Event Page is effectively one route, so nothing is lost. A `usePathname` PageView tracker must not be added, and the pop-up must keep its open state out of the URL.
- **Confirmed (Vercel docs, 2026-09-17; Next.js env docs).** `NEXT_PUBLIC_` values are inlined at build time. Vercel scopes variables to Production, Preview or Development. If `NEXT_PUBLIC_META_PIXEL_ID` is set for Production only, local and preview builds load nothing.
- **Confirmed (Meta help).** Traffic permissions can allow-list `onehouseproject.com`, which covers its subdomains. Blocked events cannot be recovered later.

### Events

| Event | Fired by | Notes |
|---|---|---|
| `PageView` | Base code | Once per load, with `disablePushState`. |
| `AddToCart` | Givebutter widget | From `donation.started`. Fires each time the checkout step becomes active, so more than one per buyer is normal. |
| `InitiateCheckout` | Givebutter widget | From `donation.paying`. Also not deduplicated per buyer. |
| `Purchase` | Givebutter widget | From `donation.complete`, once per completed checkout. `value` is Givebutter's `total`, `currency` is USD, `content_ids` is the campaign ID `747191`, and `eventID` is the transaction number. |
| `TicketClick` (custom) | Our `TicketLink` | Optional. Gives per-button data, and a signal even when the widget has not loaded. |
| `Lead` | Our giveaway form | Only after the server confirms the HighLevel write. Carries our own UUID `eventID`. |

- **Confirmed (widget code).** `https://widgets.givebutter.com/latest.umd.cjs`, Last-Modified 2026-11-23, 284,015 bytes. The mapping above holds in this copy, and the checkout bundle confirms `transactionId` is the transaction `number`.
- **Confirmed (Meta developer docs).** Meta deduplicates a browser event against a server event when the name and ID match within 48 hours. It does not document browser-to-browser deduplication. A second browser `Purchase`, for example from a thank-you page, would double count. Our code must not fire checkout events.
- **Not to send:** video events, form values, or URLs that reveal sensitive topics. See "Privacy, policy and law".

### Account setup Meta needs

- **Which Pixel. Confirmed (live HTML).** OHP appears to own two Pixels. `1239616024912261` runs on www.onehouseproject.com, and `1306608097630463` is saved in Givebutter's integration. The second sits beside OHP's GA4 ID `G-KPTN6JHLB6` in a `gb_client` block on the campaign page, while Givebutter's own site uses a different Pixel. The live Event Page loads no Pixel.
- **Data source categories. Partly confirmed.** Meta files data sources into categories, and restricted ones lose URL data and custom parameters, and can lose lower-funnel events. Meta's restricted list includes "Personal hardship" (secondary source quoting Meta, 2025-01-13). "Economic vulnerability", described as covering hardship affecting housing, appears only in secondary sources. The main site's Pixel fires on `/crisis-housing` and `/direct-assistance`, which could put it in such a category. **Unconfirmed:** Meta's separate "prohibited domains" rule can block a whole domain that mainly serves people in severe economic hardship. A new dataset would not avoid that. The owner should read both statuses in Events Manager.
- **Aggregated Event Measurement. Confirmed in substance.** Meta no longer requires ranking 8 events per domain, and domain verification is no longer needed to configure events. The fact-checker dates this change to 2023, not 2025.
- **Domain verification.** Still worth doing, by a DNS TXT record on `onehouseproject.com` (DNS is on Google Cloud DNS and has no Meta record today). **Correction:** keep the record after verification, because Meta's developer doc says it may be checked again.
- **Conversions API. Confirmed (Meta help and developer docs).** Meta recommends running the Pixel and the Conversions API together. The Meta-enabled Conversions API is a free, one-click setup that mirrors the Pixel's events from Meta's side and deduplicates them, with no code. That covers the MVP. Direct server events come later (issue 24).
- **Testing.** Events Manager Test Events and Meta Ads Data Advisor (formerly Pixel Helper) show events live, and which were deduplicated.

### Live test (issue 19)

The steps in `docs/research/2026-11-14-givebutter-embedded-checkout.md` still apply, with these corrections:

- Expect exactly one `Purchase` with `eventID` equal to the transaction number. Expect at least one `AddToCart` and one `InitiateCheckout`.
- Test one paid low-price order (then refund it) as well as a 100% promo-code order. It is not known whether a $0 order sends the same messages and webhook.
- Repeat in late December, because Givebutter changes its scripts often and does not document this bridge.

## Givebutter

- **Native Meta integration. Confirmed (help center, 2026-09-22; live HTML).** It is set per account and covers every OHP campaign. Inside the embedded checkout it does nothing: the embed page sets no `FB_PIXEL`. It fires only on givebutter.com pages, which is the fallback path. It uses the same transaction number as the event ID, so keeping it on with the same Pixel ID does not double count. To keep other OHP campaigns out of NYE results, create a custom conversion on `content_ids` `747191`.
- **Fallback link. Confirmed (code).** `TicketLink` falls back to `https://givebutter.com/onehousenye` with no query string. So a purchase through the fallback loses its `utm_*` and `fbclid`, and the Event Page's `_fbp` and `_fbc` cookies do not carry across. The fallback fires whenever the widget has not loaded yet, not only when it is blocked. Forwarding the landing query string fixes most of this (issue 19).
- **UTMs. Confirmed (Givebutter docs).** Widgets automatically capture `utm_*` and click IDs, including `fbclid`, when the library is on the landing page, and Givebutter shows `utm_*` and the referrer on each transaction and in the CSV export. https://docs.givebutter.com/widgets/advanced/analytics.md and https://help.givebutter.com/en/articles/5530633
- **No Conversions API. Inferred.** Givebutter documents none, and its checkout makes only browser calls.
- **Webhooks. Confirmed (help center).** `transaction.succeeded`, `ticket.created`, `refund.created` and others carry the buyer's name, email, phone, amount and UTMs. The `Signature` header is a static shared secret, not an HMAC. A server-side Purchase could be built from them, but Meta requires `client_user_agent` for website events, and the webhook lacks it.
- **Thank-you redirect. Confirmed (help center, 2026-10-23; widget code).** A campaign-level thank-you page redirect exists, and the widget honours it. If one is ever added, that page must fire only a PageView, never a Purchase.
- **Buyer tagging in HighLevel. Confirmed.** Givebutter has no native HighLevel integration. Two routes work: a `transaction.succeeded` webhook into a HighLevel Inbound Webhook workflow (a premium trigger, $0.01 per execution after 100 free), or Zapier's Givebutter-to-LeadConnector template. Either ends the hand removal of buyers before sends (issue 22).

## HighLevel lead capture

| Option | Effort | Design control | Lead tracking | Cost | Verdict |
|---|---|---|---|---|---|
| A. HighLevel form with its Popup layout | Low | HighLevel's builder | Only through an undocumented `set-sticky-contacts` message, or HighLevel's own Pixel call from inside its iframe | Free | No-code fallback only |
| B. Our form, our server, API v2 | Medium | Full | Exact success moment, our own `eventID` | Free | **Recommended** |
| C. Our form, server POST to an Inbound Webhook | Medium-low | Full | Same as B | $0.01 per lead after 100 free | Workable; failures are invisible to the page |
| D. HighLevel External Tracking script | Low code | Full | Attribution, but capture of a React form is undocumented | Free; 108 KB gzipped | No |
| E. LeadConnector chat widget | Low | Low | No reliable Lead signal | Free | No |

Facts behind option B:

- **API v1 is gone. Confirmed (HighLevel help).** It reached end of support on December 31, 2025, and new v1 keys are disabled. Use a Private Integration Token (PIT), created under Settings, Private Integrations, with only the scopes needed. The token is shown once. PITs are available on all plans.
- **Upsert overwrites. Confirmed (API reference).** `POST https://services.leadconnectorhq.com/contacts/upsert` replaces every existing tag on a matched contact when `tags` is sent, and overwrites any other field it is sent. Add tags with `POST /contacts/{id}/tags` instead. The safer flow:
  1. Call `GET /contacts/search/duplicate`.
  2. If no contact matches, create one.
  3. If one matches, only add the tag (and fill empty fields).

  This stops a visitor from overwriting an existing donor's name. It needs `contacts.readonly` as well as `contacts.write`.
- **Attribution. Inferred (API reference).** The upsert request has no UTM or attribution fields. HighLevel records attribution only from its own forms, chat widget and tracking script, so UTMs on API-created contacts need custom fields (issue 23).
- **Abuse. Inferred.** The endpoint is public, so anyone can submit someone else's email and trigger follow-ups. Use a honeypot, Vercel BotID Basic (needs `instrumentation-client.ts`, test on a deployed page) and a Vercel WAF rate limit.
- **Rate limits. Confirmed.** 100 requests per 10 seconds per PIT per location, far above this page's needs.
- **HighLevel's own Conversions API action. Confirmed (help, 2026-11-17).** A workflow action can send a Lead to Meta. It sets its own event IDs, so it would not deduplicate against our browser `Lead`.
- **Next.js. Confirmed (16.4.6 docs).** Env vars without `NEXT_PUBLIC_` stay on the server. Treat every Server Action as a public POST. A Server Action posting to `/nye` keeps the page's static shell.

## The pop-up

The owner's pop-up is now the giveaway prototype: commit 884317a on `nye-giveaway-prototypes`. It has six placements, collects first name, last name, mobile and email, and draws on Friday, December 4. The research below bears on which placement ships and how.

- **Visitor-opened forms convert far better than automatic ones. Confirmed, vendor data only.** Wisepops' 2026 report on about a billion displays gives click-triggered pop-ups about 54% conversion, against roughly 4% to 5% for scroll, on-landing and exit-intent triggers. In Wisepops' A/B tests, immediate pop-ups raised bounce up to five times. No independent study measures pop-ups against purchases.
- **Exit intent does not work on phones. Confirmed.** It relies on cursor movement, and HighLevel says its own exit pop-up is desktop-only. Meta's Spam community standard counts "trapping" (irrelevant pop-ups when someone tries to leave) as deceptive landing-page behaviour.
- **What this means for the six placements.** Inferred from the above: avoid prototype 1, the splash on arrival. Inline placements the visitor chooses to open, and a card that appears after engagement, fit the evidence. Never open the pop-up while the video plays or after a ticket click.
- **Stacking with checkout. Inferred from the widget code.** Givebutter's checkout opens its own modal `<dialog>`, and two top-layer modals conflict. The giveaway must close before checkout opens, and stay suppressed after any `TicketLink` click.
- **Accessibility. Confirmed (W3C APG, MDN, WCAG 2.2).** A native `<dialog>` with `showModal()` gives focus handling, an inert background and Escape to close, but no scroll lock. The dialog needs a visible close button, labelled fields, `autocomplete` tokens (Meta's in-app browsers autofill from them), inline errors and an announced success state. The Casino Night design system has no dialog component, so one is built from `.field`, `.input`, `.btn-primary` and `.alert`.
- **Offer. Inferred.** The giveaway is itself the offer. If the giveaway is dropped, a reminder before the December 15 launch-offer deadline fits, and a discount does not, because it would undercut the $399 price.
- **Meta Lead ads. Confirmed (HighLevel help).** HighLevel syncs Facebook and Instagram Instant Form leads into a sub-account. That is a way to collect leads without touching the sales page.

## Privacy, policy and law

This section is research, not legal advice. Issue 18 carries the questions to counsel.

- **Privacy notice. Confirmed (Meta Business Tools Terms, effective 2025-11-03, section 3).** Every page where the Pixel runs needs a clear and prominent notice. It links to an explanation of third-party collection for measurement and ad targeting, and of how to opt out. **Confirmed (live fetch):** neither OHP host publishes a policy, and `/privacy` and the other usual paths return 404. The notice must also name Givebutter (whose checkout iframe loads Meta's SDK and a Givebutter Google tag), HighLevel, Vercel Analytics, Mux and GA4 if used.
- **Sensitive data. Confirmed (same terms).** Meta forbids sending data based on health, financial or other sensitive information. From September 2, 2025, Meta flags custom audiences that suggest financial status (confirmed in Meta's audiences overview). The main site's Pixel on its housing-help pages is the exposure, and it lives outside this repository.
- **Video Privacy Protection Act.** Low risk. **Confirmed:** in Christopherson v. Cinema Entertainment (8th Cir., 2025-12-08), free promotional video was held to be advertising, not a video business. The Supreme Court heard Salazar v. Paramount Global (No. 25-459) on 2026-10-14, on who counts as a "consumer", and no opinion had issued by 2026-11-27. Mitigation: send no video events.
- **State privacy laws.** **Confirmed (enrolled bill):** Alabama HB 351 takes effect May 1, 2027. It exempts nonprofits with fewer than 100 employees only if they do not "sell" personal data, and whether Pixel sharing is a sale is a question for counsel. Its 25,000-consumer threshold has no time window. Its section 6(c)(1) still mentions opt-out preference signals. **Inferred:** OHP is below the thresholds of the other state laws that cover nonprofits (Colorado, Oregon and others). Honoring Global Privacy Control costs one line of code and is recommended.
- **Special Ad Categories. Confirmed for the restrictions, inferred for the conclusion.** Meta requires the Housing category for ads "that market housing". An ad selling fundraiser tickets does not, so no Special Ad Category applies. Declaring Housing would lock age targeting to 18 and over, which conflicts with a 21+ event.
- **Gambling. Confirmed (Meta policy, change log 2026-05-18).** Meta allows ads for "casino entertainment events" and physical gambling without authorization, as long as nothing promotes online gambling. Raffles and sweepstakes are listed among online gambling that needs authorization. Whether a free giveaway ad counts is a question for issue 18. Meta also requires compliance with local law.
- **Alcohol. Confirmed.** Meta's US age floor for alcohol-related ads is 21.
- **Alabama lottery law. Text confirmed, application not determined.** Ala. Code 13A-12-20 defines a lottery as paying for a chance at a prize. The page sells tiers with 3x, 2x and 1x starting chips that make guests eligible for prizes, including the $6,000 design package. Counsel should review before ads promote the prize. The free giveaway raises a separate question: could entering by giving a phone number and marketing consent count as consideration? IRS Publication 3079 and $600 prize reporting are related.
- **Texts. Confirmed (47 CFR 64.1200 and the Eleventh Circuit opinion of 2025-01-24).** A tax-exempt nonprofit needs prior express consent, not written consent, for autodialed marketing texts. The FCC's one-to-one consent rule was vacated. A2P 10DLC carrier rules, which HighLevel enforces, are stricter: a dedicated SMS checkbox that is unchecked by default and optional, separate from the terms, with full disclosures nearby. The prototype's bundled "by entering, you agree to calls and texts" line does not meet the carrier rules.
- **Email. Confirmed (FTC).** CAN-SPAM is opt-out: the email needs a postal address and an unsubscribe link, and an unsubscribe must be honored within 10 business days.

## Running the ads (issue 20)

- **Learning phase.** About 50 optimization events per ad set per week are needed to leave the learning phase. This is widely cited, but Meta's page could not be read to confirm it. NYE's Purchase volume will likely be too low, so run one consolidated ad set optimized for a more frequent event (`AddToCart`, `InitiateCheckout` or `TicketClick`), and report on the NYE Purchase custom conversion.
- **Do not optimize for the giveaway `Lead`:** it would attract prize seekers.
- **Targeting.** Age 21+ and a Huntsville radius.
- **Copy.** Lead with the party, and say "play chips, no cash value, 21+". Avoid odds, betting, jackpot or cash language. Never suggest a bigger ticket improves the chance to win. Avoid housing-policy advocacy, which could get the ads classed as social issue ads.

## Later stages

- **UTMs on leads (issue 23).** Read `utm_*` and `fbclid` in the browser, not through `searchParams` in a server component, which would end the page's static shell under `cacheComponents`. Send them with the form, and store them in owner-created HighLevel custom fields.
- **Direct Conversions API (issue 24).** For `Lead`, the server sends the same `event_id` as the browser, with hashed email, phone and name, plus `fbp`, `fbc`, IP, user agent and `event_source_url`. For `Purchase`, build only if needed: the source would be the Givebutter webhook, with `client_user_agent` joined from a browser beacon keyed by Givebutter's checkout session ID. Which webhook field equals the browser event ID must be confirmed from a real payload.
- **Content Security Policy.** None exists. A nonce-based CSP does not work with Partial Prerendering. If one is ever added, it must allow `connect.facebook.net`, Givebutter and HighLevel.

## Corrections from the fact-check

- The AEM 8-event limit and the domain-verification requirement were dropped in 2023, not 2025.
- Keep the domain-verification TXT record; it is not safe to remove.
- Hash anchors inflate PageViews unless `disablePushState` is set.
- Givebutter's native Meta integration is account-wide, so NYE needs a custom conversion on `content_ids` `747191`.
- The live test should expect exactly one `Purchase` and at least one each of `AddToCart` and `InitiateCheckout`, and should include a paid order.
- The fallback ticket link drops UTMs and `fbclid`.
- HighLevel's upsert overwrites any sent field, not only tags.
- The TCPA floor for a tax-exempt nonprofit is prior express consent. The separate SMS checkbox is still needed, because of carrier rules.
- Meta's gambling policy allows "casino entertainment events", but lists sweepstakes as needing authorization.
- The Givebutter checkout bundle's Last-Modified date changes on re-upload without a code change, so watch the bundle's file name, not its date.

## Unconfirmed

- Whether `donation.complete` arrives for a $0 promo-code order, as it does for a paid one.
- Which Givebutter webhook field equals the browser `eventID`.
- Meta's "Economic vulnerability" category name and its prohibited-domain rule (secondary sources only).
- The learning-phase figure of about 50 events a week (secondary sources only).
- Whether the Android back gesture closes a page `<dialog>` inside Facebook's in-app browser.
- Whether HighLevel's Contact Tag workflow trigger is a free (standard) trigger.
- Whether Safari 26's Advanced Fingerprinting Protection strips `fbclid` outside Private Browsing.
