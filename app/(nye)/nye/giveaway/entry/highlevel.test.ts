import assert from "node:assert/strict";
import { test } from "node:test";
import { enterGiveaway, type GiveawayEntry } from "./highlevel.ts";

const tags = {
  entry: "nye-2026-giveaway-entry",
  newContact: "nye-2026-giveaway-new-contact",
  emailNews: "nye-2026-event-news",
  callOk: "nye-2026-call-ok",
};

const entry: GiveawayEntry = {
  firstName: "Ada",
  lastName: "Lovelace",
  email: "ada@example.com",
  phone: "+12565550100",
  emailOptIn: false,
  callOptIn: false,
};

type Recorded = { method: string; path: string; body: Record<string, unknown> | null };
type Reply = { status?: number; json?: unknown };
type Handler = (call: Recorded) => Reply | undefined;

/** A fake fetch that records every call and answers from `handler`. */
function fake(handler: Handler) {
  const calls: Recorded[] = [];
  const fetchFn = (async (url: string | URL | Request, init?: RequestInit) => {
    const path = String(url).replace("https://services.leadconnectorhq.com", "");
    const call: Recorded = {
      method: init?.method ?? "GET",
      path,
      body: typeof init?.body === "string" ? JSON.parse(init.body) : null,
    };
    calls.push(call);
    const reply = handler(call) ?? { status: 500 };
    const status = reply.status ?? 200;
    return new Response(JSON.stringify(reply.json ?? {}), { status });
  }) as typeof fetch;
  return { calls, fetch: fetchFn };
}

const run = (f: ReturnType<typeof fake>, over: Partial<GiveawayEntry> = {}) =>
  enterGiveaway({ token: "t", locationId: "loc", fetch: f.fetch, tags, entry: { ...entry, ...over } });

const tagCalls = (f: ReturnType<typeof fake>) => f.calls.filter((c) => c.path.endsWith("/tags"));
const writes = (f: ReturnType<typeof fake>) => f.calls.filter((c) => c.method !== "GET");

/** A handler for an existing contact. */
function existing(contact: Record<string, unknown>): Handler {
  return (c) => {
    if (c.path.startsWith("/contacts/search/duplicate")) return { json: { contact: { id: "c1" } } };
    if (c.path === "/contacts/c1") return { json: { contact: { id: "c1", email: "ada@example.com", ...contact } } };
    if (c.method === "PUT") return { json: { succeeded: true } };
    if (c.path.endsWith("/tags")) return { status: 201, json: {} };
  };
}

test("a new contact is created with the new-contact tag, and the tag call omits it", async () => {
  const f = fake((c) => {
    if (c.path.startsWith("/contacts/search/duplicate")) return { json: { contact: null } };
    if (c.path === "/contacts/") return { status: 201, json: { contact: { id: "n1" } } };
    if (c.path.endsWith("/tags")) return { status: 201, json: {} };
  });
  const result = await run(f, { emailOptIn: true });
  assert.deepEqual(result, { status: "entered", isNew: true });
  const create = f.calls.find((c) => c.path === "/contacts/");
  assert.deepEqual(create?.body?.tags, [tags.newContact]);
  assert.equal(create?.body?.phone, "+12565550100");
  assert.equal("dnd" in (create?.body ?? {}), false);
  assert.equal("dndSettings" in (create?.body ?? {}), false);
  assert.deepEqual(tagCalls(f).map((c) => c.body?.tags), [[tags.entry, tags.emailNews]]);
  assert.equal(f.calls.some((c) => c.path.includes("upsert")), false);
});

test("an existing contact with empty fields: fills only those, and the PUT sends no tags", async () => {
  const f = fake(existing({ firstName: "Augusta", lastName: "", phone: null, tags: ["donor"] }));
  const result = await run(f);
  assert.deepEqual(result, { status: "entered", isNew: true });
  const put = f.calls.find((c) => c.method === "PUT");
  assert.deepEqual(put?.body, { lastName: "Lovelace", phone: "+12565550100" });
  assert.deepEqual(tagCalls(f).map((c) => c.body?.tags), [[tags.entry]]);
});

test("an existing contact with full fields: no PUT", async () => {
  const f = fake(existing({ firstName: "A", lastName: "L", phone: "+12565550111", tags: ["donor"] }));
  await run(f);
  assert.equal(f.calls.some((c) => c.method === "PUT"), false);
});

test("the call box with the same stored phone adds the call tag", async () => {
  const f = fake(existing({ firstName: "A", lastName: "L", phone: "(256) 555-0100", tags: [] }));
  await run(f, { callOptIn: true });
  assert.deepEqual(tagCalls(f).map((c) => c.body?.tags), [[tags.entry, tags.callOk]]);
});

test("the call box with a different stored phone leaves the call tag off and still enters", async () => {
  const f = fake(existing({ firstName: "A", lastName: "L", phone: "+12565550111", tags: [] }));
  const result = await run(f, { callOptIn: true });
  assert.deepEqual(result, { status: "entered", isNew: true });
  assert.deepEqual(tagCalls(f).map((c) => c.body?.tags), [[tags.entry]]);
});

test("the call box on a contact whose empty phone is filled adds the call tag", async () => {
  const f = fake(existing({ firstName: "A", lastName: "L", phone: "", tags: [] }));
  await run(f, { callOptIn: true });
  assert.deepEqual(tagCalls(f).map((c) => c.body?.tags), [[tags.entry, tags.callOk]]);
});

