"use client";

import Link from "next/link";
import { OPTIONS } from "./catalog";
import { clearEntry } from "./state";
import r from "./review.module.css";

/**
 * The strip above a prototype: which option this is, links to the others, and Replay, which
 * forgets the entry and reloads so the option can be seen fresh. Not part of any design.
 * The links between options load the whole page, so each option starts as a visitor's would.
 */
export function ReviewBar({ slug }: { slug: string }) {
  const index = OPTIONS.findIndex((option) => option.slug === slug);
  const option = OPTIONS[index];
  const prev = OPTIONS[(index + OPTIONS.length - 1) % OPTIONS.length];
  const next = OPTIONS[(index + 1) % OPTIONS.length];

  return (
    <div className={r.bar}>
      <p className={r.label}>
        <span className={r.count}>
          Prototype {index + 1} of {OPTIONS.length}
        </span>{" "}
        <strong>{option.title}</strong>
      </p>
      <nav className={r.nav} aria-label="Giveaway prototypes">
        <a href={`/nye/giveaway/${prev.slug}`} aria-label={`Previous: ${prev.title}`}>
          <i className="ph ph-caret-left" aria-hidden="true" />
        </a>
        <Link href="/nye/giveaway">All six</Link>
        <a href={`/nye/giveaway/${next.slug}`} aria-label={`Next: ${next.title}`}>
          <i className="ph ph-caret-right" aria-hidden="true" />
        </a>
        <button
          type="button"
          onClick={() => {
            clearEntry();
            window.scrollTo(0, 0);
            window.location.reload();
          }}
        >
          <i className="ph ph-arrow-counter-clockwise" aria-hidden="true" /> Replay
        </button>
      </nav>
    </div>
  );
}
