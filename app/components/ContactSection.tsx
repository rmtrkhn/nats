import { ContactForm } from "./ContactForm";
import { type Locale, getUi } from "../../lib/i18n";
import { projects } from "../../content/projects";

export function ContactSection({ locale }: { locale: Locale }) {
  const copy = getUi(locale).home;

  return (
    <section className="contact" id="kontakt">
      <div className="page contact-inner">
        <div>
          <p className="kicker">{copy.contactKicker}</p>
          <h2>{copy.contactTitle}</h2>
          <p className="contact-lead">{copy.contactLead}</p>
          <p className="contact-links">
            <a href="mailto:hello@atelierlew.pl">hello@atelierlew.pl</a>
            <a href="tel:+48500100200">+48 500 100 200</a>
          </p>
        </div>
        <ContactForm
          locale={locale}
          projects={projects.map((item) => ({ id: item.id, title: item.title }))}
        />
      </div>
    </section>
  );
}
