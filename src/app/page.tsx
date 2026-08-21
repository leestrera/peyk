import CustomCursor from "@/components/CustomCursor";
import GlassNavbar from "@/components/GlassNavbar";
import ApertureHero from "@/components/ApertureHero";
import Manifesto from "@/components/Manifesto";
import ShowcaseDeck from "@/components/ShowcaseDeck";
import CloudTransition from "@/components/CloudTransition";
import AgencyServices from "@/components/AgencyServices";
import PurposeSection from "@/components/PurposeSection";
import ContactTerminal from "@/components/ContactTerminal";
import ScrollRestoration from "@/components/ScrollRestoration";
import TemplatesShowcase from "@/components/TemplatesShowcase";
import Preloader from "@/components/Preloader";

export default function Home() {
  return (
    <main className="relative w-full bg-background overflow-clip">
      <ScrollRestoration />
      <Preloader />
      <CustomCursor />
      <GlassNavbar />
      
      <ApertureHero />
      <Manifesto />
      <ShowcaseDeck />
      <CloudTransition />
      <AgencyServices />
      <TemplatesShowcase />
      <PurposeSection />
      <ContactTerminal />
    </main>
  );
}
