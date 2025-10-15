import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from './providers';
import { Toaster } from "@/components/ui/sonner"
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "TaskFlow AI - AI-Powered Task Management & Project Planning",
    template: "%s | TaskFlow AI"
  },
  description: "Modern task management platform powered by AI. Organize tasks, manage projects, and boost productivity with intelligent insights. Built with Next.js 15 and React 19.",
  keywords: ["task management", "project management", "AI assistant", "productivity", "collaboration", "workflow automation"],
  authors: [{ name: "TaskFlow AI Team" }],
  creator: "TaskFlow AI",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "TaskFlow AI - AI-Powered Task Management",
    description: "Modern task management platform powered by AI. Organize tasks, manage projects, and boost productivity with intelligent insights.",
    siteName: "TaskFlow AI",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "TaskFlow AI - AI-Powered Task Management",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TaskFlow AI - AI-Powered Task Management",
    description: "Modern task management platform powered by AI. Organize tasks, manage projects, and boost productivity.",
    images: ["/images/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
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
        <Providers>
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
