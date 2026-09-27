import type { Metadata } from "next";
import "./globals.css";
import { Press_Start_2P, Space_Mono } from "next/font/google";
import { site, siteUrl } from "@/lib/site";

const pixel = Press_Start_2P({ weight: "400", subsets: ["latin"], variable: "--font-pixel", display: "swap" });
const body = Space_Mono({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: site.name,
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: { title: site.name, description: site.description, type: "website", url: "/" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="it" className={`${pixel.variable} ${body.variable}`}><body>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebSite", name: site.name, url: siteUrl, description: site.description }) }} /></body></html>;
}
