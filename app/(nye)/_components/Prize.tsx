import Image from "next/image";
import compassLockup from "../_assets/compass-lockup-horizontal-light-gold.svg";
import { COMPASS_URL } from "../event";
import s from "./Prize.module.css";

// The pieces of the "what you can win" card.

/**
 * An illustration of what the prize is: a schematic kitchen plan and elevation.
 * It stands in until real imagery exists. It is not a Compass Design Studio drawing.
 */
export function KitchenPlan() {
  return (
    <figure className={`${s.plan} tone-gold`}>
      <svg viewBox="0 0 800 440" role="img" aria-label="Illustration of a schematic kitchen plan">
        {/* Elevation */}
        <g transform="translate(18 44) scale(.62)">
          <path className={s.ln} d="M40 380H760" />
          <rect className={s.fill} x="80" y="130" width="300" height="90" />
          <rect className={s.fill} x="460" y="130" width="160" height="90" />
          <path className={s.ln} d="M155 130v90M230 130v90M305 130v90M540 130v90" />
          <path className={s.hi} d="M380 220h80l-12-30h-56zM404 190v-60h32v60" />
          <path className={s.thin} d="M80 241h300M80 262h300M460 241h160M460 262h160" />
          <rect className={s.hi} x="76" y="284" width="548" height="7" />
          <rect className={s.fill} x="80" y="291" width="300" height="89" />
          <rect className={s.fill} x="460" y="291" width="160" height="89" />
          <path className={s.ln} d="M140 291v89M200 291v89M260 291v89M320 291v89M540 291v89" />
          <rect className={s.fill} x="380" y="291" width="80" height="89" />
          <rect className={s.ln} x="392" y="318" width="56" height="42" rx="4" />
          <path className={s.ln} d="M396 304h6M412 304h6M428 304h6M444 304h6" />
          <path className={s.hi} d="M222 284v-26q0-12 12-12h10" />
          <rect className={s.fill} x="632" y="150" width="90" height="230" />
          <path className={s.ln} d="M632 250h90M644 190v36M644 270v60" />
        </g>
        {/* Plan */}
        <rect className={s.wall} x="530" y="96" width="222" height="222" />
        <rect className={s.fill} x="530" y="96" width="222" height="34" />
        <rect className={s.fill} x="530" y="130" width="34" height="140" />
        <rect className={s.ln} x="537" y="176" width="20" height="40" rx="5" />
        <rect className={s.ln} x="622" y="100" width="44" height="26" />
        <circle className={s.thin} cx="633" cy="108" r="4" />
        <circle className={s.thin} cx="655" cy="108" r="4" />
        <circle className={s.thin} cx="633" cy="119" r="4" />
        <circle className={s.thin} cx="655" cy="119" r="4" />
        <rect className={s.ln} x="706" y="100" width="40" height="28" />
        <rect className={s.hi} x="612" y="188" width="110" height="50" rx="3" />
        <circle className={s.ln} cx="634" cy="254" r="8" />
        <circle className={s.ln} cx="667" cy="254" r="8" />
        <circle className={s.ln} cx="700" cy="254" r="8" />
        <path className={s.thin} d="M530 336h222M530 330v12M752 330v12M512 96v222M506 96h12M506 318h12" />
        <text className={s.label} x="40" y="34">
          ELEVATION
        </text>
        <text className={s.label} x="530" y="76">
          PLAN
        </text>
        <path className={s.thin} d="M40 392h712" />
        <text className={s.label} x="40" y="418">
          KITCHEN · SCHEMATIC DESIGN
        </text>
        <text className={s.labelEnd} x="752" y="418">
          READY FOR A BUILDER TO PRICE
        </text>
      </svg>
      <figcaption className={s.planCaption}>Illustration. Yours is drawn for your kitchen.</figcaption>
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
