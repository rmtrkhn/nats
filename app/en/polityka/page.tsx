import type { Metadata } from "next";
import { PrivacyPage } from "../../components/PrivacyPage";

export const metadata: Metadata = {
  title: "Privacy policy — NATS",
  description: "How NATS processes data from the contact form.",
};

export default function Page() {
  return <PrivacyPage locale="en" />;
}
