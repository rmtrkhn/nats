import { type Locale, type RouteId, localeHref, locales } from "../../lib/i18n";

export function LanguageSwitcher({
  locale,
  route,
}: {
  locale: Locale;
  route: RouteId;
}) {
  return (
    <div className="lang-switch" role="navigation" aria-label="Language">
      {locales.map((loc, index) => (
        <span key={loc} className="lang-switch-item">
          {index > 0 ? <span className="lang-switch-sep" aria-hidden="true">/</span> : null}
          <a
            href={localeHref(loc, route)}
            lang={loc}
            hrefLang={loc}
            aria-current={loc === locale ? "page" : undefined}
            className={loc === locale ? "is-active" : undefined}
          >
            {loc.toUpperCase()}
          </a>
        </span>
      ))}
    </div>
  );
}
