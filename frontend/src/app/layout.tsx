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
  title: "CodeLearn - AI-Powered College Coding Platform",
  description: "Master Data Structures and Algorithms (DSA) with curated sheets, classroom contests, and an interactive AI Tutor.",
  keywords: ["DSA", "LeetCode", "Coding platform", "AI Tutor", "Monaco Editor", "Computer Science Education"],
  authors: [{ name: "CodeLearn Team" }],
};

import { ThemeProvider } from "@/context/ThemeContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[#f8fafc] dark:bg-[#f8fafc] dark:bg-[#0f1419] text-slate-900 dark:text-slate-900 dark:text-[#f0f9ff] font-sans antialiased selection:bg-emerald-500/30 selection:text-emerald-200 transition-colors duration-300">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

