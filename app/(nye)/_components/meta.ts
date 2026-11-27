import type { TicketPlacement } from "./givebutter";

// The Meta Pixel events our own code may send. Givebutter's widget sends the checkout events
// (AddToCart, InitiateCheckout, Purchase) itself, so none of them belong in this union.
export type MetaEvent = { name: "TicketClick"; params: { placement: TicketPlacement } };

/** Sends a custom event to the Meta Pixel. Does nothing when the Pixel is not loaded. */
export function trackMeta(event: MetaEvent) {
  try {
    window.fbq?.("trackCustom", event.name, event.params);
  } catch {
    // Tracking must never break a ticket click.
  }
}
