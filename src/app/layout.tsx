import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

import Chatbot from "@/components/shared/Chatbot";
import ApplyButton from "@/components/shared/ApplyButton";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TakshConnect | Takshashila University",
  description: "Fly High with TakshConnect - Your smart student companion for Takshashila University.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-white dark:bg-navy text-navy dark:text-white">
        {children}
        <Chatbot />
        <ApplyButton />
      </body>
    </html>
  );
}
