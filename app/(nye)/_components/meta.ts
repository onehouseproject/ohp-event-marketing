import type { TicketPlacement } from "./givebutter";

// The Meta Pixel events our own code may send: TicketClick and Lead. Givebutter's widget sends
// the checkout events (AddToCart, InitiateCheckout, Purchase) itself, so none of them belong here.
export type MetaEvent = { name: "TicketClick"; params: { placement: TicketPlacement } };

/** Sends a custom event to the Meta Pixel. Does nothing when the Pixel is not loaded. */
export function trackMeta(event: MetaEvent) {
  try {
    window.fbq?.("trackCustom", event.name, event.params);
  } catch {
    // Tracking must never break a ticket click.
  }
}

/**
 * Sends the standard `Lead` event for one new giveaway entry, with a unique ID. Issue #24 may
 * send a server-side `Lead` with the same `eventId`. Does nothing when the Pixel is not loaded.
 */
export function trackLead(eventId: string) {
  try {
    window.fbq?.("track", "Lead", {}, { eventID: eventId });
  } catch {
    // Tracking must never break the form.
  }
}
