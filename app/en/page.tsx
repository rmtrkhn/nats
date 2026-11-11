import type { Metadata } from "next";
import { HomePage } from "../components/HomePage";

export const metadata: Metadata = {
  title: "NATS — interior architect, Warsaw",
  description:
    "Interior design for apartments and homes in Warsaw. Consultation, concept, visualizations and site supervision.",
  alternates: { canonical: "/en/" },
};

export default function EnHomePage() {
  return <HomePage locale="en" />;
}
