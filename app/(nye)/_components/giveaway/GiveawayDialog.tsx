"use client";

import { type ReactNode, type RefObject, useCallback, useRef } from "react";
import g from "./giveaway.module.css";

/**
 * A handle on one giveaway dialog. `open` shows it as a modal and moves focus to its top,
 * not to the first field, so a phone does not raise its keyboard before the visitor chooses to.
 */
export function useDialog() {
  const ref = useRef<HTMLDialogElement>(null);
  const open = useCallback(() => {
    const dialog = ref.current;
    if (!dialog || dialog.open) return;
    dialog.showModal();
    dialog.querySelector<HTMLElement>("[data-dialog-start]")?.focus();
  }, []);
  const close = useCallback(() => ref.current?.close(), []);
  return { ref, open, close };
}

/**
 * A native modal dialog in the giveaway's gold, with a close button that is always in view.
 * Esc, the close button and a click outside the card all close it.
 * `fullOnPhone` fills a phone's screen, and `wide` widens it on a desktop, both for the splash.
 * `compact` tightens its padding and spacing at every width, for the splash variants.
 */
export function GiveawayDialog({
  dialogRef,
  label,
  fullOnPhone = false,
  wide = false,
  compact = false,
  children,
}: {
  dialogRef: RefObject<HTMLDialogElement | null>;
  label: string;
  fullOnPhone?: boolean;
  wide?: boolean;
  compact?: boolean;
  children: ReactNode;
}) {
  return (
    <dialog
      ref={dialogRef}
      aria-label={label}
      className={`${g.dialog} ${fullOnPhone ? g.dialogFull : ""} ${wide ? g.dialogWide : ""} ${compact ? g.dialogCompact : ""} tone-gold`}
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}
    >
      <button
        type="button"
        className={g.close}
        aria-label="Close"
        onClick={() => dialogRef.current?.close()}
      >
        <i className="ph ph-x" aria-hidden="true" />
      </button>
      <div className={g.dialogBody} tabIndex={-1} data-dialog-start="">
        {children}
      </div>
    </dialog>
  );
}
