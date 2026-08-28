import CustomCursor from "@/components/CustomCursor";
import GlassNavbar from "@/components/GlassNavbar";
import ScrollRestoration from "@/components/ScrollRestoration";
import Footer from "@/components/Footer";
import ContactHero from "@/components/ContactHero";
import ContactFormMinimal from "@/components/ContactFormMinimal";

export default function ContactPage() {
  return (
    <main className="relative w-full bg-[#09090b] min-h-screen flex flex-col">
      {/* Global Cinematic Film Grain */}
      <div className="fixed inset-0 z-[9999] bg-noise pointer-events-none" />
      <ScrollRestoration />
      <CustomCursor />
      <GlassNavbar />

      <ContactHero />
      <ContactFormMinimal />
      
      <div className="mt-auto">
        <Footer theme="dark" />
      </div>
    </main>
  );
}
