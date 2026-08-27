"use client";

import CustomCursor from "@/components/CustomCursor";
import GlassNavbar from "@/components/GlassNavbar";
import ApertureHero from "@/components/ApertureHero";
import Manifesto from "@/components/Manifesto";
import dynamic from "next/dynamic";

const ShowcaseDeck = dynamic(() => import("@/components/ShowcaseDeck"), { ssr: false });
const CloudTransition = dynamic(() => import("@/components/CloudTransition"), { ssr: false });
import AgencyServices from "@/components/AgencyServices";
import PurposeSection from "@/components/PurposeSection";
import ContactTerminal from "@/components/ContactTerminal";
import ScrollRestoration from "@/components/ScrollRestoration";
import TemplatesShowcase from "@/components/TemplatesShowcase";
import Preloader from "@/components/Preloader";
import ScrollIndicator from "@/components/ScrollIndicator";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative w-full bg-background overflow-x-hidden [clip-path:inset(0)]">
      <ScrollRestoration />
      <Preloader />
      <ScrollIndicator />
      <CustomCursor />
      <GlassNavbar />

      <ApertureHero />
      <div><Manifesto /></div>
      <div><ShowcaseDeck /></div>
      <CloudTransition />
      <div><AgencyServices /></div>
      <div><TemplatesShowcase /></div>
      <div><PurposeSection /></div>
      <div><ContactTerminal /></div>
      <Footer theme="light" />
    </main>
  );
}
