# Embedding Givebutter ticket checkout in an Event Page

Research memo for issue 1, written 2026-11-14. Every source below was read on 2026-11-14.

## Short answer

An Event Page can sell tickets without sending the visitor away. Givebutter's Widgets library is the supported way to do it, it is documented to work for a Givebutter campaign of type `event`, and the ticket selection step appears inside the modal automatically.

A button cannot open checkout with one ticket already chosen. Givebutter's help center says so directly, and the shipped widget script has no ticket option. The three ticket buttons on the Event Page will all open the same modal, and the visitor picks the ticket there.

A note on words: "campaign" in this memo always means the Givebutter object that holds the tickets and takes payment (code `RE4TYY`). The Event is the New Year's Eve fundraiser itself, and the Event Page is our page that markets it.

Nothing in this memo was tested by clicking through a checkout. The research was read-only. The section "Live test" lists what a browser session must confirm before launch.

## Sources and how they are cited

- **Docs (help center)**: `help.givebutter.com`. These pages show "Updated over 2 weeks ago" with no exact date, except where noted.
- **Docs (developer)**: `docs.givebutter.com/widgets/...`, read as the Markdown versions listed in `https://docs.givebutter.com/llms.txt`.
- **Code**: the widget script `https://widgets.givebutter.com/latest.umd.cjs?acct=BWLFFUVs4GTgmfRz&p=other` as served on 2026-11-14. Response headers: `Last-Modified: Fri, 13 Nov 2026 19:11:40 GMT`, 283,801 bytes, SHA-256 `44dfddf5ccab91285d499968e655ec00b8fcaf69032d1c1ce4efe0e21784a7a1`. The file is minified, so each code finding names a string to search for and the line it sat on in this copy. The script was read, not run.
- **HTML**: the public HTML of `https://givebutter.com/onehousenye`, including its `window.GB_CAMPAIGN` data.

A finding marked "code" is true of the script as shipped on that day. The URL is unversioned (`latest`), so Givebutter can change it without notice. The copy read here was one day old.

## Answers to the seven questions

### 1. Is the widget script still the supported way, and is `latest.umd.cjs` the right loader?

**Yes. Confirmed by docs.**

- The developer docs give this exact install snippet: `<script async src="https://widgets.givebutter.com/latest.umd.cjs?acct=YOUR_ACCOUNT_ID"></script>`, placed in `<head>`, once per page. Source: https://docs.givebutter.com/widgets/getting-started.md
- The older product, Givebutter Elements, is deprecated: "Elements have been deprecated and are no longer maintained or updated." Widgets replaced it in July 2023, and the two cannot be mixed on one page. Source: https://help.givebutter.com/en/articles/8688409-how-to-switch-from-givebutter-elements-to-givebutter-widgets
- The docs snippet has no `p` parameter. The older page's snippet has `&p=other`. Code: `p` is read as a platform label (`godaddy`, `salesforce`, `wix`, default `unknown`) and is only forwarded to the checkout as an analytics field. Search `getConfigParam(` and `gba_gb.element.platform`, lines 1 and 460. Keeping `&p=other` is harmless.
- Code: the `acct` value must be 16 letters or digits, or the script logs `Invalid ?acct= format`. Search that string, line 1.

### 2. Does it work for a campaign of type `event`, with ticket selection inside the modal?

**Yes according to docs. Not yet seen working for this campaign.**

- "You can sell tickets with Widgets!" and "If your campaign has tickets for sale, they will automatically be included in the Widget on your website." The widget embeds the checkout flow, not the whole campaign page. Source: https://help.givebutter.com/en/articles/6464859-how-to-use-givebutter-widgets-on-your-website
- The help page for campaigns of type `event` says buyers can purchase tickets on the external site without being redirected, and that the goal bar and story do not appear in the embed. Source: https://help.givebutter.com/en/articles/3688279-how-to-configure-an-event-campaign
- The developer docs show an "Event Tickets" button example (`label="Get Tickets" icon="ticket"`). Source: https://docs.givebutter.com/widgets/examples.md
- Code: the script asks Givebutter for the campaign's embed settings and receives a flag named `is_event_tickets_flow`, which changes the modal's size on desktop and makes it full screen on small screens. Search `is_event_tickets_flow`, lines 481 to 535.
- The prerequisite from the help center: the campaign must be "live and published before you can embed it as a Widget."

