import Image from "next/image";
import type { ReactNode } from "react";
import ohpLogo from "../_assets/ohp-logo-white.svg";
import glyph from "../_assets/symbol-neon-outline.svg";
import { TicketLink } from "./givebutter";
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
}: {
  size?: "md" | "lg";
  block?: boolean;
  label?: string;
}) {
  return (
    <span data-book="" className={block ? u.bookBlock : u.book}>
      <TicketLink
        className={`btn btn-primary ${size === "lg" ? "btn-lg" : ""} ${block ? "btn-block" : ""}`}
      >
        <i className="ph ph-ticket" aria-hidden="true" /> {label}
      </TicketLink>
    </span>
  );
}

/**
 * The line under a booking button that says what the button opens. Givebutter cannot open
 * checkout with a ticket already chosen, so the visitor is told which one to pick.
 */
export function NextStep() {
  return (
    <p className={u.nextStep}>
      Checkout opens right here. Choose &quot;Stay &amp; Play for Two&quot;.
    </p>
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
