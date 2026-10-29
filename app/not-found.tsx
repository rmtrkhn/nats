import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import { asset } from "../lib/asset";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="page prose">
        <p className="kicker">404</p>
        <h1>Nie ma takiej strony.</h1>
        <p>Ten adres nie prowadzi do realizacji ani do kontaktu.</p>
        <p>
          <a className="btn" href={asset("/")}>
            Wróć na stronę główną
          </a>
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
