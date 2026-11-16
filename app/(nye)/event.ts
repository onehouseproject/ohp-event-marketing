// Facts about the New Year's Eve Event that more than one file needs.

export const EVENT_NAME = "New Year's Eve Casino Night";

/**
 * The price of Stay & Play for Two, as printed. The Givebutter ticket charges
 * the same amount, and the share image (`nye/opengraph-image.png`) has it drawn in.
 */
export const STAY_AND_PLAY_PRICE = "$399";

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
