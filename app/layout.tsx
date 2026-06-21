import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "createresume.co — AI-Powered Free Resume Builder",
  description: "Build professional resumes in minutes with AI assistance. ATS-friendly templates, pre-written content, and smart suggestions to land your dream job.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}

