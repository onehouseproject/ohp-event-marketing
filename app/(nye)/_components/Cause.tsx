import Image from "next/image";
import housing from "../_assets/program-affordable-housing-on-dark.svg";
import events from "../_assets/program-community-events-on-dark.svg";
import crisis from "../_assets/program-crisis-intervention-on-dark.svg";
import direct from "../_assets/program-direct-assistance-on-dark.svg";
import s from "./Cause.module.css";
import u from "./shared.module.css";

const PROGRAMS = [
  [crisis, "Crisis housing"],
  [housing, "Affordable housing"],
  [direct, "Direct assistance"],
  [events, "Community events"],
] as const;

/** Where the money goes: the number of beds, as large as the screen allows, then the story. */
export function Cause() {
  return (
    <section className={`${s.cause} tone-green`}>
      <div className={s.causeInner}>
        <p className={`stat-value ${s.causeNumber}`}>36</p>
        <div className={s.causeText}>
          <p className="eyebrow">Where the money goes</p>
          <h2 className={`display-m ${u.h2}`}>Every chip builds a home</h2>
          <p className={`lead ${u.lead}`}>
            This night raises money for something you&apos;ll be able to drive past. All proceeds
            benefit One House Project, and the money raised goes toward a{" "}
            <strong>36-bed workforce housing facility in southwest Huntsville</strong>.
          </p>
          <p className={`lead ${u.lead}`}>
            It will offer more than a bed: people will find both a job and a path to housing, so
            they can get back on their feet and stay there.
          </p>
          <ul className={s.marks}>
            {PROGRAMS.map(([src, label]) => (
              <li key={label}>
                <Image src={src} alt="" className={s.mark} />
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
