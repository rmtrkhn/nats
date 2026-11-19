"use client";

import { useEffect, useState } from "react";
import { asset } from "../../lib/asset";
import { type Locale, type RouteId, getUi, localeHref } from "../../lib/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function SiteHeader({
  locale,
  route,
}: {
  locale: Locale;
  route: RouteId;
}) {
  const ui = getUi(locale);
  const home = localeHref(locale, "home");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 421px)");
    const onChange = () => {
      if (query.matches) setOpen(false);
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return (
    <header className={open ? "nav is-open" : "nav"}>
      <div className="page nav-inner">
        <a className="brand" href={`${home}#top`} aria-label="NATS" onClick={() => setOpen(false)}>
          <img src={asset("/nats-logo.png")} alt="NATS" width={196} height={72} />
        </a>
        {open ? (
          <button type="button" className="nav-backdrop" aria-label={ui.nav.close} onClick={() => setOpen(false)} />
        ) : null}
        <div className="nav-end" id="site-menu" onClick={() => setOpen(false)}>
          <nav className="nav-links" aria-label={locale === "en" ? "Site" : "Strona"}>
            <a href={localeHref(locale, "home", "#realizacje")} onClick={() => setOpen(false)}>
              {ui.nav.realizacje}
            </a>
            <a href={localeHref(locale, "dziennik")} onClick={() => setOpen(false)}>
              {ui.nav.dziennik}
            </a>
            <a href={localeHref(locale, "home", "#studio")} onClick={() => setOpen(false)}>
              {ui.nav.studio}
            </a>
            <a href={localeHref(locale, "home", "#kontakt")} onClick={() => setOpen(false)}>
              {ui.nav.kontakt}
            </a>
          </nav>
        </div>
        <div className="nav-tools">
          <LanguageSwitcher locale={locale} route={route} />
          <button
            type="button"
            className="nav-toggle"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="nav-toggle-bars" aria-hidden="true" />
            <span className="sr-only">{open ? ui.nav.close : ui.nav.menu}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
