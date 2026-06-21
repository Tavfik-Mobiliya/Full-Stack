import type { Metadata } from "next";
import { Playfair_Display, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { ThemeScript } from "@/components/ThemeScript";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Tevfik Mobilya | Luxury Interior & Furniture Design Showroom",
  description: "Sculpting light, space & matter into living sanctuaries. Bespoke luxury architectural and interior design atelier.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${hanken.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-full bg-background text-on-surface flex flex-col font-sans">
        <LanguageProvider>
          <WelcomeScreen />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
