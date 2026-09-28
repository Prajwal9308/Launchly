import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Atmosphere } from "@/components/app/atmosphere";
import { Toaster } from "@/components/ui/toaster";
import { siteConfig } from "@/lib/site";
import "./globals.css";


const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.defaultTitle, template: "%s · Launchly" },
  description: siteConfig.defaultDescription,
  openGraph: {
    type: "website",
    siteName: "Launchly",
    title: siteConfig.defaultTitle,
    description: siteConfig.defaultDescription,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#050507",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-dvh font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-surface focus:px-3 focus:py-2 focus:text-sm focus:shadow-popover"
        >
          Skip to content
        </a>
        <Atmosphere />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
