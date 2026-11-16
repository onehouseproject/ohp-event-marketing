import Image from "next/image";
import glyph from "../_assets/symbol-neon-outline.svg";
import ohpLogo from "../_assets/ohp-logo-white.svg";
import { EVENT_NAME, STAY_AND_PLAY_PRICE } from "../event";
import { TicketLink } from "./givebutter";
import s from "./Sections.module.css";

// The sections under the hero, ported from prototype 3c in its launch state.

function Check() {
  return <i className={`ph ph-check tone-gold ${s.check}`} aria-hidden="true" />;
}

/** What the night is, with when and where. */
export function Intro() {
  return (
    <section className={s.section}>
      <div className={s.inner}>
        <div className={s.two}>
          <div className={s.column}>
            <h2 className={`display-l ${s.h2Large}`}>Ring in 2027 at the tables.</h2>
            <p className={`lead ${s.lead}`}>
              Casino games, a DJ, a red-carpet entrance and a midnight countdown, with a room
              waiting upstairs so nobody has to drive home. One night. One booking. And every chip
              helps build a home.
            </p>
          </div>
          <ul className={`${s.card} ${s.details}`}>
            <li>
              <i className={`ph ph-calendar-blank tone-pink ${s.detailIcon}`} aria-hidden="true" />
              <div>
                <div className={s.detailTitle}>Thursday, December 31</div>
                <div className={s.detailText}>8 PM – 1 AM</div>
              </div>
            </li>
            <li>
              <i className={`ph ph-map-pin tone-blue ${s.detailIcon}`} aria-hidden="true" />
              <div>
                <div className={s.detailTitle}>
                  Hilton Garden Inn Huntsville South/Redstone Arsenal
                </div>
                <div className={s.detailText}>301 Boulevard S SW, Huntsville, AL</div>
              </div>
            </li>
            <li>
              <i
                className={`ph ph-identification-card tone-gold ${s.detailIcon}`}
                aria-hidden="true"
              />
              <div>
                <div className={s.detailTitle}>21+</div>
                <div className={s.detailText}>Bring a valid ID.</div>
              </div>
            </li>
          </ul>
        </div>
        <div className="alert" role="note">
          <i className="ph ph-info alert-icon" aria-hidden="true" />
          <div>
            <p className="alert-title">first access</p>
            <p className="alert-text">
              <strong>May golf supporters get first dibs on Stay &amp; Play packages.</strong>{" "}
              Thanks for teeing this one up.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/** The lead offer in full. */
export function StayAndPlay() {
  return (
    <section className={s.section}>
      <div className={`${s.inner} ${s.two}`}>
        <div className={s.column}>
          <i className={`ph ph-champagne tone-gold ${s.icon}`} aria-hidden="true" />
          <h2 className={`display-m ${s.h2}`}>Stay &amp; Play for Two: {STAY_AND_PLAY_PRICE}</h2>
          <p className={`lead ${s.lead}`}>
            <strong>{"The easiest New Year's Eve plan in Huntsville."}</strong> Food, drinks, the
            party and the hotel, all in one checkout.
          </p>
          <ul className={s.perks}>
            <li>
              <Check />
              <span>
                <strong>2 VIP admissions</strong> to {EVENT_NAME}
              </span>
            </li>
            <li>
              <Check />
              <span>
                <strong>Unlimited food</strong>
              </span>
            </li>
            <li>
              <Check />
              <span>
                <strong>4 drink tickets</strong>, 2 each
              </span>
            </li>
            <li>
              <Check />
              <span>
                <strong>Reserved VIP seating</strong>
              </span>
            </li>
            <li>
              <Check />
              <span>
                <strong>A bigger stack of casino chips</strong> to start the night
              </span>
            </li>
            <li>
              <Check />
              <span>
                <strong>A hotel room</strong> at Hilton Garden Inn, room tax included. We book it.
                You just check in.
              </span>
            </li>
          </ul>
        </div>
        <div className={`${s.card} ${s.offerCard} tone-gold`}>
          <div className={s.offerPrice}>
            <span className={`display-xl ${s.bigPrice}`}>{STAY_AND_PLAY_PRICE}</span>
            <span className="eyebrow">Total for two adults</span>
          </div>
          <hr className={s.rule} />
          <p className={s.offerText}>
            Bring your partner, your best friend or your favorite plus-one.
          </p>
          <p className={`${s.offerText} ${s.strong}`}>
            Launch packages available until they are all booked.
          </p>
          <TicketLink className="btn btn-primary btn-lg btn-block">
            <i className="ph ph-ticket" aria-hidden="true" /> Reserve our night out
          </TicketLink>
        </div>
      </div>
    </section>
  );
}

const WAITING = [
  {
    icon: "poker-chip",
    tone: "pink",
    title: "casino tables",
    text: "Play money games with real bragging rights. Never played? One of our experts will teach you.",
  },
  {
    icon: "camera",
    tone: "blue",
    title: "red carpet & photo booth",
    text: "Dress to impress and get the photo to prove it.",
  },
  {
    icon: "music-notes",
    tone: "gold",
    title: "dj & dancing",
    text: "Music from the first hand to the final countdown.",
  },
  {
    icon: "fork-knife",
    tone: "green",
    title: "food & drinks",
    text: "VIP guests get unlimited food and 2 drink tickets each. General admission guests have a cash bar, with food available for purchase.",
  },
  {
    icon: "champagne",
    tone: "pink",
    title: "midnight countdown",
    text: "Ring in 2027 in a room full of people who came to celebrate and to give.",
  },
  {
    icon: "bed",
    tone: "blue",
    title: "your room upstairs",
    text: "No designated driver, no 1 AM rideshare surge and no leaving early.",
  },
] as const;

/** What happens on the night, as six cards. */
export function WhatsWaiting() {
  return (
    <section className={s.section}>
      <div className={s.inner}>
        <div className={s.heading}>
          <i className={`ph ph-dice-five tone-pink ${s.icon}`} aria-hidden="true" />
          <h2 className={`display-m ${s.h2}`}>{"What's waiting for you"}</h2>
        </div>
        <div className={s.cards}>
          {WAITING.map((item) => (
            <div key={item.title} className={`${s.card} ${s.feature}`}>
              <i
                className={`ph ph-${item.icon} tone-${item.tone} ${s.featureIcon}`}
                aria-hidden="true"
              />
              <h3 className="h4">{item.title}</h3>
              <p className={s.featureText}>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** The kitchen design giveaway. */
export function Giveaway() {
  return (
    <section className={s.section}>
      <div className={`${s.inner} ${s.two}`}>
        <div className={s.column}>
          <i className={`ph ph-house-line tone-orange ${s.icon}`} aria-hidden="true" />
          <h2 className={`display-m ${s.h2}`}>{"We're giving away a $6,000 kitchen design"}</h2>
        </div>
        <p className={`lead ${s.lead} ${s.beside}`}>
          {"Start the new year with a plan for the kitchen you've been imagining. "}
          <strong>Compass Design Studio</strong>
          {
            " is donating its Design Essentials package, a $6,000 professional kitchen design that ends with plans ready for a builder to price, and we're giving it away during the celebration."
          }
        </p>
      </div>
    </section>
  );
}

/** Where the money goes. */
export function Cause() {
  return (
    <section className={`${s.section} ${s.glow}`}>
      <div className={`${s.inner} ${s.narrow}`}>
        <i className={`ph ph-heart tone-pink ${s.icon}`} aria-hidden="true" />
        <h2 className={`display-l ${s.h2Large}`}>Every chip builds a home</h2>
        <p className={`lead ${s.lead}`}>
          {
            "This isn't just a party. One House Project is raising money to build a 36-bed workforce housing facility in southwest Huntsville. It will offer more than a bed: people will find both "
          }
          <strong>a job and a path to housing</strong>, so they can get back on their feet and stay
          there.
        </p>
        <p className={`lead ${s.lead}`}>
          {"It's built for the neighbors who most often fall through the cracks: "}
          <strong>veterans, women, families and seniors.</strong>
        </p>
        <p className={`lead ${s.lead} ${s.strong}`}>
          Every ticket, every package and every donation brings that housing closer to opening its
          doors.
        </p>
        <p className={s.footnote}>
          One House Project is a 501(c)(3) nonprofit serving Huntsville and North Alabama. Uniting
          services. Rebuilding lives.
        </p>
      </div>
    </section>
  );
}

const QUESTIONS = [
  ["When is it?", "Thursday, December 31, 8 PM to 1 AM."],
  [
    "Where?",
    "Hilton Garden Inn Huntsville South/Redstone Arsenal, 301 Boulevard S SW, Huntsville, AL 35802.",
  ],
  ["Who can come?", "Adults 21 and over. Bring a valid ID."],
  [
    "What should I wear?",
    "Whatever makes you feel like a high roller. Glam is encouraged but not required.",
  ],
  [
    "I've never played casino games. Is that okay?",
    "Absolutely. It's all play money, so there's nothing to lose. The casino dealers will teach you as the games go.",
  ],
  [
    "Is a hotel room included?",
    "With Stay & Play for Two, yes: one hotel room, room tax included, booked by us. VIP and GA tickets don't include a room.",
  ],
  ["Do we have to be a couple?", "Nope. Stay & Play is for any two adults."],
  [
    "What about the kids?",
    "This is a 21+ event and childcare isn't included. It's New Year's Eve, so book your sitter early.",
  ],
  [
    "Can I support without attending?",
    "Yes. Tap Get Tickets and choose \"I'd just like to donate.\"",
  ],
] as const;

/** Common questions. */
export function GoodToKnow() {
  return (
    <section className={s.section}>
      <div className={s.inner}>
        <h2 className={`display-m ${s.h2}`}>Good to know</h2>
        <dl className={s.questions}>
          {QUESTIONS.map(([question, answer]) => (
            <div key={question} className={s.question}>
              <dt>{question}</dt>
              <dd>{answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/** The last ask, then the footer. */
export function Closing() {
  return (
    <section className={`${s.closing} ${s.glow}`}>
      <div className={`bulb-row ${s.bulbs}`} />
      <div className={`${s.inner} ${s.narrow}`}>
        <Image src={glyph} alt="" className={s.closingGlyph} />
        <h2 className={`display-m ${s.h2}`}>
          New year. New memories. A new home for neighbors who need one.
        </h2>
        <p className={`lead ${s.lead}`}>
          Grab your plus-one. Book your room. See you at the tables.
        </p>
        <TicketLink className="btn btn-primary btn-lg">
          <i className="ph ph-ticket" aria-hidden="true" /> Reserve our night out
        </TicketLink>
      </div>
      <footer className={s.footer}>
        <div className={s.footerInner}>
          <div className={s.presented}>
            <span className="overline">Presented by</span>
            <Image src={ohpLogo} alt="One House Project" className={s.ohp} />
          </div>
          <p className={`caption ${s.small}`}>
            Play money only. No cash prizes. 21+ with valid ID.
          </p>
        </div>
      </footer>
    </section>
  );
}
