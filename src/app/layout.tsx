import type { Metadata } from "next";
import { Geist_Mono, Noto_Sans, Playfair_Display } from "next/font/google";

import { AuthProvider } from "@/features/auth/providers/auth-provider";
import { SiteLayout } from "@/components/layout/site-layout";
import { cn } from "@/lib/utils";

import "./globals.css";

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AFTERWORK-COMMERCE",
  description: "Discover Your Everyday Elegance.",
};

interface LayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="id" className={cn(notoSans.variable, playfairDisplay.variable, geistMono.variable, "font-sans")}>
      <body className="flex min-h-full flex-col">
        <AuthProvider>
          <SiteLayout>{children}</SiteLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
