import type { Metadata } from "next";
import { ContactSection } from "../../components/ContactSection";
import { Journal } from "../../components/Journal";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";

export const metadata: Metadata = {
  title: "Journal — NATS",
  description: "Project journal — spreads from NATS studio.",
  alternates: { canonical: "/en/dziennik/" },
};

export default function EnJournalPage() {
  return (
    <>
      <SiteHeader locale="en" />
      <main id="top">
        <Journal locale="en" />
        <ContactSection locale="en" />
      </main>
      <SiteFooter locale="en" />
    </>
  );
}
