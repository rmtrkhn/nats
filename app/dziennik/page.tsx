import type { Metadata } from "next";
import { ContactSection } from "../components/ContactSection";
import { Journal } from "../components/Journal";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "Dziennik — NATS",
  description: "Dziennik realizacji — przegląd kadrów studia NATS.",
  alternates: { canonical: "/dziennik/" },
};

export default function DziennikPage() {
  return (
    <>
      <SiteHeader locale="pl" route="dziennik" />
      <main id="top">
        <Journal locale="pl" />
        <ContactSection locale="pl" />
      </main>
      <SiteFooter locale="pl" />
    </>
  );
}
