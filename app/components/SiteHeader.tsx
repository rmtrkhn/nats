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
        <div className="nav-tools">
          <LanguageSwitcher locale={locale} route={route} />
          <a className="nav-cta" href={localeHref(locale, "home", "#kontakt")}>
            {ui.nav.kontakt}
          </a>
        </div>
      </div>
    </header>
  );
}
