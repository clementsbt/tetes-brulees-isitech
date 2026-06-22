import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import JsonLd from "../components/JsonLd";
import Footer from "../components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tetes-brulees.vercel.app"),
  title: {
    default: "Têtes Brûlées - Club de Parapente & Speedriding",
    template: "%s | Têtes Brûlées",
  },
  description: "Club de parapente et speedriding basé à Valfréjus en Savoie. Sorties régulières, covoiturage, location matériel et rencontre entre pilotes passionnés.",
  keywords: ["parapente", "speedriding", "Valfréjus", "Savoie", "club parapente", "club speedriding", "vol libre", "speedfly", "apprendre le speedriding"],
  authors: [{ name: "Têtes Brûlées" }],
  creator: "Têtes Brûlées",
  publisher: "Têtes Brûlées",
  formatDetection: {
    email: false,
    address: false,
    telephone: true,
  },
 alternates: {
    canonical: "https://tetes-brulees.vercel.app",
    languages: {
      fr: "https://tetes-brulees.vercel.app",
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://tetes-brulees.vercel.app",
    siteName: "Têtes Brûlées",
    title: "Têtes Brûlées - Club de Parapente & Speedriding",
    description: "Club de parapente et speedriding basé à Valfréjus en Savoie. Sorties régulières, covoiturage, location matériel et rencontre entre pilotes passionnés.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Têtes Brûlées - Club de Parapente & Speedriding",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Têtes Brûlées - Club de Parapente & Speedriding",
    description: "Club de parapente et speedriding basé à Valfréjus en Savoie.",
    images: ["/og-image.png"],
    creator: "@tetesbrulees",
  },
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#ea580c" />
      </head>
      <body className="min-h-full flex flex-col">
        <JsonLd />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}