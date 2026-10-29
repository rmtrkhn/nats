import type { Metadata } from "next";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { asset } from "../../lib/asset";

export const metadata: Metadata = {
  title: "Polityka prywatności — NATS",
  description: "Jak NATS przetwarza dane z formularza kontaktowego.",
};

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="page prose">
        <p className="kicker">NATS</p>
        <h1>Polityka prywatności</h1>
        <p>
          Administratorem danych jest NATS, Warszawa. Kontakt w sprawie danych:{" "}
          <a href="mailto:hello@atelierlew.pl">hello@atelierlew.pl</a>.
        </p>
        <p>
          Formularz zbiera imię, adres e-mail, treść wiadomości i nazwę projektu,
          jeśli wybrałeś go z realizacji. Zaznaczenie zgody jest warunkiem wysłania.
        </p>
        <p>
          Dane służą tylko do odpowiedzi na zapytanie. Nie zakładamy konta i nie
          używamy ich do wysyłki ofert.
        </p>
        <p>
          Wiadomość przekazuje FormSubmit (formsubmit.co) na skrzynkę studia.
          Prośbę o usunięcie korespondencji wyślij na ten sam adres.
        </p>
        <p>
          <a href={asset("/")}>Wróć na stronę główną</a>
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
