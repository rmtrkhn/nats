import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { studio } from "../../content/studio";
import { type Locale, getUi, localeHref } from "../../lib/i18n";

export function PrivacyPage({ locale }: { locale: Locale }) {
  const copy = getUi(locale).privacy;

  return (
    <>
      <SiteHeader locale={locale} route="polityka" />
      <main className="page prose">
        <p className="kicker">{copy.kicker}</p>
        <h1>{copy.title}</h1>
        <p>
          {copy.p1}{" "}
          <a href={`mailto:${studio.email}`}>{studio.email}</a>.
        </p>
        <p>{copy.p2}</p>
        <p>{copy.p3}</p>
        <p>{copy.p4}</p>
        <p>
          <a href={localeHref(locale, "home")}>{copy.back}</a>
        </p>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
