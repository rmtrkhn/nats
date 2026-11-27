"use client";

import { asset } from "../../lib/asset";
import { type Locale, getUi, localeHref } from "../../lib/i18n";

let scrollFrame = 0;
let detachScroll = () => {};

function scrollToKontakt(event: React.MouseEvent<HTMLAnchorElement>) {
  const link = new URL(event.currentTarget.href, window.location.href);
  if (link.pathname !== window.location.pathname || link.hash !== "#kontakt") return;
  const target = document.getElementById("kontakt");
  if (!target) return;
  event.preventDefault();
  const nav = document.querySelector(".nav");
  const offset = nav instanceof HTMLElement ? nav.offsetHeight : 0;
  const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  detachScroll();
  cancelAnimationFrame(scrollFrame);
  if (!reduce && Math.abs(top - window.scrollY) > 2) {
    const start = window.scrollY;
    const distance = top - start;
    const duration = Math.min(1400, Math.max(700, Math.abs(distance) * 0.5));
    const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
    const started = performance.now();
    const stop = () => {
      cancelAnimationFrame(scrollFrame);
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchstart", stop);
      detachScroll = () => {};
    };
    detachScroll = stop;
    const step = (now: number) => {
      const t = Math.min(1, (now - started) / duration);
      window.scrollTo(0, start + distance * ease(t));
      if (t < 1) scrollFrame = requestAnimationFrame(step);
      else stop();
    };
    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("touchstart", stop, { passive: true });
    scrollFrame = requestAnimationFrame(step);
  } else {
    window.scrollTo(0, top);
  }
  history.pushState(null, "", `${link.pathname}${link.search}#kontakt`);
}

export function SiteHeader({ locale }: { locale: Locale }) {
  const ui = getUi(locale);
  const home = localeHref(locale, "home");

  return (
    <header className="nav">
      <div className="page nav-inner">
        <a className="brand" href={`${home}#top`} aria-label="NATS">
          <img src={asset("/nats-logo.png")} alt="NATS" width={196} height={72} />
        </a>
        <div className="nav-tools">
          <a className="nav-cta" href={localeHref(locale, "home", "#kontakt")} onClick={scrollToKontakt}>
            {ui.nav.kontakt}
          </a>
        </div>
      </div>
    </header>
  );
}
