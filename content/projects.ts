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
  const src = `${asset(file)}?v=2`;
  return {
    src,
    srcSet: `${src} ${width}w`,
    width,
    height,
    label,
    role,
  };
}

const frame = [1050, 1140] as const;

export const projects = [
  {
    id: "belki",
    title: "Pod belkami",
    meta: "Warszawa · wysoki strop",
    copy: "Belki na skosie, jodła pod nogami. Kuchnia w tym samym beżu. Dwie łazienki: terrazzo i marmur.",
    layout: "left" as const,
    frames: [
      photo("/visuals/projects/01/salon.webp", "Salon, jodła, zielona sofa", "idea", ...frame),
      photo("/visuals/projects/01/sciana-tv.webp", "Ściana TV i regał", "plan", ...frame),
      photo("/visuals/projects/01/kuchnia.webp", "Wyspa i okno nad zlewem", "node", ...frame),
      photo("/visuals/projects/01/lazienka-master.webp", "Master — terrazzo, owalne lustro", "material", ...frame),
      photo("/visuals/projects/01/wanna.webp", "Wanna, płytka, ciepły sufit", "light", ...frame),
      photo("/visuals/projects/01/reczniki.webp", "Szafka na ręczniki", "node", ...frame),
    ],
  },
  {
    id: "wyspa",
    title: "Dębowa wyspa",
    meta: "Warszawa · salon z kuchnią",
    copy: "Zaokrąglona wyspa z witryną na szkło. Stół, obraz i biblioteczka siedzą w jednej boazerii.",
    layout: "right" as const,
    frames: [
      photo("/visuals/projects/02/salon.webp", "Sofa, stół, kuchnia w głębi", "idea", ...frame),
      photo("/visuals/projects/02/jadalnia.webp", "Obraz między kinkietami", "light", ...frame),
      photo("/visuals/projects/02/kuchnia.webp", "Wyspa z dębu i mosiądz", "node", ...frame),
      photo("/visuals/projects/02/biblioteka.webp", "Biblioteczka i fotel", "plan", ...frame),
      photo("/visuals/projects/02/telewizor.webp", "Ściana TV, kule światła", "light", ...frame),
      photo("/visuals/projects/02/os.webp", "Jedna oś: sofa, stół, wyspa", "plan", ...frame),
      photo("/visuals/projects/02/stol.webp", "Stół przy boazerii", "node", ...frame),
      photo("/visuals/projects/02/okno.webp", "Sofa na wprost okien", "light", ...frame),
    ],
  },
  {
    id: "pejzaz",
    title: "Pejzaż",
    meta: "Warszawa · sypialnia i gabinet",
    copy: "Za łóżkiem drzeworytowy pejzaż. Obok gabinet przy oknie: biurko, kanapa i lampa jak skrzydło.",
    layout: "left" as const,
    frames: [
      photo("/visuals/projects/03/sypialnia.webp", "Wezgłowie na tle pejzażu", "idea", ...frame),
      photo("/visuals/projects/03/gabinet.webp", "Biurko, kanapa, okno", "plan", ...frame),
    ],
  },
  {
    id: "schody",
    title: "Szklane schody",
    meta: "Warszawa · dwa poziomy",
    copy: "Balustrada ze szkła tnie salon. Ciemny dąb w kuchni. W łazience szczelina światła w szafie.",
    layout: "right" as const,
    frames: [
      photo("/visuals/projects/04/salon.webp", "Stół między schodami a sofą", "idea", ...frame),
      photo("/visuals/projects/04/schody.webp", "Szklana balustrada", "plan", ...frame),
      photo("/visuals/projects/04/stol.webp", "Stół widziany ze schodów", "node", ...frame),
      photo("/visuals/projects/04/sofa.webp", "Sofa i okrągłe kinkiety", "light", ...frame),
      photo("/visuals/projects/04/telewizor.webp", "Ściana TV w szczelinie światła", "light", ...frame),
      photo("/visuals/projects/04/kuchnia.webp", "Ciemny dąb, kamienny blat", "material", ...frame),
      photo("/visuals/projects/04/wc.webp", "Umywalka i prysznic", "node", ...frame),
      photo("/visuals/projects/04/lazienka.webp", "Szczelina światła w szafie", "material", ...frame),
    ],
  },
  {
    id: "nisza",
    title: "Nisza kawowa",
    meta: "Warszawa · kuchnia otwarta",
    copy: "Marmur, ciemny fornir, złote uchwyty. Ekspres stoi w niszy, sofa po drugiej stronie blatu.",
    layout: "left" as const,
    frames: [
      photo("/visuals/projects/05/sofa.webp", "Sofa przy ciągu kuchni", "idea", ...frame),
      photo("/visuals/projects/05/blat.webp", "Marmur, bateria, kinkiety", "material", ...frame),
      photo("/visuals/projects/05/marmur.webp", "Gruszka i złoty uchwyt", "material", ...frame),
      photo("/visuals/projects/05/ekspres.webp", "Ekspres w niszy", "node", ...frame),
      photo("/visuals/projects/05/nisza.webp", "Nisza kawowa, szerszy kadr", "node", ...frame),
      photo("/visuals/projects/05/stol.webp", "Czarny stół, welurowe krzesło", "plan", ...frame),
      photo("/visuals/projects/05/rtv.webp", "Szafka RTV i płyty", "light", ...frame),
    ],
  },
  {
    id: "luki",
    title: "Trzy łuki",
    meta: "Warszawa · kuchnia i salon",
    copy: "Łuk witryny w kuchni, trzy łuki nad sofą. Kominek w kamieniu zamyka ścianę.",
    layout: "right" as const,
    frames: [
      photo("/visuals/projects/06/wejscie.webp", "Konsola, łuk, kuchnia", "idea", ...frame),
      photo("/visuals/projects/06/wyspa.webp", "Wyspa pod szklanymi kloszami", "node", ...frame),
      photo("/visuals/projects/06/okap.webp", "Ryflowany okap, marmurowy blat", "material", ...frame),
      photo("/visuals/projects/06/krzesla.webp", "Wyspa otwarta na salon", "plan", ...frame),
      photo("/visuals/projects/06/jadalnia.webp", "Stół i witryna w łuku", "light", ...frame),
      photo("/visuals/projects/06/luki.webp", "Trzy łuki nad sofą", "plan", ...frame),
      photo("/visuals/projects/06/sofa.webp", "Sofa, łuki, światło w niszach", "light", ...frame),
      photo("/visuals/projects/06/kominek.webp", "Kominek w kamieniu", "material", ...frame),
    ],
  },
  {
    id: "kobalt",
    title: "Kobalt",
    meta: "Warszawa · mieszkanie",
    copy: "Korytarz w graficie i rysunku drewna, kuchnia w kobalcie. Łuk drzwi otwiera gabinet.",
    layout: "left" as const,
    frames: [
      photo("/visuals/projects/07/korytarz.webp", "Fornir jak mapa, czarna komoda", "idea", ...frame),
      photo("/visuals/projects/07/os.webp", "Oś na kobaltową kuchnię", "plan", ...frame),
      photo("/visuals/projects/07/salon.webp", "Salon i obraz nad szafką", "light", ...frame),
      photo("/visuals/projects/07/kobalt.webp", "Wyspa w kobalcie", "node", ...frame),
      photo("/visuals/projects/07/gabinet.webp", "Łuk drzwi do gabinetu", "plan", ...frame),
      photo("/visuals/projects/07/toaletka.webp", "Toaletka przy łóżku", "node", ...frame),
      photo("/visuals/projects/07/sypialnia.webp", "Łóżko, kobaltowa zasłona", "light", ...frame),
      photo("/visuals/projects/07/lazienka.webp", "Szachownica i ciemna płytka", "material", ...frame),
    ],
  },
  {
    id: "lampiony",
    title: "Lampiony",
    meta: "Warszawa · dom",
    copy: "Papierowe klosze nad sofą, zielony marmur w kuchni. Bordowy sufit w przedpokoju, prysznic w ciepłym beżu.",
    layout: "right" as const,
    frames: [
      photo("/visuals/projects/08/salon.webp", "Lampiony nad zielonym fotelem", "idea", ...frame),
      photo("/visuals/projects/08/jadalnia.webp", "Stół, sofa, zielony marmur", "plan", ...frame),
      photo("/visuals/projects/08/antresola.webp", "Jadalnia ze schodów", "plan", ...frame),
      photo("/visuals/projects/08/kuchnia.webp", "Zielony kamień, gięty dąb", "material", ...frame),
      photo("/visuals/projects/08/stol.webp", "Stół przy zielonym blacie", "light", ...frame),
      photo("/visuals/projects/08/kawa.webp", "Nisza na ekspres przy schodach", "node", ...frame),
      photo("/visuals/projects/08/przedpokoj.webp", "Szafa z łukami, bordowy sufit", "idea", ...frame),
      photo("/visuals/projects/08/wc.webp", "Lustro w podkowę", "node", ...frame),
      photo("/visuals/projects/08/prysznic.webp", "Prysznic w beżowej płytce", "light", ...frame),
      photo("/visuals/projects/08/umywalka.webp", "Umywalka i świecące lustro", "material", ...frame),
    ],
  },
  {
    id: "okno",
    title: "Przy oknie",
    meta: "Warszawa · sypialnia",
    copy: "Łóżko w lnie, firanka i lampa z trzech krążków. W łazience zielony pas płytki i wanna w marmurze.",
    layout: "left" as const,
    frames: [
      photo("/visuals/projects/09/sypialnia.webp", "Łóżko, firanka, trzy krążki", "idea", ...frame),
      photo("/visuals/projects/09/toaletka.webp", "Toaletka w świetle okna", "light", ...frame),
      photo("/visuals/projects/09/umywalka.webp", "Zielona płytka, marmurowy próg", "material", ...frame),
      photo("/visuals/projects/09/wanna.webp", "Wanna, szafka lustrzana", "node", ...frame),
    ],
  },
  {
    id: "ogrod",
    title: "Wino i ogród",
    meta: "Warszawa · salon przy ogrodzie",
    copy: "Bordowa sofa na wprost ogrodu. Wyspa w żółtej płytce, czerwony sufit w przedpokoju, kwiaty w WC.",
    layout: "right" as const,
    frames: [
      photo("/visuals/projects/10/salon.webp", "Bordowa sofa i ogród", "idea", ...frame),
      photo("/visuals/projects/10/stol.webp", "Stół pod papierową lampą", "light", ...frame),
      photo("/visuals/projects/10/wyspa.webp", "Żółta wyspa i stół", "node", ...frame),
      photo("/visuals/projects/10/plytki.webp", "Wyspa z półką", "material", ...frame),
      photo("/visuals/projects/10/schody.webp", "Schody i nisza na kawę", "plan", ...frame),
      photo("/visuals/projects/10/przedpokoj.webp", "Czerwony sufit, mozaika", "plan", ...frame),
      photo("/visuals/projects/10/wc.webp", "Kwiatowa tapeta, konsola", "material", ...frame),
    ],
  },
] as const;
