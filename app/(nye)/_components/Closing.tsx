import Image from "next/image";
import ohpLogo from "../_assets/ohp-logo-white.svg";
import { PRICES, PRIVACY_URL } from "../event";
import { BookButton } from "./shared";
import s from "./Closing.module.css";
import u from "./shared.module.css";

/** The last ask, then the footer with the lines a careful buyer looks for. */
export function Closing() {
  return (
    <section className={s.closing}>
      <div className="bulb-row" />
      <div className={s.closingInner}>
        <h2 className={`display-m ${u.h2}`}>New year. New memories. 36 new beds for Huntsville.</h2>
        <p className={`lead ${u.lead}`}>
          Grab your plus-one. Book your room. See you at the tables.
        </p>
        <BookButton placement="closing" />
        <a href="#tickets" className={u.textLink}>
          Single tickets from {PRICES.generalAdmission}
        </a>
      </div>
      <footer className={s.footer}>
        <div className={s.footerInner}>
          <Image src={ohpLogo} alt="One House Project" className={u.ohp} />
          <p>
            New Year&apos;s Eve Casino Night is presented by One House Project, Inc., a 501(c)(3)
            public charity. All proceeds benefit One House Project.
          </p>
          <p>
            The casino games use play chips, provided and run by Huntsville Casino Parties. Chips
            have no cash value. No cash prizes. 21 and over only, with valid photo ID.
          </p>
          <p>
            Prizes are donated by sponsors. The kitchen design package is donated by Compass Design
            Studio and covers design only.
          </p>
          <p>
            Our <a href={PRIVACY_URL}>privacy notice</a> explains what we and our partners,
            including Meta, collect on this page, and how to opt out.
          </p>
        </div>
      </footer>
    </section>
  );
}