### 3. Can a button open checkout with one ticket already chosen?

**No. Confirmed by docs and by code.**

- Docs: "For campaigns that include tickets: URL parameters do not apply to the ticket selection step." The supported parameters are `amount`, `frequency`, `fund` and `promo`, and they act on the donation amount step that follows ticket selection. Source: https://help.givebutter.com/en/articles/4868782-how-to-leverage-url-and-html-parameters
- Docs: the help page on tickets describes no direct link to one ticket and no parameter that selects one. Source: https://help.givebutter.com/en/articles/3661362-how-to-create-and-edit-tickets
- Code: the script contains no ticket identifier, item identifier or preselection option. The only prefill keys are `amount`, `frequency`, `fund` and `promo` (search `widgetFormKeys`, line 1, and ``attribute:`promo` ``, line 591). The custom trigger reads exactly three attributes: `data-gb-account`, `data-gb-campaign` and `data-gb-type` (search `data-gb-processed`, line 1).
- What is possible: `promo` can be passed, so a button could open checkout with a promo code applied. Promo codes can be limited to chosen tickets, which changes price, not selection. Source: https://help.givebutter.com/en/articles/2799365-how-to-use-promo-codes
- One loose end, unconfirmed: the `<givebutter-button>` element accepts an `embed-url` attribute (code, search ``attribute:`embed-url` ``, line 334) that must start with `https://givebutter.com`. If Givebutter's checkout page honours some undocumented ticket parameter, it could be passed that way. Nothing read supports that such a parameter exists. Only Givebutter support can say.

Consequence for the Event Page: the buttons "Stay & Play for Two", "VIP Admission" and "General Admission" all open the same ticket list. The ticket names in Givebutter should match the button labels word for word so the visitor finds the one they clicked.

### 4. What is created in the dashboard, and what do we write ourselves?

**Confirmed by docs and code, except the allowed-domain point.**

Written by us, no dashboard object needed:

