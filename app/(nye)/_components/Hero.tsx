import Image from "next/image";
import glyph from "../_assets/symbol-neon-outline.svg";
import ohpLogo from "../_assets/ohp-logo-white.svg";
import { EVENT_NAME, STAY_AND_PLAY_PRICE } from "../event";
import { TicketLink } from "./givebutter";
import { Vsl } from "./Vsl";
import s from "./Hero.module.css";

/** The first screen: a headline, the video, and one button under it. */
export function Hero() {
  return (
    <section className={s.hero}>
      <div className={s.wrap}>
        <div className={s.topbar}>
          <div className={s.lockup}>
            <Image src={glyph} alt="" className={s.glyph} priority />
            <span className={`neon-sign tone-pink is-flicker ${s.sign}`}>casino night</span>
          </div>
          <div className={s.presented}>
            <span className="overline">Presented by</span>
            <Image src={ohpLogo} alt="One House Project" className={s.ohp} priority />
          </div>
        </div>
        <div className={s.stack}>
          <p className="eyebrow">{EVENT_NAME}</p>
          <h1 className={`display-l ${s.headline}`}>{"Your New Year's Eve plans, handled."}</h1>
          <Vsl className={s.video} />
          <div className={s.cta}>
            <TicketLink className="btn btn-primary btn-lg">
              <i className="ph ph-ticket" aria-hidden="true" /> Reserve our night out
            </TicketLink>
            <p className={s.offer}>
              <span className={`display-s ${s.price}`}>{STAY_AND_PLAY_PRICE}</span>
              <span>
                Stay &amp; Play for Two
                <br />2 VIP admissions and a hotel room upstairs
              </span>
            </p>
          </div>
          <p className={`marquee ${s.facts}`}>Dec 31 · 8 PM to 1 AM · Huntsville · 21+</p>
        </div>
      </div>
    </section>
  );
}
