import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { AnalysisProvider } from "@/context/AnalysisContext";
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
  title: "ReviveAI - Turn Bad Reviews Into Loyal Customers | AI Business Recovery Assistant",
  description:
    "ReviveAI uses AI to analyze customer reviews, detect recurring complaints, generate WhatsApp recovery messages, suggest smart discounts, and grow your local business automatically.",
  keywords: [
    "AI Business Recovery",
    "Customer Retention",
    "Review Analysis",
    "WhatsApp Recovery",
    "Google Review Management",
    "Local Business AI",
  ],
  authors: [{ name: "ReviveAI Team" }],
  openGraph: {
    title: "ReviveAI - Turn Bad Reviews Into Loyal Customers",
    description:
      "Automated AI business recovery assistant for local businesses. Recover lost customers and analyze Google reviews instantly.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark scroll-smooth h-full antialiased`}
    >
      <body className="bg-[#09090B] text-zinc-100 min-h-full flex flex-col selection:bg-purple-500/30 selection:text-purple-200">
        <ClerkProvider>
          <AnalysisProvider>
            {children}
          </AnalysisProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
