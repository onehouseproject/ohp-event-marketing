"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import room from "../../_assets/imagery/room.jpg";
import { GIVEAWAY, PRICES } from "../../event";
import { TicketLink } from "../givebutter";
import { ProofRows } from "../shared";
import u from "../shared.module.css";
import { GiveawayDialog, useDialog } from "./GiveawayDialog";
import { GiveawayForm, PrizeList } from "./GiveawayForm";
import { hasEntry, useDaysToDraw, useEntry } from "./state";
import o from "./options.module.css";

// The six ways onto the page. Each one uses the shared form, so they differ only in where the
// giveaway sits and when it shows.

/** The heading block a dialog opens with, when a button elsewhere opened it. */
function DialogIntro() {
  return (
    <div className={o.intro}>
      <span className="badge badge-solid">Free to enter</span>
      <h2 className={`display-s ${o.introTitle}`}>Win New Year&apos;s Eve for two</h2>
      <p className={o.introText}>
        One winner gets Stay &amp; Play for Two, free. We draw {GIVEAWAY.drawDate}.
      </p>
      <PrizeList />
    </div>
  );
}

/** A button that opens the form in a dialog. `className` styles the button. */
function DialogEntry({ className, label = "Enter free" }: { className: string; label?: string }) {
  const dialog = useDialog();
  return (
    <>
      <button type="button" className={className} onClick={dialog.open}>
        <i className="ph ph-gift" aria-hidden="true" /> {label}
      </button>
      <GiveawayDialog dialogRef={dialog.ref} label="Win Stay & Play for Two">
        <DialogIntro />
        <GiveawayForm onBeforeBook={dialog.close} />
      </GiveawayDialog>
    </>
  );
}

/** "You're entered", for the small places that show a button before the visitor enters. */
function EnteredLine({ name }: { name: string }) {
  return (
    <p className={`${o.enteredLine} tone-green`}>
      <i className="ph ph-check-circle" aria-hidden="true" /> You&apos;re entered. Good luck, {name}.
    </p>
  );
}

// ---------- 1. Splash on arrival ----------

/** Opens over the page half a second after it loads, unless this visitor has entered. */
export function Splash() {
  const dialog = useDialog();
  const entry = useEntry();
  const { open } = dialog;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!hasEntry()) open();
    }, 500);
    return () => window.clearTimeout(timer);
  }, [open]);

  return (
    <GiveawayDialog dialogRef={dialog.ref} label="Win Stay & Play for Two" fullOnPhone>
      <div className={o.splashPhoto}>
        <Image src={room} alt="" sizes="520px" placeholder="blur" className={o.splashImg} />
      </div>
      <div className={o.splashHead}>
        <span className="badge badge-solid">Free to enter</span>
        {/* Once entered, the lit "you're in" takes this sign's place: two lit signs at most */}
        {entry === null ? (
          <p className={`neon-sign tone-gold ${o.splashSign}`}>win the night</p>
        ) : null}
        <h2 className={`display-s ${o.splashTitle}`}>New Year&apos;s Eve for two, on us</h2>
        <p className={o.introText}>
          Enter to win Stay &amp; Play for Two. We draw the winner {GIVEAWAY.drawDate}.
        </p>
        <PrizeList className={o.splashPrize} />
      </div>
      <GiveawayForm onBeforeBook={dialog.close} />
      {entry === null ? (
        <button type="button" className={o.skip} onClick={dialog.close}>
          No thanks, show me the party
        </button>
      ) : null}
    </GiveawayDialog>
  );
}

// ---------- 2. A section of the page ----------

