import { asset } from "../../lib/asset";
import { type Locale, getUi, localeHref } from "../../lib/i18n";

export function SiteFooter({ locale }: { locale: Locale }) {
  const ui = getUi(locale);

  return (
    <footer className="site-foot">
      <div className="page foot-inner">
        <span>© {new Date().getFullYear()} NATS · {locale === "en" ? "Warsaw" : "Warszawa"}</span>
        <a href={localeHref(locale, "polityka")}>{ui.footer.privacy}</a>
      </div>
    </footer>
  );
}
