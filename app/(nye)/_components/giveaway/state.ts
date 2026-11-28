"use client";

import { useSyncExternalStore } from "react";
import { GIVEAWAY } from "../../event";

// Browser state the giveaway shares: whether this visitor has entered, whether they closed the
// splash, and which part of the giveaway window it is. Nothing here is sent anywhere.

const KEY = "nye-giveaway-entry";
const CLOSED_KEY = "nye-giveaway-splash-closed";
const EVENT = "nye-giveaway-change";

// The entry is kept in memory too, so a confirmed entrant never sees the form again on a
// browser that blocks storage.
let entryInMemory: string | null = null;

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(EVENT, onChange);
  };
}

function read(): string | null {
  try {
    return window.localStorage.getItem(KEY) ?? entryInMemory;
  } catch {
    return entryInMemory;
  }
}

/** The first name the visitor entered with, or null before they enter (and on the server). */
export function useEntry(): string | null {
  return useSyncExternalStore(subscribe, read, () => null);
}

/** Remembers the entry in this browser, so the confirmation shows again on a later visit. */
export function saveEntry(firstName: string) {
  entryInMemory = firstName;
  try {
    window.localStorage.setItem(KEY, firstName);
  } catch {
    // Storage blocked: the copy in memory serves until the page reloads.
  }
  window.dispatchEvent(new Event(EVENT));
}

/** Whether the splash should stay closed on arrival: the visitor entered or closed it before. */
export function splashSettled(): boolean {
  try {
    return read() !== null || window.localStorage.getItem(CLOSED_KEY) !== null;
  } catch {
    return read() !== null;
  }
}

/** Remembers that the visitor closed the splash, so it stops opening by itself. */
export function rememberSplashClosed() {
  try {
    window.localStorage.setItem(CLOSED_KEY, "1");
  } catch {
    // Storage blocked: the splash opens again on the next visit.
  }
}

export type Phase = "open" | "closed" | "drawn";

const closesAt = Date.parse(GIVEAWAY.closesAt);
const drawAt = Date.parse(GIVEAWAY.drawAt);

/** Where the giveaway window stands right now, read once. */
export function phaseNow(): Phase {
  const now = Date.now();
  if (now >= drawAt) return "drawn";
  return now >= closesAt ? "closed" : "open";
}

// A timer for the next boundary, so a page left open switches at noon without a reload.
function subscribeToClock(onChange: () => void) {
  let timer: number | undefined;
  function arm() {
    const now = Date.now();
    const next = [closesAt, drawAt].find((at) => at > now);
    if (next === undefined) return;
    // setTimeout caps near 24.8 days: wake sooner and re-arm if the boundary is further off.
    timer = window.setTimeout(() => {
      onChange();
      arm();
    }, Math.min(next - now + 50, 2_000_000_000));
  }
  arm();
  return () => window.clearTimeout(timer);
}

/** Where the giveaway window stands, read in the browser. "open" on the server. */
export function usePhase(): Phase {
  return useSyncExternalStore(subscribeToClock, phaseNow, () => "open");
}
