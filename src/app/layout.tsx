import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import StoreProvider from "@/store/StoreProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LogicCheck AI APP — Validate Your Startup Idea with AI",
  description:
    "Stress-test your business logic with real-time market data, competitor scraping, and deep AI reasoning. Stop guessing, start building.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <StoreProvider>
          <Toaster position="top-right" />
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}

