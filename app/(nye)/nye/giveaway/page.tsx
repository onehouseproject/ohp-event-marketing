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
            Option 1, the splash, was chosen on November 27. Its form asks for email, then name,
            then an optional phone, with two optional boxes for email news and ticket calls.
          </li>
          <li>
            The opt-in labels, their supporting line and its bubble are pending counsel (#18). The
            entry wording under the button is the giveaway memo&apos;s draft. Official Rules opens
            the draft rules in that memo until /giveaway-rules ships.
          </li>
          <li>
            {GIVEAWAY.closesLine} Draft PR #29 does the real work: HighLevel, the cutoff and the
            Meta Lead.
          </li>
        </ul>
      </div>
    </main>
  );
}
