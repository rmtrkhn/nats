"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { journalSpreads } from "../../content/journal";
import { asset } from "../../lib/asset";
import { type Locale, getUi } from "../../lib/i18n";

const easeOut = (t: number) => 1 - (1 - t) ** 3;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

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
  const count = journalSpreads.length;
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const goRef = useRef<(delta: number) => void>(() => {});
  const suppressClick = useRef(false);
  const zoomedRef = useRef(false);

  function mod(value: number) {
    return (value + count) % count;
  }

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;
    const w = viewport.clientWidth;
    if (!w) return;
    track.style.transform = `translate3d(${-w}px,0,0)`;
  }, [index]);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let alive = true;
    let raf = 0;
    let pos = 0;
    let mode: "rest" | "glide" = "rest";
    let glideFrom = 0;
    let glideTo = 0;
    let glideStart = 0;
    let glideMs = 0;
    let glideEase = easeInOut;
    let sampleX = 0;
    let sampleT = 0;
    let velocity = 0;
    const drag = {
      x: 0,
      y: 0,
      origin: 0,
      originY: 0,
      armed: false,
      moved: false,
      pointerId: -1,
    };

    const width = () => viewport.clientWidth;

    const paint = (next: number) => {
      pos = next;
      track.style.transform = `translate3d(${-width() + next}px,0,0)`;
    };

    const frameEl = () =>
      viewport.querySelector<HTMLElement>(".journal-slide:nth-child(2) .journal-frame");

    const zoom = { scale: 1, x: 0, y: 0 };
    const pointers = new Map<number, { x: number; y: number }>();
    let pinch: { dist: number; scale: number; x: number; y: number; side: -1 | 0 | 1 } | null = null;

    // Landscape spreads are a left page and a right page. On a phone, a pinch
    // on one of them should enlarge that half, not the middle of the spread.
    const spreadSide = (clientX: number): -1 | 0 | 1 => {
      if (!window.matchMedia("(max-width: 800px)").matches) return 0;
      const frame = frameEl();
      const img = frame?.querySelector("img");
      if (!frame || !img || img.naturalWidth <= img.naturalHeight) return 0;
      const rect = frame.getBoundingClientRect();
      if (rect.width < 1) return 0;
      return clientX < rect.left + rect.width / 2 ? 1 : -1;
    };

    const zoomLimits = (scale: number) => {
      const frame = frameEl();
      if (!frame || scale <= 1) return { maxX: 0, maxY: 0 };
      return {
        maxX: Math.max(0, (frame.offsetWidth * scale - viewport.clientWidth) / 2),
        maxY: Math.max(0, (frame.offsetHeight * scale - viewport.clientHeight) / 2),
      };
    };

    const paintZoom = () => {
      const frame = frameEl();
      if (zoom.scale <= 1.01) {
        zoom.scale = 1;
        zoom.x = 0;
        zoom.y = 0;
      } else {
        const { maxX, maxY } = zoomLimits(zoom.scale);
        zoom.x = Math.max(-maxX, Math.min(maxX, zoom.x));
        zoom.y = Math.max(-maxY, Math.min(maxY, zoom.y));
      }
      zoomedRef.current = zoom.scale > 1;
      if (!frame) return;
      if (!zoomedRef.current) {
        frame.style.transform = "";
        viewport.classList.remove("is-zoom");
        return;
      }
      frame.style.transform = `translate3d(${zoom.x}px, ${zoom.y}px, 0) scale(${zoom.scale})`;
      viewport.classList.add("is-zoom");
    };

    const settle = (delta: number) => {
      if (!alive) return;
      mode = "rest";
      pos = 0;
      zoom.scale = 1;
      zoom.x = 0;
      zoom.y = 0;
      pinch = null;
      paintZoom();
      const next = (indexRef.current + delta + count) % count;
      indexRef.current = next;
      setIndex(next);
    };

    const tick = (now: number) => {
      raf = 0;
      if (mode !== "glide") return;
      const t = Math.min(1, (now - glideStart) / glideMs);
      paint(glideFrom + (glideTo - glideFrom) * glideEase(t));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
        return;
      }
      paint(glideTo);
      mode = "rest";
      const w = width();
      if (w && glideTo <= -w + 0.5) settle(1);
      else if (w && glideTo >= w - 0.5) settle(-1);
    };

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const glide = (dest: number, flung: boolean) => {
      const w = width();
      if (!w) return;
      if (reduce || Math.abs(dest - pos) < 0.5) {
        if (dest <= -w + 0.5) settle(1);
        else if (dest >= w - 0.5) settle(-1);
        else paint(0);
        return;
      }
      glideFrom = pos;
      glideTo = dest;
      glideStart = performance.now();
      glideMs = Math.min(520, Math.max(240, Math.abs(dest - pos) * 0.55));
      glideEase = flung ? easeOut : easeInOut;
      mode = "glide";
      kick();
    };

    goRef.current = (delta: number) => {
      if (!alive || mode === "glide") return;
      const w = width();
      if (!w || reduce) {
        settle(delta);
        return;
      }
      glide(delta > 0 ? -w : w, true);
    };

    const onDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (pointers.size >= 2) {
        if (mode === "glide") {
          mode = "rest";
          cancelAnimationFrame(raf);
          raf = 0;
        }
        drag.armed = false;
        drag.moved = false;
        viewport.classList.remove("is-drag");
        paint(0);
        if (finePointer) return;
        const pts = [...pointers.values()];
        const midX = (pts[0].x + pts[1].x) / 2;
        pinch = {
          dist: Math.max(1, Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y)),
          scale: zoom.scale,
          x: zoom.x,
          y: zoom.y,
          side: spreadSide(midX),
        };
        return;
      }
      if (mode === "glide" || zoom.scale > 1) {
        if (mode === "glide") return;
        drag.armed = true;
        drag.moved = false;
        drag.x = event.clientX;
        drag.y = event.clientY;
        drag.origin = zoom.x;
        drag.originY = zoom.y;
        drag.pointerId = event.pointerId;
        return;
      }
      drag.armed = true;
      drag.moved = false;
      drag.x = event.clientX;
      drag.y = event.clientY;
      drag.origin = pos;
      drag.pointerId = event.pointerId;
      sampleX = event.clientX;
      sampleT = performance.now();
      velocity = 0;
    };

    const onMove = (event: PointerEvent) => {
      if (!pointers.has(event.pointerId)) return;
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (finePointer && pointers.size >= 2) return;
      if (pointers.size >= 2 && pinch) {
        const pts = [...pointers.values()];
        const dist = Math.max(1, Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y));
        const next = Math.min(4, Math.max(1, pinch.scale * (dist / pinch.dist)));
        const frame = frameEl();
        if (pinch.side !== 0 && frame) {
          zoom.scale = next;
          zoom.x = pinch.side * (frame.offsetWidth / 4) * next;
          zoom.y = 0;
        } else if (frame && zoom.scale > 0) {
          const rect = frame.getBoundingClientRect();
          const midX = (pts[0].x + pts[1].x) / 2;
          const midY = (pts[0].y + pts[1].y) / 2;
          const factor = 1 - next / zoom.scale;
          zoom.x += (midX - (rect.left + rect.width / 2)) * factor;
          zoom.y += (midY - (rect.top + rect.height / 2)) * factor;
          zoom.scale = next;
        } else {
          zoom.scale = next;
        }
        paintZoom();
        return;
      }
      if (zoom.scale > 1 && drag.armed && event.pointerId === drag.pointerId) {
        const dx = event.clientX - drag.x;
        const dy = event.clientY - drag.y;
        if (!drag.moved && Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
        drag.moved = true;
        zoom.x = drag.origin + dx;
        zoom.y = drag.originY + dy;
        paintZoom();
        return;
      }
      if (!drag.armed || event.pointerId !== drag.pointerId || zoom.scale > 1) return;
      const dx = event.clientX - drag.x;
      const dy = event.clientY - drag.y;
      if (!drag.moved) {
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
        if (Math.abs(dy) > Math.abs(dx)) {
          drag.armed = false;
          return;
        }
        drag.moved = true;
        viewport.classList.add("is-drag");
        try {
          viewport.setPointerCapture(event.pointerId);
        } catch {
          // A pointer id is only capturable while that pointer is really down.
        }
      }
      const now = performance.now();
      const elapsed = now - sampleT;
      if (elapsed > 0) velocity = velocity * 0.65 + ((event.clientX - sampleX) / elapsed) * 0.35;
      sampleX = event.clientX;
      sampleT = now;
      const w = width();
      paint(Math.max(-w, Math.min(w, drag.origin + dx)));
    };

    const endDrag = (event: PointerEvent) => {
      pointers.delete(event.pointerId);
      if (pointers.size < 2) pinch = null;
      if (zoom.scale > 1) {
        const moved = drag.moved;
        drag.armed = false;
        drag.moved = false;
        if (drag.pointerId === event.pointerId) drag.pointerId = -1;
        if (moved) {
          suppressClick.current = true;
          window.setTimeout(() => {
            suppressClick.current = false;
          }, 0);
        }
        return;
      }
      if (event.pointerId !== drag.pointerId) return;
      const moved = drag.moved;
      drag.armed = false;
      drag.moved = false;
      drag.pointerId = -1;
      viewport.classList.remove("is-drag");
      if (viewport.hasPointerCapture(event.pointerId)) {
        try {
          viewport.releasePointerCapture(event.pointerId);
        } catch {
          // Already released.
        }
      }
      if (!moved) return;
      suppressClick.current = true;
      window.setTimeout(() => {
        suppressClick.current = false;
      }, 0);
      const w = width();
      const idle = performance.now() - sampleT;
      const coast = idle > 90 ? 0 : Math.max(-w * 0.85, Math.min(w * 0.85, velocity * 280));
      const projected = Math.max(-w, Math.min(w, pos + coast));
      let dest = 0;
      if (projected <= -w * 0.5) dest = -w;
      else if (projected >= w * 0.5) dest = w;
      glide(dest, Math.abs(coast) > 12);
    };

    const onResize = () => {
      if (mode === "glide") {
        mode = "rest";
        cancelAnimationFrame(raf);
        raf = 0;
      }
      drag.armed = false;
      viewport.classList.remove("is-drag");
      paint(0);
      paintZoom();
    };

    const onTouchMove = (event: TouchEvent) => {
      if (finePointer) return;
      if (event.touches.length >= 2 || zoom.scale > 1) event.preventDefault();
    };

    paint(0);
    viewport.addEventListener("pointerdown", onDown);
    viewport.addEventListener("pointermove", onMove);
    viewport.addEventListener("pointerup", endDrag);
    viewport.addEventListener("pointercancel", endDrag);
    viewport.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("resize", onResize);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      goRef.current = () => {};
      viewport.removeEventListener("pointerdown", onDown);
      viewport.removeEventListener("pointermove", onMove);
      viewport.removeEventListener("pointerup", endDrag);
      viewport.removeEventListener("pointercancel", endDrag);
      viewport.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("resize", onResize);
    };
  }, [count]);

  function go(delta: number) {
    goRef.current(delta);
  }

  function onZone(delta: number) {
    if (zoomedRef.current) return;
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    go(delta);
  }

  const slots = [mod(index - 1), index, mod(index + 1)];

  return (
    <section
      className={home ? "journal journal-home" : "journal"}
      id="dziennik"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          go(1);
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          go(-1);
        }
      }}
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

          <div className="journal-viewport" ref={viewportRef}>
            <div className="journal-track" ref={trackRef}>
              {slots.map((page, position) => {
                const spread = journalSpreads[page];
                const src = asset(spread.src);
                const current = position === 1;
                return (
                  <div className="journal-slide" key={position}>
                    <div className="journal-frame">
                      <img
                        src={src}
                        sizes="(min-width: 1200px) 80vw, (min-width: 760px) 90vw, 90vw"
                        alt={current ? `${heading}, ${index + 1} / ${count}` : ""}
                        aria-hidden={current ? undefined : true}
                        decoding="async"
                        fetchPriority={current && index === 0 ? "high" : "auto"}
                        draggable={false}
                      />
                      {current ? (
                        <>
                          <button
                            type="button"
                            className="journal-zone journal-zone-prev"
                            onClick={() => onZone(-1)}
                            aria-label={j.prevPage}
                          />
                          <button
                            type="button"
                            className="journal-zone journal-zone-next"
                            onClick={() => onZone(1)}
                            aria-label={j.nextPage}
                          />
                        </>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
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
