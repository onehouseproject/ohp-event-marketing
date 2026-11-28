"use client";

import { useEffect } from "react";
import { useDialog } from "./GiveawayDialog";
import { phaseNow, rememberSplashClosed, splashSettled } from "./state";

// When the giveaway splash opens:
// - By itself, half a second after the page loads, while entries are open, unless this visitor
//   has entered or closed it before, the address carries ?splash=off (for a ticket ad), or a
//   ticket button was clicked first: Givebutter's checkout may be open, and two modals conflict.
// - Whenever the address ends in #giveaway, in any phase: the rules page links there.
// - When the hero's line asks for it.
// Closing it, by any means, stops the automatic opening and clears #giveaway from the address,
// so a reload does not bring it back.

const OPEN_SPLASH = "nye-giveaway-open";
const HASH = "#giveaway";

/** A dialog handle that opens and remembers closing as above. */
export function useSplash() {
  const dialog = useDialog();
  const { open, ref } = dialog;

  useEffect(() => {
    const asked = () => window.location.hash === HASH;
    const switchedOff = new URLSearchParams(window.location.search).get("splash") === "off";
    let ticketClicked = false;
    const onClick = (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest('a[href*="givebutter.com"]')) {
        ticketClicked = true;
      }
    };
    document.addEventListener("click", onClick, true);
    const timer = window.setTimeout(() => {
      document.removeEventListener("click", onClick, true);
      const byItself = phaseNow() === "open" && !switchedOff && !ticketClicked && !splashSettled();
      if (asked() || byItself) open();
    }, 500);
    const onHash = () => {
      if (asked()) open();
    };
    const onClose = () => {
      rememberSplashClosed();
      if (asked()) {
        const { pathname, search } = window.location;
        window.history.replaceState(window.history.state, "", pathname + search);
      }
    };
    const element = ref.current;
    window.addEventListener(OPEN_SPLASH, open);
    window.addEventListener("hashchange", onHash);
    element?.addEventListener("close", onClose);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("click", onClick, true);
      window.removeEventListener(OPEN_SPLASH, open);
      window.removeEventListener("hashchange", onHash);
      element?.removeEventListener("close", onClose);
    };
  }, [open, ref]);

  return dialog;
}

/** Opens the splash, for the hero's line. The address is left alone. */
export function openSplash() {
  window.dispatchEvent(new Event(OPEN_SPLASH));
}
