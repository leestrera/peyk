import type { Metadata } from "next";
import { Space_Grotesk, Plus_Jakarta_Sans, JetBrains_Mono, Playfair_Display, Alex_Brush } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
});

const alexBrush = Alex_Brush({
  weight: "400",
  variable: "--font-alex",
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

const playfair = Playfair_Display({
  variable: "--font-playfair",
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
    <html lang="en" className={`${spaceGrotesk.variable} ${plusJakarta.variable} ${jetbrains.variable} ${playfair.variable} ${alexBrush.variable}`}>
      <body className="antialiased font-sans bg-background text-foreground min-h-screen">
        {children}
      </body>
    </html>
  );
}
