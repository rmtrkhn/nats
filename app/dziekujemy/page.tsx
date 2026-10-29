import type { Metadata } from "next";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { asset } from "../../lib/asset";

export const metadata: Metadata = {
  title: "Zapytanie przyjęte — NATS",
  robots: { index: false, follow: false },
};

export default function ThanksPage() {
  return (
    <>
      <SiteHeader />
      <main className="page prose">
        <p className="kicker">Kontakt</p>
        <h1>Zapytanie przyjęte.</h1>
        <p>Odpowiedź przyjdzie na adres podany w formularzu.</p>
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