- The account ID in the script URL (`BWLFFUVs4GTgmfRz`). HTML: the public page for `RE4TYY` names this same account ID, so the NYE campaign belongs to the account the older page used.
- The campaign code (`RE4TYY`) on a trigger. Docs give two forms: a custom trigger, `<button data-gb-account="..." data-gb-campaign="...">`, on any element (help center, link in answer 2), or a manual tag, `<givebutter-button campaign="...">` (https://docs.givebutter.com/widgets/widget-types/button.md).

Created in the dashboard, only if wanted:

- A widget ID. It is needed only for the `<givebutter-widget id="...">` tag, which renders a button, form or goal bar designed in the dashboard. The older page's `<givebutter-widget id="LYO85B">` is such a widget and belongs to the other campaign. Custom triggers do not use a widget ID. Code agrees: the trigger handler creates its own hidden `<givebutter-button>` from the account and campaign alone.
- An Apple Pay domain. "By default, Apple Pay won't appear on embedded widgets on external sites" until the site's domain is added under Settings, Account, General, Payment methods, Digital Wallets, Apple Pay domains. Source: https://help.givebutter.com/en/articles/1726573-how-to-configure-payment-methods-on-givebutter

Allowed domain for the widget itself: **unconfirmed**. No help or developer page read describes an allowlist of sites for widgets. The script does contain a "This widget can't be loaded on this site" message for an HTTP 422 answer (search `This widget can`, line 588), shown only inside the Wix editor. Whether Givebutter's server ever refuses a normal site is not documented. The live test settles it.

Where the dashboard keeps these: the help center says the library and account ID are under Settings, Developers, Widgets, and the "Installation" tab. The developer docs say Settings, Integrations. The two disagree, so the owner should look in both places.

### 5. How to wire it in Next.js App Router

**Derived from code. The sketch below has not been run.**

Facts from the script that shape the wiring:

- The custom elements (`givebutter-button`, `givebutter-giving-form`, `givebutter-widget` and others) are ordinary web components. An element added to the page at any later time is upgraded by the browser, so they survive client-side navigation with no extra work.
- The `data-gb-*` custom trigger does not survive it. The script scans for `[data-gb-account][data-gb-campaign]` once when it runs, and again only on `DOMContentLoaded`, `popstate` and `hashchange` (search that list, line 1). A forward navigation in App Router fires none of these, so a trigger rendered after navigation is never wired. On `pagehide` the script also removes its listeners and leaves `data-gb-processed` set, so a page restored from the back/forward cache keeps dead triggers.
- The script must run once. Each element is registered with `customElements.define` and no guard (search `customElements.define(e,t)`), so a second run throws inside the script's own try block and logs an error. `next/script` with a fixed `id` loads a script once per session.
- The script reads its own URL to find `acct`. Passing `account` on the element as well removes the dependence on that.
- A click on a custom trigger works by clicking the real `<button>` inside the hidden `<givebutter-button hide-button="true">`'s open shadow root (search `hide-button`, line 1). The recommended approach does the same thing from a React handler.

TypeScript: the elements are declared by augmenting `JSX.IntrinsicElements` in the `react` module, shown in the sketch.

### 6. Can the page learn that a purchase finished? Does Givebutter have a Meta Pixel integration?

**Partly confirmed. The behaviour for a ticket purchase in the widget needs a live test.**

Givebutter's own Meta Pixel integration, from docs:

- It exists and is set per account: Settings, Integrations, Meta Pixel, Details, paste the Pixel ID. It tracks "every Givebutter campaign" and sends `PageView`, `ViewContent`, `ClickPurchase`, `InitiatePurchase`, `InitiateCheckout` and `Purchase`, with value and currency on the last two. Source, dated September 22, 2026: https://help.givebutter.com/en/articles/3831687-how-to-integrate-meta-pixel-with-givebutter
- The same page says "Meta Pixels are not yet supported on embedded Givebutter Form campaigns" and says nothing about widgets for other campaign types. The matching Google Analytics page says "Google Analytics is not supported on embedded iFrame forms." Source: https://help.givebutter.com/en/articles/5625295-how-to-integrate-google-analytics-with-givebutter
- HTML: the public NYE page already defines a Meta Pixel ID (`window.FB_PIXEL = "1306608097630463"`). Whether that is One House Project's pixel or one of Givebutter's is unconfirmed.

What the widget script does, from code (undocumented by Givebutter):

- The checkout iframe sends messages to the host page. The script accepts messages shaped `{ givebutter: true, event, total, currency, campaign: { id, code, title }, transactionId }` where `event` is `donation.started`, `donation.paying` or `donation.complete`. Search `isDonationMessage`, line 460.
- For each one, the script calls the host page's own trackers if they exist. Meta: `fbq("track", "AddToCart" | "InitiateCheckout" | "Purchase", { content_type: "product", content_ids: [campaign id], content_name, currency, value }, { eventID: transactionId })`. Google: `gtag("event", "add_to_cart" | "begin_checkout" | "purchase", ...)`, or a push to `dataLayer`. Search `sendEcommerceEvent` and `AddToCart`, line 460.
- So if the Event Page loads its own Meta Pixel, the widget should fire `Purchase` into it with no code from us. The script dispatches no DOM event and offers no callback. A page that wants its own hook can listen for `message` events from origin `https://givebutter.com` and match `event === "donation.complete"`. That relies on an undocumented message format.
- A redirect also exists in code: the iframe can send `post_checkout.redirect` with an `https` URL and the script navigates the whole page there (search `parseRedirectUrl`, line 460). HTML: this campaign's data has `"post_checkout_redirect": null`. No help page read explains where that setting is, so how to turn it on is unconfirmed.

Unconfirmed: that the iframe really sends `donation.complete` for a ticket purchase, and whether `Purchase` then reaches Meta once or twice if the same Pixel ID is also set in Givebutter.

### 7. What does the visitor get when the script is blocked?

**Confirmed by code and HTML.**

- Nothing happens on its own. The custom elements stay unknown tags and render nothing, and a `<button data-gb-...>` has no handler, so it is dead. The older page's plain buttons have this weakness.
- A plain link to the campaign works as the fallback. `https://givebutter.com/onehousenye` answered HTTP 200 on 2026-11-14 and serves the live campaign with its "BUY TICKETS" button. If the trigger is an `<a href>` to that URL, a blocked script means the visitor lands on Givebutter and buys there.
- The campaign page cannot be put in our own iframe as a second fallback: it is served with `X-Frame-Options: sameorigin`.
- Docs also describe a link that opens checkout on arrival for some campaigns by adding `/donate` to the URL (parameter guide, link in answer 3). Not checked for this campaign.

## Recommended approach

Render every ticket button as a real link to the campaign URL, mount one hidden `<givebutter-button>` for the campaign, and on click open that element's modal if the library has loaded. If the library is blocked, slow or changed, the click is left alone and the link takes the visitor to Givebutter.

Why this and not the `data-gb-*` attributes the older page uses: those attributes are the documented path and work on a full page load, but the script wires them only at load (answer 5), so they fail quietly after client-side navigation, and on a `<button>` they fail to nothing. The approach below uses the same mechanism the script uses internally, works whenever the element is on the page, and always degrades to a working link. Its cost is that `hide-button` and the inner shadow `<button>` are not in Givebutter's docs. If Givebutter renames them, the buttons become plain links until the code is updated.

Sketch, not run. `types/givebutter.d.ts`:

```ts
import type { DetailedHTMLProps, HTMLAttributes } from "react";

type GivebutterElement<Extra> = DetailedHTMLProps<
  HTMLAttributes<HTMLElement>,
  HTMLElement
> &
  Extra;

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "givebutter-button": GivebutterElement<{
        campaign: string;
        account?: string;
        type?: "modal" | "link";
        label?: string;
        "hide-button"?: "true";
        "max-width"?: string;
      }>;
      "givebutter-widget": GivebutterElement<{
        id: string;
        account?: string;
        align?: "left" | "center" | "right";
        promo?: string;
      }>;
    }
  }
}
```

`components/givebutter-checkout.tsx`:

```tsx
"use client";

import Script from "next/script";
import type { MouseEvent, ReactNode } from "react";

const ACCOUNT_ID = "BWLFFUVs4GTgmfRz";
const LIBRARY_SRC = `https://widgets.givebutter.com/latest.umd.cjs?acct=${ACCOUNT_ID}&p=other`;
const LAUNCHER = "givebutter-button[data-checkout-launcher]";

/** Render once per Event Page: loads the library and mounts the hidden launcher. */
export function GivebutterCheckout({ campaignCode }: { campaignCode: string }) {
  return (
    <>
      <Script id="givebutter-widgets" src={LIBRARY_SRC} strategy="afterInteractive" />
      {/* No id attribute here: the element reports its id to Givebutter as a widget ID. */}
      <givebutter-button
        data-checkout-launcher=""
        account={ACCOUNT_ID}
        campaign={campaignCode}
        hide-button="true"
      />
    </>
  );
}

/** A ticket button. It is a plain link until the library is ready. */
export function TicketLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    // Leave new-tab and modified clicks to the browser.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    const launcher = document.querySelector<HTMLElement>(LAUNCHER);
    const trigger = launcher?.shadowRoot?.querySelector<HTMLButtonElement>("button");
    if (!trigger) return; // library blocked or not loaded yet: follow the link
    event.preventDefault();
    trigger.click();
  }

  return (
    <a href={href} className={className} onClick={handleClick}>
      {children}
    </a>
  );
}
```

`app/nye/page.tsx` (a server component):

```tsx
import { GivebutterCheckout, TicketLink } from "@/components/givebutter-checkout";

