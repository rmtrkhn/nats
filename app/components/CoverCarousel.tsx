"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { projects } from "../../content/projects";
import { type Locale, getUi } from "../../lib/i18n";

export function CoverCarousel({ locale }: { locale: Locale }) {
  const carousel = getUi(locale).carousel;
  const railRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const pointerOpen = useRef(false);
  const drag = useRef({ x: 0, y: 0, left: 0, armed: false, moved: false });
  const swipe = useRef({ x: 0, armed: false });
  const suppressClick = useRef(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);
  const project = projects.find((item) => item.id === openId) ?? null;
  const photos = project ? project.frames : [];
  const photo = photos[photoIndex] ?? null;

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
    setPhotoIndex((current) => {
      const count = photos.length;
      if (count < 2) return current;
      return (current + delta + count) % count;
    });
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
                  {`${carousel.named(item.title)} | ${item.id === "mokotow" ? carousel.realizacja : carousel.wizualizacja}`}
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
              <button type="button" className="icon-btn" onClick={closePreview}>
                {carousel.close}
              </button>
            </div>
            <div className="covers-lightbox-body">
              {photo ? (
                <div
                  className="covers-lightbox-stage"
                  onPointerDown={(event) => {
                    if (event.button !== 0) return;
                    swipe.current = { x: event.clientX, armed: true };
                  }}
                  onPointerUp={(event) => {
                    if (!swipe.current.armed) return;
                    const dx = event.clientX - swipe.current.x;
                    swipe.current.armed = false;
                    if (Math.abs(dx) < 40) return;
                    suppressClick.current = true;
                    stepPhoto(dx < 0 ? 1 : -1);
                  }}
                  onPointerCancel={() => {
                    swipe.current.armed = false;
                  }}
                >
                  <img
                    key={photo.original}
                    src={photo.original}
                    alt={`${project.title} — ${photo.label}`}
                    draggable={false}
                  />
                  <button
                    type="button"
                    className="covers-lightbox-zone covers-lightbox-zone-prev"
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
                    aria-label={carousel.forward}
                    onClick={() => {
                      if (suppressClick.current) {
                        suppressClick.current = false;
                        return;
                      }
                      stepPhoto(1);
                    }}
                  />
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
