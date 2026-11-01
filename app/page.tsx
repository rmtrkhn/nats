import { ContactForm } from "./components/ContactForm";
import { ProjectCarousel } from "./components/ProjectCarousel";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import { imageSizes, projects } from "../content/projects";

export default function HomePage() {
  const cover = projects[0];
  const hero = cover.frames[0];

  return (
    <>
      <SiteHeader />
      <main id="top">
        <section className="hero">
          <div className="page hero-grid">
            <div className="hero-visual">
              <div className="frame" style={{ aspectRatio: "1050 / 1140" }}>
                <img
                  src={hero.src}
                  srcSet={hero.srcSet}
                  sizes={imageSizes}
                  width={hero.width}
                  height={hero.height}
                  alt={`${cover.title} — ${hero.label}`}
                  fetchPriority="high"
                  decoding="async"
                />
              </div>
              <p className="caption">
                {cover.title} · {hero.label}
              </p>
            </div>
            <div className="hero-copy">
              <p className="kicker">Warszawa</p>
              <h1>
                Wnętrza,
                <br />
                <em>które zostają.</em>
              </h1>
              <p className="lead">
                Dziesięć realizacji. Od osi i światła do węzła i faktury.
              </p>
            </div>
          </div>
        </section>

        <section className="issue" id="realizacje">
          <header className="page issue-head">
            <div>
              <p className="kicker">Realizacje</p>
              <h2>
                Dziesięć wnętrz,
                <br />
                <em>pełna głębokość</em>
              </h2>
            </div>
          </header>
          {projects.map((project) => (
            <ProjectCarousel
              key={project.id}
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
            <p className="kicker">O studiu</p>
            <h2>Filozofia</h2>
            <p>
              Projektujemy od światła i materiału, nie od katalogu. Mało
              przedmiotów, czytelna oś, faktura widoczna z bliska.
            </p>
            <dl className="facts">
              <div>
                <dt>Praca</dt>
                <dd>Koncepcja, rysunek, światło, odbiór</dd>
              </div>
              <div>
                <dt>Miejsce</dt>
                <dd>Warszawa</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="contact" id="kontakt">
          <div className="page contact-inner">
            <div>
              <p className="kicker">Kontakt</p>
              <h2>Rozmowa o metrażu.</h2>
              <p className="contact-lead">Krótki opis mieszkania wystarczy.</p>
              <p className="contact-links">
                <a href="mailto:hello@atelierlew.pl">hello@atelierlew.pl</a>
                <a href="tel:+48500100200">+48 500 100 200</a>
              </p>
            </div>
            <ContactForm projects={projects.map((project) => ({ id: project.id, title: project.title }))} />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
