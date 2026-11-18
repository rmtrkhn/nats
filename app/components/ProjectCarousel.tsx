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
}: {
  id: string;
  title: string;
  meta: string;
  copy: string;
  frames: readonly Frame[];
  reverse?: boolean;
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
    let lastFrame = 0;
    let mode: "rest" | "follow" | "glide" = "rest";
    let glideFrom = 0;
    let glideToPos = 0;
    let glideStart = 0;
    let glideMs = 0;
    let sampleX = 0;
    let sampleT = 0;
    let velocity = 0;
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

    const easeOut = (t: number) => 1 - (1 - t) ** 3;
    const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
    let glideEase = easeInOut;

    const tick = (now: number) => {
      raf = 0;
      const dt = lastFrame ? Math.min(34, now - lastFrame) : 16;
      lastFrame = now;

      if (!dragging) {
        if (reduce || mode === "rest") current = target;
        else if (mode === "glide") {
          const t = Math.min(1, (now - glideStart) / glideMs);
          current = glideFrom + (glideToPos - glideFrom) * glideEase(t);
          if (t >= 1) {
            current = glideToPos;
            target = glideToPos;
            mode = "rest";
          }
        } else {
          current += (target - current) * (1 - Math.exp(-dt / 56));
          if (Math.abs(target - current) < 0.35) current = target;
        }
      }

      paint();
      const moving = dragging || mode === "glide" || Math.abs(target - current) >= 0.35;
      if (moving) raf = requestAnimationFrame(tick);
      else lastFrame = 0;
    };

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const clampTarget = (v: number) => Math.min(max(), Math.max(0, v));

    const nearest = (v: number) => {
      if (!width) return 0;
      return Math.round(clampTarget(v) / width) * width;
    };

    const glide = (dest: number, flung = false) => {
      dest = clampTarget(dest);
      target = dest;
      window.clearTimeout(snapTimer);
      if (reduce || Math.abs(dest - current) < 0.5) {
        current = dest;
        mode = "rest";
        paint();
        return;
      }
      glideFrom = current;
      glideToPos = dest;
      glideStart = performance.now();
      glideMs = Math.min(640, Math.max(220, Math.abs(dest - current) * 1.05));
      glideEase = flung ? easeOut : easeInOut;
      mode = "glide";
      kick();
    };

    const snapSoon = () => {
      window.clearTimeout(snapTimer);
      snapTimer = window.setTimeout(() => {
        if (dragging) return;
        glide(nearest(target));
      }, 180);
    };

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return;
      const dy = e.deltaY * (e.deltaMode === 1 ? 16 : 1);
      const delta = Math.abs(e.deltaX) > Math.abs(dy) ? e.deltaX : dy;
      if (!delta) return;
      const base = mode === "glide" ? current : target;
      const next = base + delta;
      if (next < 0 && delta < 0) return;
      if (next > max() && delta > 0) return;
      e.preventDefault();
      mode = "follow";
      target = clampTarget(next);
      kick();
      snapSoon();
    };

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      armed = true;
      dragging = false;
      pointerId = e.pointerId;
      dragOrigin = e.clientX;
      originY = e.clientY;
      if (mode === "glide") mode = "follow";
      dragStart = current;
      target = current;
      sampleX = e.clientX;
      sampleT = performance.now();
      velocity = 0;
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
      const now = performance.now();
      const elapsed = now - sampleT;
      if (elapsed > 0) velocity = velocity * 0.65 + ((sampleX - e.clientX) / elapsed) * 0.35;
      sampleX = e.clientX;
      sampleT = now;
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
      const idle = performance.now() - sampleT;
      const coast =
        idle > 90 ? 0 : Math.max(-width * 0.85, Math.min(width * 0.85, velocity * 280));
      glide(nearest(current + coast), Math.abs(coast) > 12);
    };

    const go = (i: number) => {
      glide(Math.max(0, Math.min(n - 1, i)) * width);
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
      target = nearest(i * width);
      mode = "rest";
      window.clearTimeout(snapTimer);
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
      const wasDrag = dragging;
      armed = false;
      dragging = false;
      pointerId = -1;
      viewport.classList.remove("is-drag");
      if (wasDrag) glide(nearest(current));
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
                <div className="frame">
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
        <p className="kicker">{meta}</p>
        <h3 className="project-title">{title}</h3>
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
