import CustomCursor from "@/components/CustomCursor";
import GlassNavbar from "@/components/GlassNavbar";
import ScrollRestoration from "@/components/ScrollRestoration";
import AboutHero from "@/components/AboutHero";
import AboutNarrative from "@/components/AboutNarrative";
import TeamShowcase from "@/components/TeamShowcase";
import CoreValues from "@/components/CoreValues";
import AboutCTA from "@/components/AboutCTA";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <main className="relative w-full bg-[#09090b] min-h-screen overflow-x-hidden [clip-path:inset(0)]">
      {/* Global Cinematic Film Grain */}
      <div className="fixed inset-0 z-[9999] bg-noise pointer-events-none" />
      <ScrollRestoration />
      <CustomCursor />
      <GlassNavbar />

      <AboutHero />
      <AboutNarrative />
      <TeamShowcase />
      <CoreValues />
      <AboutCTA />
      <Footer theme="dark" />
    </main>
  );
}
