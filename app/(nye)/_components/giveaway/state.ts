"use client";

import { useSyncExternalStore } from "react";
import { GIVEAWAY } from "../../event";

// Whether this visitor has entered the giveaway, shared by every giveaway piece on the page.
// Prototype: the entry lives only in this browser's localStorage, and nothing is sent anywhere.

const KEY = "nye-giveaway-entry";
const EVENT = "nye-giveaway-change";

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
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

/** The first name the visitor entered with, or null before they enter (and on the server). */
export function useEntry(): string | null {
  return useSyncExternalStore(subscribe, read, () => null);
}

/** Read once, outside React: for deciding whether to open something on arrival. */
export function hasEntry(): boolean {
  return read() !== null;
}

export function saveEntry(firstName: string) {
  try {
    window.localStorage.setItem(KEY, firstName);
  } catch {
    // Storage blocked: the confirmation still shows until the page reloads.
  }
  window.dispatchEvent(new Event(EVENT));
}

export function clearEntry() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // Nothing stored.
  }
  window.dispatchEvent(new Event(EVENT));
}

/** Whole days from today in Huntsville to the drawing: 0 on the day, negative after. */
function daysToDraw(): number {
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: GIVEAWAY.timeZone }).format(new Date());
  const ms = Date.parse(GIVEAWAY.drawDay) - Date.parse(today);
  return Math.round(ms / 86_400_000);
}

const never = () => () => {};

/** Days left before the drawing, counted in the browser. Null on the server. */
export function useDaysToDraw(): number | null {
  return useSyncExternalStore(never, daysToDraw, () => null);
}
