"use client";

import { useEffect } from "react";
import { useDialog } from "./GiveawayDialog";
import { hasEntry } from "./state";

// How every splash opens: half a second after the page loads unless this visitor has entered,
// whenever the address ends in #giveaway, and when the hero's line asks for it.
// Prototype: it opens on every load. In production it would stop opening by itself once closed.

const OPEN_SPLASH = "nye-giveaway-open";

/** A dialog handle that opens itself the ways above. */
export function useSplash() {
  const dialog = useDialog();
  const { open } = dialog;

  useEffect(() => {
    const asked = () => window.location.hash === "#giveaway";
    const timer = window.setTimeout(() => {
      if (asked() || !hasEntry()) open();
    }, 500);
    const onHash = () => {
      if (asked()) open();
    };
    window.addEventListener(OPEN_SPLASH, open);
    window.addEventListener("hashchange", onHash);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(OPEN_SPLASH, open);
      window.removeEventListener("hashchange", onHash);
    };
  }, [open]);

  return dialog;
}

/** Opens the splash again, for anyone who closed it, and puts #giveaway in the address. */
export function openSplash() {
  window.history.replaceState(null, "", "#giveaway");
  window.dispatchEvent(new Event(OPEN_SPLASH));
}
