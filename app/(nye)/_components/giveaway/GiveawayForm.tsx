"use client";

import { type FormEvent, type ReactNode, useEffect, useId, useRef, useState } from "react";
import {
  GIVEAWAY,
  GIVEAWAY_CALL_OPT_IN_LABEL,
  GIVEAWAY_EMAIL_OPT_IN_LABEL,
  GIVEAWAY_ENTRY_WORDING,
  GIVEAWAY_OPT_IN_NOTE,
  GIVEAWAY_RULES_URL,
  PRIVACY_URL,
} from "../../event";
import { trackLead } from "../meta";
import { BookButton, InfoLine } from "../shared";
import { saveEntry, useEntry } from "./state";
import g from "./giveaway.module.css";

// The giveaway's entry form and its confirmation, shown in the splash. The form posts JSON to
// /nye/giveaway/entry, which writes to HighLevel. Every outcome but success keeps what the
// visitor typed and says plainly that the entry was not recorded.

type Field = "email" | "name" | "phone";
/** The fields in page order, which is also the order the first error is focused in. */
const FIELDS: Field[] = ["email", "name", "phone"];

/** The name's first word, for the greeting. The route splits it the same way. */
function firstWord(name: string): string {
  return name.trim().split(/\s+/)[0] ?? "";
}

type Outcome =
  | { kind: "entered"; isNew: boolean }
  | { kind: "already" }
  | { kind: "invalid"; fieldErrors: Partial<Record<Field, string>> }
  | { kind: "closed" }
  | { kind: "blocked" }
  | { kind: "error" };

const MESSAGES = {
  closed: "Entries closed at noon CT on Friday, December 4. This entry was not recorded.",
  blocked: "We couldn't verify this entry, so it was not recorded. Refresh the page and try again.",
  error: "Something went wrong and your entry was not recorded. Please try again.",
  invalid: "Check the fields marked below. Your entry was not recorded.",
  already: "You're already in. One entry per person, and yours is saved.",
} as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/** Reads the route's JSON. Anything that is not one of its shapes (a WAF's 429, say) is an error. */
function readOutcome(json: unknown): Outcome {
  if (!isRecord(json)) return { kind: "error" };
  switch (json.status) {
    case "entered":
      return typeof json.isNew === "boolean" ? { kind: "entered", isNew: json.isNew } : { kind: "error" };
    case "already":
      return { kind: "already" };
    case "closed":
      return { kind: "closed" };
    case "blocked":
      return { kind: "blocked" };
    case "invalid": {
      if (!isRecord(json.fieldErrors)) return { kind: "error" };
      const fieldErrors: Partial<Record<Field, string>> = {};
      for (const field of FIELDS) {
        const message = json.fieldErrors[field];
        if (typeof message === "string") fieldErrors[field] = message;
      }
      return Object.keys(fieldErrors).length > 0 ? { kind: "invalid", fieldErrors } : { kind: "error" };
    }
    default:
      return { kind: "error" };
  }
}

function Field({
  label,
  aside,
  name,
  type = "text",
  autoComplete,
  inputMode,
  required = true,
  error,
  onValue,
}: {
  label: string;
  /** A note at the label's far end, such as "Optional". */
  aside?: ReactNode;
  name: Field;
  type?: "text" | "tel" | "email";
  autoComplete: string;
  inputMode?: "tel" | "email";
  required?: boolean;
  error?: string;
  onValue?: (value: string) => void;
}) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className={`field ${error ? "is-error" : ""}`}>
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
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        onChange={onValue ? (event) => onValue(event.currentTarget.value) : undefined}
      />
      {error ? (
        <span id={errorId} className="field-hint">
          {error}
        </span>
      ) : null}
    </div>
  );
}

/**
 * The confirmation that replaces the form once the visitor has entered.
 * It points the visitor at booking, with the reimbursement that makes booking now safe.
 * `onBeforeBook` runs before checkout opens, so the splash closes first and the two modals
 * never stack. `focusOnShow` moves focus here right after a successful entry.
 */
export function Entered({
  name,
  onBeforeBook,
  focusOnShow = false,
}: {
  name: string;
  onBeforeBook?: () => void;
  focusOnShow?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (focusOnShow) ref.current?.focus();
  }, [focusOnShow]);
  return (
    <div className={g.entered} role="status" tabIndex={-1} ref={ref}>
      <div className={`${g.enteredHead} tone-green`}>
        <i className="ph ph-check-circle" aria-hidden="true" />
        <h3 className="h3">you&apos;re in</h3>
      </div>
      <p className={g.enteredText}>
        Good luck, {name}. We draw the winner {GIVEAWAY.drawDate} at 2 p.m. CT and email them that
        afternoon.
      </p>
      <div className={g.wait}>
        <p>
          <strong>Don&apos;t want to wait?</strong> Book Stay &amp; Play now. If you win, we
          reimburse your package.
        </p>
        <span className={g.waitBook} onClickCapture={onBeforeBook}>
          <BookButton block size="md" label="Book for two" placement="giveaway" />
        </span>
      </div>
    </div>
  );
}

