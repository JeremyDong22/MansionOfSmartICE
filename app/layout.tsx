// Root Layout - Mansion of SmartICE
// Global layout with navigation header

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NavigationHeader from "@/components/navigation-header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "野百灵·贵州酸汤 | Wildlark · Guizhou Sour Soup - 云贵川Bistro",
  description: "出山入林，一川一味 | Authentic Yunnan-Guizhou-Sichuan cuisine bringing mountain flavors to the city. 正宗云贵川风味餐厅。",
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
        <NavigationHeader />
        {children}
      </body>
    </html>
  );
}
