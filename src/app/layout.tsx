import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "TradeFood - Produits Exotiques du Monde Entier",
  description: "Découvrez notre sélection de produits exotiques rares et authentiques : fruits exotiques, épices, thés, chocolats et bien plus encore.",
  icons: {
    icon: [
      { url: '/logotrade.png', type: 'image/png' },
      { url: '/favicon.ico', type: 'image/x-icon' },
    ],
    apple: [
      { url: '/logotrade.png', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/logotrade.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logotrade.png" />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}