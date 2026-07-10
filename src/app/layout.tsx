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
  title: "Beagea Sari Sari Store — POS & Inventory",
  description: "Modern Point of Sale and Inventory Management system for Beagea Sari Sari Store. Efficiently track sales, manage products, and monitor business performance.",
  metadataBase: new URL("https://beageasari-sari.vercel.app/pos"),
  openGraph: {
    title: "Beagea Sari Sari Store — POS & Inventory",
    description: "Modern Point of Sale and Inventory Management system for Beagea Sari Sari Store. Efficiently track sales, manage products, and monitor business performance.",
    url: "https://beageasari-sari.vercel.app/pos",
    siteName: "Beagea Sari Sari Store",
    locale: "en_PH",
    type: "website",
    images: [
      {
        url: "/og-main.png",
        width: 1200,
        height: 630,
        alt: "Beagea Sari Sari Store Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Beagea Sari Sari Store — POS & Inventory",
    description: "Modern Point of Sale and Inventory Management system for Beagea Sari Sari Store. Efficiently track sales, manage products, and monitor business performance.",
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
          defaultTheme="light"
          enableSystem={false}
          storageKey="beagea-theme"
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-center" expand={true} richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
