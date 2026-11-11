import type { Metadata } from "next";
import { ThanksPage } from "../../components/ThanksPage";

export const metadata: Metadata = {
  title: "Message received — NATS",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ThanksPage locale="en" />;
}
