"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { projects } from "../../content/projects";
import { type Locale, getUi } from "../../lib/i18n";

const easeOut = (t: number) => 1 - (1 - t) ** 3;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

export function CoverCarousel({ locale }: { locale: Locale }) {
  const carousel = getUi(locale).carousel;
  const railRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const pointerOpen = useRef(false);
  const drag = useRef({ x: 0, y: 0, left: 0, armed: false, moved: false });
  const swipe = useRef({ x: 0, y: 0, armed: false });
  const suppressClick = useRef(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const goRef = useRef<(delta: number) => void>(() => {});
  const photoIndexRef = useRef(0);
  const [openId, setOpenId] = useState<string | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);
  const project = projects.find((item) => item.id === openId) ?? null;
  const photos = project ? project.frames : [];
  const photo = photos[photoIndex] ?? null;
  photoIndexRef.current = photoIndex;

  function mod(value: number) {
    const count = photos.length;
    if (!count) return 0;
    return (value + count) % count;
  }

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) >= Math.abs(event.deltaX)) return;
      if (!event.deltaX) return;
      const max = rail.scrollWidth - rail.clientWidth;
      if ((rail.scrollLeft <= 0 && event.deltaX < 0) || (rail.scrollLeft >= max - 1 && event.deltaX > 0)) return;
      event.preventDefault();
      rail.scrollLeft += event.deltaX;
    };
    rail.addEventListener("wheel", onWheel, { passive: false });
    return () => rail.removeEventListener("wheel", onWheel);
  }, []);

  function readRail() {
    const rail = railRef.current;
    const card = rail?.querySelector<HTMLElement>(".covers-card");
    if (!rail || !card) return { page: 0, pages: 1 };
    const step = card.offsetWidth + 16;
    const max = Math.max(0, Math.round((rail.scrollWidth - rail.clientWidth) / step));
    const index = Math.min(max, Math.max(0, Math.round(rail.scrollLeft / step)));
    return { page: index, pages: max + 1 };
  }

  useLayoutEffect(() => {
    const next = readRail();
    setPage(next.page);
    setPages(next.pages);
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const next = readRail();
      setPage(next.page);
      setPages(next.pages);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    rail.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      rail.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, []);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    const track = trackRef.current;
    if (!stage || !track) return;
    const width = stage.clientWidth;
    // An unloaded frame reports 0. Leave the CSS -100% offset so the middle
    // slide stays visible instead of flashing the previous photo.
    if (!width) {
      track.style.transform = "";
      return;
    }
    track.style.transform = `translate3d(${-width}px,0,0)`;
  }, [photoIndex, openId]);

  useEffect(() => {
    const stage = stageRef.current;
    const track = trackRef.current;
    if (!stage || !track || photos.length < 2) return;

    const count = photos.length;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
      armed: false,
      moved: false,
      pointerId: -1,
    };

    const width = () => stage.clientWidth;

    const paint = (next: number) => {
      pos = next;
      const w = width();
      if (!w) {
        track.style.transform = "";
        return;
      }
      track.style.transform = `translate3d(${-w + next}px,0,0)`;
    };

    const settle = (delta: number) => {
      if (!alive) return;
      mode = "rest";
      pos = 0;
      const next = (photoIndexRef.current + delta + count) % count;
      photoIndexRef.current = next;
      setPhotoIndex(next);
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
      if (event.button !== 0 || mode === "glide") return;
      const target = event.target as HTMLElement;
      if (target.closest(".covers-lightbox-arrow, .covers-lightbox-close")) return;
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
      if (!drag.armed || event.pointerId !== drag.pointerId) return;
      const dx = event.clientX - drag.x;
      const dy = event.clientY - drag.y;
      if (!drag.moved) {
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
        if (Math.abs(dy) > Math.abs(dx)) {
          drag.armed = false;
          return;
        }
        drag.moved = true;
        stage.classList.add("is-drag");
        try {
          stage.setPointerCapture(event.pointerId);
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
      if (event.pointerId !== drag.pointerId) return;
      const moved = drag.moved;
      drag.armed = false;
      drag.moved = false;
      drag.pointerId = -1;
      stage.classList.remove("is-drag");
      if (stage.hasPointerCapture(event.pointerId)) {
        try {
          stage.releasePointerCapture(event.pointerId);
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

    const realign = () => {
      if (mode === "glide") {
        mode = "rest";
        cancelAnimationFrame(raf);
        raf = 0;
      }
      drag.armed = false;
      stage.classList.remove("is-drag");
      paint(0);
    };

    let seenWidth = width();
    const observer = new ResizeObserver(() => {
      const next = width();
      if (next === seenWidth) return;
      seenWidth = next;
      realign();
    });

    paint(0);
    observer.observe(stage);
    stage.addEventListener("pointerdown", onDown);
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerup", endDrag);
    stage.addEventListener("pointercancel", endDrag);
    window.addEventListener("resize", realign);

    return () => {
      alive = false;
      goRef.current = () => {};
      cancelAnimationFrame(raf);
      observer.disconnect();
      stage.removeEventListener("pointerdown", onDown);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerup", endDrag);
      stage.removeEventListener("pointercancel", endDrag);
      window.removeEventListener("resize", realign);
    };
  }, [openId, photos.length]);

  useLayoutEffect(() => {
    const node = dialogRef.current;
    if (!node) return;
    if (!project) {
      if (node.open) node.close();
      return;
    }
    if (!node.open) {
      const fromPointer = pointerOpen.current;
      pointerOpen.current = false;
      node.showModal();
      // Esc leaves keyboard focus on, so the next showModal() rings a control
      // inside the preview. A click should not show that ring.
      if (fromPointer) node.focus({ preventScroll: true });
    }
  }, [project]);

  function openProject(id: string, button: HTMLButtonElement, fromPointer: boolean) {
    if (drag.current.moved) {
      drag.current.moved = false;
      return;
    }
    pointerOpen.current = fromPointer;
    openerRef.current = button;
    setPhotoIndex(0);
    setOpenId(id);
  }

  function stepPhoto(delta: number) {
    if (photos.length < 2) return;
    goRef.current(delta);
  }

  function closePreview() {
    dialogRef.current?.close();
  }

  function scrollRail(direction: number) {
    const rail = railRef.current;
    const card = rail?.querySelector<HTMLElement>(".covers-card");
    if (!rail || !card) return;
    const gap = 16;
    rail.scrollBy({ left: direction * (card.offsetWidth + gap), behavior: "smooth" });
  }

  function snapRail() {
    const rail = railRef.current;
    const card = rail?.querySelector<HTMLElement>(".covers-card");
    if (!rail || !card) return;
    const step = card.offsetWidth + 16;
    const index = Math.round(rail.scrollLeft / step);
    rail.scrollTo({ left: index * step, behavior: "smooth" });
  }

  function onRailPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    const rail = railRef.current;
    if (!rail) return;
    drag.current = {
      x: event.clientX,
      y: event.clientY,
      left: rail.scrollLeft,
      armed: true,
      moved: false,
    };
  }

  function onRailPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const rail = railRef.current;
    if (!rail || !drag.current.armed) return;
    const dx = event.clientX - drag.current.x;
    const dy = event.clientY - drag.current.y;
    if (!drag.current.moved) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      if (Math.abs(dy) > Math.abs(dx)) {
        drag.current.armed = false;
        return;
      }
      drag.current.moved = true;
      rail.setPointerCapture(event.pointerId);
    }
    rail.scrollLeft = drag.current.left - dx;
  }

  function onRailPointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (!drag.current.armed && !drag.current.moved) return;
    const moved = drag.current.moved;
    drag.current.armed = false;
    const rail = railRef.current;
    if (rail?.hasPointerCapture(event.pointerId)) rail.releasePointerCapture(event.pointerId);
    if (moved) {
      snapRail();
      window.setTimeout(() => {
        drag.current.moved = false;
      }, 0);
    }
  }

  return (
    <div className="covers">
      <div className="covers-stage">
        <div
          className="covers-rail"
          ref={railRef}
        tabIndex={0}
        aria-roledescription="karuzela"
        aria-label={carousel.covers}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") {
              event.preventDefault();
              scrollRail(1);
            }
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              scrollRail(-1);
            }
          }}
          onPointerDown={onRailPointerDown}
          onPointerMove={onRailPointerMove}
          onPointerUp={onRailPointerUp}
          onPointerCancel={onRailPointerUp}
        >
          {projects.map((item) => {
          const cover = item.frames[0];
            return (
              <button
                key={item.id}
                type="button"
                className="covers-card"
                onClick={(event) => openProject(item.id, event.currentTarget, event.detail > 0)}
                aria-label={carousel.open(item.title)}
              >
                <img
                  src={cover.src}
                  srcSet={cover.srcSet}
                  sizes="(max-width: 800px) 72vw, 280px"
                  alt=""
                  draggable={false}
                  decoding="async"
                />
                <strong>
                  {item.id === "mokotow"
                    ? `${carousel.named(item.title)} | ${carousel.realizacja}`
                    : carousel.named(item.title)}
                </strong>
              </button>
            );
          })}
        </div>
        <button
          type="button"
          className="covers-arrow covers-arrow-prev"
          aria-label={carousel.back}
          disabled={page <= 0}
          onClick={() => scrollRail(-1)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M14.5 5.5 L8 12 l6.5 6.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </button>
        <button
          type="button"
          className="covers-arrow covers-arrow-next"
          aria-label={carousel.forward}
          disabled={page >= pages - 1}
          onClick={() => scrollRail(1)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9.5 5.5 L16 12 l-6.5 6.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </button>
      </div>

      <div className="covers-nav">
        <div
          className="covers-progress"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={pages}
          aria-valuenow={page + 1}
          aria-label={carousel.covers}
        >
          {Array.from({ length: pages }, (_, index) => (
            <span key={index} className={index <= page ? "is-on" : ""} />
          ))}
        </div>
      </div>

      <dialog
        className="lightbox covers-lightbox"
        tabIndex={-1}
        ref={dialogRef}
        aria-label={project ? carousel.preview(project.title) : carousel.covers}
        onClose={() => {
          const opener = openerRef.current;
          setOpenId(null);
          // Wait until Esc finishes restoring focus, or the ring lands on Wstecz.
          requestAnimationFrame(() => opener?.focus({ preventScroll: true }));
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          const target = event.target as HTMLElement;
          if (target.closest(".covers-lightbox-arrow, .covers-lightbox-close")) return;
          swipe.current = { x: event.clientX, y: event.clientY, armed: true };
        }}
        onPointerUp={(event) => {
          if (!swipe.current.armed) return;
          const dx = event.clientX - swipe.current.x;
          const dy = event.clientY - swipe.current.y;
          swipe.current.armed = false;
          const mobile = window.matchMedia("(max-width: 800px)").matches;
          if (mobile && dy < -64 && Math.abs(dy) > Math.abs(dx)) {
            suppressClick.current = true;
            closePreview();
          }
        }}
        onPointerCancel={() => {
          swipe.current.armed = false;
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            stepPhoto(1);
          }
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            stepPhoto(-1);
          }
        }}
      >
        {project ? (
          <>
            <div className="lightbox-bar">
              <button
                type="button"
                className="icon-btn covers-lightbox-close"
                onClick={closePreview}
                aria-label={carousel.close}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 6 L18 18 M18 6 L6 18" fill="none" stroke="currentColor" strokeWidth="1.15" />
                </svg>
              </button>
            </div>
            <div className="covers-lightbox-body">
              {photo ? (
                <div className="covers-lightbox-stage">
                  <div className="covers-lightbox-clip" ref={stageRef}>
                    <img
                      className="covers-lightbox-sizer"
                      src={photo.original}
                      alt=""
                      aria-hidden="true"
                      draggable={false}
                    />
                    <div className="covers-lightbox-track" ref={trackRef}>
                      {[mod(photoIndex - 1), photoIndex, mod(photoIndex + 1)].map((slot, position) => {
                        const frame = photos[slot];
                        const current = position === 1;
                        return (
                          <div className="covers-lightbox-slide" key={position}>
                            <img
                              src={frame.original}
                              alt={current ? `${project.title} — ${frame.label}` : ""}
                              aria-hidden={current ? undefined : true}
                              draggable={false}
                            />
                          </div>
                        );
                      })}
                    </div>
                    <button
                      type="button"
                      className="covers-lightbox-zone covers-lightbox-zone-prev"
                      tabIndex={-1}
                      aria-label={carousel.back}
                      onClick={() => {
                        if (suppressClick.current) {
                          suppressClick.current = false;
                          return;
                        }
                        stepPhoto(-1);
                      }}
                    />
                    <button
                      type="button"
                      className="covers-lightbox-zone covers-lightbox-zone-next"
                      tabIndex={-1}
                      aria-label={carousel.forward}
                      onClick={() => {
                        if (suppressClick.current) {
                          suppressClick.current = false;
                          return;
                        }
                        stepPhoto(1);
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    className="covers-lightbox-arrow covers-lightbox-arrow-prev"
                    aria-label={carousel.back}
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={() => stepPhoto(-1)}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M14.5 5.5 L8 12 l6.5 6.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="covers-lightbox-arrow covers-lightbox-arrow-next"
                    aria-label={carousel.forward}
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={() => stepPhoto(1)}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M9.5 5.5 L16 12 l-6.5 6.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                    </svg>
                  </button>
                </div>
              ) : null}
              <div
                className="covers-lightbox-progress"
                role="progressbar"
                aria-valuemin={1}
                aria-valuemax={Math.max(photos.length, 1)}
                aria-valuenow={photoIndex + 1}
                aria-label={carousel.frames}
              >
                {photos.map((item, index) => (
                  <span key={item.src} className={index <= photoIndex ? "is-on" : ""} />
                ))}
              </div>
              <p className="covers-lightbox-count">
                {photoIndex + 1} / {photos.length}
              </p>
            </div>
          </>
        ) : null}
      </dialog>
    </div>
  );
}
