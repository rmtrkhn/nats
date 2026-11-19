"use client";

import { useEffect, useState, type FormEvent } from "react";
import { asset } from "../../lib/asset";
import { studio } from "../../content/studio";
import { type Locale, getUi, localeHref, thanksRedirect } from "../../lib/i18n";

type ProjectRef = { id: string; title: string };

const ENDPOINT = `https://formsubmit.co/ajax/${studio.email}`;

export function ContactForm({
  locale,
  projects,
}: {
  locale: Locale;
  projects: readonly ProjectRef[];
}) {
  const t = getUi(locale).form;
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
    const form = getUi(locale).form;
    setProjectTitle(found.title);
    setMessage((prev) => prev || form.prefilled(found.title));
  }, [projects, locale]);

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
          _subject: projectTitle ? t.subjectProject(projectTitle) : t.subject,
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
        {t.ok}
      </p>
    );
  }

  return (
    <form
      method="post"
      action={`https://formsubmit.co/${studio.email}`}
      onSubmit={onSubmit}
    >
      <input type="hidden" name="_captcha" value="false" />
      <input type="hidden" name="_template" value="table" />
      <input
        type="hidden"
        name="_subject"
        value={projectTitle ? t.subjectProject(projectTitle) : t.subject}
      />
      <input type="hidden" name="_next" value={thanksRedirect(locale)} />
      {projectTitle ? (
        <p className="project-ref">
          {t.projectRef(projectTitle)}
          <input type="hidden" name="projekt" value={projectTitle} />
        </p>
      ) : null}
      <label htmlFor="name">
        {t.name} <span className="req">*</span>
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
        {t.email} <span className="req">*</span>
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
        {t.message} <span className="req">*</span>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
      </label>
      <p className="form-note">{t.requiredNote}</p>
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
            {t.consent}
          </label>{" "}
          <a href={localeHref(locale, "polityka")}>{t.privacy}</a>
        </span>
      </div>
      {status === "error" ? (
        <p className="form-status" role="alert">
          {t.error}{" "}
          <a href={`mailto:${studio.email}`}>{studio.email}</a>.
        </p>
      ) : null}
      <button className="btn" type="submit" disabled={hydrated && (!consent || status === "sending")}>
        {status === "sending" ? t.sending : t.send}
      </button>
    </form>
  );
}
