import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React from 'react';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Cada corpo conta uma história | MyFormula",
  description: "Mais de 2500 mulheres portuguesas já partilharam. Encontra histórias do teu distrito, filtra por tema de saúde e partilha a tua.",
  icons: {
    icon: "https://res.cloudinary.com/dlmyres0i/image/upload/v1765550441/icon_tdwuig.png",
  },
  openGraph: {
    title: "Cada corpo conta uma história | MyFormula",
    description: "Mais de 2500 mulheres portuguesas já partilharam. Encontra histórias do teu distrito, filtra por tema de saúde e partilha a tua.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>{children}</body>
    </html>
  );
}