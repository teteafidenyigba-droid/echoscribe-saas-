import type { Metadata } from "next";
import "./globals.css";

const BASE_URL = "https://echoscribe.fr";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "EchoScribe — Compte rendu d'échographie par dictée IA",
    template: "%s | EchoScribe",
  },
  description:
    "EchoScribe génère votre compte rendu d'échographie structuré en 30 secondes par dictée vocale. Conforme SFR / HAS. Pas de matériel externe — le micro de votre PC suffit. Essai gratuit 7 jours.",
  keywords: [
    // Prioritaires
    "compte rendu échographie IA",
    "dictée échographique automatique",
    "logiciel compte rendu échographie",
    "compte rendu SFR automatisé",
    "dictée vocale radiologue IA",
    "compte rendu échographie conforme HAS",
    // Secondaires
    "logiciel dictée médicale radiologue",
    "transcription vocale médicale France",
    "alternative Dragon Medical radiologie",
    // Généraux
    "compte rendu échographie",
    "dictée médicale IA",
    "logiciel radiologue dictée",
    "transcription médicale intelligence artificielle",
    "compte rendu radiologie automatique",
    "dictée vocale médecin",
    "echoscribe",
    "IA médicale SFR",
    "compte rendu structuré HAS",
    "logiciel échographie",
    "dictée échographique",
    "compte rendu médical automatique",
  ],
  authors: [{ name: "EchoScribe", url: BASE_URL }],
  creator: "EchoScribe",
  publisher: "EchoScribe",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: BASE_URL },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: BASE_URL,
    siteName: "EchoScribe",
    title: "EchoScribe — Compte rendu d'échographie en 30 secondes par IA",
    description:
      "Dictez pendant l'examen. EchoScribe structure votre compte rendu conforme SFR/HAS en 30 secondes. Sans matériel externe. Essai gratuit 7 jours.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "EchoScribe — Dictée médicale IA pour radiologues",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EchoScribe — Compte rendu d'échographie par IA en 30 secondes",
    description:
      "Dictée vocale → compte rendu structuré SFR/HAS en 30 secondes. Micro PC intégré suffisant. Essai gratuit 7 jours.",
    images: ["/og-image.png"],
  },
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
