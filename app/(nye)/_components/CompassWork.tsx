"use client";

import Image, { type StaticImageData } from "next/image";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import compassGlyph from "../_assets/compass-brand/compass-glyph-light-gold.svg";
import compassLockup from "../_assets/compass-lockup-horizontal-light-gold.svg";
import exteriorBrick from "../_assets/compass-work/exterior-brick.jpg";
import exteriorFarmhouse from "../_assets/compass-work/exterior-farmhouse.jpg";
import exteriorStone from "../_assets/compass-work/exterior-stone.jpg";
import floorPlan from "../_assets/compass-work/floor-plan.png";
import kitchenCream from "../_assets/compass-work/kitchen-cream.jpg";
import kitchenElevations from "../_assets/compass-work/kitchen-elevations.png";
import farmhouseLinework from "../_assets/compass-work/kitchen-farmhouse-linework.jpg";
import kitchenFarmhouse from "../_assets/compass-work/kitchen-farmhouse.jpg";
import kitchenGreen from "../_assets/compass-work/kitchen-green.jpg";
import kitchenLinework from "../_assets/compass-work/kitchen-linework.jpg";
import kitchenRender from "../_assets/compass-work/kitchen-render.jpg";
import kitchenStone from "../_assets/compass-work/kitchen-stone.jpg";
import livingLinework from "../_assets/compass-work/living-linework.jpg";
import livingRender from "../_assets/compass-work/living-render.jpg";
import s from "./CompassWork.module.css";

// Real work from Compass Design Studio, the donor of the prize: a banner on the prize card
// opens a full-screen lightbox. The lightbox opens on an intro card that says these are real
// past projects, then shows drawings, 3D views and renders, each captioned with a question
// someone planning a kitchen asks and the answer.
//
// Every picture is from a past client's project, shared with the homeowners' permission:
// Hurricane Ranch, Newton, Adams, Baxter and Widner. Names, addresses and title blocks are
// cropped off, and the page never names a client. The prototype that chose this design is
// on the branch prototype/nye-compass-work.
//
// The Compass marks follow the Compass Design System's rules: light-gold files placed as
// supplied (no glow, shadow or recolor), never inside a line of text, with their clear
// space kept and their minimum sizes met.

/** A 3D linework view and the render from the same camera, compared with a slider. */
type Pair = { linework: StaticImageData; render: StaticImageData; alt: string };

type Slide = {
  id: string;
  question: string;
  answer: string;
  pair?: Pair;
  picture?: { src: StaticImageData; alt: string; drawing?: boolean };
};

const WHOLE_HOME = "From a past whole-home project.";

const SLIDES: Slide[] = [
  {
    id: "kitchen-pair", // Hurricane Ranch
    question: "Will it look the way you pictured?",
    answer: "You see it in 3D as it's designed, then photoreal, before anything gets torn out.",
    pair: {
      linework: kitchenLinework,
      render: kitchenRender,
      alt: "Rendered kitchen with oak cabinets, a long stone island and glass pendants",
    },
  },
  {
    id: "elevations", // Newton
    question: "Can contractors price it accurately?",
    answer:
      "Every wall is dimensioned, so contractors and cabinet makers quote and build the same kitchen.",
    picture: {
      src: kitchenElevations,
      alt: "Two kitchen wall elevations with every cabinet width and height dimensioned",
      drawing: true,
    },
  },
  {
    id: "farmhouse-pair", // Widner
    question: "Will the finishes go together?",
    answer: "See your cabinets, counters and fixtures in place before you buy them.",
    pair: {
      linework: farmhouseLinework,
      render: kitchenFarmhouse,
      alt: "Rendered farmhouse kitchen with cream cabinets, butcher-block counters and a green range",
    },
  },
  {
    id: "floor-plan", // Newton
    question: "Will the layout work?",
    answer: "It's settled and drawn to scale before any work starts.",
    picture: {
      src: floorPlan,
      alt: "Floor plan of a house with the kitchen, island and pantry at its center",
      drawing: true,
    },
  },
  {
    id: "living-pair", // Hurricane Ranch
    question: "What about the rest of the house?",
    answer: "Compass designs whole homes the same way.",
    pair: {
      linework: livingLinework,
      render: livingRender,
      alt: "Rendered two-story living room with a stone fireplace and tall black windows",
    },
  },
  {
    id: "kitchen-green", // Adams
    question: "Will it fit how you live?",
    answer: "The design starts with how your household cooks, eats and gathers.",
    picture: {
      src: kitchenGreen,
      alt: "Rendered kitchen with green cabinets, a walnut island, white stools and a banquette",
    },
  },
  {
    id: "kitchen-cream", // Newton
    question: "Will it feel like yours?",
    answer: "Your style leads every decision, not a template.",
    picture: {
      src: kitchenCream,
      alt: "Rendered kitchen with cream cabinets, marble counters, an oak island and brass lanterns",
    },
  },
  {
    id: "kitchen-stone", // Baxter
    question: "What if something's wrong?",
    answer: "You catch it on screen, where changes are easy, not after install.",
    picture: {
      src: kitchenStone,
      alt: "Rendered kitchen with cream cabinets, a long dark wood island with stools and an oak dining table",
    },
  },
  {
    id: "exterior-stone", // Baxter
    question: "Building new?",
    answer: `Compass designs whole homes, too. ${WHOLE_HOME}`,
    picture: {
      src: exteriorStone,
      alt: "Rendered stone and stucco house with a timber-framed front porch among trees",
    },
  },
  {
    id: "exterior-farmhouse", // Widner
    question: "Want the outside to match?",
    answer: `One team designs the house and the kitchen. ${WHOLE_HOME}`,
    picture: {
      src: exteriorFarmhouse,
      alt: "Rendered white farmhouse with a wraparound porch on brick piers at sunset",
    },
  },
  {
    id: "exterior-brick", // Newton
    question: "Planning ahead?",
    answer: `Whole-home projects start the same way your kitchen would. ${WHOLE_HOME}`,
    picture: { src: exteriorBrick, alt: "Rendered brick house with a white front porch at sunset" },
  },
];