/**
 * Email, name and an optional phone, the two optional boxes, the button and the entry wording,
 * or the confirmation once entered. The call box needs a phone number: ticking it makes the
 * phone field required and says so. The server checks the same rule.
 */
export function GiveawayForm({ onBeforeBook }: { onBeforeBook?: () => void } = {}) {
  const entry = useEntry();
  const [sending, setSending] = useState(false);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [justEntered, setJustEntered] = useState(false);
  const [callOptIn, setCallOptIn] = useState(false);
  const [phone, setPhone] = useState("");
  const needsPhone = callOptIn && phone.trim() === "";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const value = (name: string) => String(data.get(name) ?? "").trim();
    const eventId = crypto.randomUUID();
    setSending(true);
    setOutcome(null);

    let result: Outcome;
    try {
      const response = await fetch("/nye/giveaway/entry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: value("email"),
          name: value("name"),
          phone: value("phone"),
          emailOptIn: data.get("emailOptIn") !== null,
          callOptIn: data.get("callOptIn") !== null,
          company: value("company"),
        }),
      });
      result = readOutcome(await response.json().catch(() => null));
    } catch {
      result = { kind: "error" };
    }
    setSending(false);

    if (result.kind === "entered" || result.kind === "already") {
      // One Lead per new entry, after the server confirmed the HighLevel write.
      if (result.kind === "entered" && result.isNew) trackLead(eventId);
      setOutcome(result.kind === "already" ? result : null);
      setJustEntered(true);
      saveEntry(firstWord(value("name")));
      return;
    }

    setOutcome(result);
    if (result.kind === "invalid") {
      const first = FIELDS.find((field) => result.kind === "invalid" && result.fieldErrors[field]);
      const element = first ? form.elements.namedItem(first) : null;
      if (element instanceof HTMLInputElement) element.focus();
    }
  }

  if (entry !== null) {
    return (
      <>
        {outcome?.kind === "already" ? <p className={g.already} role="status">{MESSAGES.already}</p> : null}
        <Entered name={entry} onBeforeBook={onBeforeBook} focusOnShow={justEntered} />
      </>
    );
  }

  const fieldErrors = outcome?.kind === "invalid" ? outcome.fieldErrors : {};
  const message =
    outcome === null || outcome.kind === "entered" || outcome.kind === "already"
      ? null
      : MESSAGES[outcome.kind];

  return (
    // method="post" keeps contact details out of the page address if the form submits before
    // the page has loaded its script.
    <form className={g.form} method="post" onSubmit={submit}>
      <div className={g.fields}>
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          error={fieldErrors.email}
        />
        <Field label="Name" name="name" autoComplete="name" error={fieldErrors.name} />
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
          error={fieldErrors.phone}
          onValue={setPhone}
        />
      </div>

      {/* The honeypot: people never see it, and bots fill it. */}
      <div className={g.trap} aria-hidden="true">
        <input name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className={`${g.optIns} tone-gold`}>
        <InfoLine note={GIVEAWAY_OPT_IN_NOTE} quiet className={`tone-blue ${g.optInsHead}`}>
          Optional
        </InfoLine>
        <label className={g.check}>
          <input type="checkbox" name="emailOptIn" className={g.box} />
          <span>{GIVEAWAY_EMAIL_OPT_IN_LABEL}</span>
        </label>
        <div className={g.optIn}>
          <label className={g.check}>
            <input
              type="checkbox"
              name="callOptIn"
              className={g.box}
              checked={callOptIn}
              onChange={(event) => setCallOptIn(event.currentTarget.checked)}
            />
            <span>{GIVEAWAY_CALL_OPT_IN_LABEL}</span>
          </label>
          {needsPhone ? (
            <p className={g.optInHint}>
              <i className="ph ph-arrow-up" aria-hidden="true" /> Add your phone number above so
              we can call.
            </p>
          ) : null}
        </div>
      </div>

      <div role="alert" className={g.live}>
        {message ? (
          <div className="alert alert-danger">
            <i className="ph ph-warning-circle alert-icon" aria-hidden="true" />
            <p className="alert-text">{message}</p>
          </div>
        ) : null}
      </div>

      <button type="submit" className="btn btn-gold btn-lg btn-block" disabled={sending}>
        <i className="ph ph-gift" aria-hidden="true" /> {sending ? "Entering…" : "Enter free"}
      </button>

      <p className={g.terms}>
        {GIVEAWAY_ENTRY_WORDING.before}
        <a href={GIVEAWAY_RULES_URL} target="_blank" rel="noopener">
          {GIVEAWAY_ENTRY_WORDING.rules}
        </a>
        {GIVEAWAY_ENTRY_WORDING.between}
        <a href={PRIVACY_URL} target="_blank" rel="noopener">
          {GIVEAWAY_ENTRY_WORDING.privacy}
        </a>
        {GIVEAWAY_ENTRY_WORDING.after}
      </p>
    </form>
  );
}
