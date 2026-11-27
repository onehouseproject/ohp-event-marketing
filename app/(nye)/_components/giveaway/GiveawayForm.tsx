"use client";

import { type FormEvent, useId, useState } from "react";
import { GIVEAWAY, GIVEAWAY_CONSENT, GIVEAWAY_TERMS } from "../../event";
import { BookButton, InfoLine } from "../shared";
import { saveEntry, useEntry } from "./state";
import g from "./giveaway.module.css";

// The giveaway's entry form and its confirmation, shared by all six prototypes.
// Prototype: submitting stores the first name in this browser and sends nothing.
// Wiring it to HighLevel and the Meta pixel's Lead event comes after an option is chosen.

const RULES_NOTE = "Placeholder. The official rules page isn't written yet.";

/** What the winner gets, as a short row of facts. */
export function PrizeList({ className = "" }: { className?: string }) {
  return (
    <ul className={`${g.prize} ${className}`}>
      <li>
        <i className="ph ph-ticket" aria-hidden="true" /> Two VIP tickets
      </li>
      <li>
        <i className="ph ph-bed" aria-hidden="true" /> A hotel room upstairs
      </li>
      <li>
        <i className="ph ph-coffee" aria-hidden="true" /> Breakfast for two
      </li>
    </ul>
  );
}

/** The terms line: when we draw, what entering does not require, and the rules. */
export function Terms() {
  return (
    <p className={g.terms}>
      We draw one winner {GIVEAWAY.drawDate}. {GIVEAWAY_TERMS}{" "}
      <InfoLine note={RULES_NOTE} quiet className="tone-blue">
        Official rules
      </InfoLine>
    </p>
  );
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  inputMode,
  wide = false,
}: {
  label: string;
  name: string;
  type?: "text" | "tel" | "email";
  autoComplete: string;
  inputMode?: "tel" | "email";
  wide?: boolean;
}) {
  const id = useId();
  return (
    <div className={`field ${wide ? g.wide : ""}`}>
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className="input"
        name={name}
        type={type}
        autoComplete={autoComplete}
        inputMode={inputMode}
        required
      />
    </div>
  );
}

/**
 * The confirmation that replaces the form once the visitor has entered, anywhere on the page.
 * It points the visitor at booking, with the refund that makes booking now safe.
 * `onBeforeBook` runs before checkout opens, so a dialog can close first.
 */
export function Entered({ name, onBeforeBook }: { name: string; onBeforeBook?: () => void }) {
  return (
    <div className={g.entered} role="status">
      <div className={`${g.enteredHead} tone-green`}>
        <i className="ph ph-check-circle" aria-hidden="true" />
        <h3 className="h3">you&apos;re in</h3>
      </div>
      <p className={g.enteredText}>
        Good luck, {name}. We draw the winner {GIVEAWAY.drawDate}, and we&apos;ll call or text if
        it&apos;s you.
      </p>
      <div className={g.wait}>
        <p>
          <strong>Don&apos;t want to wait?</strong> Book Stay &amp; Play now. If you win, we refund
          you.
        </p>
        <span onClickCapture={onBeforeBook} className={g.waitBook}>
          <BookButton block size="md" label="Book for two" />
        </span>
      </div>
    </div>
  );
}

/**
 * The four fields, the button and the fine print, or the confirmation once entered.
 * `label` names the button.
 */
export function GiveawayForm({
  label = "Enter free",
  onBeforeBook,
}: {
  label?: string;
  onBeforeBook?: () => void;
}) {
  const entry = useEntry();
  const [sending, setSending] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const firstName = String(new FormData(event.currentTarget).get("firstName") ?? "").trim();
    setSending(true);
    // Stands in for the request to HighLevel.
    window.setTimeout(() => {
      saveEntry(firstName);
      setSending(false);
    }, 700);
  }

  if (entry !== null) return <Entered name={entry} onBeforeBook={onBeforeBook} />;

  return (
    <form className={g.form} onSubmit={submit}>
      <div className={g.fields}>
        <Field label="First name" name="firstName" autoComplete="given-name" />
        <Field label="Last name" name="lastName" autoComplete="family-name" />
        <Field
          label="Mobile number"
          name="phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          wide
        />
        <Field label="Email" name="email" type="email" autoComplete="email" inputMode="email" wide />
      </div>
      <button type="submit" className="btn btn-gold btn-lg btn-block" disabled={sending}>
        <i className="ph ph-gift" aria-hidden="true" /> {sending ? "Entering…" : label}
      </button>
      <p className={g.consent}>{GIVEAWAY_CONSENT}</p>
      <Terms />
    </form>
  );
}
