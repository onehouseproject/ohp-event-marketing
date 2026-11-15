"use client";

import MuxPlayer from "@mux/mux-player-react";
import { EVENT_NAME, VSL } from "../event";
import styles from "./Vsl.module.css";

/**
 * The sales video, hosted on Mux. Mux picks the quality each visitor's
 * connection can hold. Until a playback id is set, a still placeholder holds
 * the video's place.
 */
export function Vsl({ className }: { className?: string }) {
  return (
    <div className={`${styles.frame} ${className ?? ""}`}>
      {VSL.muxPlaybackId ? (
        <MuxPlayer
          className={styles.player}
          playbackId={VSL.muxPlaybackId}
          videoTitle={EVENT_NAME}
          metadata={{ video_title: EVENT_NAME }}
          thumbnailTime={VSL.posterAtSeconds}
          preload="metadata"
          disableCookies
        />
      ) : (
        <div className={styles.placeholder}>
          <span className={styles.play} aria-hidden="true">
            <i className="ph ph-play" />
          </span>
          <span className={`eyebrow ${styles.caption}`}>Video goes here · {VSL.length}</span>
        </div>
      )}
    </div>
  );
}
