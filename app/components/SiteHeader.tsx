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

  return (
    <header className="nav">
      <div className="page nav-inner">
        <a className="brand" href={`${home}#top`} aria-label="NATS">
          <img src={asset("/nats-logo.png")} alt="NATS" width={196} height={72} />
        </a>
        <div className="nav-end">
          <nav className="nav-links" aria-label={locale === "en" ? "Site" : "Strona"}>
            <a href={localeHref(locale, "home", "#realizacje")}>{ui.nav.realizacje}</a>
            <a href={localeHref(locale, "dziennik")}>{ui.nav.dziennik}</a>
            <a href={localeHref(locale, "home", "#studio")}>{ui.nav.studio}</a>
            <a href={localeHref(locale, "home", "#kontakt")}>{ui.nav.kontakt}</a>
          </nav>
          <LanguageSwitcher locale={locale} route={route} />
        </div>
      </div>
    </header>
  );
}