/** The line in the hero's offer that points down to the section. */
export function InlineHeroNote() {
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
export function InlineSection() {
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
            <span className={`badge badge-solid ${o.photoBadge}`}>Free to enter</span>
          </div>
          <p className="eyebrow">The giveaway · Drawing {GIVEAWAY.drawDateShort}</p>
          <h2 className={`display-m ${u.h2}`}>Or win the whole night, free</h2>
          <p className={`lead ${u.lead}`}>
            We&apos;re giving away one Stay &amp; Play for Two: <strong>two VIP tickets, a hotel
            room upstairs and breakfast the next morning</strong>. Leave your name and number, and
            we draw the winner {GIVEAWAY.drawDate}.
          </p>
          <p className={o.refund}>
            <i className="ph ph-arrow-counter-clockwise" aria-hidden="true" />
            <span>
              <strong>Already booked?</strong> Enter anyway. If you win, we refund you.
            </span>
          </p>
        </div>
        <div className={o.formCard}>
          <h3 className={`h3 ${o.formCardTitle}`}>enter the drawing</h3>
          <GiveawayForm />
        </div>
      </div>
    </section>
  );
}

// ---------- 3. Beside Stay & Play ----------

/**
 * The tear-off stub at the foot of the Stay & Play card. `inline` opens the form inside the
 * stub, for the card under the timeline. `dialog` is one short row that opens the form over
 * the page, for the rail, which stays in view and so must stay shorter than the screen.
 */
export function PackageStub({ mode }: { mode: "inline" | "dialog" }) {
  const entry = useEntry();
  const [open, setOpen] = useState(false);

  if (mode === "dialog") {
    return (
      <div className={`${o.stub} ${o.stubRow}`}>
        <p className={o.stubHead}>
          <i className="ph ph-gift" aria-hidden="true" />
          <span>
            <strong>Or win it free.</strong>
            <br />
            Drawing {GIVEAWAY.drawDateShort}.
          </span>
        </p>
        {entry !== null ? (
          <span className={`${o.enteredLine} tone-green`}>
            <i className="ph ph-check-circle" aria-hidden="true" /> Entered
          </span>
        ) : (
          <DialogEntry className="btn btn-secondary btn-sm" label="Enter" />
        )}
      </div>
    );
  }

  return (
    <div className={o.stub}>
      <p className={o.stubHead}>
        <i className="ph ph-gift" aria-hidden="true" />
        <span>
          <strong>Or win this package free.</strong> We draw one winner {GIVEAWAY.drawDate}.
        </span>
      </p>
      {entry !== null ? (
        <EnteredLine name={entry} />
      ) : open ? (
        <GiveawayForm />
      ) : (
        <button type="button" className="btn btn-secondary btn-block" onClick={() => setOpen(true)}>
          <i className="ph ph-gift" aria-hidden="true" /> Enter free
        </button>
      )}
    </div>
  );
}

/** The bar between the ticket table and the Hotel Room add-on. */
export function TableBar() {
  const entry = useEntry();
  return (
    <div className={`${o.tableBar} tone-gold`}>
      <i className="ph ph-gift" aria-hidden="true" />
      <p>
        <strong>Win Stay &amp; Play for Two, free.</strong> Leave your name and number, and we draw
        one winner {GIVEAWAY.drawDate}.
      </p>
      {entry !== null ? (
        <EnteredLine name={entry} />
      ) : (
        <DialogEntry className="btn btn-gold btn-sm" />
      )}
    </div>
  );
}

// ---------- 4. Giveaway-first hero ----------

/** Replaces the hero's offer: the giveaway card, then booking as the second choice. */
export function HeroOffer() {
  const entry = useEntry();
  return (
    <div className={o.heroOffer}>
      <div className={`${o.heroCard} tone-gold`}>
        <p className={o.heroDeal}>
          <span className={`display-s ${o.heroFree}`}>Free</span>
          <s>{PRICES.stayAndPlay}</s>
          <span className="eyebrow">Stay &amp; Play for Two</span>
        </p>
        <PrizeList className={o.heroPrize} />
        <GiveawayForm />
      </div>
      {entry === null ? (
        <div className={o.heroBook}>
          <p>
            <strong>Rather not wait for the drawing?</strong> Book now. If you win, we refund you.
          </p>
          <span data-book="" className={u.bookBlock}>
            <TicketLink className="btn btn-secondary btn-block" placement="hero">
              <i className="ph ph-ticket" aria-hidden="true" /> Book for two · {PRICES.stayAndPlay}
            </TicketLink>
          </span>
        </div>
      ) : null}
      <ProofRows />
      <a href="#tickets" className={u.textLink}>
        Just the party? Single tickets from {PRICES.generalAdmission}
      </a>
    </div>
  );
}

