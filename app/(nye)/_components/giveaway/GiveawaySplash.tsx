"use client";

import Image from "next/image";
import room from "../../_assets/imagery/room.jpg";
import { GIVEAWAY, GIVEAWAY_BUYER_LINE } from "../../event";
import { GiveawayDialog } from "./GiveawayDialog";
import { GiveawayForm } from "./GiveawayForm";
import { openSplash, useSplash } from "./splashOpen";
import { useEntry, usePhase } from "./state";
import s from "./GiveawaySplash.module.css";

// The Stay & Play giveaway on /nye: a splash over the page, and a line in the hero's offer that
// opens it again. The design is splash variant 3, "$399, free", from the prototype branch
// (issue #21). The window is read in the browser; the server enforces the same cutoff.

const PRIZES = [
  ["ticket", "Two VIP tickets"],
  ["bed", "A hotel room upstairs"],
  ["coffee", "Breakfast for two"],
] as const;

const CLOSED_NOTE = {
  closed: "Entries are closed. We draw the winner at 2 p.m. CT today.",
  drawn: "We drew the winner on December 4. Thanks to everyone who entered.",
} as const;

/**
 * The line in the hero's offer that opens the splash. It carries `id="giveaway"`, so
 * /nye#giveaway lands on it if scripts fail. It hides once entries close.
 */
export function SplashHeroNote() {
  const entry = useEntry();
  const phase = usePhase();
  if (phase !== "open") return null;
  return (
    <a
      id="giveaway"
      href="#giveaway"
      className={`${s.heroNote} tone-gold`}
      onClick={(event) => {
        event.preventDefault();
        openSplash();
      }}
    >
      <i className="ph ph-gift" aria-hidden="true" />
      {entry === null ? (
        <span>
          Or <strong>win it free</strong>. {GIVEAWAY.closesShort}
        </span>
      ) : (
        <span>
          <strong>You&apos;re entered</strong> in the giveaway.
        </span>
      )}
    </a>
  );
}

/**
 * The splash: the room, "win the night", the prize's value struck through beside a lit "free",
 * the three prizes, then the closing time, the line for ticket holders and the form. After the
 * cutoff, a closed or drawn note takes the form's place.
 */
export function GiveawaySplash() {
  const dialog = useSplash();
  const entry = useEntry();
  const phase = usePhase();

  return (
    <GiveawayDialog dialogRef={dialog.ref} label="Win a free New Year's Eve for two">
      <div className={s.photo}>
        <Image src={room} alt="" sizes="520px" placeholder="blur" className={s.photoImg} />
      </div>
      <div className={s.head}>
        {/* Once entered, the lit "you're in" takes this sign's place: two lit signs at most */}
        {entry === null ? <p className={`neon-sign tone-gold ${s.sign}`}>win the night</p> : null}
        <p className={s.deal}>
          <s className={s.dealWas}>{GIVEAWAY.prizeValue}</s>
          <span className={`neon-sign tone-gold ${s.dealFree}`}>free</span>
        </p>
        <p className={s.dealWhat}>New Year&apos;s Eve for two in Huntsville</p>
        <ul className={s.tiles}>
          {PRIZES.map(([icon, label]) => (
            <li key={icon}>
              <i className={`ph ph-${icon}`} aria-hidden="true" />
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </div>

      {phase === "open" ? (
        <>
          {entry === null ? (
            <div className={s.when}>
              <p className={`badge ${s.chip}`}>
                <i className="ph ph-hourglass-medium" aria-hidden="true" /> {GIVEAWAY.closesChip}
              </p>
              <p className={s.buyers}>{GIVEAWAY_BUYER_LINE}</p>
            </div>
          ) : null}
          <GiveawayForm onBeforeBook={dialog.close} />
          {entry === null ? (
            <button type="button" className={s.skip} onClick={dialog.close}>
              No thanks, show me the party
            </button>
          ) : null}
        </>
      ) : (
        <p className={s.closed} role="status">
          {CLOSED_NOTE[phase]}
        </p>
      )}
    </GiveawayDialog>
  );
}
