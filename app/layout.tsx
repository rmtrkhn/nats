import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const sans = Outfit({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500"],
  variable: "--font-sans",
});

const description =
  "Projektowanie wnętrz mieszkań i domów w Warszawie. Konsultacja, koncepcja, wizualizacje i nadzór.";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  metadataBase: new URL("https://rmtrkhn.github.io/nats"),
  title: "NATS — architekt wnętrz, Warszawa",
  description,
  alternates: { canonical: "/" },
  openGraph: {
    title: "NATS — architekt wnętrz, Warszawa",
    description,
    url: "/",
    type: "website",
    locale: "pl_PL",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Wnętrze — NATS",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NATS — architekt wnętrz, Warszawa",
    description,
    images: ["/og.jpg"],
  },
  icons: {
    icon: [
      { url: `${base}/favicon.ico` },
      { url: `${base}/favicon-32.png`, sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: `${base}/apple-touch-icon.png`, sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className={`${display.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
