# Peyk Landing Page - Master Implementation Plan & Sketch

This document outlines the complete architectural, visual, and narrative plan for the Peyk landing page. It strictly adheres to the **Dark Luxury / Obsidian Minimalism** aesthetic while introducing bespoke cinematic interactions (like the Aperture Split) to tell the story of your Hybrid Studio.

## User Review Required

> [!IMPORTANT]
> Please review the comprehensive "Scene-by-Scene Sketch" below. This outlines the entire scroll flow from the top of the page to the footer. Let me know if the structure, copy, and specific section inclusions align with your vision.

---

## 🎨 Global Design System & Rules

- **Palette Theme:** Dark Luxury.
  - Deep Base: `#09090b` (Zinc-950) for the main dark sections.
  - Borders/Glass: Ultra-subtle `rgba(255, 255, 255, 0.08)`.
  - Accents: Warm Amber / Honey Gold (`#f59e0b`) used very sparingly (cursor bloom, specific triggers).
- **Typography Hierarchy:**
  - **Headings:** `Space Grotesk` (800/900 weight, uppercase tracking, pure white `#ffffff`). *NO numbered prefixes (e.g., no "01 / Index").*
  - **Cursive Accents / Quotes:** Elegant script (`Alex Brush`) in pure white `#ffffff`. *NO fragmented multi-color highlighting mid-sentence.*
  - **Body / Interface:** `Plus Jakarta Sans` or `Inter` (`#a1a1aa` / `#f4f4f5`).
  - **Metadata / Badges:** `JetBrains Mono` (`#a1a1aa`).
- **Interactive Global Elements:**
  - **Custom Cursor:** Interactive dual-layer cursor (26px inner glowing dot, 48px outer magnetic halo expanding on hover). Hidden on touch devices.
  - **Navigation:** Glassmorphic floating pill design (`backdrop-blur-xl`), subtly appearing after the hero section.

---

## 🎬 Scene-by-Scene Sketch (The Scroll Flow)

### 1. The Formal Hero (Light Theme)
*   **Visuals:** Pristine, formal minimalism. Pure white background `#ffffff`.
*   **Typography:** Massive, high-impact `Space Grotesk` centered on the screen: **PEYK.**
*   **The Nuance:** The period at the end of "PEYK." is a perfect, subtle Amber (`#f59e0b`) circle.
*   **Interaction:** The dual-layer magnetic custom cursor reacts to the typography, causing subtle magnetic distortion. No other clutter or buttons.

### 2. The Transition: "The Aperture Split"
*   **The Action:** As you begin to scroll, the Amber period detaches and scales up exponentially, blooming to fill the entire viewport in a warm, luxurious glow.
*   **The Reveal:** Just as the screen is entirely consumed by the glow, it physically **cracks and splits perfectly down the middle**. The left half slides left, the right half slides right (like an elegant curtain opening), revealing the deep `#09090b` obsidian universe beneath it.

### 3. The Hybrid Manifesto (Dark Theme - Obsidian Base)
*   **Visuals:** We are now in the Dark Luxury aesthetic.
*   **Typography:**
    *   *Heading:* **The Messenger.** (`Space Grotesk`)
    *   *Sub-text:* We don't just build for clients. We build for the world. (`Alex Brush`)
*   **Interaction:** Text decoder/scramble effect on the paragraph as it enters the viewport.

### 4. The Dual Realms (Interactive Split-Showcase)
*   *This section utilizes the "Mobile Sliding Curtain Showcase" pattern for airtight mobile responsiveness.*
*   **Left Side (Product Realm):** 
    *   *Visual:* A 3D WebGL (Three.js) subtle wireframe or a floating magnetic hover preview of **KadaSplit**.
    *   *Focus:* Proprietary Tools. Built once, scales infinitely.
*   **Right Side (Services Realm):** 
    *   *Visual:* A precise, architectural grid or data-flow animation.
    *   *Focus:* Client Automations & Custom Solutions.
*   **Interaction:** Hovering the left dims the right (and vice versa). On mobile, this transforms into a perfectly locked sliding text card masking over the media slots.

### 5. Our Purpose
*   **Visuals:** Clean, breathable layout.
*   **Typography:**
    *   *Heading:* **Our Purpose** (clean sans tracking).
    *   *Scripture Quote:* Pure white cursive script (`Alex Brush`).
    *   *Reference:* `— 1 Corinthians 10:31` (`JetBrains Mono`).
    *   *Narrative Description:* Light sans text (`Plus Jakarta Sans`).

### 6. The Approach / Contact Terminal
*   **Visuals:** Frosted glassmorphism (`backdrop-blur-xl`) card floating over the dark backdrop.
*   **Copy Sketch:** "Bring us a problem. We'll engineer the solution."
*   **Interaction:** A sleek, interactive terminal simulation where users can type `/contact` to reveal the email/booking form. It merges formal design with undeniable developer credibility.

### 7. Footer
*   **Visuals:** Ultra-minimalist.
*   **Content:** Copyright, social links, and system telemetry (e.g., `SYS.VER.01.2026` in `JetBrains Mono`).

---

## 🔧 Technical Execution Plan

### 1. Foundation & Routing
- Initialize Next.js project (App Router) for Server-Side Rendering (SSR) to ensure maximum SEO and crawler visibility.
- Set up Tailwind CSS with the strict Obsidian/Amber custom color tokens.

### 2. Motion & Scroll Architecture
- `@studio-freight/lenis` for buttery smooth momentum scrolling.
- `gsap` (ScrollTrigger) to handle the complex "Aperture Split" math. We will use dynamic `clip-path: inset(...)` coordinates to ensure the split is pixel-perfect with zero glitches.

### 3. UI Components to Build
- `CustomCursor.jsx`: Interactive dual-layer cursor.
- `GlassNavbar.jsx`: Floating pill design.
- `ApertureTransition.jsx`: The custom GSAP component handling the hero-to-split-screen cinematic effect.
- `DualRealmShowcase.jsx`: The interactive product/service split container (incorporating the mobile curtain math).
- `TerminalContact.jsx`: The interactive contact footer.

## Verification Plan
### Automated Tests
- Build verification for GSAP/Lenis bundling without SSR conflicts.
### Manual Verification
- Calibrate the `clip-path` masking and "Split" transition across viewport sizes (using a `FREEZE_COMPARISON_MODE` dock) to ensure the cinematic impact holds up flawlessly on both 4K monitors and mobile screens.
