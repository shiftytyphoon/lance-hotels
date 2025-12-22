import type React from "react"
import type { Metadata } from "next";
import { Geist_Mono, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ConditionalHeader } from "@/components/conditional-header";
import { ScrollToTop } from "@/components/scroll-to-top";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lance - AI Voice Agents for Car Dealerships",
  description: "AI-powered voice agents for car dealership reception, service, and sales",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistMono.variable} ${inter.variable} ${playfair.variable} antialiased`} suppressHydrationWarning>
        <ScrollToTop />
        <ConditionalHeader />
        {children}
      </body>
    </html>
  );
}
