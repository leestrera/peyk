import CustomCursor from "@/components/CustomCursor";
import GlassNavbar from "@/components/GlassNavbar";
import ApertureHero from "@/components/ApertureHero";
import Manifesto from "@/components/Manifesto";
import DualRealms from "@/components/DualRealms";
import PurposeSection from "@/components/PurposeSection";
import ContactTerminal from "@/components/ContactTerminal";

export default function Home() {
  return (
    <main className="relative w-full overflow-x-hidden bg-background">
      <CustomCursor />
      <GlassNavbar />
      
      <ApertureHero />
      <Manifesto />
      <DualRealms />
      <PurposeSection />
      <ContactTerminal />
    </main>
  );
}
