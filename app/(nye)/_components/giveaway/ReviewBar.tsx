"use client";

import Link from "next/link";
import { clearEntry } from "./state";
import r from "./review.module.css";

/**
 * The strip above a prototype: which one this is, links to the others in its set, and Replay,
 * which forgets the entry and reloads so the prototype can be seen fresh. Not part of any
 * design. The links between prototypes load the whole page, so each one starts as a visitor's
 * would. `base` is the address the slugs hang from; `index` is the set's list page.
 */
export function ReviewBar({
  items,
  slug,
  base,
  index,
}: {
  items: readonly { slug: string; title: string }[];
  slug: string;
  base: string;
  index: { href: string; label: string };
}) {
  const at = items.findIndex((item) => item.slug === slug);
  const item = items[at];
  const prev = items[(at + items.length - 1) % items.length];
  const next = items[(at + 1) % items.length];

  return (
    <div className={r.bar}>
      <p className={r.label}>
        <span className={r.count}>
          Prototype {at + 1} of {items.length}
        </span>{" "}
        <strong>{item.title}</strong>
      </p>
      <nav className={r.nav} aria-label="Prototypes">
        <a href={`${base}/${prev.slug}`} aria-label={`Previous: ${prev.title}`}>
          <i className="ph ph-caret-left" aria-hidden="true" />
        </a>
        <Link href={index.href}>{index.label}</Link>
        <a href={`${base}/${next.slug}`} aria-label={`Next: ${next.title}`}>
          <i className="ph ph-caret-right" aria-hidden="true" />
        </a>
        <button
          type="button"
          onClick={() => {
            clearEntry();
            window.location.hash = "";
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
