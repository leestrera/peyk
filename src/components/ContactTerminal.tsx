"use client";

import { useState, useRef, useEffect } from "react";
import { Terminal } from "lucide-react";

export default function ContactTerminal() {
  const [input, setInput] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim().toLowerCase() === "/contact") {
      setIsUnlocked(true);
    } else {
      setInput(""); // Clear if wrong command
    }
  };

  // Focus input on click anywhere in terminal
  const handleTerminalClick = () => {
    if (!isUnlocked && inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <footer id="contact" className="relative w-full bg-background px-6 pb-12 pt-24">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <h3 className="font-heading text-3xl font-black uppercase tracking-wide text-white">
            Bring us a problem.
          </h3>
          <p className="mt-2 font-sans text-white/50">
            We'll engineer the solution.
          </p>
        </div>

        {/* Terminal Window */}
        <div 
          onClick={handleTerminalClick}
          className="group relative overflow-hidden rounded-xl border border-peyk-glass bg-black/40 p-6 backdrop-blur-xl shadow-2xl transition-all duration-500 hover:border-peyk-amber/30 cursor-text"
        >
          {/* Mac window dots */}
          <div className="mb-6 flex gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500/20 group-hover:bg-red-500/80 transition-colors" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/20 group-hover:bg-yellow-500/80 transition-colors" />
            <div className="h-3 w-3 rounded-full bg-green-500/20 group-hover:bg-green-500/80 transition-colors" />
          </div>

          {!isUnlocked ? (
            <div className="font-mono text-sm sm:text-base text-white/80">
              <p className="mb-2 text-white/50">peyk@system ~ % sudo enter command to connect...</p>
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <span className="text-peyk-amber">❯</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="type /contact"
                  className="flex-1 bg-transparent text-white outline-none placeholder:text-white/20"
                  autoComplete="off"
                  autoFocus
                />
              </form>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <p className="font-mono text-sm text-green-400 mb-6">Access Granted. Connection established.</p>
              <form className="space-y-4">
                <div className="space-y-1">
                  <label className="font-mono text-xs text-white/50">EMAIL</label>
                  <input 
                    type="email" 
                    required
                    className="w-full border-b border-white/10 bg-transparent py-2 font-sans text-white outline-none transition-colors focus:border-peyk-amber" 
                    placeholder="you@company.com"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-xs text-white/50">DIRECTIVE</label>
                  <textarea 
                    required
                    className="w-full border-b border-white/10 bg-transparent py-2 font-sans text-white outline-none transition-colors focus:border-peyk-amber min-h-[100px] resize-none" 
                    placeholder="Describe your architectural needs..."
                  />
                </div>
                <button className="mt-4 flex w-full items-center justify-center gap-2 rounded bg-white px-6 py-3 font-sans text-sm font-bold text-black transition-all hover:scale-[1.02] hover:bg-peyk-amber" data-magnetic>
                  <Terminal className="h-4 w-4" />
                  INITIALIZE PROTOCOL
                </button>
              </form>
            </div>
          )}
        </div>
        
        <div className="mt-16 flex items-center justify-between border-t border-white/5 pt-8 font-mono text-xs text-white/30">
          <p>© {new Date().getFullYear()} PEYK ARCHITECTURE.</p>
          <p>SYS.VER.01.2026</p>
        </div>
      </div>
    </footer>
  );
}
