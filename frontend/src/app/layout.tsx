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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#07090e] text-[#f1f5f9] font-sans antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
        {children}
      </body>
    </html>
  );
}

