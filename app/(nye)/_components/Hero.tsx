import { PRICES } from "../event";
import { BookButton, LimitedOffer, ProofRows, TopBar } from "./shared";
import { Vsl } from "./Vsl";
import s from "./Hero.module.css";
import u from "./shared.module.css";

/**
 * The first screen. The video is the centerpiece, with the prize riding under it,
 * then the offer and the one button.
 */
export function Hero() {
  return (
    <section className={s.hero}>
      <div className={s.heroInner}>
        <TopBar />
        <div className={s.heroStack}>
          <p className="eyebrow">Thu, Dec 31 · Huntsville · 21+</p>
          <h1 className={`display-l ${s.headline}`}>{"Your New Year's Eve plans, handled."}</h1>
          <div className={s.stage}>
            <Vsl />
            <a href="#win" className={`${s.ribbon} tone-gold`}>
              <i className="ph ph-gift" aria-hidden="true" />
              <span>
                Win a <strong>$6,000 kitchen design package</strong>
              </span>
              <span className={s.ribbonMore}>
                See what you can win <i className="ph ph-arrow-down" aria-hidden="true" />
              </span>
            </a>
          </div>
          <div className={s.offer}>
            <p className={s.priceRow}>
              <span className={`display-s ${s.price}`}>{PRICES.stayAndPlay}</span>
              <span className="eyebrow">for two</span>
              <LimitedOffer bubble="end" />
            </p>
            <BookButton block />
            <ProofRows />
            <a href="#tickets" className={u.textLink}>
              Just the party? Single tickets from {PRICES.generalAdmission}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