const CAMPAIGN_URL = "https://givebutter.com/onehousenye";

export default function Page() {
  return (
    <main>
      <TicketLink href={CAMPAIGN_URL}>Stay &amp; Play for Two</TicketLink>
      <TicketLink href={CAMPAIGN_URL}>VIP Admission</TicketLink>
      <TicketLink href={CAMPAIGN_URL}>General Admission</TicketLink>
      <GivebutterCheckout campaignCode="RE4TYY" />
    </main>
  );
}
```

Notes on the sketch:

- Do not wrap the launcher in a hidden container. The modal is drawn from inside that element, so a `display: none` parent would hide the modal too. The script itself appends its hidden button straight to `<body>`.
- The module augmentation suits React 19, which current Next.js uses. On older React typings that have no `React.JSX` namespace, declare the elements in the global `JSX` namespace instead.
- If the site later sets a Content-Security-Policy, the script shows it needs `script-src https://widgets.givebutter.com`, `frame-src https://givebutter.com`, `connect-src https://givebutter.com https://widgets.givebutter.com` and images from `https://givebutter.com` and `https://givebuttercdn.com`.
- For purchase tracking, load the Meta Pixel on the Event Page in the usual way and let the widget call it (answer 6). Add no custom `message` listener unless the live test shows the pixel call is missing.

## Steps only the owner can do in the Givebutter dashboard

