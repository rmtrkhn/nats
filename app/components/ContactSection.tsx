import { ContactForm } from "./ContactForm";
import { type Locale, getUi } from "../../lib/i18n";
import { projects } from "../../content/projects";
import { studio } from "../../content/studio";

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
            <a href={`mailto:${studio.email}`}>{studio.email}</a>
            <a href={studio.phoneHref}>{studio.phone}</a>
          </p>
          <p className="contact-social">
            <a href={studio.instagram} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
            <a href={studio.pinterest} target="_blank" rel="noopener noreferrer">
              Pinterest
            </a>
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
