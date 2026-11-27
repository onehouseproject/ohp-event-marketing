"use client";

import Script from "next/script";
import { useSyncExternalStore, type MouseEvent, type ReactNode } from "react";
import { GIVEBUTTER } from "../event";
import { trackMeta } from "./meta";

// How this works and why: docs/research/2026-11-14-givebutter-embedded-checkout.md

const LIBRARY_SRC = `https://widgets.givebutter.com/latest.umd.cjs?acct=${GIVEBUTTER.accountId}&p=other`;
const LAUNCHER = "givebutter-button[data-checkout-launcher]";

/** Render once per page: loads Givebutter's widget script and mounts the hidden checkout launcher. */
export function GivebutterCheckout() {
  return (
    <>
      <Script id="givebutter-widgets" src={LIBRARY_SRC} strategy="afterInteractive" />
      {/* Pinned to the top of the viewport so opening checkout does not scroll the page to it. */}
      <givebutter-button
        style={{ position: "fixed", top: 0, left: 0 }}
        data-checkout-launcher=""
        account={GIVEBUTTER.accountId}
        campaign={GIVEBUTTER.campaignCode}
        hide-button="true"
      />
    </>
  );
}

export type TicketPlacement =
  | "hero"
  | "package"
  | "rail"
  | "table-package"
  | "table-vip"
  | "table-ga"
  | "table-room"
  | "closing"
  | "sticky";

const subscribeToNothing = () => () => {};
const readSearch = () => window.location.search;
const readNoSearch = () => "";

/** The campaign link with the landing page's utm_* and fbclid parameters carried over. */
function attributedUrl(search: string) {
  const url = new URL(GIVEBUTTER.campaignUrl);
  for (const [key, value] of new URLSearchParams(search)) {
    if (key.startsWith("utm_") || key === "fbclid") url.searchParams.append(key, value);
  }
  // url.search, not searchParams.size, which Safari before 17 lacks.
  return url.search ? url.toString() : GIVEBUTTER.campaignUrl;
}

/**
 * A ticket button. It opens Givebutter checkout over the page. When the widget
 * script is blocked or still loading, it is a plain link to the campaign.
 */
export function TicketLink({
  className,
  placement,
  children,
}: {
  className?: string;
  placement: TicketPlacement;
  children: ReactNode;
}) {
  // Read after hydration so server and client HTML match.
  const search = useSyncExternalStore(subscribeToNothing, readSearch, readNoSearch);

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    // Leave new-tab and modified clicks to the browser.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    trackMeta({ name: "TicketClick", params: { placement } });
    const launcher = document.querySelector<HTMLElement>(LAUNCHER);
    const trigger = launcher?.shadowRoot?.querySelector<HTMLButtonElement>("button");
    if (!trigger) return;
    event.preventDefault();
    trigger.click();
  }

  return (
    <a href={attributedUrl(search)} className={className} onClick={handleClick}>
      {children}
    </a>
  );
}
