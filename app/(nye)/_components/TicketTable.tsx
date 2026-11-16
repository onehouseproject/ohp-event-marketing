import Image from "next/image";
import type { ReactNode } from "react";
import ohpLogo from "../_assets/ohp-logo-white.svg";
import { LAUNCH_LINE, PRICES } from "../event";
import { TicketLink } from "./givebutter";
import { Boost, BookButton } from "./shared";
import s from "./TicketTable.module.css";
import u from "./shared.module.css";

// Every button opens the same Givebutter ticket list: Givebutter cannot open checkout with
// one ticket already chosen. Keep the ticket names here identical to the names in Givebutter
// so a visitor finds the one they clicked.

const YES = <i className="ph ph-check-circle tone-green" aria-label="Included" />;
const NO = <i className="ph ph-minus" aria-label="Not included" />;

/** A large figure with a small caption under it. Lit, it glows in its column's tone. */
function Figure({ value, note, lit = false }: { value: string; note?: string; lit?: boolean }) {
  return (
    <span className={s.figure}>
      <Boost lit={lit}>{value}</Boost>
      {note ? <small>{note}</small> : null}
    </span>
  );
}

// One row per thing a ticket can include. Columns: Stay & Play for Two, VIP, general admission.
const ROWS: [string, ReactNode, ReactNode, ReactNode][] = [
  ["Casino tables, DJ, red carpet, photo booth and the countdown", YES, YES, YES],
  ["Eligible for prizes", YES, YES, YES],
  ["A midnight toast", YES, YES, YES],
  [
    "Starting chips",
    <Figure key="s" value="3x" note="each" lit />,
    <Figure key="v" value="2x" />,
    <Figure key="g" value="1x" />,
  ],
  [
    "Drink tickets",
    <Figure key="s" value="4" note="2 each" lit />,
    <Figure key="v" value="2" />,
    <Figure key="g" value="0" note="Pay as you go" />,
  ],
  ["Food", "Unlimited", "Unlimited", "Pay as you go"],
  ["Reserved VIP seating", YES, YES, NO],
  ["A hotel room upstairs, with breakfast for two", YES, NO, NO],
];

/** Who is selling, in the place where a visitor decides. */
function Organizer() {
  return (
    <div className={s.organizer}>
      <Image src={ohpLogo} alt="One House Project" className={s.organizerLogo} />
      <div className={s.organizerText}>
        <p>
          <strong>Presented by One House Project, Inc.</strong>, a 501(c)(3) public charity serving
          Huntsville and North Alabama.
        </p>
        <p>Secure checkout by Givebutter. Your tickets arrive by email.</p>
      </div>
    </div>
  );
}

/** "Choose your tickets": one comparison table, the room as an add-on, then the organizer. */
export function TicketTable() {
  return (
    <section className={s.section} id="tickets">
      <div className={s.inner}>
        <h2 className={`display-m ${u.h2}`}>Choose your tickets</h2>
        <div className={s.table}>
          <div className={`${s.row} ${s.head}`}>
            <span className={s.rowLabel} />
            <div className={`${s.col} ${s.lead} tone-gold`}>
              <span className={s.colName}>stay &amp; play</span>
              <span className={s.colPrice}>{PRICES.stayAndPlay}</span>
              <span className="overline">for two</span>
            </div>
            <div className={`${s.col} tone-pink`}>
              <span className={s.colName}>vip</span>
              <span className={s.colPrice}>{PRICES.vip}</span>
              <span className="overline">per person</span>
            </div>
            <div className={`${s.col} tone-blue`}>
              <span className={s.colName}>general</span>
              <span className={s.colPrice}>{PRICES.generalAdmission}</span>
              <span className="overline">per person</span>
            </div>
          </div>
          {ROWS.map(([label, stayAndPlay, vip, general]) => (
            <div key={label} className={s.row}>
              <span className={s.rowLabel}>{label}</span>
              <span className={`${s.cell} ${s.lead} tone-gold`}>{stayAndPlay}</span>
              <span className={`${s.cell} tone-pink`}>{vip}</span>
              <span className={`${s.cell} tone-blue`}>{general}</span>
            </div>
          ))}
          <div className={`${s.row} ${s.foot}`}>
            <span className={s.rowLabel}>
              Two VIP tickets alone are $396. <strong>The room adds $3.</strong> {LAUNCH_LINE}
            </span>
            <span className={`${s.cell} ${s.lead} tone-gold`}>
              <BookButton size="md" label="Book" />
            </span>
            <span className={s.cell}>
              <TicketLink className="btn btn-secondary btn-sm">Get VIP</TicketLink>
            </span>
            <span className={s.cell}>
              <TicketLink className="btn btn-secondary btn-sm">Get GA</TicketLink>
            </span>
          </div>
        </div>
        <div className={`${s.addon} tone-gold`}>
          <i className="ph ph-bed" aria-hidden="true" />
          <p>
            <strong>Have tickets and want to stay?</strong> Add a Hotel Room for{" "}
            {PRICES.hotelRoom}: one room upstairs, room tax and breakfast for two included.
          </p>
          <TicketLink className="btn btn-secondary btn-sm">Add a Hotel Room</TicketLink>
        </div>
        <Organizer />
      </div>
    </section>
  );
}
