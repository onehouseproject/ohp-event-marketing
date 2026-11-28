// Facts about the New Year's Eve Event that more than one file needs.

export const EVENT_NAME = "New Year's Eve Casino Night";

/**
 * Ticket prices as printed. The Givebutter tickets charge the same amounts, and the share
 * image (`nye/opengraph-image.png`) has the Stay & Play price drawn in.
 *
 * Three figures in the copy follow from these and are typed where they are used:
 * "$396" (two VIP tickets), "$646" (two VIP tickets and a Hotel Room bought separately)
 * and "$3" (what the room adds to two VIP tickets). Change them together.
 */
export const PRICES = {
  stayAndPlay: "$399",
  vip: "$198",
  generalAdmission: "$99",
  hotelRoom: "$250",
} as const;

/** The privacy notice. The footer and the giveaway form (#21) link it. */
export const PRIVACY_URL = "/privacy";

/** The limit on Stay & Play for Two, as one sentence. */
export const LAUNCH_LINE = "Launch offer: 50 packages, through December 15.";

/** The same limit spelled out, for the info bubble beside "Limited time offer." */
export const LAUNCH_LIMIT_NOTE = "Only 50 packages are for sale, through December 15.";

/** Where the Event happens. From the hotel's page on hilton.com, read 2026-11-15. */
export const VENUE = {
  name: "Hilton Garden Inn Huntsville South/Redstone Arsenal",
  shortName: "Hilton Garden Inn Huntsville South",
  street: "301 Boulevard South SW",
  city: "Huntsville, AL 35802",
  hotelUrl:
    "https://www.hilton.com/en/hotels/hsvsogi-hilton-garden-inn-huntsville-south-redstone-arsenal/",
  directionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=Hilton+Garden+Inn+Huntsville+South%2FRedstone+Arsenal%2C+301+Boulevard+South+SW%2C+Huntsville%2C+AL+35802",
  mapEmbedUrl:
    "https://www.google.com/maps?q=Hilton+Garden+Inn+Huntsville+South%2FRedstone+Arsenal%2C+301+Boulevard+South+SW%2C+Huntsville%2C+AL+35802&z=13&output=embed",
} as const;

/** The studio that donates the kitchen design package. */
export const COMPASS_URL = "https://compass-design.studio";

/**
 * What the prize's $6,000 value covers, for the info bubble on the prize card and the
 * "What can I win?" answer.
 */
export const PRIZE_VALUE_NOTE =
  "The $6,000 covers the design work. Construction and the materials you pick aren't included.";

/** The Givebutter campaign that sells this Event's tickets. */
export const GIVEBUTTER = {
  accountId: "BWLFFUVs4GTgmfRz",
  campaignCode: "RE4TYY",
  campaignUrl: "https://givebutter.com/onehousenye",
} as const;

/**
 * The sales video, hosted on Mux. `muxPlaybackId` is the asset's Playback ID
 * (not its Asset ID). While it is empty, the video block shows a placeholder.
 * `posterAtSeconds` picks the frame shown before the visitor presses play.
 */
export const VSL: { muxPlaybackId: string; posterAtSeconds: number; length: string } = {
  muxPlaybackId: "zgF01v7Z6Dszss1Ab01CDpRbyYQSnbGwEBasns6dNLgZ4",
  posterAtSeconds: 40,
  length: "4 min 35 sec",
};

/**
 * The Stay & Play giveaway: one free package, drawn before the night. Owner decisions,
 * 2026-11-27: the server rejects every entry at or after `closesAt` (noon Central, Friday,
 * December 4), and the drawing is at `drawAt`. A winner who already booked is reimbursed.
 * The tags are the drawing pool and the marketing flags in HighLevel (issue #21).
 */
export const GIVEAWAY = {
  drawDate: "Friday, December 4",
  drawDateShort: "Fri, Dec 4",
  /** The closing time on the splash's chip. */
  closesChip: "Entries close Dec 4 at noon CT",
  /** The closing time on the hero's line. */
  closesShort: "Entries close noon CT, Dec 4.",
  /**
   * The prize's approximate retail value as the rules state it, struck through on the splash.
   * Kept apart from `PRICES.stayAndPlay` so the splash matches the rules whatever the ticket
   * price does. Confirm it against the final rules before publishing.
   */
  prizeValue: "$399",
  closesAt: "2026-12-04T12:00:00-06:00",
  drawAt: "2026-12-04T14:00:00-06:00",
  timeZone: "America/Chicago",
  tags: {
    /** Every accepted entry. This is the drawing pool. */
    entry: "nye-2026-giveaway-entry",
    /** Only when the form created the contact. Marketing sends skip it unless the contact also has `emailNews`. */
    newContact: "nye-2026-giveaway-new-contact",
    /** The email box was ticked. */
    emailNews: "nye-2026-event-news",
    /** The call box was ticked and the stored phone is the number the entrant typed. */
    callOk: "nye-2026-call-ok",
  },
} as const;

/** The official rules. */
export const GIVEAWAY_RULES_URL = "/giveaway-rules";

/** The entry wording under the submit button. "Official Rules" and "Privacy Notice" are links. */
export const GIVEAWAY_ENTRY_WORDING = {
  before:
    "No purchase or donation is necessary to enter or win. Buying a ticket or making a donation does not improve your chances. We'll use your email to confirm your entry and contact you if selected. By entering, you agree to the ",
  rules: "Official Rules",
  between: " and acknowledge our ",
  privacy: "Privacy Notice",
  after: ".",
} as const;

/** Pending counsel (#18): the label of the email opt-in box. */
export const GIVEAWAY_EMAIL_OPT_IN_LABEL = "Email me about Casino Night promotions and news.";

/** Pending counsel (#18): the label of the call opt-in box. It needs a phone number. */
export const GIVEAWAY_CALL_OPT_IN_LABEL = "Call me about tickets before they sell out.";

/** Pending counsel (#18): the info bubble on the "Optional" label above the two boxes. */
export const GIVEAWAY_OPT_IN_NOTE =
  "Tick the first box and we'll email you Casino Night news and offers. Tick the second and we may call the number you gave about tickets. Everyone who enters gets an entry confirmation by email, and the winner gets a winner email. Unsubscribe from any email with its link, or ask us to stop calling at any time. Ticking a box, or leaving it empty, has no effect on your entry or your odds.";

/** The line for ticket holders, under the splash's closing chip. */
export const GIVEAWAY_BUYER_LINE = "Already booked? Enter anyway. If you win, we reimburse your package.";
