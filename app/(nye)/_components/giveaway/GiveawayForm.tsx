"use client";

import { type FormEvent, type ReactNode, useId, useState } from "react";
import {
  GIVEAWAY,
  GIVEAWAY_CALL_OPT_IN_LABEL,
  GIVEAWAY_EMAIL_OPT_IN_LABEL,
  GIVEAWAY_ENTRY_WORDING,
  GIVEAWAY_OPT_IN_NOTE,
  GIVEAWAY_OPT_IN_SUPPORT,
  PRIVACY_URL,
} from "../../event";
import { BookButton, InfoLine } from "../shared";
import { saveEntry, useEntry } from "./state";
import g from "./giveaway.module.css";

// The giveaway's entry form and its confirmation, shared by all six prototypes.
// Prototype: submitting stores the first name in this browser and sends nothing.
// Draft PR #29 (issue #21) does the real work: HighLevel, the cutoff and the Meta Lead.

/**
 * The draft rules, until PR #29 ships them at /giveaway-rules. They are in the giveaway memo
 * on main, so the link in the prototype opens real text.
 */
const RULES_DRAFT_URL =
  "https://github.com/onehouseproject/ohp-event-marketing/blob/main/docs/research/2026-11-27-nye-giveaway-rules-and-prize-mechanics.md#stay--play-for-two-giveaway-official-rules";

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

/** The entry wording under the button, with the rules and the privacy notice as links. */
export function EntryWording() {
  return (
    <p className={g.terms}>
      {GIVEAWAY_ENTRY_WORDING.before}
      <a href={RULES_DRAFT_URL} target="_blank" rel="noopener">
        {GIVEAWAY_ENTRY_WORDING.rules}
      </a>
      {GIVEAWAY_ENTRY_WORDING.between}
      <a href={PRIVACY_URL} target="_blank" rel="noopener">
        {GIVEAWAY_ENTRY_WORDING.privacy}
      </a>
      {GIVEAWAY_ENTRY_WORDING.after}
    </p>
  );
}

function Field({
  label,
  aside,
  name,
  type = "text",
  autoComplete,
  inputMode,
  required = true,
  onValue,
}: {
  label: string;
  /** A note set beside the label, such as "Optional". */
  aside?: ReactNode;
  name: string;
  type?: "text" | "tel" | "email";
  autoComplete: string;
  inputMode?: "tel" | "email";
  required?: boolean;
  onValue?: (value: string) => void;
}) {
  const id = useId();
  return (
    <div className="field">
      <label className={`field-label ${g.label}`} htmlFor={id}>
        {label}
        {aside}
      </label>
      <input
        id={id}
        className="input"
        name={name}
        type={type}
        autoComplete={autoComplete}
        inputMode={inputMode}
        required={required}
        onChange={onValue ? (event) => onValue(event.currentTarget.value) : undefined}
      />
    </div>
  );
}

/** One optional box: unchecked to start, with its label beside it. */
function OptIn({
  name,
  label,
  checked,
  onChange,
  children,
}: {
  name: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  children?: ReactNode;
}) {
  return (
    <div className={g.optIn}>
      <label className={g.optInRow}>
        <input
          type="checkbox"
          name={name}
          className={g.box}
          checked={checked}
          onChange={(event) => onChange(event.currentTarget.checked)}
        />
        <span>{label}</span>
      </label>
      {children}
    </div>
  );
}

/**
 * The two optional boxes. `panel` sets them on a raised panel with the supporting line;
 * `light` keeps them plain, under an "Optional" label that carries the bubble.
 * The call box needs a phone number, so it reports whether one is still missing.
 */
function OptIns({
  look,
  emailOptIn,
  setEmailOptIn,
  callOptIn,
  setCallOptIn,
  needsPhone,
}: {
  look: "panel" | "light";
  emailOptIn: boolean;
  setEmailOptIn: (checked: boolean) => void;
  callOptIn: boolean;
  setCallOptIn: (checked: boolean) => void;
  needsPhone: boolean;
}) {
  const boxes = (
    <>
      <OptIn
        name="emailOptIn"
        label={GIVEAWAY_EMAIL_OPT_IN_LABEL}
        checked={emailOptIn}
        onChange={setEmailOptIn}
      />
      <OptIn name="callOptIn" label={GIVEAWAY_CALL_OPT_IN_LABEL} checked={callOptIn} onChange={setCallOptIn}>
        {needsPhone ? (
          <p className={g.optInHint}>
            <i className="ph ph-arrow-up" aria-hidden="true" /> Add your phone number above so we
            can call.
          </p>
        ) : null}
      </OptIn>
    </>
  );

  if (look === "light") {
    return (
      <div className={`${g.optInsLight} tone-gold`}>
        <InfoLine note={GIVEAWAY_OPT_IN_NOTE} quiet className={`tone-blue ${g.optInsHead}`}>
          Optional
        </InfoLine>
        {boxes}
      </div>
    );
  }

  return (
    <div className={`${g.optIns} tone-gold`}>
      {boxes}
      <InfoLine note={GIVEAWAY_OPT_IN_NOTE} quiet className={`tone-blue ${g.support}`}>
        {GIVEAWAY_OPT_IN_SUPPORT}
      </InfoLine>
    </div>
  );
}

