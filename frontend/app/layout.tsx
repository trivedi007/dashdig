import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dashdig - Humanize & Shortenize URLs",
  description: "AI-powered URL shortener that creates human-readable short links.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
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
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body>{children}</body>
    </html>
  );
}
