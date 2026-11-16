import Image, { type StaticImageData } from "next/image";
import banner from "../_assets/imagery/banner.jpg";
import bar from "../_assets/imagery/bar.jpg";
import breakfast from "../_assets/imagery/breakfast.jpg";
import danceFloor from "../_assets/imagery/dance-floor.jpg";
import eventRoom from "../_assets/imagery/event-room.jpg";
import lobby from "../_assets/imagery/lobby.jpg";
import redCarpet from "../_assets/imagery/red-carpet.jpg";
import room from "../_assets/imagery/room.jpg";
import tables from "../_assets/imagery/tables.jpg";
import { VENUE } from "../event";
import { LazyMap } from "./LazyMap";
import s from "./Venue.module.css";
import u from "./shared.module.css";

// Illustrations of the night. Each is made from one of the hotel's own photographs, supplied
// by its Director of Sales: the same room, lit for the evening and dressed for the party.
// The guests and the casino tables are invented, and PICTURE_NOTE says so once on the page.
// No picture shows a bed, because rooms are a mix of bed types.
const PHOTOS = {
  banner: {
    src: banner,
    alt: "Guests in evening dress with drinks beside the hotel's lobby fireplace",
    caption: "By the lobby fireplace",
  },
  room: {
    src: room,
    alt: "A hotel room in the evening: a lamp on the desk, a jacket over the chair and gold heels by the armchair",
    caption: "A room upstairs",
  },
  redCarpet: {
    src: redCarpet,
    alt: "Guests in evening dress walking a red carpet through the hotel lobby",
    caption: "Arriving through the lobby",
  },
  tables: {
    src: tables,
    alt: "Hands, play chips and a dealer's card on a green felt table, with guests laughing behind",
    caption: "At the tables",
  },
  danceFloor: {
    src: danceFloor,
    alt: "Guests dancing in the event space, with a DJ and balloons behind them",
    caption: "The dance floor",
  },
  breakfast: {
    src: breakfast,
    alt: "Breakfast for two on a table at the hotel's bar and restaurant",
    caption: "Breakfast at Garden Grille & Bar",
  },
  lobby: {
    src: lobby,
    alt: "The hotel's atrium lobby in the evening, with a lit fireplace, balloons and colored lights",
    caption: "The lobby",
  },
  eventRoom: {
    src: eventRoom,
    alt: "The hotel's event space set with blackjack, craps and roulette tables",
    caption: "The event space, set for casino night",
  },
  bar: {
    src: bar,
    alt: "The hotel's bar in the evening, with a bartender mixing drinks and two guests at the counter",
    caption: "Garden Grille & Bar",
  },
} satisfies Record<string, { src: StaticImageData; alt: string; caption: string }>;

/** Said once, under the first picture on the page. */
const PICTURE_NOTE =
  "Pictures of the night on this page are illustrations, made from the hotel's own photographs.";

/** One picture of the hotel in a frame, with its caption beneath. */
export function VenuePhoto({
  which,
  shape = "wide",
  caption = true,
  sizes = "(max-width: 700px) 100vw, 640px",
}: {
  which: keyof typeof PHOTOS;
  shape?: "wide" | "banner";
  caption?: boolean;
  sizes?: string;
}) {
  const photo = PHOTOS[which];
  return (
    <figure className={s.figure}>
      <div className={`${s.frame} ${s[shape]}`}>
        <Image src={photo.src} alt={photo.alt} sizes={sizes} placeholder="blur" className={s.img} />
      </div>
      {caption ? <figcaption className={s.caption}>{photo.caption}</figcaption> : null}
    </figure>
  );
}

/** The banner that opens the run of show: a picture, the hotel's name and address, then the note. */
export function VenueBanner() {
  return (
    <div className={s.openerWrap}>
      <div className={s.opener}>
        <VenuePhoto
          which="banner"
          shape="banner"
          caption={false}
          sizes="(max-width: 1000px) 100vw, 800px"
        />
        <div className={`${s.bannerBar} tone-blue`}>
          <i className="ph ph-map-pin" aria-hidden="true" />
          <p>
            <strong>{VENUE.name}</strong>
            <span>
              {VENUE.street}, {VENUE.city}
            </span>
          </p>
        </div>
      </div>
      <p className={s.caption}>{PICTURE_NOTE}</p>
    </div>
  );
}

const FACTS = [
  ["map-pin", "Off Memorial Parkway, by Redstone Arsenal's main gate."],
  ["path", "Five miles from downtown Huntsville and the Von Braun Center."],
  ["clock", "For Stay & Play guests: check-in from 3 PM, checkout by 11 AM."],
  ["fork-knife", "Garden Grille & Bar on site, where breakfast is served."],
] as const;

/** The venue as its own section: pictures, the address, a few facts and a map. */
export function VenueSection() {
  return (
    <section className={s.section} id="venue">
      <div className={s.inner}>
        <div className={s.heading}>
          <p className="eyebrow">The venue</p>
          <h2 className={`display-m ${u.h2}`}>Where it all happens</h2>
          <p className={`lead ${u.lead}`}>
            The party is in the hotel&apos;s event space. Stay &amp; Play rooms are an elevator
            ride away.
          </p>
        </div>
        <div className={s.mosaic}>
          <div className={s.mosaicLead}>
            <VenuePhoto which="lobby" sizes="(max-width: 900px) 100vw, 760px" />
          </div>
          <VenuePhoto which="eventRoom" sizes="(max-width: 900px) 50vw, 380px" />
          <VenuePhoto which="bar" sizes="(max-width: 900px) 50vw, 380px" />
        </div>
        <div className={s.details}>
          <div className={s.detailsText}>
            <div className={s.address}>
              <p className={s.name}>{VENUE.name}</p>
              <p className={s.street}>
                {VENUE.street}, {VENUE.city}
              </p>
              <div className={s.links}>
                <a
                  href={VENUE.directionsUrl}
                  target="_blank"
                  rel="noopener"
                  className="btn btn-secondary"
                >
                  <i className="ph ph-navigation-arrow" aria-hidden="true" /> Get directions
                </a>
                <a href={VENUE.hotelUrl} target="_blank" rel="noopener" className={u.textLink}>
                  See the hotel on hilton.com
                </a>
              </div>
            </div>
            <ul className={`${s.facts} tone-blue`}>
              {FACTS.map(([icon, text]) => (
                <li key={icon}>
                  <i className={`ph ph-${icon}`} aria-hidden="true" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
          <LazyMap className={s.map} src={VENUE.mapEmbedUrl} title={`Map showing ${VENUE.name}`} />
        </div>
      </div>
    </section>
  );
}
