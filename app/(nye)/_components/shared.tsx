import Image from "next/image";
import { type ReactNode, useId } from "react";
import ohpLogo from "../_assets/ohp-logo-white.svg";
import glyph from "../_assets/symbol-neon-outline.svg";
import { LAUNCH_LIMIT_NOTE } from "../event";
import { TicketLink, type TicketPlacement } from "./givebutter";
import u from "./shared.module.css";

// Pieces more than one section uses.

/** The event lockup and the parent credit. */
export function TopBar() {
  return (
    <div className={u.topbar}>
      <div className={u.lockup}>
        <Image src={glyph} alt="" className={u.glyph} priority />
        <span className={`neon-sign tone-pink is-flicker ${u.sign}`}>casino night</span>
      </div>
      <div className={u.presented}>
        <span className={`overline ${u.presentedBy}`}>Presented by</span>
        <Image src={ohpLogo} alt="One House Project" className={u.ohp} priority />
      </div>
    </div>
  );
}

/**
 * The primary booking button. It carries `data-book` so the sticky bar can tell when one
 * is on screen and step aside.
 */
export function BookButton({
  size = "lg",
  block = false,
  label = "Book Stay & Play for Two",
  placement,
}: {
  size?: "md" | "lg";
  block?: boolean;
  label?: string;
  placement: TicketPlacement;
}) {
  return (
    <span data-book="" className={block ? u.bookBlock : u.book}>
      <TicketLink
        placement={placement}
        className={`btn btn-primary ${size === "lg" ? "btn-lg" : ""} ${block ? "btn-block" : ""}`}
      >
        <i className="ph ph-ticket" aria-hidden="true" /> {label}
      </TicketLink>
    </span>
  );
}

/**
 * A short line with an info icon, and a bubble that opens when the line is hovered, focused
 * or tapped. `bubble` places it: "span" fills the width of the row the line sits in, and
 * "end" hangs it from the icon, growing leftward, for a line that ends a centered row.
 * A `quiet` line takes the look of the text around it; otherwise it is bold, in the tone.
 * `className` reaches the outer span, for a tone or for sizing it in its row.
 */
export function InfoLine({
  children,
  note,
  bubble = "span",
  quiet = false,
  className = "",
}: {
  children: ReactNode;
  note: ReactNode;
  bubble?: "span" | "end";
  quiet?: boolean;
  className?: string;
}) {
  const noteId = useId();
  return (
    <span
      className={`${u.info} ${bubble === "end" ? u.infoEnd : u.infoSpan} ${quiet ? u.infoQuiet : ""} ${className}`}
    >
      <button type="button" className={u.infoButton} aria-describedby={noteId}>
        <span>{children}</span>
        <i className="ph ph-info" aria-hidden="true" />
      </button>
      <span role="tooltip" id={noteId} className={u.infoNote}>
        {note}
      </span>
    </span>
  );
}

/**
 * "Limited time offer." with a bubble that gives the limit: spanning the package card, or
 * hung from the icon in the hero.
 */
export function LimitedOffer({ bubble = "span" }: { bubble?: "span" | "end" }) {
  return (
    <InfoLine note={LAUNCH_LIMIT_NOTE} bubble={bubble} className="tone-gold">
      Limited time offer.
    </InfoLine>
  );
}

/** Who benefits, and how the games work. */
export function ProofRows() {
  return (
    <ul className={u.proof}>
      <li>
        <i className="ph ph-heart tone-pink" aria-hidden="true" />
        All proceeds benefit One House Project, a local Huntsville nonprofit.
      </li>
      <li>
        <i className="ph ph-spade tone-blue" aria-hidden="true" />
        Play chips only. Tables and dealers by Huntsville Casino Parties.
      </li>
    </ul>
  );
}

/** A figure meant to catch the eye. Lit, it glows in the tone of its surroundings. */
export function Boost({ children, lit = true }: { children: ReactNode; lit?: boolean }) {
  return <span className={`${u.boost} ${lit ? u.boostLit : ""}`}>{children}</span>;
}
