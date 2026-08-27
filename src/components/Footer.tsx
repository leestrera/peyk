import Link from 'next/link';
import Image from 'next/image';

interface FooterProps {
  theme?: 'dark' | 'light';
}

export default function Footer({ theme = 'dark' }: FooterProps) {
  const isLight = theme === 'light';

  return (
    <footer className={`w-full overflow-hidden relative z-20 ${
      isLight ? 'bg-[#fbfbfb] text-zinc-900' : 'bg-transparent text-white'
    }`}>
      
      <div className="mx-auto w-full px-6 md:px-12 pt-20 md:pt-32 pb-8 max-w-[1600px] flex flex-col justify-between">
        
        {/* Top Section: Information Grid */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 md:gap-16 mb-8 md:mb-16">
          
          {/* Left: Mission */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6 md:gap-8">
            <span className="font-heading text-2xl md:text-3xl font-black uppercase tracking-tighter">
              PEYK ARCHITECTURE
            </span>
            <p className={`font-sans text-base md:text-lg leading-relaxed font-light max-w-md ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
              Engineering digital monoliths. We design and build hyper-premium software architectures for brands that demand perfection.
            </p>
          </div>

          {/* Right: Navigation Links */}
          <div className="w-full lg:w-1/2 flex flex-row sm:flex-nowrap gap-16 md:gap-32 justify-start lg:justify-end">
            <div className="flex flex-col gap-6 md:gap-8">
              <span className={`font-mono text-[10px] uppercase tracking-widest font-semibold ${isLight ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Index
              </span>
              <div className="flex flex-col gap-3 md:gap-4 font-sans text-lg md:text-xl font-medium">
                <Link href="/" className="hover:opacity-50 transition-opacity">Home</Link>
                <Link href="/about" className="hover:opacity-50 transition-opacity">About</Link>
                <Link href="/contact" className="hover:opacity-50 transition-opacity">Contact</Link>
              </div>
            </div>

            <div className="flex flex-col gap-6 md:gap-8">
              <span className={`font-mono text-[10px] uppercase tracking-widest font-semibold ${isLight ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Network
              </span>
              <div className="flex flex-col gap-3 md:gap-4 font-sans text-lg md:text-xl font-medium">
                <a href="#" className="hover:opacity-50 transition-opacity">Instagram</a>
                <a href="#" className="hover:opacity-50 transition-opacity">Twitter / X</a>
                <a href="#" className="hover:opacity-50 transition-opacity">LinkedIn</a>
              </div>
            </div>
          </div>
        </div>

        {/* Logo Section */}
        <div className="w-full flex justify-center items-center my-8 md:my-16">
          <div className={`relative w-full max-w-[1400px] aspect-[4/1] md:aspect-[5/1] select-none pointer-events-none ${
            isLight ? 'opacity-10' : 'opacity-10 invert'
          }`}>
            <Image 
              src="/assets/logos/text_logo.png"
              alt="Peyk Logo"
              fill
              sizes="100vw"
              className="object-contain object-center md:object-bottom"
            />
          </div>
        </div>

        {/* Bottom Section: Telemetry & Legal (Below the Logo) */}
        <div className={`w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-8 font-mono text-[10px] uppercase tracking-widest pt-8 md:pt-12 border-t ${
          isLight ? 'border-zinc-200 text-zinc-500' : 'border-zinc-800/60 text-zinc-500'
        }`}>
          <div className="flex flex-col gap-2 md:gap-3">
            <p>SYS.LOC: 37.7749° N, 122.4194° W</p>
            <p>GLOBAL REMOTE OPERATIONS</p>
          </div>
          
          <div className="flex flex-col gap-4 md:gap-3 items-start md:items-end">
            <div className="flex gap-6">
              <span className="hover:opacity-75 cursor-pointer transition-opacity">Privacy Policy</span>
              <span className="hover:opacity-75 cursor-pointer transition-opacity">Terms of Service</span>
            </div>
            <p>© {new Date().getFullYear()} PEYK. SYS.VER.01.2026</p>
          </div>
        </div>

      </div>
    </footer>
  );
}
