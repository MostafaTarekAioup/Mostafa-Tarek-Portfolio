import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { OSProvider } from "@/context/OSContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mostafa Tarek | Aether OS Portfolio",
  description:
    "Front-End React Developer with 1+ years of experience in modern web development, React, Next.js, and interactive user interfaces.",
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
    <html lang="en" className={`${inter.variable} ${outfit.variable} h-full dark`}>
      <body className="h-screen w-screen overflow-hidden bg-slate-950 font-sans text-slate-100 selection:bg-cyan-500 selection:text-black">
        <OSProvider>{children}</OSProvider>
      </body>
    </html>
  );
}
