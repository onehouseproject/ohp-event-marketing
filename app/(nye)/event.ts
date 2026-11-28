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
 * The Stay & Play giveaway: one free package, drawn before the night, for visitors who leave
 * an email and name. Owner decisions, 2026-11-27: entries close at noon Central on Friday,
 * December 4, the drawing follows at 2 p.m., and a winner who already booked Stay & Play gets
 * a refund. `drawDay` drives the days-left count, read in Huntsville's time zone.
 */
export const GIVEAWAY = {
  drawDate: "Friday, December 4",
  drawDateShort: "Fri, Dec 4",
  closesLine: "Entries close at noon CT on Friday, December 4.",
  closesShort: "Entries close noon CT, Dec 4.",
  closesChip: "Entries close Dec 4 at noon CT",
  closesAt: "2026-12-04T12:00:00-06:00",
  drawDay: "2026-12-04",
  timeZone: "America/Chicago",
} as const;

// The wording below matches draft PR #29 (issue #21), so the prototype shows what will ship.

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

/** Pending counsel (#18): the supporting line under the two boxes. */
export const GIVEAWAY_OPT_IN_SUPPORT = "Your choice, your inbox. No spam, and it won't change your odds.";

/** Pending counsel (#18): the info bubble on the supporting line. */
export const GIVEAWAY_OPT_IN_NOTE =
  "Tick the first box and we'll email you Casino Night news and offers. Tick the second and we may call the number you gave about tickets. Everyone who enters gets an entry confirmation by email, and the winner gets a winner email. Unsubscribe from any email with its link, or ask us to stop calling at any time. Ticking a box, or leaving it empty, has no effect on your entry or your odds.";
