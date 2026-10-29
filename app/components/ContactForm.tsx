"use client";

import { useEffect, useState, type FormEvent } from "react";
import { asset } from "../../lib/asset";

type ProjectRef = { id: string; title: string };

const ENDPOINT = "https://formsubmit.co/ajax/hello@atelierlew.pl";

export function ContactForm({ projects }: { projects: readonly ProjectRef[] }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [consent, setConsent] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

  useEffect(() => {
    setHydrated(true);
    const id = new URLSearchParams(window.location.search).get("projekt");
    const found = projects.find((item) => item.id === id);
    if (!found) return;
    setProjectTitle(found.title);
    setMessage((prev) => prev || `Chcę porozmawiać o projekcie ${found.title}.`);
  }, [projects]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!consent) return;
    setStatus("sending");
    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          message,
          projekt: projectTitle,
          zgoda: "tak",
          _subject: projectTitle
            ? `NATS — zapytanie: ${projectTitle}`
            : "NATS — zapytanie",
          _template: "table",
          _captcha: "false",
        }),
      });
      if (!response.ok) throw new Error(String(response.status));
      const data = (await response.json()) as { success?: string | boolean };
      if (data.success === false || data.success === "false") throw new Error("rejected");
      setStatus("ok");
    } catch {
      setStatus("error");
    }
  }

  if (status === "ok") {
    return (
      <p className="form-status" role="status">
        Zapytanie przyjęte. Odpowiedź przyjdzie na podany adres.
      </p>
    );
  }

  return (
    <form
      method="post"
      action="https://formsubmit.co/hello@atelierlew.pl"
      onSubmit={onSubmit}
    >
      <input type="hidden" name="_captcha" value="false" />
      <input type="hidden" name="_template" value="table" />
      <input
        type="hidden"
        name="_subject"
        value={projectTitle ? `NATS — zapytanie: ${projectTitle}` : "NATS — zapytanie"}
      />
      <input type="hidden" name="_next" value="https://rmtrkhn.github.io/nats/dziekujemy/" />
      {projectTitle ? (
        <p className="project-ref">
          Wiadomość dotyczy projektu {projectTitle}.
          <input type="hidden" name="projekt" value={projectTitle} />
        </p>
      ) : null}
      <label htmlFor="name">
        Imię <span className="req">*</span>
        <input
          id="name"
          name="name"
          required
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </label>
      <label htmlFor="email">
        E-mail <span className="req">*</span>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>
      <label htmlFor="message">
        O projekcie <span className="req">*</span>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
      </label>
      <p className="form-note">Pola oznaczone * są wymagane.</p>
      <div className="consent">
        <input
          id="consent"
          name="zgoda"
          type="checkbox"
          value="tak"
          required
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
        />
        <span>
          <label htmlFor="consent">
            Zgadzam się na przetwarzanie imienia, adresu e-mail i treści wiadomości w celu
            odpowiedzi na zapytanie.
          </label>{" "}
          <a href={asset("/polityka/")}>Polityka prywatności</a>
        </span>
      </div>
      {status === "error" ? (
        <p className="form-status" role="alert">
          Nie udało się wysłać. Napisz bezpośrednio na{" "}
          <a href="mailto:hello@atelierlew.pl">hello@atelierlew.pl</a>.
        </p>
      ) : null}
      <button className="btn" type="submit" disabled={hydrated && (!consent || status === "sending")}>
        {status === "sending" ? "Wysyłanie" : "Wyślij"}
      </button>
    </form>
  );
}
