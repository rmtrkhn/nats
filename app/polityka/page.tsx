import type { Metadata } from "next";
import { PrivacyPage } from "../components/PrivacyPage";

export const metadata: Metadata = {
  title: "Polityka prywatności — NATS",
  description: "Jak NATS przetwarza dane z formularza kontaktowego.",
};

export default function Page() {
  return <PrivacyPage locale="pl" />;
}
