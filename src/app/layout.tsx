import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "G-VIMS — Gujarat Venue & Infrastructure Management System",
  description: "Gujarat's digital sports spine — unified venue management, booking, and Pay & Play platform for Sports Authority of Gujarat.",
  keywords: ["VIMS", "Gujarat Sports", "venue management", "SAG", "booking"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="h-full antialiased bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
