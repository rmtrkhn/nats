import { studio } from "../../content/studio";
import { type Locale, getUi, localeHref } from "../../lib/i18n";

export function SiteFooter({ locale }: { locale: Locale }) {
  const ui = getUi(locale);

  return (
    <footer className="site-foot">
      <div className="page foot-inner">
        <span>© {new Date().getFullYear()} NATS · {locale === "en" ? "Warsaw" : "Warszawa"}</span>
        <p className="foot-social">
          <a href={studio.instagram} target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
          <a href={studio.pinterest} target="_blank" rel="noopener noreferrer">
            Pinterest
          </a>
        </p>
        <a href={localeHref(locale, "polityka")}>{ui.footer.privacy}</a>
      </div>
    </footer>
  );
}
