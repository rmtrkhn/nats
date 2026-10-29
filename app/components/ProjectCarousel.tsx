"use client";

import { useEffect, useRef, useState } from "react";
import type { Frame } from "../../content/projects";
import { imageSizes } from "../../content/projects";

const roleLabel: Record<Frame["role"], string> = {
  idea: "koncepcja",
  plan: "układ",
  light: "światło",
  node: "węzeł",
  material: "materiał",
};

export function ProjectCarousel({
  id,
  title,
  meta,
  copy,
  frames,
  reverse,
  intro,
}: {
  id: string;
  title: string;
  meta: string;
  copy: string;
  frames: readonly Frame[];
  reverse?: boolean;
  intro?: { kicker: string; heading: string };
}) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const captions = useRef<HTMLParagraphElement[]>([]);
  const dots = useRef<HTMLButtonElement[]>([]);
  const openAt = useRef<(index: number) => void>(() => {});
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  const n = frames.length;
  openAt.current = (index) => setOpen(index);

  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    if (open === null) {
      if (node.open) node.close();
      return;
    }
    if (!node.open) node.showModal();
  }, [open]);

  useEffect(() => {
    const viewport = root.current;
    const row = track.current;
    if (!viewport || !row) return;

    let width = viewport.clientWidth;
    let current = 0;
    let target = 0;
    let raf = 0;
    let armed = false;
    let dragging = false;
    let dragOrigin = 0;
    let dragStart = 0;
    let originY = 0;
    let pointerId = -1;
    let lastIndex = 0;
    let snapTimer = 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const max = () => Math.max(0, (n - 1) * width);

    const paint = () => {
      row.style.transform = `translate3d(${-current}px,0,0)`;
      const p = width ? current / width : 0;
      captions.current.forEach((el, i) => {
        if (!el) return;
        const d = Math.abs(p - i);
        el.style.opacity = String(Math.max(0, 1 - d));
        el.style.transform = `translateY(${(p - i) * 8}px)`;
      });
      const i = Math.round(p);
      if (i !== lastIndex) {
        lastIndex = i;
        dots.current.forEach((d, j) => d?.classList.toggle("is-on", j === i));
      }
    };

    const tick = () => {
      raf = 0;
      if (!dragging) {
        if (reduce) current = target;
        else current += (target - current) * 0.38;
        if (Math.abs(target - current) < 0.4) current = target;
      }
      paint();
      if (dragging || Math.abs(target - current) >= 0.35) {
        raf = requestAnimationFrame(tick);
      }
    };

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const clampTarget = (v: number) => Math.min(max(), Math.max(0, v));

    const snapSoon = () => {
      window.clearTimeout(snapTimer);
      snapTimer = window.setTimeout(() => {
        target = Math.round(target / width) * width;
        kick();
      }, 70);
    };

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return;
      const dy = e.deltaY * (e.deltaMode === 1 ? 16 : 1);
      const delta = Math.abs(e.deltaX) > Math.abs(dy) ? e.deltaX : dy;
      if (!delta) return;
      const next = target + delta;
      if (next < 0 && delta < 0) return;
      if (next > max() && delta > 0) return;
      e.preventDefault();
      target = clampTarget(next);
      current = target;
      paint();
      snapSoon();
    };

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      armed = true;
      dragging = false;
      pointerId = e.pointerId;
      dragOrigin = e.clientX;
      originY = e.clientY;
      dragStart = current;
      window.clearTimeout(snapTimer);
    };

    const onMove = (e: PointerEvent) => {
      if (!armed || e.pointerId !== pointerId) return;
      const dx = e.clientX - dragOrigin;
      const dy = e.clientY - originY;
      if (!dragging) {
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
        if (Math.abs(dy) > Math.abs(dx)) {
          armed = false;
          return;
        }
        dragging = true;
        viewport.classList.add("is-drag");
        viewport.setPointerCapture(e.pointerId);
        kick();
      }
      current = clampTarget(dragStart - dx);
      target = current;
      kick();
    };

    const onUp = (e: PointerEvent) => {
      if (e.pointerId !== pointerId) return;
      if (!armed && !dragging) return;
      const wasDrag = dragging;
      const travel = Math.abs(e.clientX - dragOrigin);
      armed = false;
      dragging = false;
      pointerId = -1;
      viewport.classList.remove("is-drag");
      if (!wasDrag && travel < 8) {
        const i = width ? Math.round(current / width) : 0;
        openAt.current(Math.max(0, Math.min(n - 1, i)));
        return;
      }
      target = Math.round(current / width) * width;
      kick();
    };

    const go = (i: number) => {
      target = clampTarget(Math.max(0, Math.min(n - 1, i)) * width);
      kick();
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        go(Math.round(target / width) + 1);
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(Math.round(target / width) - 1);
      }
      if (e.key === "Enter") {
        e.preventDefault();
        openAt.current(Math.max(0, Math.min(n - 1, Math.round(target / width))));
      }
    };

    const onResize = () => {
      const i = width ? current / width : 0;
      width = viewport.clientWidth;
      current = i * width;
      target = Math.round(i) * width;
      paint();
    };

    dots.current.forEach((btn, i) => {
      btn?.addEventListener("click", () => go(i));
    });

    paint();
    viewport.addEventListener("wheel", onWheel, { passive: false });
    viewport.addEventListener("pointerdown", onDown);
    viewport.addEventListener("pointermove", onMove);
    const onCancel = (e: PointerEvent) => {
      if (e.pointerId !== pointerId) return;
      armed = false;
      dragging = false;
      pointerId = -1;
      viewport.classList.remove("is-drag");
    };

    viewport.addEventListener("pointerup", onUp);
    viewport.addEventListener("pointercancel", onCancel);
    viewport.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(snapTimer);
      viewport.removeEventListener("wheel", onWheel);
      viewport.removeEventListener("pointerdown", onDown);
      viewport.removeEventListener("pointermove", onMove);
      viewport.removeEventListener("pointerup", onUp);
      viewport.removeEventListener("pointercancel", onCancel);
      viewport.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [n]);

  const frame = open !== null ? frames[open] : null;

  return (
    <article className={reverse ? "spread reverse project-carousel" : "spread project-carousel"}>
      <div className="spread-visual">
        <div
          className="carousel"
          ref={root}
          tabIndex={0}
          aria-label={`${title}. Strzałki zmieniają kadr, kliknięcie powiększa.`}
        >
          <div className="carousel-track" ref={track}>
            {frames.map((item) => (
              <div key={item.src} className="carousel-slide">
                <div className="frame" style={{ aspectRatio: `${item.width} / ${item.height}` }}>
                  <img
                    src={item.src}
                    srcSet={item.srcSet}
                    sizes={imageSizes}
                    width={item.width}
                    height={item.height}
                    alt={`${title} — ${item.label}`}
                    draggable={false}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="copy">
        {intro ? (
          <>
            <p className="kicker">{intro.kicker}</p>
            <p className="issue-title">{intro.heading}</p>
          </>
        ) : null}
        <p className="kicker">{meta}</p>
        <h2>{title}</h2>
        <p>{copy}</p>
        <div className="carousel-caption" aria-live="off">
          {frames.map((item, i) => (
            <p
              key={item.src}
              className="carousel-caption-item"
              ref={(el) => {
                if (el) captions.current[i] = el;
              }}
              style={{ opacity: i === 0 ? 1 : 0 }}
            >
              <span>{roleLabel[item.role]}</span>
              {item.label}
            </p>
          ))}
        </div>
        <div className="carousel-dots" role="tablist" aria-label="Kadry">
          {frames.map((item, i) => (
            <button
              key={item.src}
              type="button"
              role="tab"
              aria-label={`${i + 1} / ${n}: ${item.label}`}
              className={i === 0 ? "is-on" : ""}
              ref={(el) => {
                if (el) dots.current[i] = el;
              }}
            />
          ))}
        </div>
        <a className="btn ghost ask" href={`?projekt=${id}#kontakt`}>
          Zapytaj o ten układ
        </a>
      </div>
      <dialog
        className="lightbox"
        ref={dialog}
        aria-label={frame ? `${title} — ${frame.label}` : title}
        onClose={() => setOpen(null)}
      >
        {frame ? (
          <>
            <div className="lightbox-bar">
              <button type="button" className="icon-btn" onClick={() => dialog.current?.close()}>
                Zamknij
              </button>
            </div>
            <figure className="lightbox-figure">
              <img
                src={frame.src}
                srcSet={frame.srcSet}
                sizes="100vw"
                width={frame.width}
                height={frame.height}
                alt={`${title} — ${frame.label}`}
              />
              <figcaption className="lightbox-caption">
                {title} · {frame.label}
              </figcaption>
            </figure>
            <div className="lightbox-nav">
              <button
                type="button"
                className="icon-btn"
                onClick={() => setOpen((index) => (index === null ? 0 : (index - 1 + n) % n))}
              >
                Wstecz
              </button>
              <button
                type="button"
                className="icon-btn"
                onClick={() => setOpen((index) => (index === null ? 0 : (index + 1) % n))}
              >
                Dalej
              </button>
            </div>
          </>
        ) : null}
      </dialog>
    </article>
  );
}
