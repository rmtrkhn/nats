import { ContactSection } from "./ContactSection";
import { CoverCarousel } from "./CoverCarousel";
import { Journal } from "./Journal";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { type Locale, getUi } from "../../lib/i18n";

export function HomePage({ locale }: { locale: Locale }) {
  const ui = getUi(locale);
  const copy = ui.home;

  return (
    <>
      <SiteHeader locale={locale} />
      <main id="top">
        <Journal locale={locale} subtitle={copy.journalSubtitle} />

        <section className="issue issue-covers" id="realizacje">
          <header className="page issue-head">
            <div>
              <h2>{copy.issueTitle}</h2>
            </div>
          </header>
          <CoverCarousel locale={locale} />
        </section>

        <section className="band" id="studio">
          <div className="page about">
            <h2>{copy.studioTitle}</h2>
            <p>{copy.studioCopy}</p>
          </div>
        </section>

        <ContactSection locale={locale} />
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
