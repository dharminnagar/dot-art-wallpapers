import type { Metadata } from "next";
import { Kode_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const kodeMono = Kode_Mono({
  variable: "--font-kode-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dot Art Wallpaper Generator",
  description:
    "Generate customised stunning dot art wallpapers by uploading your images.",
  keywords: ["dot art", "wallpaper", "generator", "image processing"],
  authors: [{ name: "Your Name" }],
  openGraph: {
    title: "Dot Art Wallpaper Generator",
    description:
      "Generate customised stunning dot art wallpapers by uploading your images.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dot Art Wallpaper Generator",
    description:
      "Generate customised stunning dot art wallpapers by uploading your images.",
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
        className={`${kodeMono.variable} ${kodeMono.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