1. **Check the tickets.** On 2026-11-14 the public data for the NYE campaign listed one ticket, "50% Off Couples Night Out Package" at $250, and none named "Stay & Play for Two", "VIP Admission" or "General Admission". Create the three tickets, or switch on "Available for purchase" for them, and name them to match the buttons on the Event Page.
2. **Check the library and account ID.** Under Settings, Developers, Widgets (or Settings, Integrations), open Installation and confirm the account ID is `BWLFFUVs4GTgmfRz` and the script URL matches the one in the sketch. No new widget needs to be created for the recommended approach.
3. **Register the Apple Pay domain.** Settings, Account, General, Payment methods, Digital Wallets, Apple Pay domains: add `events.onehouseproject.com`. Without it Apple Pay does not appear in the embed.
4. **Check the Meta Pixel.** Settings, Integrations, Meta Pixel, Details: confirm which Pixel ID is saved and whether it is the pixel the Event Page will load.
5. **Confirm payouts are connected.** The help center names missing payout information as the cause of a widget that stays blank or loading.
6. **Make one test purchase** during the live test, for example with a 100 percent promo code, then cancel or refund it.
7. **Ask Givebutter support** three things: whether any parameter opens the embedded checkout with a ticket selected, where the post-checkout redirect setting is and whether the account has it, and whether widgets are restricted to registered sites.

## Unconfirmed

- That the modal opens and lists tickets for campaign `RE4TYY` on our domain. Docs say it will. Nobody has clicked it.
- The widget's settings answer for this campaign (`https://givebutter.com/elements/api/v2/BWLFFUVs4GTgmfRz/campaigns/RE4TYY`). The request was not made during this research, so the `embed_url` and `is_event_tickets_flow` values were not seen.
- Whether Givebutter restricts widgets to certain sites. No allowlist is documented.
- Whether the three tickets named in the issue exist in the dashboard. The public data shows one differently named ticket.
- Whether the checkout iframe sends `donation.complete` for ticket purchases, and whether the widget's `fbq` call then fires once, twice or not at all alongside Givebutter's own pixel integration.
- Where `post_checkout_redirect` is set and whether this account can use it.
- Whether an undocumented ticket parameter exists for the embed URL. Everything read says no.
- Whether `https://givebutter.com/onehousenye/donate` opens checkout on arrival for this campaign.
- That the sketch compiles and type-checks. It was written from the script's source and React's typings, and no Next.js project exists in the repository yet.
- The dashboard menu paths. The help center and the developer docs give different paths for the account ID.
- Apple Pay in the embed. Search summaries of Givebutter's Squarespace and WordPress guides say it does not work in widgets. The payment methods page and the January 2026 changelog (https://community.givebutter.com/changelog/january-2026-product-roundup-whats-new-in-givebutter) say it does once the domain is registered. The two platform guides were not opened.

## Live test

Run these in a browser on a Vercel preview and again on `events.onehouseproject.com`, with DevTools open.

1. **Modal and tickets (questions 2 and 4).** Load the Event Page fresh and click each ticket link. The modal should open over the page and its first step should list the tickets. In the Network tab, the request to `givebutter.com/elements/api/v2/.../campaigns/RE4TYY` should return 200 with `is_event_tickets_flow: true`. A 422 or an "error loading this widget" panel on the production domain would mean a site restriction.
2. **Client-side navigation (question 5).** Reach the Event Page through an in-app link, then click a ticket link. Then leave, press Back, and click again. The modal should open each time, and the console should show no "Error initializing web components".
3. **Blocked script (question 7).** Block `widgets.givebutter.com` with DevTools request blocking or an ad blocker and click a ticket link. The browser should go to `https://givebutter.com/onehousenye`.
4. **Purchase signal (question 6).** Before the test purchase, paste this into the console: `window.addEventListener("message", (e) => { if (e.origin === "https://givebutter.com") console.log(e.data); })`. Complete the purchase and look for `donation.started`, `donation.paying` and `donation.complete`. With the Meta Pixel Helper extension or Events Manager's test events, count the `Purchase` events and note which page sent them.
5. **Phone.** Repeat step 1 at a phone width. The modal should fill the screen and scroll.
6. **Apple Pay.** After the domain is registered, open the modal in Safari and check that Apple Pay is offered.
7. **Promo, optional.** If a promo code will be advertised, load the Event Page with `?promo=CODE` and confirm the code is applied in the modal.
