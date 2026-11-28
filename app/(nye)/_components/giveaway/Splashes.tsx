"use client";

import Image from "next/image";
import room from "../../_assets/imagery/room.jpg";
import { GIVEAWAY, PRICES } from "../../event";
import { GiveawayDialog } from "./GiveawayDialog";
import { ExtrasStep, GiveawayForm, PrizeList } from "./GiveawayForm";
import { useSplash } from "./splashOpen";
import { useEntry, useMinutesToClose } from "./state";
import x from "./splashes.module.css";

// Five versions of the splash, built from the same parts so they differ only in what leads.
// Every one keeps the gold, "win the night" and the three prize icons, says $399 plainly
// instead of leaning on the name Stay & Play, and puts the closing time where it is seen.

const LABEL = "Win a free New Year's Eve for two";

// ---------- Shared parts ----------

/** The room photo across the top, bleeding to the dialog's edges. */
function Photo({ className = "" }: { className?: string }) {
  return (
    <div className={`${x.photo} ${className}`}>
      <Image src={room} alt="" sizes="520px" placeholder="blur" className={x.photoImg} />
    </div>
  );
}

/** "win the night", lit. Hidden once entered, when the lit "you're in" takes its place. */
function Sign({ className = "" }: { className?: string }) {
  const entry = useEntry();
  if (entry !== null) return null;
  return <p className={`neon-sign tone-gold ${x.sign} ${className}`}>win the night</p>;
}

/** The headline that says what the prize is worth. */
function ValueTitle() {
  return (
    <h2 className={`display-s ${x.title}`}>
      A <span className={x.gold}>{PRICES.stayAndPlay}</span> night for two, on us
    </h2>
  );
}

/** The closing time, as a chip that sits right above the form. Hidden once entered. */
function ClosesChip({ className = "" }: { className?: string }) {
  const entry = useEntry();
  if (entry !== null) return null;
  return (
    <p className={`badge ${x.chip} ${className}`}>
      <i className="ph ph-hourglass-medium" aria-hidden="true" /> {GIVEAWAY.closesChip}
    </p>
  );
}

/** The quiet way past the splash. Hidden once entered. */
function Skip({ onClick }: { onClick: () => void }) {
  const entry = useEntry();
  if (entry !== null) return null;
  return (
    <button type="button" className={x.skip} onClick={onClick}>
      No thanks, show me the party
    </button>
  );
}

/** Days, hours and minutes to the cutoff, as three counters. */
function Countdown() {
  const minutes = useMinutesToClose();
  const parts =
    minutes === null
      ? null
      : [
          [Math.floor(minutes / 1440), "days"],
          [Math.floor((minutes % 1440) / 60), "hours"],
          [minutes % 60, "min"],
        ];
  return (
    <div className={x.countdown}>
      <p className={`eyebrow ${x.countdownLabel}`}>Entries close in</p>
      <div className={x.counters} role="timer" aria-live="off">
        {(parts ?? [["–", "days"], ["–", "hours"], ["–", "min"]]).map(([value, unit]) => (
          <span key={unit} className={x.counter}>
            <span className={x.counterValue}>
              {typeof value === "number" ? String(value).padStart(2, "0") : value}
            </span>
            <span className={x.counterUnit}>{unit}</span>
          </span>
        ))}
      </div>
      <p className={x.countdownWhen}>Friday, December 4 at noon CT</p>
    </div>
  );
}

// ---------- 1. Stacked, simplified ----------

export function SplashStacked() {
  const dialog = useSplash();
  return (
    <GiveawayDialog dialogRef={dialog.ref} label={LABEL} fullOnPhone compact>
      <Photo />
      <div className={x.head}>
        <span className="badge badge-solid">Free to enter</span>
        <Sign />
        <ValueTitle />
        <PrizeList className={x.prize} />
      </div>
      <ClosesChip />
      <GiveawayForm optIns="light" onBeforeBook={dialog.close} />
      <Skip onClick={dialog.close} />
    </GiveawayDialog>
  );
}

// ---------- 2. Two steps ----------

export function SplashTwoStep() {
  const dialog = useSplash();
  return (
    <GiveawayDialog dialogRef={dialog.ref} label={LABEL} fullOnPhone compact>
      <Photo />
      <div className={x.head}>
        <span className="badge badge-solid">Free to enter</span>
        <Sign />
        <ValueTitle />
        <PrizeList className={x.prize} />
      </div>
      <ClosesChip />
      <GiveawayForm
        optIns="none"
        phone={false}
        onBeforeBook={dialog.close}
        afterEntry={(name) => <ExtrasStep name={name} onBeforeBook={dialog.close} />}
      />
      <Skip onClick={dialog.close} />
    </GiveawayDialog>
  );
}

// ---------- 3. $399, free ----------

const TILES = [
  ["ticket", "Two VIP tickets"],
  ["bed", "A hotel room upstairs"],
  ["coffee", "Breakfast for two"],
] as const;

export function SplashPriceTag() {
  const dialog = useSplash();
  return (
    <GiveawayDialog dialogRef={dialog.ref} label={LABEL} fullOnPhone compact>
      <Photo className={x.photoShort} />
      <div className={`${x.head} ${x.headPlain}`}>
        <Sign className={x.signSmall} />
        <p className={x.deal}>
          <s className={x.dealWas}>{PRICES.stayAndPlay}</s>
          <span className={`neon-sign tone-gold ${x.dealFree}`}>free</span>
        </p>
        <p className={x.dealWhat}>New Year&apos;s Eve for two in Huntsville</p>
        <ul className={`${x.tiles} tone-gold`}>
          {TILES.map(([icon, label]) => (
            <li key={icon}>
              <i className={`ph ph-${icon}`} aria-hidden="true" />
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </div>
      <ClosesChip />
      <GiveawayForm optIns="light" onBeforeBook={dialog.close} />
      <Skip onClick={dialog.close} />
    </GiveawayDialog>
  );
}

// ---------- 4. Countdown first ----------

export function SplashCountdown() {
  const dialog = useSplash();
  return (
    <GiveawayDialog dialogRef={dialog.ref} label={LABEL} fullOnPhone compact>
      <div className={`${x.marquee} tone-gold`}>
        <div className="bulb-row" />
        <Countdown />
        <div className="bulb-row is-reverse" />
      </div>
      <div className={x.head}>
        <Sign />
        <ValueTitle />
        <PrizeList className={x.prize} />
      </div>
      <GiveawayForm optIns="light" onBeforeBook={dialog.close} />
      <Skip onClick={dialog.close} />
    </GiveawayDialog>
  );
}

// ---------- 5. Admission ticket ----------

export function SplashTicket() {
  const dialog = useSplash();
  return (
    <GiveawayDialog dialogRef={dialog.ref} label={LABEL} fullOnPhone compact>
      <div className={`${x.ticket} tone-gold`}>
        <div className={x.ticketTop}>
          <Photo className={x.ticketPhoto} />
          <p className={`marquee ${x.admit}`}>Admit two · Dec 31</p>
          <Sign />
          <p className={x.ticketValue}>
            <span className={x.gold}>{PRICES.stayAndPlay} value</span>, yours free
          </p>
          <PrizeList className={x.prize} />
        </div>
        <div className={x.tear}>
          <ClosesChip className={x.tearChip} />
        </div>
        <div className={x.ticketBottom}>
          <GiveawayForm optIns="light" onBeforeBook={dialog.close} />
        </div>
      </div>
      <Skip onClick={dialog.close} />
    </GiveawayDialog>
  );
}