/** The phone field: optional, until the call box is ticked. */
function PhoneField({ callOptIn, setPhone }: { callOptIn: boolean; setPhone: (value: string) => void }) {
  return (
    <Field
      label="Phone"
      aside={
        <span className={`${g.aside} ${callOptIn ? g.asideOn : ""}`}>
          {callOptIn ? "Needed for ticket calls" : "Optional"}
        </span>
      }
      name="phone"
      type="tel"
      autoComplete="tel"
      inputMode="tel"
      required={callOptIn}
      onValue={setPhone}
    />
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
        Good luck, {name}. We draw the winner {GIVEAWAY.drawDate}, and we&apos;ll email you if
        it&apos;s you.
      </p>
      <div className={g.wait}>
        <p>
          <strong>Don&apos;t want to wait?</strong> Book Stay &amp; Play now. If you win, we refund
          you.
        </p>
        <span onClickCapture={onBeforeBook} className={g.waitBook}>
          <BookButton block size="md" label="Book for two" placement="giveaway" />
        </span>
      </div>
    </div>
  );
}

/**
 * Email, name and an optional phone, then the two optional boxes, the button and the entry
 * wording. Once entered, the confirmation, or `afterEntry` in its place. The call box needs a
 * phone number: ticking it makes the phone field required and says so.
 * `optIns` picks the boxes' look, or leaves them out; `phone: false` leaves out the phone field.
 */
export function GiveawayForm({
  label = "Enter free",
  optIns = "panel",
  phone: withPhone = true,
  afterEntry,
  onBeforeBook,
}: {
  label?: string;
  optIns?: "panel" | "light" | "none";
  phone?: boolean;
  afterEntry?: (name: string) => ReactNode;
  onBeforeBook?: () => void;
}) {
  const entry = useEntry();
  const [sending, setSending] = useState(false);
  const [emailOptIn, setEmailOptIn] = useState(false);
  const [callOptIn, setCallOptIn] = useState(false);
  const [phone, setPhone] = useState("");
  const needsPhone = callOptIn && phone.trim() === "";

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = String(new FormData(event.currentTarget).get("name") ?? "").trim();
    setSending(true);
    // Stands in for the request PR #29 sends to HighLevel.
    window.setTimeout(() => {
      saveEntry(name.split(/\s+/)[0] ?? name);
      setSending(false);
    }, 700);
  }

  if (entry !== null) {
    return afterEntry ? afterEntry(entry) : <Entered name={entry} onBeforeBook={onBeforeBook} />;
  }

  return (
    <form className={g.form} onSubmit={submit} method="post">
      <div className={g.fields}>
        <Field label="Email" name="email" type="email" autoComplete="email" inputMode="email" />
        <Field label="Name" name="name" autoComplete="name" />
        {withPhone ? <PhoneField callOptIn={callOptIn} setPhone={setPhone} /> : null}
      </div>
      {optIns !== "none" ? (
        <OptIns
          look={optIns}
          emailOptIn={emailOptIn}
          setEmailOptIn={setEmailOptIn}
          callOptIn={callOptIn}
          setCallOptIn={setCallOptIn}
          needsPhone={needsPhone}
        />
      ) : null}
      <button type="submit" className="btn btn-gold btn-lg btn-block" disabled={sending}>
        <i className="ph ph-gift" aria-hidden="true" /> {sending ? "Entering…" : label}
      </button>
      <EntryWording />
    </form>
  );
}

/**
 * The second, optional step of the two-step splash: the entry is already in, and this asks
 * for a phone and the two boxes. Saving or skipping leads to the confirmation.
 * Prototype: saving sends nothing. In PR #29 it would resubmit, and a repeat entry gains the
 * newly ticked tags.
 */
export function ExtrasStep({ name, onBeforeBook }: { name: string; onBeforeBook?: () => void }) {
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);
  const [emailOptIn, setEmailOptIn] = useState(false);
  const [callOptIn, setCallOptIn] = useState(false);
  const [phone, setPhone] = useState("");
  const needsPhone = callOptIn && phone.trim() === "";

  if (done) return <Entered name={name} onBeforeBook={onBeforeBook} />;

  return (
    <form
      className={g.form}
      method="post"
      onSubmit={(event) => {
        event.preventDefault();
        setSaving(true);
        window.setTimeout(() => {
          setSaving(false);
          setDone(true);
        }, 600);
      }}
    >
      <div className={`${g.enteredHead} tone-green`}>
        <i className="ph ph-check-circle" aria-hidden="true" />
        <h3 className="h3">you&apos;re in</h3>
      </div>
      <p className={g.enteredText}>Good luck, {name}. Want ticket news too?</p>
      <div className={g.fields}>
        <PhoneField callOptIn={callOptIn} setPhone={setPhone} />
      </div>
      <OptIns
        look="light"
        emailOptIn={emailOptIn}
        setEmailOptIn={setEmailOptIn}
        callOptIn={callOptIn}
        setCallOptIn={setCallOptIn}
        needsPhone={needsPhone}
      />
      <button type="submit" className="btn btn-gold btn-block" disabled={saving}>
        {saving ? "Saving…" : "Save"}
      </button>
      <button type="button" className={g.skipStep} onClick={() => setDone(true)}>
        No thanks
      </button>
    </form>
  );
}
