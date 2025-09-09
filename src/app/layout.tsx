import type { Metadata } from "next";
import { Kode_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const kodeMono = Kode_Mono({
  variable: "--font-kode-mono",
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
      <body className={`${kodeMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