const PERMISSION_NOTE =
  "Real Compass Design Studio projects, shared with the homeowners' permission. The prize is a kitchen design; the living room and exterior come from whole-home projects.";

const BANNER = "Click to see real designs";
const SEAL = <i className="ph ph-seal-check" aria-hidden="true" />;

/** The banner on the prize card, and the lightbox it opens. */
export function CompassWork() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    // Escape and the close button both end here: give the page its scroll back
    const onClose = () => {
      document.documentElement.style.overflow = "";
      setOpen(false);
    };
    d.addEventListener("close", onClose);
    return () => {
      d.removeEventListener("close", onClose);
      document.documentElement.style.overflow = "";
    };
  }, []);

  const show = () => {
    setStarted(false);
    setIndex(0);
    dialog.current?.showModal();
    document.documentElement.style.overflow = "hidden";
    setOpen(true);
  };

  // Leaving the intro card removes its button, so focus moves to the dialog and the arrow
  // keys keep working
  const start = () => {
    setStarted(true);
    dialog.current?.focus();
  };

  const step = (by: number) => setIndex((n) => (n + by + SLIDES.length) % SLIDES.length);
  const slide = SLIDES[index];

  return (
    <>
      <button
        type="button"
        className={s.banner}
        onClick={show}
        aria-haspopup="dialog"
        aria-label={`${BANNER}: real drawings and renders from Compass Design Studio`}
      >
        <span className={s.stage}>
          <Image
            src={kitchenRender}
            alt=""
            sizes="(max-width: 640px) 100vw, 720px"
            placeholder="blur"
            className={s.stagePicture}
          />
          <Image
            src={kitchenLinework}
            alt=""
            sizes="(max-width: 640px) 100vw, 720px"
            className={`${s.stagePicture} ${s.stageLinework}`}
          />
          <span className={s.seam} aria-hidden="true" />
        </span>
        <span className={s.tag} aria-hidden="true">
          <i className="ph ph-pencil-simple-line" /> drawn, then rendered
        </span>
        <span className={`${s.pill} tone-blue`} aria-hidden="true">
          <i className="ph ph-images" />
          {BANNER}
          <span className={s.count}>{SLIDES.length}</span>
        </span>
      </button>

      <dialog
        ref={dialog}
        tabIndex={-1}
        className={s.dialog}
        aria-label="Real past Compass projects"
        onKeyDown={(e) => {
          // The slider takes the arrow keys while it has focus
          if (e.target instanceof HTMLInputElement) return;
          if (e.key === "ArrowRight") {
            if (started) step(1);
            else start();
          }
          if (e.key === "ArrowLeft" && started) step(-1);
        }}
      >
        {open ? (
          <div className={s.shell}>
            <header className={s.head}>
              <span />
              <div className={s.headTitle}>
                {started ? (
                  <>
                    <Image src={compassGlyph} alt="Compass Design Studio" unoptimized className={s.glyph} />
                    <p className={s.line}>Real past Compass projects · examples of what you&apos;d get</p>
                  </>
                ) : null}
              </div>
              <span className={s.tools}>
                {started ? (
                  <span className={s.counter}>
                    {index + 1} / {SLIDES.length}
                  </span>
                ) : null}
                <button
                  type="button"
                  className={s.close}
                  onClick={() => dialog.current?.close()}
                  aria-label="Close"
                >
                  <i className="ph ph-x" aria-hidden="true" />
                </button>
              </span>
            </header>

            {started ? (
              <div className={s.main}>
                <button type="button" className={s.nav} onClick={() => step(-1)} aria-label="Previous picture">
                  <i className="ph ph-caret-left" aria-hidden="true" />
                </button>
                <figure className={s.figure}>
                  {slide.pair ? (
                    <Compare key={slide.id} pair={slide.pair} />
                  ) : slide.picture ? (
                    <Image
                      key={slide.id}
                      src={slide.picture.src}
                      alt={slide.picture.alt}
                      sizes="90vw"
                      placeholder="blur"
                      className={`${s.picture} ${slide.picture.drawing ? s.drawing : ""}`}
                    />
                  ) : null}
                  <figcaption className={s.caption}>
                    <span>
                      <strong>{slide.question}</strong> {slide.answer}
                    </span>
                    {slide.pair ? (
                      <small className={s.hint}>Drag the slider to compare the 3D view with the render.</small>
                    ) : null}
                  </figcaption>
                </figure>
                <button type="button" className={s.nav} onClick={() => step(1)} aria-label="Next picture">
                  <i className="ph ph-caret-right" aria-hidden="true" />
                </button>
              </div>
            ) : (
              <div className={s.intro}>
                <span className="badge badge-solid tone-blue">{SEAL} Real past projects</span>
                <h2 className="display-m">Every picture here is a real Compass project.</h2>
                <p>
                  They come from past clients&apos; homes, shared with permission. Win the kitchen
                  design package and this is the work Compass does for your kitchen.
                </p>
                <button type="button" className="btn btn-outline" onClick={start} autoFocus>
                  See the projects <i className="ph ph-arrow-right" aria-hidden="true" />
                </button>
                <div className={s.signature}>
                  <span className="overline">Designed by</span>
                  <Image src={compassLockup} alt="Compass Design Studio" unoptimized className={s.lockup} />
                </div>
              </div>
            )}

            {started ? (
              <nav className={s.strip} aria-label="All pictures">
                {SLIDES.map((sl, n) => (
                  <button
                    key={sl.id}
                    type="button"
                    className={s.thumb}
                    aria-current={n === index ? "true" : undefined}
                    aria-label={`Picture ${n + 1} of ${SLIDES.length}`}
                    onClick={() => setIndex(n)}
                  >
                    <Image
                      src={sl.pair?.render ?? sl.picture!.src}
                      alt=""
                      sizes="120px"
                      className={s.thumbPicture}
                    />
                    {sl.pair ? (
                      <Image
                        src={sl.pair.linework}
                        alt=""
                        sizes="120px"
                        className={`${s.thumbPicture} ${s.thumbHalf}`}
                      />
                    ) : null}
                  </button>
                ))}
              </nav>
            ) : (
              <span />
            )}
            <p className={s.note}>{PERMISSION_NOTE}</p>
          </div>
        ) : null}
      </dialog>
    </>
  );
}

/** Linework left of the seam, the render right of it. The range input under it is the control. */
function Compare({ pair }: { pair: Pair }) {
  const [x, setX] = useState(50);
  const { width, height } = pair.render;
  return (
    <div
      className={s.compare}
      style={{ "--x": `${x}%`, "--ratio": width / height, aspectRatio: `${width} / ${height}` } as CSSProperties}
    >
      <Image src={pair.render} alt={pair.alt} sizes="90vw" placeholder="blur" className={s.comparePicture} />
      <Image src={pair.linework} alt="" sizes="90vw" className={`${s.comparePicture} ${s.compareLinework}`} />
      <span className={s.compareSeam} aria-hidden="true">
        <i className="ph ph-arrows-horizontal" />
      </span>
      <span className={`${s.compareLabel} ${s.compareLabelLeft}`}>3D linework</span>
      <span className={`${s.compareLabel} ${s.compareLabelRight}`}>render</span>
      <input
        type="range"
        min={0}
        max={100}
        value={x}
        onChange={(e) => setX(Number(e.target.value))}
        aria-label="Drag to compare the 3D linework with the render"
        className={s.compareRange}
      />
    </div>
  );
}
