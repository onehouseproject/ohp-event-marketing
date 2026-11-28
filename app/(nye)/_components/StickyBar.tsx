"use client";

import { useEffect, useState } from "react";
import { PRICES } from "../event";
import { TicketLink } from "./givebutter";
import s from "./StickyBar.module.css";

/**
 * A booking bar that keeps a button within reach: at the bottom edge on a phone, at the
 * top on a wider screen. It shows only once the visitor has scrolled past the first
 * booking button, and steps aside whenever another one is on screen, so a view never
 * has two primary buttons.
 */
export function StickyBar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const buttons = Array.from(document.querySelectorAll("[data-book]"));
    const visible = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      }
      const passedFirst = (buttons[0]?.getBoundingClientRect().bottom ?? 0) < 0;
      setShow(visible.size === 0 && passedFirst);
    });
    buttons.forEach((button) => observer.observe(button));
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`${s.sticky} ${show ? s.stickyOn : ""}`} aria-hidden={!show} inert={!show}>
      <span className={s.stickyPrice}>
        <strong>{PRICES.stayAndPlay}</strong> for two
        <span className={s.stickyExtra}>· Two VIP tickets and a hotel room upstairs</span>
      </span>
      <TicketLink className="btn btn-primary" placement="sticky">
        <i className="ph ph-ticket" aria-hidden="true" /> Book for two
      </TicketLink>
    </div>
  );
}
