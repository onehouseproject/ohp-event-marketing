import type { ReactNode } from "react";
import { PRICES } from "../event";
import { Boost, BookButton, LimitedOffer } from "./shared";
import s from "./PackageCard.module.css";

// What Stay & Play for Two holds, line by line. The first two rows carry the prices of the
// same things bought on their own: two VIP tickets, and the Hotel Room ticket.
const ROWS: [string, ReactNode, string | null][] = [
  ["Two VIP tickets", "$396", "New Year's Eve Casino Night, Thursday, December 31, 8 PM to 1 AM."],
  [
    "A hotel room upstairs",
    PRICES.hotelRoom,
    "The night of December 31, room tax included. Breakfast for two the next morning. We book it.",
  ],
  ["Starting chips", <Boost key="chips">3x</Boost>, "Triple the chips of general admission. VIP gets 2x."],
  ["Drink tickets", <Boost key="drinks" lit={false}>4</Boost>, "Two each."],
  ["Unlimited food", "Included", null],
  ["Reserved VIP seating", "Included", null],
  ["A midnight toast", "Included", null],
];

/** The package, priced line by line, with its button. `compact` drops the notes, for the rail. */
export function PackageCard({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`${s.stack} tone-gold ${compact ? s.stackCompact : ""}`}>
      <ul className={s.stackRows}>
        {ROWS.map(([name, value, note]) => (
          <li key={name}>
            <span className={s.stackName}>{name}</span>
            <span className={s.stackValue}>{value}</span>
            {note && !compact ? <span className={s.stackNote}>{note}</span> : null}
          </li>
        ))}
      </ul>
      <p className={s.stackSeparate}>
        <span>Bought separately</span>
        <s>$646</s>
      </p>
      <div className={s.stackTotal}>
        <span className={`display-l ${s.stackPrice}`}>{PRICES.stayAndPlay}</span>
        <span className="eyebrow">Total for two adults</span>
      </div>
      <p className={s.stackMath}>
        Two VIP tickets alone are $396. <strong>The room adds $3.</strong>
      </p>
      <LimitedOffer />
      <BookButton
        block
        size={compact ? "md" : "lg"}
        label="Book for two"
        placement={compact ? "rail" : "package"}
      />
    </div>
  );
}
