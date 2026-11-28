"use client";

import { type FormEvent, useId, useState } from "react";
import {
  GIVEAWAY,
  GIVEAWAY_CALL_OPT_IN_LABEL,
  GIVEAWAY_EMAIL_OPT_IN_LABEL,
  GIVEAWAY_ENTRY_WORDING,
  GIVEAWAY_OPT_IN_NOTE,
  GIVEAWAY_OPT_IN_SUPPORT,
  GIVEAWAY_RULES_URL,
  PRIVACY_URL,
} from "../../event";
import { trackLead } from "../meta";
import { BookButton, InfoLine } from "../shared";
import { saveEntry, useEntry } from "./state";
import g from "./giveaway.module.css";

// The giveaway's entry form and its confirmation. The form posts JSON to /nye/giveaway/entry,
// which writes to HighLevel. Every outcome but success keeps what the visitor typed and says
// plainly that the entry was not recorded.

type Field = "firstName" | "lastName" | "email" | "phone";
const FIELDS: Field[] = ["firstName", "lastName", "email", "phone"];

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
  name,
  type = "text",
  autoComplete,
  inputMode,
  required = true,
  error,
  wide = false,
}: {
  label: string;
  name: Field;
  type?: "text" | "tel" | "email";
  autoComplete: string;
  inputMode?: "tel" | "email";
  required?: boolean;
  error?: string;
  wide?: boolean;
}) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className={`field ${error ? "is-error" : ""} ${wide ? g.wide : ""}`}>
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
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
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
 */
export function Entered({ name }: { name: string }) {
  return (
    <div className={g.entered} role="status">
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
        <span className={g.waitBook}>
          <BookButton block size="md" label="Book for two" placement="giveaway" />
        </span>
      </div>
    </div>
  );
}

/** The fields, the two optional boxes, the button and the entry wording, or the confirmation once entered. */
export function GiveawayForm() {
  const entry = useEntry();
  const [sending, setSending] = useState(false);
  const [outcome, setOutcome] = useState<Outcome | null>(null);

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
          firstName: value("firstName"),
          lastName: value("lastName"),
          email: value("email"),
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
      saveEntry(value("firstName"));
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
        <Entered name={entry} />
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
        <Field label="First name" name="firstName" autoComplete="given-name" error={fieldErrors.firstName} />
        <Field label="Last name" name="lastName" autoComplete="family-name" error={fieldErrors.lastName} />
        <Field label="Email" name="email" type="email" autoComplete="email" inputMode="email" error={fieldErrors.email} wide />
        <Field
          label="Phone (optional)"
          name="phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          required={false}
          error={fieldErrors.phone}
          wide
        />
      </div>

      {/* The honeypot: people never see it, and bots fill it. */}
      <div className={g.trap} aria-hidden="true">
        <input name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className={g.optIns}>
        <label className={g.check}>
          <input type="checkbox" name="emailOptIn" />
          <span>{GIVEAWAY_EMAIL_OPT_IN_LABEL}</span>
        </label>
        <label className={g.check}>
          <input type="checkbox" name="callOptIn" />
          <span>{GIVEAWAY_CALL_OPT_IN_LABEL}</span>
        </label>
        <InfoLine note={GIVEAWAY_OPT_IN_NOTE} quiet className={`tone-blue ${g.support}`}>
          {GIVEAWAY_OPT_IN_SUPPORT}
        </InfoLine>
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
