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
 * The Stay & Play giveaway: one free package, drawn before the night, for visitors who leave a
 * name and number. Owner decisions, 2026-11-27: the drawing is Friday, December 4, and a winner
 * who already booked Stay & Play gets a refund. The entry cutoff time is not decided.
 * `drawDay` drives the days-left count, read in Huntsville's time zone.
 */
export const GIVEAWAY = {
  drawDate: "Friday, December 4",
  drawDateShort: "Fri, Dec 4",
  drawDay: "2026-12-04",
  timeZone: "America/Chicago",
} as const;

/** The giveaway's terms, under every entry form. Placeholder wording until counsel reviews it. */
export const GIVEAWAY_TERMS =
  "No purchase necessary. 21 and over, one entry per person. If the winner already booked Stay & Play, we refund it.";

/** Consent to call and text, under every submit button. Placeholder wording until counsel reviews it. */
export const GIVEAWAY_CONSENT =
  "By entering, you agree that One House Project may call and text you at this number about the giveaway and this event. Message and data rates may apply. Reply STOP to opt out.";
