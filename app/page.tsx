import { mosaic, projects } from "../content/projects";
import { asset } from "../lib/asset";

function Frame({
  src,
  label,
  className = "",
}: {
  src: string;
  label: string;
  className?: string;
}) {
  return (
    <div className={`frame ${className}`} aria-label={label}>
      <img src={src} alt={label} />
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <header className="nav">
        <div className="nav-inner">
          <a className="brand" href="#top">
            Atelier Lew
          </a>
          <a className="btn" href="#kontakt">
            Umów konsultację
          </a>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-visual">
            <Frame
              src={asset("/visuals/dining-sofa.jpg")}
              label="Salon i jadalnia — wizualizacja NATS.architects"
            />
          </div>
          <div className="hero-copy">
            <p className="kicker">Warszawa · nr 01</p>
            <h1>
              Wnętrza,
              <br />
              <em>które zostają.</em>
            </h1>
            <p className="lead">
              Magazyn jednego studia: mieszkania i domy projektowane od światła,
              nie od katalogu. Marta Lewandowska — od konsultacji do odbioru.
            </p>
          </div>
        </section>

        <section className="issue" id="realizacje">
          <div className="issue-head">
            <div className="issue-head-copy">
              <p className="kicker">Zeszyt realizacji</p>
              <h2>Obraz i opis</h2>
            </div>
          </div>

          {projects.map((p) => (
            <article
              key={p.id}
              className={p.layout === "right" ? "spread reverse" : "spread"}
            >
              <div className="spread-visual">
                <Frame src={p.src} label={`${p.title} — wizualizacja`} />
              </div>
              <div className="copy">
                <p className="kicker">{p.meta}</p>
                <h2>{p.title}</h2>
                <p>{p.copy}</p>
                <p className="caption">Wizualizacja 3D · NATS.architects</p>
                <div className="hero-actions" style={{ marginTop: 24 }}>
                  <a className="btn" href="#kontakt">
                    Zapytaj o podobny układ
                  </a>
                </div>
              </div>
            </article>
          ))}

          <div className="mosaic" aria-label="Galeria kadrów">
            {mosaic.map((m, i) => (
              <Frame
                key={m.id}
                className={["a", "b", "c", "d"][i]}
                src={m.src}
                label={`${m.title} · ${m.note}`}
              />
            ))}
          </div>
        </section>

        <section className="contact" id="kontakt">
          <div className="contact-inner">
            <div>
              <p className="kicker">Kolofon</p>
              <h2>Zacznijmy od rozmowy.</h2>
              <p style={{ color: "var(--muted)", maxWidth: "36ch" }}>
                Metraż, dzielnica, termin. Odpowiedź w dwa dni robocze — bez
                konta, bez logowania.
              </p>
              <p>
                <a href="mailto:hello@atelierlew.pl">hello@atelierlew.pl</a>
                <br />
                <a href="tel:+48500100200">+48 500 100 200</a>
              </p>
            </div>
            <form action="#kontakt">
              <label>
                Imię
                <input name="name" required autoComplete="name" />
              </label>
              <label>
                E-mail
                <input name="email" type="email" required autoComplete="email" />
              </label>
              <label>
                O projekcie
                <textarea name="message" rows={4} required />
              </label>
              <button className="btn" type="submit">
                Wyślij zapytanie
              </button>
            </form>
          </div>
        </section>
      </main>

      <div className="wrap">
        <footer className="site-foot">
          <span>© {new Date().getFullYear()} Atelier Lew · Warszawa</span>
          <span>Strona bez kont użytkowników</span>
        </footer>
      </div>
    </>
  );
}
