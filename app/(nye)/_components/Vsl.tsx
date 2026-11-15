"use client";

import { useState } from "react";
import { VSL } from "../event";
import styles from "./Vsl.module.css";

/**
 * The sales video. It shows our own poster and play button; the player loads
 * only when the visitor presses play, so nothing from the video host appears
 * or downloads before then.
 */
export function Vsl({ className }: { className?: string }) {
  const [playing, setPlaying] = useState(false);
  const hasVideo = VSL.youtubeId.length > 0;

  return (
    <div className={`${styles.frame} ${className ?? ""}`}>
      {playing && hasVideo ? (
        <iframe
          className={styles.player}
          src={`https://www.youtube-nocookie.com/embed/${VSL.youtubeId}?autoplay=1&rel=0&playsinline=1`}
          title="New Year's Eve Casino Night: watch the video"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          className={styles.poster}
          onClick={() => setPlaying(true)}
          aria-label={`Play the video (${VSL.length})`}
        >
          <span className={styles.play} aria-hidden="true">
            <i className="ph ph-play" />
          </span>
          <span className={`eyebrow ${styles.caption}`}>
            Watch first · {VSL.length}
            {hasVideo ? "" : " · video goes here"}
          </span>
        </button>
      )}
    </div>
  );
}
