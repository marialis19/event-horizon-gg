import type { Metadata } from "next";
import { Rajdhani, Barlow_Condensed } from "next/font/google";
import "./globals.css";

const rajdhani = Rajdhani({
  weight: ["500", "700"],
  subsets: ["latin"],
  variable: "--font-rajdhani",
});

const barlowCondensed = Barlow_Condensed({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-barlow",
});

export const metadata: Metadata = {
  title: "Event Horizon GG",
  description: "Competitive Gaming Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${rajdhani.variable} ${barlowCondensed.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}