test("a repeat entry returns already and adds only newly ticked opt-ins", async () => {
  const f = fake(existing({ firstName: "A", lastName: "L", phone: "+12565550100", tags: [tags.entry, tags.emailNews] }));
  const result = await run(f, { emailOptIn: true, callOptIn: true });
  assert.deepEqual(result, { status: "already" });
  assert.deepEqual(tagCalls(f).map((c) => c.body?.tags), [[tags.callOk]]);
});

test("a repeat entry with nothing new sends no tag call", async () => {
  const f = fake(existing({ firstName: "A", lastName: "L", phone: "+12565550100", tags: [tags.entry] }));
  assert.deepEqual(await run(f), { status: "already" });
  assert.equal(writes(f).length, 0);
});

test("a create that answers duplicate falls back to the match path", async () => {
  const f = fake((c) => {
    if (c.path.startsWith("/contacts/search/duplicate")) return { json: { contact: null } };
    if (c.path === "/contacts/") return { status: 400, json: { message: "duplicated contacts", meta: { contactId: "d1" } } };
    if (c.path === "/contacts/d1") return { json: { contact: { id: "d1", email: "ADA@example.com", firstName: "A", lastName: "L", phone: "+12565550100", tags: ["x"] } } };
    if (c.path.endsWith("/tags")) return { status: 201, json: {} };
  });
  const result = await run(f);
  assert.deepEqual(result, { status: "entered", isNew: true });
  assert.deepEqual(tagCalls(f).map((c) => [c.path, c.body?.tags]), [["/contacts/d1/tags", [tags.entry]]]);
});

test("a recovered contact with a different email throws and writes nothing", async () => {
  const f = fake((c) => {
    if (c.path.startsWith("/contacts/search/duplicate")) return { json: { contact: null } };
    if (c.path === "/contacts/") return { status: 400, json: { meta: { contactId: "d1" } } };
    if (c.path === "/contacts/d1") return { json: { contact: { id: "d1", email: "other@example.com", tags: [] } } };
  });
  await assert.rejects(run(f));
  assert.deepEqual(writes(f).map((c) => c.path), ["/contacts/"]);
});

test("a failed search throws and sends no tag call", async () => {
  const f = fake(() => ({ status: 500 }));
  await assert.rejects(run(f), /GET \/contacts\/search\/duplicate failed: 500/);
  assert.equal(f.calls.length, 1);
  assert.equal(tagCalls(f).length, 0);
});

test("a failed tag call throws, and errors carry no contact details", async () => {
  const f = fake((c) => (c.path.endsWith("/tags") ? { status: 422 } : existing({ firstName: "A", lastName: "L", phone: null, tags: [] })(c)));
  await assert.rejects(run(f), (error: Error) => {
    assert.match(error.message, /tags failed: 422/);
    assert.equal(error.message.includes("ada@example.com"), false);
    return true;
  });
});

test("requests carry the bearer token, the Version header and the location", async () => {
  const seen: Array<Record<string, string>> = [];
  const f = fake(existing({ firstName: "A", lastName: "L", phone: "+12565550100", tags: [tags.entry] }));
  const base = f.fetch;
  f.fetch = (async (url: string | URL | Request, init?: RequestInit) => {
    seen.push(init?.headers as Record<string, string>);
    if (String(url).includes("/search/duplicate")) assert.match(String(url), /locationId=loc&email=ada%40example\.com/);
    return base(url, init);
  }) as typeof fetch;
  await run(f);
  assert.equal(seen[0].Authorization, "Bearer t");
  assert.equal(seen[0].Version, "2021-07-28");
});

test("a search that returns only an id still reads the full contact: no PUT, already, no tag re-added", async () => {
  const f = fake(existing({ firstName: "Augusta", lastName: "King", phone: "+12565550111", tags: [tags.entry] }));
  assert.deepEqual(await run(f), { status: "already" });
  assert.equal(writes(f).length, 0);
  assert.deepEqual(f.calls.map((c) => c.path.split("?")[0]), ["/contacts/search/duplicate", "/contacts/c1"]);
});

test("a loaded contact whose email differs throws and writes nothing", async () => {
  const f = fake(existing({ email: "other@example.com", firstName: "A", lastName: "L", tags: [] }));
  await assert.rejects(run(f));
  assert.equal(writes(f).length, 0);
});

test("a one-word name creates the contact without a last name", async () => {
  const f = fake((c) => {
    if (c.path.startsWith("/contacts/search/duplicate")) return { json: { contact: null } };
    if (c.path === "/contacts/") return { status: 201, json: { contact: { id: "n1" } } };
    if (c.path.endsWith("/tags")) return { status: 201, json: {} };
  });
  await run(f, { firstName: "Cher", lastName: "", phone: null });
  const create = f.calls.find((c) => c.path === "/contacts/");
  assert.deepEqual(create?.body, {
    locationId: "loc",
    firstName: "Cher",
    email: "ada@example.com",
    source: "NYE giveaway form",
    tags: [tags.newContact],
  });
});

test("a one-word name fills an empty first name and leaves the empty last name alone", async () => {
  const f = fake(existing({ firstName: "", lastName: "", phone: "+12565550111", tags: [] }));
  await run(f, { firstName: "Cher", lastName: "" });
  const put = f.calls.find((c) => c.method === "PUT");
  assert.deepEqual(put?.body, { firstName: "Cher" });
});

test("a one-word name with both names stored writes no PUT", async () => {
  const f = fake(existing({ firstName: "Augusta", lastName: "", phone: "+12565550111", tags: [] }));
  await run(f, { firstName: "Cher", lastName: "" });
  assert.equal(f.calls.some((c) => c.method === "PUT"), false);
});
