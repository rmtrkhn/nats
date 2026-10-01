export const projects = [
  {
    id: "p1",
    title: "Mokotów loft",
    meta: "68 m² · Warszawa",
    copy: "Otwarta kuchnia, niski sofa i światło z północy. Mniej mebli, więcej powietrza między nimi.",
    tone: "linear-gradient(160deg, #cfc6b8 0%, #8e8678 42%, #d8d0c4 100%)",
    layout: "left",
  },
  {
    id: "p2",
    title: "Dom, Wilanów",
    meta: "210 m² · ogród",
    copy: "Parter łączy salon z tarasem. Kamienie, dąb i zasłony, które gaszą południe.",
    tone: "linear-gradient(200deg, #b7bdb4 0%, #6f766e 50%, #c5c1b6 100%)",
    layout: "right",
  },
  {
    id: "p3",
    title: "Śródmieście",
    meta: "42 m² · kamienica",
    copy: "Wąskie mieszkanie: jedna oś, dwa nastroje. Gabinet chowa się za przesuwaną tkaniną.",
    tone: "linear-gradient(180deg, #ddd4c8 0%, #9a8f82 100%)",
    layout: "left",
  },
] as const;

export const mosaic = [
  { id: "m1", title: "Żoliborz", note: "kuchnia", tone: "#d9d2c8" },
  { id: "m2", title: "Wola", note: "biuro", tone: "#c8c2b8" },
  { id: "m3", title: "Saska Kępa", note: "salon", tone: "#e2d8cc" },
  { id: "m4", title: "Praga", note: "sypialnia", tone: "#ccc8c0" },
] as const;
