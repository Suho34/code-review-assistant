import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mockmind.ai"),
  title: {
    default: "MockMind — Ace Your Tech Interviews with AI",
    template: "%s | MockMind",
  },
  description:
    "MockMind provides real-time, AI-driven mock interviews with professional code reviews and actionable feedback. Master your craft and land your dream job.",
  keywords: ["AI interview", "mock interview", "coding interview", "tech interview prep", "career coaching"],
  authors: [{ name: "MockMind Team" }],
  creator: "MockMind",
  publisher: "MockMind",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mockmind.ai",
    siteName: "MockMind",
    title: "MockMind — Ace Your Tech Interviews with AI",
    description: "Real-time, AI-driven interviews with actionable feedback.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MockMind — Master Tech Interviews with AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MockMind — Ace Your Tech Interviews with AI",
    description: "Real-time, AI-driven interviews with actionable feedback.",
    images: ["/og-image.png"],
    creator: "@mockmind",
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <TooltipProvider>
          {children}
          <Toaster richColors closeButton position="top-center" />
        </TooltipProvider>
      </body>
    </html>
  );
}
