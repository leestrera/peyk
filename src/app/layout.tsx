import type { Metadata } from "next";
import { Space_Grotesk, Alex_Brush, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
});

const alexBrush = Alex_Brush({
  variable: "--font-alex",
  weight: "400",
  subsets: ["latin"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Peyk | The Messenger",
  description: "We don't just build for clients. We build for the world.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${alexBrush.variable} ${plusJakarta.variable} ${jetbrains.variable}`}>
      <body className="antialiased font-sans bg-background text-foreground min-h-screen">
        {children}
      </body>
    </html>
  );
}
