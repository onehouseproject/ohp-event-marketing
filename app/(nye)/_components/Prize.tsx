import Image from "next/image";
import compassLockup from "../_assets/compass-lockup-horizontal-light-gold.svg";
import kitchenStudy from "../_assets/imagery/kitchen-study.jpg";
import { COMPASS_URL } from "../event";
import s from "./Prize.module.css";

// The pieces of the "what you can win" card.

/**
 * An illustration of what the prize is: a kitchen study, half painted and half still in
 * pencil, beside a floor plan and swatches. It is in Compass Design Studio's style and is
 * not a Compass drawing, so the caption calls it an illustration.
 */
export function KitchenStudy() {
  return (
    <figure className={s.study}>
      <Image
        src={kitchenStudy}
        alt="Watercolor illustration of a kitchen, half painted and half in pencil line, beside a floor plan and color swatches"
        sizes="(max-width: 640px) 100vw, 400px"
        placeholder="blur"
        className={s.studyImg}
      />
      <figcaption className={s.studyCaption}>Illustration. Yours is drawn for your kitchen.</figcaption>
    </figure>
  );
}

/**
 * The donor credit. The Compass lockup is placed exactly as supplied, with clear space
 * around it and no glow: the studio's own rules for its mark.
 */
export function CompassCredit() {
  return (
    <div className={s.compass}>
      <span className="overline">Generously donated by</span>
      <a href={COMPASS_URL} target="_blank" rel="noopener" className={s.compassLink}>
        <Image src={compassLockup} alt="Compass Design Studio" className={s.compassMark} unoptimized />
      </a>
    </div>
  );
}

/** What the kitchen design package is, in four lines. */
export function PrizeFacts() {
  return (
    <ul className={`${s.facts} tone-gold`}>
      <li>
        <i className="ph ph-compass-tool" aria-hidden="true" />
        <span>
          <strong>Design Essentials</strong>, the studio&apos;s 30-day design process for your
          kitchen.
        </span>
      </li>
      <li>
        <i className="ph ph-blueprint" aria-hidden="true" />
        <span>
          It ends with <strong>schematic plans ready for a builder to price</strong>.
        </span>
      </li>
      <li>
        <i className="ph ph-tag" aria-hidden="true" />
        <span>
          Valued at <strong>$6,000</strong>. Design only: construction and materials aren&apos;t
          part of it.
        </span>
      </li>
      <li>
        <i className="ph ph-gift" aria-hidden="true" />
        <span>One guest wins it on New Year&apos;s Eve.</span>
      </li>
    </ul>
  );
}
