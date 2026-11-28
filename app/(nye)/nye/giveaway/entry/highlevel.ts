// Writes one giveaway entry to HighLevel (API v2, services.leadconnectorhq.com).
// This file has no imports so `node --test` can load it directly. The route passes in the
// token, location, tag names and `fetch`.
//
// The drawing pool is a tag, `tags.entry`, and it is written last: any failure before it
// leaves the person out of the pool, and a retry starts clean. Never call /contacts/upsert,
// which overwrites a matched contact's tags and fields. Matched contacts are always loaded in full.
//
// The phone and the empty-name fill are optional, so HighLevel refusing them must not cost a
// free entry. When an existing contact's fill is refused (400 or 422), it is retried once without
// the phone, then skipped. When creating a contact is refused and no contact has the email, the
// phone belongs to someone else: the contact is created once more without it. Either way the
// call tag needs a phone HighLevel stores for this contact. Refusals are logged with fixed fields
// only, never HighLevel's message or anything the entrant typed.

const BASE_URL = "https://services.leadconnectorhq.com";
// The Version header from HighLevel's published OpenAPI spec for the contacts endpoints.
const API_VERSION = "2021-07-28";
const TIMEOUT_MS = 8000;

export type GiveawayEntry = {
  /** The first word of the entrant's one name field. */
  firstName: string;
  /** The rest of the name field. Empty for a one-word name, and then never written. */
  lastName: string;
  email: string;
  /** `+1XXXXXXXXXX`, or null when the entrant gave no phone. */
  phone: string | null;
  emailOptIn: boolean;
  callOptIn: boolean;
};

export type GiveawayTags = {
  entry: string;
  newContact: string;
  emailNews: string;
  callOk: string;
};

export type EnterResult = { status: "entered"; isNew: true } | { status: "already" };

/** A refused optional write that the entry survived. Fixed fields only: nothing typed, no vendor text. */
export type RefusalEvent = {
  event: "giveaway-optional-write-refused";
  step: "create" | "fill";
  status: number;
  /** The names of the fields HighLevel refused, never their values. */
  fields: string[];
  /** HighLevel's matched field, kept only when it is exactly "phone" or "email". */
  matchingField?: "phone" | "email";
  outcome: "created-without-phone" | "names-only" | "skipped";
};

const logRefusal = (event: RefusalEvent) => console.warn(`Giveaway entry: ${JSON.stringify(event)}`);

type Contact = {
  id: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  tags?: string[] | null;
};

/** Thrown for any HighLevel failure. The message holds the method, path and status, never contact details. */
export class HighLevelError extends Error {
  constructor(label: string, status: number | string) {
    super(`HighLevel ${label} failed: ${status}`);
    this.name = "HighLevelError";
  }
}

type Reply = { status: number; ok: boolean; json: unknown };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/** `+1XXXXXXXXXX` for a US number in any format, else null. */
function normalizePhone(raw: string | null | undefined): string | null {
  const digits = (raw ?? "").replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return null;
}

function blank(value: string | null | undefined): boolean {
  return !value || value.trim() === "";
}

/** A refusal about the data sent, which repeats on every retry. Other failures are not. */
function refused(status: number): boolean {
  return status === 400 || status === 422;
}

/** HighLevel's matched field from an error body, only when it is one of the expected values. */
function matchingField(json: unknown): "phone" | "email" | undefined {
  const meta = isRecord(json) && isRecord(json.meta) ? json.meta : null;
  const field = meta?.matchingField;
  return field === "phone" || field === "email" ? field : undefined;
}

/** `{ matchingField }` for a refusal report, or nothing when HighLevel gave no expected value. */
function matched(json: unknown): { matchingField?: "phone" | "email" } {
  const field = matchingField(json);
  return field ? { matchingField: field } : {};
}

/**
 * The phone a successful update reports, normalized. Undefined when the reply leaves it out:
 * HighLevel saves an update all or nothing, so the caller then trusts the success.
 */
