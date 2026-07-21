import type { Metadata } from "next";
import { Cinzel, Rajdhani, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { OSProvider } from "@/context/OSContext";
import { GameProvider } from "@/context/GameContext";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Mostafa Tarek | Quest Log — Video Game Developer Portfolio",
  description:
    "Interactive video game-inspired portfolio of Mostafa Tarek. Experienced Front-End React Developer with 5+ years of commercial mastery building modern web experiences.",
  icons: {
    icon: "/images/portfolio-icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${rajdhani.variable} ${jetbrainsMono.variable} h-full dark`}
    >
      <body className="h-screen w-screen overflow-x-hidden bg-slate-950 font-sans text-slate-100 selection:bg-gold selection:text-black">
        <OSProvider>
          <GameProvider>{children}</GameProvider>
        </OSProvider>
      </body>
    </html>
  );
}
