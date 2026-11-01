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
      photo("/visuals/projects/01/salon.jpg", "Salon, jodła, zielona sofa", "idea", ...frame),
      photo("/visuals/projects/01/sciana-tv.jpg", "Ściana TV i regał", "plan", ...frame),
      photo("/visuals/projects/01/kuchnia.jpg", "Wyspa i okno nad zlewem", "node", ...frame),
      photo("/visuals/projects/01/lazienka-master.jpg", "Master — terrazzo, owalne lustro", "material", ...frame),
      photo("/visuals/projects/01/wanna.jpg", "Wanna, płytka, ciepły sufit", "light", ...frame),
      photo("/visuals/projects/01/reczniki.jpg", "Szafka na ręczniki", "node", ...frame),
    ],
  },
  {
    id: "wyspa",
    title: "Dębowa wyspa",
    meta: "Warszawa · salon z kuchnią",
    copy: "Zaokrąglona wyspa z witryną na szkło. Stół, obraz i biblioteczka siedzą w jednej boazerii.",
    layout: "right" as const,
    frames: [
      photo("/visuals/projects/02/salon.jpg", "Sofa, stół, kuchnia w głębi", "idea", ...frame),
      photo("/visuals/projects/02/jadalnia.jpg", "Obraz między kinkietami", "light", ...frame),
      photo("/visuals/projects/02/kuchnia.jpg", "Wyspa z dębu i mosiądz", "node", ...frame),
      photo("/visuals/projects/02/biblioteka.jpg", "Biblioteczka i fotel", "plan", ...frame),
      photo("/visuals/projects/02/telewizor.jpg", "Ściana TV, kule światła", "light", ...frame),
      photo("/visuals/projects/02/os.jpg", "Jedna oś: sofa, stół, wyspa", "plan", ...frame),
      photo("/visuals/projects/02/stol.jpg", "Stół przy boazerii", "node", ...frame),
      photo("/visuals/projects/02/okno.jpg", "Sofa na wprost okien", "light", ...frame),
    ],
  },
  {
    id: "pejzaz",
    title: "Pejzaż",
    meta: "Warszawa · sypialnia i gabinet",
    copy: "Za łóżkiem drzeworytowy pejzaż. Obok gabinet przy oknie: biurko, kanapa i lampa jak skrzydło.",
    layout: "left" as const,
    frames: [
      photo("/visuals/projects/03/sypialnia.jpg", "Wezgłowie na tle pejzażu", "idea", ...frame),
      photo("/visuals/projects/03/gabinet.jpg", "Biurko, kanapa, okno", "plan", ...frame),
    ],
  },
  {
    id: "schody",
    title: "Szklane schody",
    meta: "Warszawa · dwa poziomy",
    copy: "Balustrada ze szkła tnie salon. Ciemny dąb w kuchni. W łazience szczelina światła w szafie.",
    layout: "right" as const,
    frames: [
      photo("/visuals/projects/04/salon.jpg", "Stół między schodami a sofą", "idea", ...frame),
      photo("/visuals/projects/04/schody.jpg", "Szklana balustrada", "plan", ...frame),
      photo("/visuals/projects/04/stol.jpg", "Stół widziany ze schodów", "node", ...frame),
      photo("/visuals/projects/04/sofa.jpg", "Sofa i okrągłe kinkiety", "light", ...frame),
      photo("/visuals/projects/04/telewizor.jpg", "Ściana TV w szczelinie światła", "light", ...frame),
      photo("/visuals/projects/04/kuchnia.jpg", "Ciemny dąb, kamienny blat", "material", ...frame),
      photo("/visuals/projects/04/wc.jpg", "Umywalka i prysznic", "node", ...frame),
      photo("/visuals/projects/04/lazienka.jpg", "Szczelina światła w szafie", "material", ...frame),
    ],
  },
  {
    id: "nisza",
    title: "Nisza kawowa",
    meta: "Warszawa · kuchnia otwarta",
    copy: "Marmur, ciemny fornir, złote uchwyty. Ekspres stoi w niszy, sofa po drugiej stronie blatu.",
    layout: "left" as const,
    frames: [
      photo("/visuals/projects/05/sofa.jpg", "Sofa przy ciągu kuchni", "idea", ...frame),
      photo("/visuals/projects/05/blat.jpg", "Marmur, bateria, kinkiety", "material", ...frame),
      photo("/visuals/projects/05/marmur.jpg", "Gruszka i złoty uchwyt", "material", ...frame),
      photo("/visuals/projects/05/ekspres.jpg", "Ekspres w niszy", "node", ...frame),
      photo("/visuals/projects/05/nisza.jpg", "Nisza kawowa, szerszy kadr", "node", ...frame),
      photo("/visuals/projects/05/stol.jpg", "Czarny stół, welurowe krzesło", "plan", ...frame),
      photo("/visuals/projects/05/rtv.jpg", "Szafka RTV i płyty", "light", ...frame),
    ],
  },
  {
    id: "luki",
    title: "Trzy łuki",
    meta: "Warszawa · kuchnia i salon",
    copy: "Łuk witryny w kuchni, trzy łuki nad sofą. Kominek w kamieniu zamyka ścianę.",
    layout: "right" as const,
    frames: [
      photo("/visuals/projects/06/wejscie.jpg", "Konsola, łuk, kuchnia", "idea", ...frame),
      photo("/visuals/projects/06/wyspa.jpg", "Wyspa pod szklanymi kloszami", "node", ...frame),
      photo("/visuals/projects/06/okap.jpg", "Ryflowany okap, marmurowy blat", "material", ...frame),
      photo("/visuals/projects/06/krzesla.jpg", "Wyspa otwarta na salon", "plan", ...frame),
      photo("/visuals/projects/06/jadalnia.jpg", "Stół i witryna w łuku", "light", ...frame),
      photo("/visuals/projects/06/luki.jpg", "Trzy łuki nad sofą", "plan", ...frame),
      photo("/visuals/projects/06/sofa.jpg", "Sofa, łuki, światło w niszach", "light", ...frame),
      photo("/visuals/projects/06/kominek.jpg", "Kominek w kamieniu", "material", ...frame),
    ],
  },
  {
    id: "kobalt",
    title: "Kobalt",
    meta: "Warszawa · mieszkanie",
    copy: "Korytarz w graficie i rysunku drewna, kuchnia w kobalcie. Łuk drzwi otwiera gabinet.",
    layout: "left" as const,
    frames: [
      photo("/visuals/projects/07/korytarz.jpg", "Fornir jak mapa, czarna komoda", "idea", ...frame),
      photo("/visuals/projects/07/os.jpg", "Oś na kobaltową kuchnię", "plan", ...frame),
      photo("/visuals/projects/07/salon.jpg", "Salon i obraz nad szafką", "light", ...frame),
      photo("/visuals/projects/07/kobalt.jpg", "Wyspa w kobalcie", "node", ...frame),
      photo("/visuals/projects/07/gabinet.jpg", "Łuk drzwi do gabinetu", "plan", ...frame),
      photo("/visuals/projects/07/toaletka.jpg", "Toaletka przy łóżku", "node", ...frame),
      photo("/visuals/projects/07/sypialnia.jpg", "Łóżko, kobaltowa zasłona", "light", ...frame),
      photo("/visuals/projects/07/lazienka.jpg", "Szachownica i ciemna płytka", "material", ...frame),
    ],
  },
  {
    id: "lampiony",
    title: "Lampiony",
    meta: "Warszawa · dom",
    copy: "Papierowe klosze nad sofą, zielony marmur w kuchni. Bordowy sufit w przedpokoju, prysznic w ciepłym beżu.",
    layout: "right" as const,
    frames: [
      photo("/visuals/projects/08/salon.jpg", "Lampiony nad zielonym fotelem", "idea", ...frame),
      photo("/visuals/projects/08/jadalnia.jpg", "Stół, sofa, zielony marmur", "plan", ...frame),
      photo("/visuals/projects/08/antresola.jpg", "Jadalnia ze schodów", "plan", ...frame),
      photo("/visuals/projects/08/kuchnia.jpg", "Zielony kamień, gięty dąb", "material", ...frame),
      photo("/visuals/projects/08/stol.jpg", "Stół przy zielonym blacie", "light", ...frame),
      photo("/visuals/projects/08/kawa.jpg", "Nisza na ekspres przy schodach", "node", ...frame),
      photo("/visuals/projects/08/przedpokoj.jpg", "Szafa z łukami, bordowy sufit", "idea", ...frame),
      photo("/visuals/projects/08/wc.jpg", "Lustro w podkowę", "node", ...frame),
      photo("/visuals/projects/08/prysznic.jpg", "Prysznic w beżowej płytce", "light", ...frame),
      photo("/visuals/projects/08/umywalka.jpg", "Umywalka i świecące lustro", "material", ...frame),
    ],
  },
  {
    id: "okno",
    title: "Przy oknie",
    meta: "Warszawa · sypialnia",
    copy: "Łóżko w lnie, firanka i lampa z trzech krążków. W łazience zielony pas płytki i wanna w marmurze.",
    layout: "left" as const,
    frames: [
      photo("/visuals/projects/09/sypialnia.jpg", "Łóżko, firanka, trzy krążki", "idea", ...frame),
      photo("/visuals/projects/09/toaletka.jpg", "Toaletka w świetle okna", "light", ...frame),
      photo("/visuals/projects/09/umywalka.jpg", "Zielona płytka, marmurowy próg", "material", ...frame),
      photo("/visuals/projects/09/wanna.jpg", "Wanna, szafka lustrzana", "node", ...frame),
    ],
  },
  {
    id: "ogrod",
    title: "Wino i ogród",
    meta: "Warszawa · salon przy ogrodzie",
    copy: "Bordowa sofa na wprost ogrodu. Wyspa w żółtej płytce, czerwony sufit w przedpokoju, kwiaty w WC.",
    layout: "right" as const,
    frames: [
      photo("/visuals/projects/10/salon.jpg", "Bordowa sofa i ogród", "idea", ...frame),
      photo("/visuals/projects/10/stol.jpg", "Stół pod papierową lampą", "light", ...frame),
      photo("/visuals/projects/10/wyspa.jpg", "Żółta wyspa i stół", "node", ...frame),
      photo("/visuals/projects/10/plytki.jpg", "Wyspa z półką", "material", ...frame),
      photo("/visuals/projects/10/schody.jpg", "Schody i nisza na kawę", "plan", ...frame),
      photo("/visuals/projects/10/przedpokoj.jpg", "Czerwony sufit, mozaika", "plan", ...frame),
      photo("/visuals/projects/10/wc.jpg", "Kwiatowa tapeta, konsola", "material", ...frame),
    ],
  },
] as const;
