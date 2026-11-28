"use client";

import Image from "next/image";
import room from "../../_assets/imagery/room.jpg";
import { GIVEAWAY } from "../../event";
import u from "../shared.module.css";
import { GiveawayForm } from "./GiveawayForm";
import { usePhase } from "./state";
import o from "./GiveawaySection.module.css";

// The Stay & Play giveaway on /nye: a line in the hero's offer, and a section under the hero.
// The window is read in the browser. Before noon CT on the closing day the form shows, then a
// closed note, then, from the drawing, a thanks. The server enforces the same cutoff.

/** The line in the hero's offer that points down to the section. It hides once entries close. */
export function InlineHeroNote() {
  if (usePhase() !== "open") return null;
  return (
    <a href="#giveaway" className={`${o.heroNote} tone-gold`}>
      <i className="ph ph-gift" aria-hidden="true" />
      <span>
        Or <strong>win it free</strong>. We draw {GIVEAWAY.drawDateShort}.
      </span>
      <i className="ph ph-arrow-down" aria-hidden="true" />
    </a>
  );
}

/** The section under the hero: the story beside the form. */
export function GiveawaySection() {
  const phase = usePhase();
  return (
    <section id="giveaway" className={`${u.section} ${o.inline} tone-gold`}>
      <div className={`${u.inner} ${o.inlineInner}`}>
        <div className={o.inlineStory}>
          <div className={o.inlinePhoto}>
            <Image
              src={room}
              alt="A hotel room in the evening, a jacket over the chair and gold heels by the armchair"
              sizes="(max-width: 900px) 100vw, 600px"
              placeholder="blur"
              className={o.inlineImg}
            />
            {phase === "open" ? (
              <span className={`badge badge-solid ${o.photoBadge}`}>Free to enter</span>
            ) : null}
          </div>
          <p className="eyebrow">The giveaway · Drawing {GIVEAWAY.drawDateShort}</p>
          <h2 className={`display-m ${u.h2}`}>Or win the whole night, free</h2>
          <p className={`lead ${u.lead}`}>
            We&apos;re giving away one Stay &amp; Play for Two:{" "}
            <strong>two VIP tickets, a hotel room upstairs and breakfast the next morning</strong>.
            Leave your name and email, and we draw the winner {GIVEAWAY.drawDate}.
          </p>
          <p className={o.refund}>
            <i className="ph ph-arrow-counter-clockwise" aria-hidden="true" />
            <span>
              <strong>Already booked?</strong> Enter anyway. If you win, we reimburse your package.
            </span>
          </p>
        </div>
        <div className={o.formCard}>
          {phase === "open" ? (
            <>
              <h3 className={`h3 ${o.formCardTitle}`}>enter the drawing</h3>
              <GiveawayForm />
            </>
          ) : (
            <p className={o.closed} role="status">
              {phase === "closed"
                ? "Entries are closed. We draw the winner at 2 p.m. CT today."
                : "We drew the winner on December 4. Thanks to everyone who entered."}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
