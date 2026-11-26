import { ContactSection } from "./ContactSection";
import { Journal } from "./Journal";
import { ProjectCarousel } from "./ProjectCarousel";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { type Locale, getUi } from "../../lib/i18n";
import { projects } from "../../content/projects";

export function HomePage({ locale }: { locale: Locale }) {
  const ui = getUi(locale);
  const copy = ui.home;

  return (
    <>
      <SiteHeader locale={locale} route="home" />
      <main id="top">
        <Journal locale={locale} subtitle={copy.journalSubtitle} />

        <section className="issue" id="realizacje">
          <header className="page issue-head">
            <div>
              <p className="kicker">{copy.issueKicker}</p>
              <h2>
                {copy.issueTitle[0]}
                <br />
                <em>{copy.issueTitle[1]}</em>
              </h2>
            </div>
          </header>
          {projects.map((project) => (
            <ProjectCarousel
              key={project.id}
              locale={locale}
              id={project.id}
              title={project.title}
              meta={project.meta}
              copy={project.copy}
              frames={project.frames}
              reverse={project.layout === "right"}
            />
          ))}
        </section>

        <section className="band" id="studio">
          <div className="page about">
            <p className="kicker">{copy.studioKicker}</p>
            <h2>{copy.studioTitle}</h2>
            <p>{copy.studioCopy}</p>
            <dl className="facts">
              <div>
                <dt>{copy.workLabel}</dt>
                <dd>{copy.workValue}</dd>
              </div>
              <div>
                <dt>{copy.placeLabel}</dt>
                <dd>{copy.placeValue}</dd>
              </div>
            </dl>
          </div>
        </section>

        <ContactSection locale={locale} />
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
