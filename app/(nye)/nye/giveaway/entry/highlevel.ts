// Writes one giveaway entry to HighLevel (API v2, services.leadconnectorhq.com).
// This file has no imports so `node --test` can load it directly. The route passes in the
// token, location, tag names and `fetch`.
//
// The drawing pool is a tag, `tags.entry`, and it is written last: any failure before it
// leaves the person out of the pool, and a retry starts clean. Never call /contacts/upsert,
// which overwrites a matched contact's tags and fields.

const BASE_URL = "https://services.leadconnectorhq.com";
// The Version header from HighLevel's published OpenAPI spec for the contacts endpoints.
const API_VERSION = "2021-07-28";
const TIMEOUT_MS = 8000;

export type GiveawayEntry = {
  firstName: string;
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
}: {
  token: string;
  locationId: string;
  fetch: typeof globalThis.fetch;
  tags: GiveawayTags;
  entry: GiveawayEntry;
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
    return isRecord(reply.json) ? toContact(reply.json.contact) : null;
  }

  async function fetchContact(id: string): Promise<Contact> {
    const label = "GET /contacts/{id}";
    const reply = need(await call("GET", `/contacts/${encodeURIComponent(id)}`, label), label);
    const contact = isRecord(reply.json) ? toContact(reply.json.contact) : null;
    if (!contact) throw new HighLevelError(label, "unexpected response");
    return contact;
  }

  let contact = await search();
  let created = false;
  let storedPhone: string | null = null;

  if (!contact) {
    const label = "POST /contacts/";
    const reply = await call("POST", "/contacts/", label, {
      locationId,
      firstName: entry.firstName,
      lastName: entry.lastName,
      email: entry.email,
      ...(entry.phone ? { phone: entry.phone } : {}),
      source: "NYE giveaway form",
      tags: [tags.newContact],
    });
    if (reply.ok) {
      const made = isRecord(reply.json) ? toContact(reply.json.contact) : null;
      if (!made) throw new HighLevelError(label, "unexpected response");
      contact = { ...made, tags: [tags.newContact] };
      created = true;
      storedPhone = entry.phone;
    } else if (reply.status === 400) {
      // A duplicate: HighLevel names the existing contact in `meta.contactId`. If it does not,
      // look the email up again, since another request may have created it just now.
      const meta = isRecord(reply.json) && isRecord(reply.json.meta) ? reply.json.meta : null;
      const named = meta && typeof meta.contactId === "string" ? meta.contactId : null;
      const recovered = named ? await fetchContact(named) : await search();
      if (!recovered || (recovered.email ?? "").trim().toLowerCase() !== entry.email) {
        throw new HighLevelError(label, "400, duplicate not recoverable");
      }
      contact = recovered;
    } else {
      throw new HighLevelError(label, reply.status);
    }
  }

  const id = contact.id;

  if (!created) {
    storedPhone = blank(contact.phone) ? null : normalizePhone(contact.phone);
    const fill: Record<string, string> = {};
    if (blank(contact.firstName)) fill.firstName = entry.firstName;
    if (blank(contact.lastName)) fill.lastName = entry.lastName;
    if (entry.phone && blank(contact.phone)) {
      fill.phone = entry.phone;
      storedPhone = entry.phone;
    }
    if (Object.keys(fill).length > 0) {
      const label = "PUT /contacts/{id}";
      need(await call("PUT", `/contacts/${encodeURIComponent(id)}`, label, fill), label);
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
