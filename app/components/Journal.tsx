"use client";

import { useRef, useState } from "react";
import { journalSpreads } from "../../content/journal";
import { asset } from "../../lib/asset";
import { type Locale, getUi } from "../../lib/i18n";

export function Journal({
  locale,
  title,
  subtitle,
}: {
  locale: Locale;
  title?: string;
  subtitle?: string;
}) {
  const j = getUi(locale).journal;
  const home = Boolean(subtitle) && !title;
  const heading = title ?? subtitle ?? j.title;
  const [index, setIndex] = useState(0);
  const drag = useRef({ x: 0, y: 0, armed: false });
  const count = journalSpreads.length;
  const spread = journalSpreads[index];
  const src = asset(spread.src);

  function go(delta: number) {
    setIndex((current) => (current + delta + count) % count);
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      go(1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(-1);
    }
  }

  function onPointerDown(event: React.PointerEvent) {
    drag.current = { x: event.clientX, y: event.clientY, armed: true };
  }

  function onPointerUp(event: React.PointerEvent) {
    if (!drag.current.armed) return;
    const dx = event.clientX - drag.current.x;
    const dy = event.clientY - drag.current.y;
    drag.current.armed = false;
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return;
    go(dx < 0 ? 1 : -1);
  }

  return (
    <section
      className={home ? "journal journal-home" : "journal"}
      id="dziennik"
      tabIndex={0}
      onKeyDown={onKeyDown}
      aria-roledescription="karuzela"
      aria-label={heading}
    >
      <div className="journal-grid">
        <header className="journal-top">
          <h1 className="journal-title">{heading}</h1>
        </header>

        <div className="journal-gallery">
          <p className="journal-index" aria-live="polite">
            <span>{index + 1}</span> / <span>{count}</span>
          </p>

          <div
            className="journal-viewport"
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={() => {
              drag.current.armed = false;
            }}
          >
            <img
              key={src}
              src={src}
              sizes="(min-width: 1200px) 80vw, (min-width: 760px) 90vw, 90vw"
              alt={`${heading}, ${index + 1} / ${count}`}
              decoding="async"
              fetchPriority={index === 0 ? "high" : "auto"}
              draggable={false}
            />
          </div>

          <button
            type="button"
            className="journal-zone journal-zone-prev"
            onClick={() => go(-1)}
            aria-label={j.prevPage}
          />
          <button
            type="button"
            className="journal-zone journal-zone-next"
            onClick={() => go(1)}
            aria-label={j.nextPage}
          />
        </div>

        <div className="journal-bottom">
          <button type="button" className="journal-action journal-action-prev" onClick={() => go(-1)}>
            {j.prev}
          </button>
          <button type="button" className="journal-action journal-action-next" onClick={() => go(1)}>
            {j.next}
          </button>
        </div>
      </div>
    </section>
  );
}
