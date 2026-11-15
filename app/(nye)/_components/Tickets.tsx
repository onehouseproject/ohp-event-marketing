import { TicketLink } from "./givebutter";
import shell from "./Sections.module.css";
import s from "./Tickets.module.css";

// Every button opens the same Givebutter ticket list: Givebutter cannot open
// checkout with one ticket already chosen. Keep these names identical to the
// ticket names in Givebutter so a visitor finds the one they clicked.

/** The three ways to come, side by side, each with its own button. */
export function Tickets() {
  return (
    <section className={shell.section} id="tickets">
      <div className={shell.inner}>
        <div className={shell.heading}>
          <i className={`ph ph-ticket tone-blue ${shell.icon}`} aria-hidden="true" />
          <h2 className={`display-m ${shell.h2}`}>Choose your tickets</h2>
        </div>
        <div className={s.grid}>
          <div className="tier-card tone-gold is-lit">
            <div className="tier-head">
              <h3 className="tier-name">stay &amp; play for two</h3>
              <span className="badge tone-gold">Launch offer</span>
            </div>
            <div className="tier-price">$299</div>
            <p className="tier-desc">Total for two adults. Room tax included.</p>
            <ul className="tier-perks">
              <li>
                <i className="ph ph-check" aria-hidden="true" /> 2 VIP admissions
              </li>
              <li>
                <i className="ph ph-check" aria-hidden="true" /> Unlimited food &amp; drinks
              </li>
              <li>
                <i className="ph ph-check" aria-hidden="true" /> Reserved VIP seating
              </li>
              <li>
                <i className="ph ph-check" aria-hidden="true" /> A bigger stack of casino chips
              </li>
              <li>
                <i className="ph ph-check" aria-hidden="true" /> One king room upstairs. We book it.
              </li>
            </ul>
            <div className="tier-cta">
              <TicketLink className="btn btn-primary btn-block">
                <i className="ph ph-ticket" aria-hidden="true" /> Reserve our night out
              </TicketLink>
            </div>
          </div>

          <div className="tier-card tone-pink">
            <div className="tier-head">
              <h3 className="tier-name">vip admission</h3>
            </div>
            <div className="tier-price">$198</div>
            <p className="tier-desc">
              Per person. Unlimited food &amp; drinks, reserved VIP seating, a bigger chip stack and
              the full night: casino tables, DJ, red carpet and the midnight countdown.
            </p>
            <div className="tier-cta">
              <TicketLink className="btn btn-secondary btn-block">Get VIP tickets</TicketLink>
            </div>
          </div>

          <div className="tier-card tone-blue">
            <div className="tier-head">
              <h3 className="tier-name">general admission</h3>
            </div>
            <div className="tier-price">$99</div>
            <p className="tier-desc">
              Per person. Casino tables, DJ, red carpet, photo booth and the midnight countdown.
              Cash bar, with food available for purchase.
            </p>
            <div className="tier-cta">
              <TicketLink className="btn btn-secondary btn-block">Get tickets</TicketLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
