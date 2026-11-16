import type { ReactNode } from "react";
import { COMPASS_URL, PRICES } from "../event";
import { PackageCard } from "./PackageCard";
import { CompassCredit, KitchenStudy, PrizeFacts } from "./Prize";
import { VenueBanner, VenuePhoto } from "./Venue";
import s from "./RunOfShow.module.css";
import u from "./shared.module.css";

type Tag = "Stay & Play" | "VIP" | "Every ticket";

const TONE: Record<Tag, string> = {
  "Stay & Play": "tone-gold",
  VIP: "tone-pink",
  "Every ticket": "tone-blue",
};

/** One stop on the timeline: when, what, which tickets include it, and a picture if there is one. */
function Stop({
  time,
  title,
  tags,
  photo,
  children,
}: {
  time: string;
  title: string;
  tags: Tag[];
  photo?: ReactNode;
  children: ReactNode;
}) {
  return (
    <li className={s.stop}>
      <div className={s.stopText}>
        <span className={`eyebrow ${s.time}`}>{time}</span>
        <h3 className="h3">{title}</h3>
        <p>{children}</p>
        <div className={s.tags}>
          {tags.map((tag) => (
            <span key={tag} className={`badge ${TONE[tag]}`}>
              {tag}
            </span>
          ))}
        </div>
      </div>
      {photo}
    </li>
  );
}

/**
 * The night told by the clock. The venue opens it, the prize is one of its stops, and on a
 * wide screen the package stays beside it the whole way down. On a phone the package
 * follows the timeline and the sticky bar keeps the button in reach.
 */
export function RunOfShow() {
  return (
    <section className={s.show}>
      <div className={s.body}>
        <div className={s.main}>
          <p className="eyebrow">The run of show</p>
          <h2 className={`display-m ${u.h2}`}>One night, start to finish, under one roof</h2>
          <VenueBanner />
          <ol className={s.timeline}>
            <Stop
              time="From 3 PM"
              title="check in upstairs"
              tags={["Stay & Play"]}
              photo={<VenuePhoto which="room" sizes="320px" />}
            >
              Your room is booked for you. Park, drop your bags and get ready at the hotel.
            </Stop>
            <Stop
              time="8 PM"
              title="doors and the red carpet"
              tags={["Every ticket"]}
              photo={<VenuePhoto which="redCarpet" sizes="320px" />}
            >
              Take the elevator down. Dress up, walk the carpet and get the photo to prove it.
            </Stop>
            <Stop
              time="All night"
              title="the tables"
              tags={["Every ticket", "VIP"]}
              photo={<VenuePhoto which="tables" sizes="320px" />}
            >
              Every ticket starts you with play chips, and the dealers from Huntsville Casino
              Parties teach you as you go. VIP guests start with more chips and a reserved seat.
            </Stop>
            <Stop
              time="All night"
              title="food, drinks and the dj"
              tags={["VIP", "Every ticket"]}
              photo={<VenuePhoto which="danceFloor" sizes="320px" />}
            >
              VIP guests get unlimited food and 2 drink tickets each. General admission is pay as
              you go, and the bar takes cards. The music runs to the final countdown.
            </Stop>

            <li className={`${s.stop} ${s.giftStop} tone-gold`} id="win">
              <div className={s.giftHead}>
                <span className={`eyebrow ${s.time}`}>On the night</span>
                <h3 className="h3">what you can win</h3>
              </div>
              <div className={s.giftGrid}>
                <KitchenStudy />
                <div className={s.giftText}>
                  <p className={`stat-value ${s.amount}`}>$6,000</p>
                  <p className={s.giftTitle}>A kitchen design package, drawn for your home.</p>
                </div>
              </div>
              <PrizeFacts />
              <div className={s.giftDonor}>
                <CompassCredit />
                <a href={COMPASS_URL} target="_blank" rel="noopener" className="btn btn-secondary">
                  Visit Compass <i className="ph ph-arrow-up-right" aria-hidden="true" />
                </a>
              </div>
            </li>

            <Stop time="Midnight" title="the countdown" tags={["Every ticket"]}>
              A midnight toast, on us, in a room full of people who came to celebrate and to give.
            </Stop>
            <Stop time="1 AM" title="the elevator home" tags={["Stay & Play"]}>
              No designated driver and no 1 AM ride home. Head upstairs whenever you&apos;re done.
            </Stop>
            <Stop
              time="New Year's morning"
              title="sleep in, then breakfast"
              tags={["Stay & Play"]}
              photo={<VenuePhoto which="breakfast" sizes="320px" />}
            >
              Nobody wakes you at 6. Breakfast for two is included at the hotel, and checkout is
              11 AM.
            </Stop>
          </ol>
          <div className={s.railMobile}>
            <PackageCard />
          </div>
        </div>

        <aside className={s.rail}>
          <p className={`h4 tone-gold ${s.railTitle}`}>stay &amp; play for two</p>
          <PackageCard compact />
          <a href="#tickets" className={u.textLink}>
            Just the party? Single tickets from {PRICES.generalAdmission}
          </a>
        </aside>
      </div>
    </section>
  );
}
