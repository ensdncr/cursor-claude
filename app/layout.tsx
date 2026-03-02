import type { Metadata, Viewport } from "next";
import "./globals.css";
import ServiceWorkerRegistrar from "@/components/ServiceWorkerRegistrar";

export const metadata: Metadata = {
  title: "Aktüel Takip - BİM, A101, ŞOK Aktüel Ürünler",
  description: "Bu haftanın en iyi aktüelleri! BİM, A101 ve ŞOK marketlerinin indirimli ürünlerini keşfedin.",
  manifest: "/manifest.json",
  keywords: ["aktüel", "BİM", "A101", "ŞOK", "indirim", "kampanya", "market"],
  authors: [{ name: "Aktüel Takip" }],
  openGraph: {
    title: "Aktüel Takip",
    description: "Bu haftanın en iyi aktüelleri!",
    type: "website",
    locale: "tr_TR",
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Aktüel Takip",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#FF6B00",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="antialiased">
        <ServiceWorkerRegistrar />
        {children}
      </body>
    </html>
  );
}
