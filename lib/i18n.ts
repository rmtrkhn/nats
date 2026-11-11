import { ui as uiEn } from "../content/ui/en";
import { ui as uiPl } from "../content/ui/pl";
import { asset } from "./asset";

export type Locale = "pl" | "en";
export type RouteId = "home" | "dziennik" | "polityka" | "dziekujemy";

export const locales: Locale[] = ["pl", "en"];

const paths: Record<Locale, Record<RouteId, string>> = {
  pl: {
    home: "/",
    dziennik: "/dziennik/",
    polityka: "/polityka/",
    dziekujemy: "/dziekujemy/",
  },
  en: {
    home: "/en/",
    dziennik: "/en/dziennik/",
    polityka: "/en/polityka/",
    dziekujemy: "/en/dziekujemy/",
  },
};

export function getUi(locale: Locale) {
  return locale === "en" ? uiEn : uiPl;
}

export function localeHref(locale: Locale, route: RouteId, hash?: string) {
  const raw = asset(paths[locale][route]);
  const path = raw.endsWith("/") ? raw : `${raw}/`;
  if (!hash) return path;
  const h = hash.startsWith("#") ? hash : `#${hash}`;
  return `${path}${h}`;
}

export function thanksRedirect(locale: Locale) {
  return `https://rmtrkhn.github.io${localeHref(locale, "dziekujemy")}`;
}
