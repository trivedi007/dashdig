import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dashdig - Humanize & Shortenize URLs",
  description: "AI-powered URL shortener that creates human-readable short links. Transform ugly URLs into memorable, branded links with full analytics.",
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
