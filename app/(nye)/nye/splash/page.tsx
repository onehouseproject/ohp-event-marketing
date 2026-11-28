import type { Metadata } from "next";
import Link from "next/link";
import r from "../../_components/giveaway/review.module.css";
import { SPLASHES } from "../../_components/giveaway/splashCatalog";
import s from "../page.module.css";

// The index of the five splash variants. Kept out of search: these pages are for review.

export const metadata: Metadata = {
  title: "Splash variants | One House Project",
  robots: { index: false, follow: false },
};

export default function SplashIndex() {
  return (
    <main className={s.page}>
      <div className={r.index}>
        <div className={r.indexHead}>
          <p className="eyebrow">Giveaway splash</p>
          <h1 className="display-m">Five versions of the splash</h1>
          <p className="lead">
            Each one opens over the real Event Page. All five keep the gold, &ldquo;win the
            night&rdquo; and the three prize icons, say $399 plainly and show when entries close.
            Replay, in the strip at the top, clears your entry so you can see one fresh.
          </p>
        </div>
        <ul className={r.cards}>
          {SPLASHES.map((item, index) => (
            <li key={item.slug}>
              <a href={`/nye/splash/${item.slug}`} className={`tier-card tone-gold ${r.card}`}>
                <div className="tier-head">
                  <span className={r.cardNumber}>{index + 1}</span>
                </div>
                <span className="tier-name">{item.title}</span>
                <p className="tier-desc">{item.summary}</p>
                <span className="tier-cta btn btn-secondary btn-sm">
                  Open <i className="ph ph-arrow-right" aria-hidden="true" />
                </span>
              </a>
            </li>
          ))}
        </ul>
        <ul className={r.notes}>
          <li>
            For comparison, the current splash, with the opt-ins on a panel, is still at{" "}
            <Link href="/nye/giveaway/splash">/nye/giveaway/splash</Link>.
          </li>
          <li>
            Every version keeps the fields (email, name, optional phone), the two opt-in boxes and
            the entry wording under the button. The opt-in labels and their bubble are pending
            counsel (#18).
          </li>
        </ul>
      </div>
    </main>
  );
}
