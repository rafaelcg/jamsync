import type { Metadata } from "next";
import localFont from "next/font/local";
import { AuthProvider } from "@/components/providers";
import { ToastProvider } from "@/components/ui";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "JamSync - Musician Collaboration Platform",
  description: "Share your performances, remix tracks, and collaborate with musicians worldwide. TikTok-style video platform for musicians.",
  keywords: ["music", "collaboration", "remix", "video", "audio", "musicians"],
  authors: [{ name: "JamSync Team" }],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "JamSync",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.variable}>
      <head>
        <link rel="preconnect" href="https://api.dicebear.com" />
        <link rel="dns-prefetch" href="https://api.dicebear.com" />
      </head>
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          antialiased
          bg-neutral-50 dark:bg-neutral-950
          text-neutral-900 dark:text-neutral-50
          min-h-screen
          selection:bg-primary-500/30
        `}
      >
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
