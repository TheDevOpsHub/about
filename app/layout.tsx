import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { OrganizationJsonLd } from "@/components/seo/organization-json-ld";
import { siteConfig } from "@/lib/site-config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.author, url: siteConfig.socials.maintainer }],
  alternates: {
    canonical: `${siteConfig.url}/`,
  },
  openGraph: {
    type: "website",
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.title,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta
          name="insight-app-sec-validation"
          content="e9cc3fe1-a84b-471b-b390-e195866de170"
        />
        <meta
          name="probely-verification"
          content="e168f1ed-0dfc-4d39-85b8-abf60f65c199"
        />
        <meta
          name="probely-verification"
          content="0e4d1090-a5d1-43e2-9db4-10f2d4ce1fe5"
        />
        <OrganizationJsonLd />
      </head>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        {children}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-42PBMZ1BRC"
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-42PBMZ1BRC');
          `}
        </Script>
      </body>
    </html>
  );
}
