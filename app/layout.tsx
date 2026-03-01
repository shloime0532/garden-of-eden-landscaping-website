import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://garden-of-eden-landscaping-website.vercel.app/"),
  title: "Garden of Eden Landscaping Inc | Lakewood, NJ",
  description:
    "Professional landscaping services in Lakewood, NJ. Lawn care, hardscaping, garden design, tree service, and more. 5-star rated. Call (732) 364-2052 for a free estimate.",
  openGraph: {
    title: "Garden of Eden Landscaping Inc | Lakewood, NJ",
    description:
      "Transform your outdoor space with Lakewood's premier landscaping company. 20+ years of experience. Free estimates.",
    images: ["/og-image.png"],
    type: "website",
  },
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
