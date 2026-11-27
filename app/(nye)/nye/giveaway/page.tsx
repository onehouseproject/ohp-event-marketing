import type { Metadata } from "next";
import { OPTIONS } from "../../_components/giveaway/catalog";
import r from "../../_components/giveaway/review.module.css";
import { GIVEAWAY } from "../../event";
import s from "../page.module.css";

// The index of the six giveaway prototypes. Kept out of search: these pages are for review.

export const metadata: Metadata = {
  title: "Giveaway prototypes | One House Project",
  robots: { index: false, follow: false },
};

export default function GiveawayIndex() {
  return (
    <main className={s.page}>
      <div className={r.index}>
        <div className={r.indexHead}>
          <p className="eyebrow">Giveaway prototypes</p>
          <h1 className="display-m">Six ways to add the giveaway</h1>
          <p className="lead">
            Each one opens the real Event Page with one option in place. Entering stores your first
            name in this browser and sends nothing. Replay, in the strip at the top of each page,
            clears it so you can see the option fresh.
          </p>
        </div>
        <ul className={r.cards}>
          {OPTIONS.map((option, index) => (
            <li key={option.slug}>
              <a href={`/nye/giveaway/${option.slug}`} className={`tier-card tone-gold ${r.card}`}>
                <div className="tier-head">
                  <span className={r.cardNumber}>{index + 1}</span>
                  <span className="badge">{option.origin}</span>
                </div>
                <span className="tier-name">{option.title}</span>
                <p className="tier-desc">{option.summary}</p>
                <span className="tier-cta btn btn-secondary btn-sm">
                  Open <i className="ph ph-arrow-right" aria-hidden="true" />
                </span>
              </a>
            </li>
          ))}
        </ul>
        <ul className={r.notes}>
          <li>
            The drawing is {GIVEAWAY.drawDate}. The time entries close isn&apos;t set yet.
          </li>
          <li>
            The consent line, the terms line and the official rules are placeholder wording for
            counsel.
          </li>
          <li>
            Once you pick an option, the form gets wired to HighLevel and the Meta pixel&apos;s Lead
            event, and the other five are removed.
          </li>
        </ul>
      </div>
    </main>
  );
}
