import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SmartGrow — IoT Greenhouse Dashboard",
  description: "IoT-based smart greenhouse monitoring system for oyster mushroom cultivation. Real-time temperature and humidity tracking with automated climate control.",
  metadataBase: new URL("https://smartgrow-ui.vercel.app"),
  openGraph: {
    title: "SmartGrow — IoT Greenhouse Dashboard",
    description: "IoT-based smart greenhouse monitoring system for oyster mushroom cultivation with ESP32, DHT22 sensors, and automated climate control.",
    url: "https://smartgrow-ui.vercel.app",
    siteName: "SmartGrow",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-main.png",
        width: 1200,
        height: 630,
        alt: "SmartGrow — IoT Greenhouse Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SmartGrow — IoT Smart Greenhouse",
    description: "Real-time environmental monitoring for oyster mushroom cultivation with automated fan, fogger, and sprinkler control.",
    images: ["/og-main.png"],
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased`}
        style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          storageKey="smartgrow-theme"
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-center" expand={true} richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
