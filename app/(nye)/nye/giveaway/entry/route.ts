import { checkBotId } from "botid/server";
import { GIVEAWAY } from "../../../event";
import { enterGiveaway } from "./highlevel";

// POST /nye/giveaway/entry: the giveaway form's only endpoint. It writes to HighLevel with a
// server-only token. Every response is one of the JSON shapes GiveawayForm reads.

type Field = "firstName" | "lastName" | "email" | "phone";
type Body = Record<string, unknown>;

function json(body: unknown, status: number) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

const CONTROL = /[\u0000-\u001f\u007f-\u009f]/;
const EMAIL = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

function validate(body: Body) {
  const errors: Partial<Record<Field, string>> = {};
  const firstName = text(body.firstName);
  const lastName = text(body.lastName);
  const email = text(body.email).toLowerCase();
  const rawPhone = text(body.phone);
  const callOptIn = body.callOptIn === true;

  if (firstName.length < 1 || firstName.length > 80 || CONTROL.test(firstName)) {
    errors.firstName = "Enter your first name (up to 80 characters).";
  }
  if (lastName.length < 1 || lastName.length > 80 || CONTROL.test(lastName)) {
    errors.lastName = "Enter your last name (up to 80 characters).";
  }
  if (email.length > 254 || !EMAIL.test(email)) {
    errors.email = "Enter a valid email address, like name@example.com.";
  }

  let phone: string | null = null;
  if (rawPhone !== "") {
    const digits = rawPhone.replace(/\D/g, "");
    if (digits.length === 10 || (digits.length === 11 && digits.startsWith("1"))) {
      phone = `+1${digits.slice(-10)}`;
    } else {
      errors.phone = "Enter a 10-digit US phone number.";
    }
  } else if (callOptIn) {
    errors.phone = "Add a phone number so we can call you, or untick the call box.";
  }

  return {
    errors,
    entry: {
      firstName,
      lastName,
      email,
      phone,
      emailOptIn: body.emailOptIn === true,
      callOptIn,
    },
  };
}

export async function POST(request: Request) {
  // BotID only really checks on a Vercel deployment. Anywhere else, including `next start`
  // on a laptop, it reports a human instead of failing for lack of Vercel's token.
  const verification = await checkBotId({
    developmentOptions: { isDevelopment: process.env.VERCEL !== "1" },
  });
  if (verification.isBot) return json({ status: "blocked" }, 403);

  let body: Body;
  try {
    const parsed: unknown = await request.json();
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) throw new Error();
    body = parsed as Body;
  } catch {
    return json({ status: "error" }, 400);
  }

  // The honeypot: a bot filled the hidden field. Look successful, write nothing.
  if (text(body.company) !== "") return json({ status: "entered", isNew: false }, 200);

  if (Date.now() >= Date.parse(GIVEAWAY.closesAt)) return json({ status: "closed" }, 409);

  const { errors, entry } = validate(body);
  if (Object.keys(errors).length > 0) {
    return json({ status: "invalid", fieldErrors: errors }, 400);
  }

  const token = process.env.HIGHLEVEL_PRIVATE_INTEGRATION_TOKEN;
  const locationId = process.env.HIGHLEVEL_LOCATION_ID;
  if (!token || !locationId) {
    console.error("Giveaway entry: HIGHLEVEL_PRIVATE_INTEGRATION_TOKEN or HIGHLEVEL_LOCATION_ID is not set");
    return json({ status: "error" }, 500);
  }

  try {
    const result = await enterGiveaway({ token, locationId, fetch, tags: GIVEAWAY.tags, entry });
    return json(result, 200);
  } catch (error) {
    // The message names the endpoint and status only, never a name, email or phone.
    console.error("Giveaway entry failed:", error instanceof Error ? error.message : "unknown error");
    return json({ status: "error" }, 502);
  }
}