// ---------- 5. Peek-up after the hero ----------

type PeekState = "waiting" | "peek" | "open" | "docked";

/**
 * Waits until the hero has scrolled away, then rises from the bottom edge as a short card.
 * Enter free opens the form in the card; closing it leaves a tab on the right edge.
 */
export function Peek() {
  const entry = useEntry();
  const [state, setState] = useState<PeekState>("waiting");

  useEffect(() => {
    const hero = document.querySelector("main > section");
    if (!hero) return;
    const observer = new IntersectionObserver(([item]) => {
      if (!item.isIntersecting && item.boundingClientRect.top < 0) {
        setState((current) => (current === "waiting" ? "peek" : current));
        observer.disconnect();
      }
    });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  if (state === "waiting") return null;
  if (entry !== null && state !== "open") return null;

  if (state === "docked") {
    return (
      <button type="button" className={`${o.tab} tone-gold`} onClick={() => setState("open")}>
        <i className="ph ph-gift" aria-hidden="true" />
        <span>win it free</span>
      </button>
    );
  }

  return (
    <aside
      className={`${o.peek} ${state === "open" ? o.peekOpen : ""} tone-gold`}
      aria-label="Stay & Play giveaway"
    >
      <button
        type="button"
        className={o.peekClose}
        aria-label="Close"
        onClick={() => setState("docked")}
      >
        <i className="ph ph-x" aria-hidden="true" />
      </button>
      <div className={o.peekHead}>
        <span className="badge badge-solid">Free to enter</span>
        <h3 className={`h3 ${o.peekTitle}`}>win new year&apos;s eve for two</h3>
        <p className={o.introText}>
          Two VIP tickets and a hotel room upstairs. We draw {GIVEAWAY.drawDate}.
        </p>
      </div>
      {state === "open" ? (
        <GiveawayForm />
      ) : (
        <button type="button" className="btn btn-gold btn-block" onClick={() => setState("open")}>
          <i className="ph ph-gift" aria-hidden="true" /> Enter free
        </button>
      )}
    </aside>
  );
}

// ---------- 6. Marquee announcement ----------

function drawCount(days: number | null) {
  if (days === null) return `Drawing ${GIVEAWAY.drawDateShort}`;
  if (days > 1) return `Drawing in ${days} days`;
  if (days === 1) return "Drawing tomorrow";
  if (days === 0) return "Drawing today";
  return "Drawing closed";
}

/** The strip above the hero: the facts between two bulb rows, the count and the button. */
export function Marquee() {
  const entry = useEntry();
  const days = useDaysToDraw();
  return (
    <div className={`${o.marquee} tone-gold`}>
      <div className="bulb-row" />
      <div className={o.marqueeInner}>
        <p className={`marquee ${o.marqueeText}`}>
          <span className={o.marqueeLong}>
            Free giveaway <span aria-hidden="true">·</span> Stay &amp; Play for two
          </span>
          <span className={o.marqueeShort}>Win Stay &amp; Play free</span>
        </p>
        <span className={`badge ${o.marqueeCount}`}>
          <i className="ph ph-hourglass-medium" aria-hidden="true" /> {drawCount(days)}
        </span>
        {entry !== null ? (
          <span className={`${o.marqueeEntered} tone-green`}>
            <i className="ph ph-check-circle" aria-hidden="true" /> You&apos;re entered
          </span>
        ) : (
          <DialogEntry className="btn btn-gold btn-sm" />
        )}
      </div>
      <div className="bulb-row is-reverse" />
    </div>
  );
}
