import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://createresume.co'),
  title: {
    default: 'createresume.co — AI-Powered Free Resume Builder',
    template: '%s | createresume.co',
  },
  description:
    'Build professional resumes in minutes with AI. ATS-friendly templates, smart suggestions, and instant PDF download. Free to use.',
  keywords: [
    'free resume builder',
    'AI resume builder',
    'ATS friendly resume',
    'resume templates',
    'professional resume',
    'online resume maker',
    'resume builder free',
    'create resume online',
    'resume generator',
    'best resume builder 2026',
    'resume builder no sign up',
    'ATS resume templates free',
  ],
  authors: [{ name: 'createresume.co' }],
  creator: 'createresume.co',
  publisher: 'createresume.co',
  openGraph: {
    title: 'Free AI Resume Builder | createresume.co',
    description:
      'Build a professional, ATS-friendly resume in minutes. 12+ free templates, AI-powered suggestions, and instant PDF download.',
    url: 'https://createresume.co',
    siteName: 'createresume.co',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'createresume.co — Free AI Resume Builder with ATS-friendly templates',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free AI Resume Builder | createresume.co',
    description:
      'Build a professional, ATS-friendly resume in minutes. Free templates and AI suggestions.',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://createresume.co',
  },
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-7483ED72QY"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-7483ED72QY');
          `}
        </Script>
        {/* Google AdSense - replace ca-pub-XXXXXXXXXXXXXXXX with your publisher ID once approved */}
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