function reportedPhone(json: unknown): string | null | undefined {
  const contact = isRecord(json) && isRecord(json.contact) ? json.contact : null;
  if (!contact || !("phone" in contact)) return undefined;
  return typeof contact.phone === "string" ? normalizePhone(contact.phone) : null;
}

function toContact(value: unknown): Contact | null {
  if (!isRecord(value) || typeof value.id !== "string") return null;
  return value as Contact;
}

export async function enterGiveaway({
  token,
  locationId,
  fetch,
  tags,
  entry,
  warn = logRefusal,
}: {
  token: string;
  locationId: string;
  fetch: typeof globalThis.fetch;
  tags: GiveawayTags;
  entry: GiveawayEntry;
  /** Where refusals the entry survived are reported. The tests pass a recorder. */
  warn?: (event: RefusalEvent) => void;
}): Promise<EnterResult> {
  async function call(
    method: "GET" | "POST" | "PUT",
    path: string,
    label: string,
    body?: unknown,
  ): Promise<Reply> {
    let response: Response;
    try {
      response = await fetch(`${BASE_URL}${path}`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          Version: API_VERSION,
          Accept: "application/json",
          ...(body === undefined ? {} : { "Content-Type": "application/json" }),
        },
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch {
      throw new HighLevelError(label, "network error or timeout");
    }
    let json: unknown = null;
    try {
      json = await response.json();
    } catch {
      // An empty or non-JSON body.
    }
    return { status: response.status, ok: response.ok, json };
  }

  function need(reply: Reply, label: string): Reply {
    if (!reply.ok) throw new HighLevelError(label, reply.status);
    return reply;
  }

  async function search(): Promise<Contact | null> {
    const label = "GET /contacts/search/duplicate";
    const query = new URLSearchParams({ locationId, email: entry.email });
    const reply = need(await call("GET", `/contacts/search/duplicate?${query}`, label), label);
    const found = isRecord(reply.json) ? toContact(reply.json.contact) : null;
    if (!found) return null;
    // The search response shape is undocumented, so read names, phone and tags from the full contact.
    return fetchContact(found.id);
  }

  function hasEntryEmail(contact: Contact): boolean {
    return (contact.email ?? "").trim().toLowerCase() === entry.email;
  }

  async function loadContact(id: string): Promise<Contact> {
    const label = "GET /contacts/{id}";
    const reply = need(await call("GET", `/contacts/${encodeURIComponent(id)}`, label), label);
    const contact = isRecord(reply.json) ? toContact(reply.json.contact) : null;
    if (!contact) throw new HighLevelError(label, "unexpected response");
    return contact;
  }

  /** Loads a contact found by email, and refuses one whose email is not the entrant's. */
  async function fetchContact(id: string): Promise<Contact> {
    const contact = await loadContact(id);
    if (!hasEntryEmail(contact)) {
      throw new HighLevelError("GET /contacts/{id}", "contact email does not match");
    }
    return contact;
  }

  /**
   * After a refused create: the contact HighLevel names, if it has the entrant's email (another
   * request may have created it just now), else a fresh search by email. Null when no contact
   * has the email, so the refusal was about something else, such as the phone.
   */
  async function recoverByEmail(json: unknown): Promise<Contact | null> {
    const meta = isRecord(json) && isRecord(json.meta) ? json.meta : null;
    const named = meta && typeof meta.contactId === "string" ? meta.contactId : null;
    if (named) {
      const contact = await loadContact(named);
      if (hasEntryEmail(contact)) return contact;
    }
    return search();
  }

  let contact = await search();
  let created = false;
  let storedPhone: string | null = null;

  if (!contact) {
    const label = "POST /contacts/";
    const createBody = (withPhone: boolean) => ({
      locationId,
      firstName: entry.firstName,
      // A one-word name has no last name to send.
      ...(entry.lastName ? { lastName: entry.lastName } : {}),
      email: entry.email,
      ...(withPhone && entry.phone ? { phone: entry.phone } : {}),
      source: "NYE giveaway form",
      tags: [tags.newContact],
    });
    const made = (reply: Reply): Contact => {
      const value = isRecord(reply.json) ? toContact(reply.json.contact) : null;
      if (!value) throw new HighLevelError(label, "unexpected response");
      return { ...value, tags: [tags.newContact] };
    };

    const reply = await call("POST", "/contacts/", label, createBody(true));
    if (reply.ok) {
      contact = made(reply);
      created = true;
      storedPhone = entry.phone;
    } else if (reply.status === 400) {
      const recovered = await recoverByEmail(reply.json);
      if (recovered) {
        contact = recovered;
      } else if (entry.phone) {
        // No contact has this email, so the phone is the clash: it belongs to another contact.
        // Create this one without it. That other contact is never used for the entry.
        const again = await call("POST", "/contacts/", label, createBody(false));
        if (!again.ok) throw new HighLevelError(label, `400, then ${again.status} without the phone`);
        contact = made(again);
        created = true;
        warn({
          event: "giveaway-optional-write-refused",
          step: "create",
          status: reply.status,
          fields: ["phone"],
          ...matched(reply.json),
          outcome: "created-without-phone",
        });
      } else {
        throw new HighLevelError(label, "400, duplicate not recoverable");
      }
    } else {
      throw new HighLevelError(label, reply.status);
    }
  }

  const id = contact.id;

  if (!created) {
    storedPhone = blank(contact.phone) ? null : normalizePhone(contact.phone);
    const names: Record<string, string> = {};
    if (blank(contact.firstName)) names.firstName = entry.firstName;
    if (blank(contact.lastName) && entry.lastName) names.lastName = entry.lastName;
    const phone = entry.phone && blank(contact.phone) ? entry.phone : null;
    const fill: Record<string, string> = phone ? { ...names, phone } : names;

    if (Object.keys(fill).length > 0) {
      const label = "PUT /contacts/{id}";
      const path = `/contacts/${encodeURIComponent(id)}`;
      const reply = await call("PUT", path, label, fill);
      if (reply.ok) {
        if (phone) {
          const reported = reportedPhone(reply.json);
          storedPhone = reported === undefined ? phone : reported;
        }
      } else if (refused(reply.status)) {
        // Filling empty fields is a courtesy to the record; a refusal must not cost the entry.
        // The phone is the only field that can clash with another contact, so the names are
        // retried alone. The phone stays unsaved, so no call tag.
        let outcome: RefusalEvent["outcome"] = "skipped";
        if (phone && Object.keys(names).length > 0) {
          const retry = await call("PUT", path, label, names);
          if (retry.ok) outcome = "names-only";
          else if (!refused(retry.status)) throw new HighLevelError(label, retry.status);
        }
        warn({
          event: "giveaway-optional-write-refused",
          step: "fill",
          status: reply.status,
          fields: Object.keys(fill),
          ...matched(reply.json),
          outcome,
        });
      } else {
        throw new HighLevelError(label, reply.status);
      }
    }
  }

  const have = new Set((contact.tags ?? []).map((tag) => tag.toLowerCase()));
  const alreadyEntered = have.has(tags.entry.toLowerCase());

  const add: string[] = [];
  if (!alreadyEntered) add.push(tags.entry);
  if (entry.emailOptIn) add.push(tags.emailNews);
  // Only call a number the entrant typed: the stored phone must be that number.
  if (entry.callOptIn && entry.phone !== null && storedPhone === entry.phone) add.push(tags.callOk);
  const missing = add.filter((tag) => !have.has(tag.toLowerCase()));

  if (missing.length > 0) {
    const label = "POST /contacts/{id}/tags";
    need(await call("POST", `/contacts/${encodeURIComponent(id)}/tags`, label, { tags: missing }), label);
  }

  return alreadyEntered ? { status: "already" } : { status: "entered", isNew: true };
}
