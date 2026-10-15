import { asset } from "../lib/asset";

export const projects = [
  {
    id: "p1",
    title: "Mokotów loft",
    meta: "68 m² · Warszawa",
    copy: "Otwarta kuchnia, niski sofa i światło z północy. Mniej mebli, więcej powietrza między nimi.",
    src: asset("/visuals/living-pendants.jpg"),
    layout: "left",
  },
  {
    id: "p2",
    title: "Dom, Wilanów",
    meta: "210 m² · ogród",
    copy: "Parter łączy salon z tarasem. Kamienie, dąb i zasłony, które gaszą południe.",
    src: asset("/visuals/stairs.jpg"),
    layout: "right",
  },
  {
    id: "p3",
    title: "Śródmieście",
    meta: "42 m² · kamienica",
    copy: "Wąskie mieszkanie: jedna oś, dwa nastroje. Gabinet chowa się za przesuwaną tkaniną.",
    src: asset("/visuals/dining.jpg"),
    layout: "left",
  },
] as const;

export const mosaic = [
  { id: "m1", title: "Kuchnia", note: "wyspa", src: asset("/visuals/kitchen-island.jpg") },
  { id: "m2", title: "Łazienka", note: "zieleń", src: asset("/visuals/bath1.jpg") },
  { id: "m3", title: "Garderoba", note: "łuk", src: asset("/visuals/wardrobe.jpg") },
  { id: "m4", title: "Przedpokój", note: "kamienica", src: asset("/visuals/hall.jpg") },
] as const;
