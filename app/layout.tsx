import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Free AI Resume Builder — Create ATS-Friendly Resumes | createresume.co",
    template: "%s | createresume.co",
  },
  description:
    "Build a professional, ATS-friendly resume in minutes with AI assistance. Free templates, pre-written content, and smart suggestions to land your dream job. No credit card required.",
  metadataBase: new URL("https://createresume.co"),
  openGraph: {
    title: "Free AI Resume Builder | createresume.co",
    description:
      "Build a professional, ATS-friendly resume in minutes. Free templates, AI-powered suggestions, and instant PDF download.",
    url: "https://createresume.co",
    siteName: "createresume.co",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "createresume.co - Free AI Resume Builder",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free AI Resume Builder | createresume.co",
    description:
      "Build a professional, ATS-friendly resume in minutes. Free templates and AI suggestions.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://createresume.co",
  },
  keywords: [
    "free resume builder",
    "AI resume builder",
    "ATS friendly resume",
    "resume templates",
    "professional resume",
    "online resume maker",
    "resume builder free",
    "create resume online",
    "resume generator",
    "best resume builder 2026",
    "resume format",
    "CV builder",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "YOUR_GOOGLE_VERIFICATION_CODE",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "createresume.co",
  url: "https://createresume.co",
  description:
    "AI-powered free resume builder with ATS-friendly templates. Create professional resumes in minutes.",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "2847",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}

