import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import { localeHref } from "../lib/i18n";

export default function NotFound() {
  return (
    <>
      <SiteHeader locale="pl" route="home" />
      <main className="page prose">
        <p className="kicker">404</p>
        <h1>Nie ma takiej strony.</h1>
        <p>Ten adres nie prowadzi do realizacji ani do kontaktu.</p>
        <p>
          <a className="btn" href={localeHref("pl", "home")}>
            Wróć na stronę główną
          </a>
        </p>
      </main>
      <SiteFooter locale="pl" />
    </>
  );
}
