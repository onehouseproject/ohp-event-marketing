"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A map frame that loads only once it scrolls near the screen, so a visitor who never
 * reaches it never pays for it. The caller sizes the box with `className`.
 */
export function LazyMap({
  src,
  title,
  className,
}: {
  src: string;
  title: string;
  className?: string;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const element = box.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShow(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={box} className={className}>
      {show ? <iframe src={src} title={title} referrerPolicy="no-referrer-when-downgrade" /> : null}
    </div>
  );
}
