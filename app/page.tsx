import { mosaic, projects } from "../content/projects";

function Frame({
  tone,
  label,
  className = "",
}: {
  tone: string;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`frame ${className}`}
      style={{ background: tone }}
      aria-label={`${label} — placeholder`}
    >
      <span>{label}</span>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <header className="nav">
        <div className="wrap nav-inner">
          <a className="brand" href="#top">
            Atelier Lew
          </a>
          <nav className="nav-links" aria-label="Główne">
            <a href="#realizacje">Realizacje</a>
            <a href="#kontakt">Kontakt</a>
          </nav>
          <a className="btn" href="#kontakt">
            Umów konsultację
          </a>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <Frame
            tone="linear-gradient(145deg, #e7dfd3 0%, #9d9487 38%, #c9bfb2 70%, #efe8dc 100%)"
            label="wizualizacja · salon"
          />
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
            <div className="hero-actions">
              <a className="btn" href="#kontakt">
                Umów konsultację
              </a>
              <a className="btn ghost" href="#realizacje">
                Czytaj realizacje
              </a>
            </div>
          </div>
        </section>

        <section className="issue wrap" id="realizacje">
          <p className="kicker">Zeszyt realizacji</p>
          <h2 style={{ marginBottom: 48 }}>Obraz i opis</h2>

          {projects.map((p) => (
            <article
              key={p.id}
              className={`spread${p.layout === "right" ? " reverse" : ""}`}
            >
              <Frame tone={p.tone} label={`${p.title} · placeholder`} />
              <div className="copy">
                <p className="kicker">{p.meta}</p>
                <h2>{p.title}</h2>
                <p>{p.copy}</p>
                <p className="caption">Kadr zastępczy · 3D / foto po realizacji</p>
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
                tone={`linear-gradient(165deg, ${m.tone}, #8f877c)`}
                label={`${m.title} · ${m.note}`}
              />
            ))}
          </div>
        </section>

        <section className="wrap contact" id="kontakt">
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
