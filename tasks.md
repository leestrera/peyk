# Peyk Landing Page - Development Progress Tracker

## Phase 1: Environment & Foundation
- [x] **Project Initialization:** Scaffold Next.js 15 App Router with Tailwind CSS v4 and TypeScript.
- [x] **Workspace Cleanup:** Remove leftover Python scripts, raw `.mov`/`.mp4` screen recordings, and `.jpg` frames.
- [x] **Asset Organization:** Map `public/assets/logos/`, `public/assets/images/kadasplit/`, and `public/assets/videos/`.
- [x] **Typography System (`next/font`):** 
  - [x] Lock `Space Grotesk` (Headings/Logo).
  - [x] Lock `Alex Brush` (Cursive Accents).
  - [x] Lock `Plus Jakarta Sans` (Body).
  - [x] Lock `JetBrains Mono` (Metadata).
- [x] **Color System:** Define `--background: #09090b` (Obsidian) and `--color-amber: #f59e0b` (Amber) in `globals.css` using Tailwind v4 `@theme inline`.

## Phase 2: Global Architecture
- [x] **`CustomCursor.tsx` (Dual-Layer GSAP):**
  - [x] Implement inner white dot (`26px`).
  - [x] Implement outer magnetic halo (`48px`).
  - [x] Add hover detection (`data-magnetic`) to expand halo to `70px` and bloom Amber.
  - [x] Hide natively on touch devices (`@media (hover: none)`).
- [x] **`GlassNavbar.tsx` (Floating Navigation):**
  - [x] Render `Space Grotesk` Peyk SVG/Image Logo.
  - [x] Implement magnetic anchor links (Purpose, Products, Services).
  - [x] Implement `window.scrollY > 50` listener to trigger `backdrop-blur-xl` and `bg-black/40` pill shape.

## Phase 3: The Cinematic Hero & Transition
- [x] **`ApertureHero.tsx` (Pristine White Start):**
  - [x] Center massive `Space Grotesk` "PEYK" text.
  - [x] Wrap the period (`.`) in a separate span for the Amber trigger.
- [x] **GSAP Aperture Split Logic:**
  - [x] ScrollTrigger pinning (`pin: true`, `scrub: 1`).
  - [x] Step 1: Text fades slightly (`opacity: 0`).
  - [x] Step 2: Amber period scales exponentially (`scale: 150`) to consume viewport.
  - [x] Step 3: Amber glow mix-blend overlay fades in (`opacity: 1`).
  - [x] Step 4: Left curtain (`w-1/2`) slides `xPercent: -100`.
  - [x] Step 5: Right curtain (`w-1/2`) slides `xPercent: 100` to reveal Obsidian void.

## Phase 4: The Hybrid Manifesto (Dark Theme)
- [x] **`Manifesto.tsx`:**
  - [x] Render `Space Grotesk` heading: "The Messenger."
  - [x] Render `Alex Brush` script: "We don't just build for clients. We build for the world."
  - [x] Implement GSAP Text Decoder/Scramble effect triggered on scroll.

## Phase 5: The Dual Realms (Split-Showcase)
- [x] **`DualRealms.tsx` (Layout Wrapper):**
  - [x] Implement strict 50/50 flex layout for Desktop.
  - [x] Implement Mobile Sliding Curtain architecture (Locked interaction pattern).
  - [x] Ensure `clip-path: inset(...)` masking prevents any crossfade collision or peeking on mobile.
- [x] **`KadaSplit.tsx` (Left Realm):**
  - [x] Render high-resolution transparent iPhone mockups floating over Obsidian.
  - [x] Add subtle hover parallax effect.
- [x] **`ServicesRealm.tsx` (Right Realm):**
  - [x] Render looping `services_bg.mp4` video canvas.
  - [x] Overlay tech-forward typography.
- [x] **Hover Interaction:**
  - [x] Dim opposite side to `opacity: 0.3` when hovering a realm.

## Phase 6: Purpose & Contact Terminal
- [x] **`PurposeSection.tsx`:**
  - [x] Render clean `Space Grotesk` heading ("Our Purpose").
  - [x] Render pure white `Alex Brush` script for scripture quote.
  - [x] Render `JetBrains Mono` reference (— 1 Corinthians 10:31).
- [x] **`ContactTerminal.tsx` (Footer):**
  - [x] Build terminal-style interface simulation.
  - [x] Add typing effect for `/contact` command.
  - [x] Add glowing active states on form inputs.

## Phase 7: Polish & QA
- [x] **Mobile Responsiveness:** Verify proportional scaling and zero padding overrides.
- [x] **Build Check:** Run `npm run build` to ensure no GSAP hydration errors or Window SSR crashes.
