import Image, { type StaticImageData } from "next/image";
import bar from "../_assets/hotel/bar.jpg";
import eventSpace from "../_assets/hotel/event-space.jpg";
import fireplace from "../_assets/hotel/fireplace.jpg";
import lobby from "../_assets/hotel/lobby.jpg";
import room from "../_assets/hotel/room.jpg";
import { VENUE } from "../event";
import { LazyMap } from "./LazyMap";
import s from "./Venue.module.css";
import u from "./shared.module.css";

// The hotel's own photographs, supplied by its Director of Sales. The room photo is cropped
// to the desk and window: rooms are a mix of bed types, so no image shows a bed.
const PHOTOS = {
  lobby: { src: lobby, alt: "The hotel's atrium lobby, with a fireplace and seating", caption: "The lobby" },
  eventSpace: {
    src: eventSpace,
    alt: "The hotel's event space, set with round tables",
    caption: "The event space, before the casino tables go in",
  },
  bar: { src: bar, alt: "The hotel's bar, with stools and tables", caption: "Garden Grille & Bar" },
  fireplace: {
    src: fireplace,
    alt: "A long table beside the lobby fireplace",
    caption: "By the lobby fireplace",
  },
  room: { src: room, alt: "A hotel room's desk, chair and window", caption: "A room upstairs" },
} satisfies Record<string, { src: StaticImageData; alt: string; caption: string }>;

/** One hotel photograph in a frame, with its caption beneath. */
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

/** The banner that opens the run of show: a photo, then the hotel's name and address. */
export function VenueBanner() {
  return (
    <div className={s.opener}>
      <VenuePhoto
        which="lobby"
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
  );
}

const FACTS = [
  ["map-pin", "Off Memorial Parkway, by Redstone Arsenal's main gate."],
  ["path", "Five miles from downtown Huntsville and the Von Braun Center."],
  ["clock", "For Stay & Play guests: check-in from 3 PM, checkout by 11 AM."],
  ["fork-knife", "Garden Grille & Bar on site, where breakfast is served."],
] as const;

/** The venue as its own section: photographs, the address, a few facts and a map. */
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
          <VenuePhoto which="eventSpace" sizes="(max-width: 900px) 50vw, 380px" />
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
