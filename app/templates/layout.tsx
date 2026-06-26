import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Resume Templates 2026 — ATS-Friendly & Professional",
  description:
    "Choose from 12+ professional, ATS-optimized resume templates. Modern, classic, and creative designs. Customize and download as PDF instantly. 100% free.",
  alternates: {
    canonical: "https://createresume.co/templates",
  },
  openGraph: {
    title: "Free Resume Templates 2026 | createresume.co",
    description:
      "Browse 12+ ATS-friendly resume templates. Modern, professional, and creative designs ready to customize.",
    url: "https://createresume.co/templates",
  },
};

export default function TemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
