import { asset } from "../lib/asset";

export type Frame = {
  src: string;
  srcSet: string;
  width: number;
  height: number;
  label: string;
  role: "idea" | "plan" | "light" | "node" | "material";
};

export const imageSizes = "(max-width: 800px) calc(100vw - 32px), 570px";

function photo(
  file: string,
  label: string,
  role: Frame["role"],
  width: number,
  height: number,
): Frame {
  const src = asset(file);
  const small = asset(file.replace(/\.jpg$/, "-800.jpg"));
  return {
    src,
    srcSet: `${small} 800w, ${src} ${width}w`,
    width,
    height,
    label,
    role,
  };
}

export const projects = [
  {
    id: "antresola",
    title: "Dom z antresolą",
    meta: "Warszawa · dwa poziomy",
    copy: "Jedna oś: salon, stół i kuchnia w tym samym świetle. Schody z kamienia niosą na górę, bez korytarza.",
    layout: "left" as const,
    frames: [
      photo("/visuals/projects/antresola/salon.jpg", "Salon, stół, wyspa", "idea", 1200, 1500),
      photo("/visuals/projects/antresola/schody.jpg", "Schody i oś pionowa", "plan", 1200, 1500),
      photo("/visuals/projects/antresola/jadalnia.jpg", "Światło przy stole", "light", 1200, 1500),
      photo("/visuals/projects/antresola/kuchnia.jpg", "Zielony kamień, dąb", "material", 1200, 1500),
      photo("/visuals/projects/antresola/nisza.jpg", "Nisza kawowa", "node", 1200, 1500),
      photo("/visuals/projects/antresola/sypialnia.jpg", "Sypialnia na górze", "plan", 1500, 1140),
      photo("/visuals/projects/antresola/lazienka.jpg", "Łazienka — lustro i prysznic", "node", 1200, 1500),
      photo("/visuals/projects/antresola/wanna.jpg", "Wanna przy oknie, makra kamienia", "material", 1200, 1500),
    ],
  },
  {
    id: "kamienica",
    title: "Kamienica",
    meta: "Warszawa · wąski trakt",
    copy: "Przedpokój trzyma strop i łuki szafy. Łazienka — terrazzo, oliwkowa płytka, prysznic w głębi osi.",
    layout: "right" as const,
    frames: [
      photo("/visuals/projects/kamienica/garderoba.jpg", "Garderoba w osi wejścia", "idea", 1050, 1500),
      photo("/visuals/projects/kamienica/przedpokoj.jpg", "Drzwi, lustro, posadzka", "plan", 1050, 1500),
      photo("/visuals/projects/kamienica/lazienka.jpg", "Umywalka i przejście do prysznica", "light", 1200, 1500),
      photo("/visuals/projects/kamienica/prysznic.jpg", "Płytka i światło w kabinie", "material", 1200, 1500),
    ],
  },
] as const;
