import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { type Locale, getUi, localeHref } from "../../lib/i18n";

export function ThanksPage({ locale }: { locale: Locale }) {
  const copy = getUi(locale).thanks;

  return (
    <>
      <SiteHeader locale={locale} />
      <main className="page prose">
        <p className="kicker">{copy.kicker}</p>
        <h1>{copy.title}</h1>
        <p>{copy.body}</p>
        <p>
          <a className="btn" href={localeHref(locale, "home")}>
            {copy.back}
          </a>
        </p>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
