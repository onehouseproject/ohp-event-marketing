// Facts about the New Year's Eve Event that more than one file needs.

export const EVENT_NAME = "New Year's Eve Casino Night";

/** The Givebutter campaign that sells this Event's tickets. */
export const GIVEBUTTER = {
  accountId: "BWLFFUVs4GTgmfRz",
  campaignCode: "RE4TYY",
  campaignUrl: "https://givebutter.com/onehousenye",
} as const;

/**
 * The sales video. `youtubeId` stays empty until the video is uploaded;
 * the video block then shows its poster without a player.
 */
export const VSL = {
  youtubeId: "",
  length: "4 min 35 sec",
} as const;
