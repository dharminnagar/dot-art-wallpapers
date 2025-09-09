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
  title: "Pixel Wallpaper Generator",
  description:
    "Generate customised stunning pixel art wallpapers by uploading your images.",
  keywords: ["pixel art", "wallpaper", "generator", "image processing"],
  authors: [{ name: "Your Name" }],
  openGraph: {
    title: "Pixel Wallpaper Generator",
    description:
      "Generate customised stunning pixel art wallpapers by uploading your images.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pixel Wallpaper Generator",
    description:
      "Generate customised stunning pixel art wallpapers by uploading your images.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
