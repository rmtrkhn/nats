"use client";

import { useEffect, useRef, useState } from "react";
import { projects } from "../../content/projects";
import { type Locale, getUi } from "../../lib/i18n";

export function CoverCarousel({ locale }: { locale: Locale }) {
  const carousel = getUi(locale).carousel;
  const railRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const drag = useRef({ x: 0, y: 0, left: 0, armed: false, moved: false });
  const swipe = useRef({ x: 0, armed: false });
  const [openId, setOpenId] = useState<string | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const project = projects.find((item) => item.id === openId) ?? null;
  const photos = project ? project.frames.slice(1) : [];
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

  useEffect(() => {
    const node = dialogRef.current;
    if (!node) return;
    if (!project) {
      if (node.open) node.close();
      return;
    }
    if (!node.open) node.showModal();
  }, [project]);

  function openProject(id: string, button: HTMLButtonElement) {
    if (drag.current.moved) {
      drag.current.moved = false;
      return;
    }
    openerRef.current = button;
    setPhotoIndex(0);
    setOpenId(id);
  }

  function stepPhoto(delta: number) {
    setPhotoIndex((current) => {
      const next = current + delta;
      if (next < 0 || next >= photos.length) return current;
      return next;
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
              onClick={(event) => openProject(item.id, event.currentTarget)}
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
              <span className="covers-meta">{item.meta}</span>
              <strong>{item.title}</strong>
            </button>
          );
        })}
      </div>

      <div className="covers-nav">
        <button type="button" className="covers-action" onClick={() => scrollRail(-1)}>
          {carousel.back}
        </button>
        <button type="button" className="covers-action covers-action-next" onClick={() => scrollRail(1)}>
          {carousel.forward}
        </button>
      </div>

      <dialog
        className="lightbox covers-lightbox"
        ref={dialogRef}
        aria-label={project ? carousel.preview(project.title) : carousel.covers}
        onClose={() => {
          setOpenId(null);
          openerRef.current?.focus({ preventScroll: true });
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
              <p className="covers-lightbox-title">{project.title}</p>
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
                    stepPhoto(dx < 0 ? 1 : -1);
                  }}
                  onPointerCancel={() => {
                    swipe.current.armed = false;
                  }}
                >
                  <img
                    key={photo.src}
                    src={photo.src}
                    alt={`${project.title} — ${photo.label}`}
                    draggable={false}
                  />
                  <button
                    type="button"
                    className="covers-lightbox-arrow covers-lightbox-arrow-prev"
                    aria-label={carousel.back}
                    disabled={photoIndex === 0}
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
                    disabled={photoIndex === photos.length - 1}
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
