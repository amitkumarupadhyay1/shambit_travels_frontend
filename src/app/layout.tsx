import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ComparisonProvider } from "@/contexts/ComparisonContext";
import SessionProvider from "@/contexts/SessionProvider";
import ComparisonBar from "@/components/packages/ComparisonBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShamBit - Discover India's Spiritual Heritage",
  description: "Discover India's spiritual heritage through curated travel experiences. From sacred temples to cultural immersion, we craft journeys that touch the soul.",
  icons: {
    icon: [
      { url: "/logo.png", sizes: "32x32", type: "image/png" },
      { url: "/logo.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/logo.png",
    apple: "/logo.png",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/logo.png",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <ComparisonProvider>
            {children}
            <ComparisonBar />
          </ComparisonProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
