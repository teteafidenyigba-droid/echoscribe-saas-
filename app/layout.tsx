import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EchoScribe — Dictée échographique IA",
  description:
    "Générez des comptes rendus d'échographie structurés et conformes SFR en 30 secondes par dictée vocale. Conforme aux standards médicaux français.",
  keywords: "échographie, compte rendu, dictée vocale, IA médicale, radiologie, SFR",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=Inter+Tight:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
