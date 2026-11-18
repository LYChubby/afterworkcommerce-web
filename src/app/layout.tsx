import type { Metadata } from "next";
import { Geist_Mono, Noto_Sans, Playfair_Display } from "next/font/google";

import { cn } from "@/lib/utils";
import "./globals.css";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: {
    default: "AFTERWORK-COMMERCE",
    template: "%s | AFTERWORK-COMMERCE",
  },
  description: "Discover your style with AFTERWORK-COMMERCE.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={cn("h-full", "antialiased", notoSans.variable, playfairDisplay.variable, geistMono.variable, "font-sans")}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
