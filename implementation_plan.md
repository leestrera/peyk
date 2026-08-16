# Peyk Architecture: The Dual Identity

This changes everything in the best way possible. Your original `DualRealms` component was actually trying to tell the right story, but it just wasn't executing it with the premium, high-end flashiness you need. 

Peyk is a **two-headed beast**: a scalable Startup (Products) and a bespoke Agency (Services). 

We are going to architect the landing page to take the user on a journey through both halves of Peyk, using two completely different UI paradigms to separate them visually.

## User Review Required

> [!WARNING]
> **Final Architecture Review**
> Please review this narrative structure. If this perfectly captures Peyk's dual identity, give me the green light and I will execute the build.

---

## ACT I: The Product Side (The Startup)

This section focuses on your proprietary, scalable tools (like KadaSplit). Because these are your flagship, independent revenue drivers, they require deep focus and massive storytelling space.

**The Layout:** We will use the **Deck-of-Cards Scroll Section** here. 
- As the user scrolls down, massive full-screen cards will stack on top of each other, pushing the older cards backward into 3D space (`scale(0.95)`, `translateY(-5%)`).
- **Card 1:** KADASPLIT. Pitch black background, massive `Space Grotesk` typography, and the layered phone mockups with mouse-parallax.
- *(If you have other proprietary products, they get their own cards here).*

---

## ACT II: The Services Side (The Agency)

This section focuses on your client-facing work: Business Automations, Management Systems, Custom Software, and Websites (like Your Cafe, Your Resort, Your Vet Clinic). Because this side of the business is about volume, speed, and versatility, we need a UI that feels fast and expansive.

**The Layout:** We will use the **Floating Editorial Roster** (using **Skill #5: Magnetic Hover Preview**) here. 
- It will be a stark, massive text list on a black background:
```
— AGENCY SERVICES & TEMPLATES
01  BUSINESS AUTOMATIONS
02  MANAGEMENT SYSTEMS
03  YOUR CAFE (TEMPLATE)
04  YOUR RESORT (TEMPLATE)
05  YOUR VET CLINIC (TEMPLATE)
06  CUSTOM SOFTWARE
```
- **The Flash:** As the user hovers over any of these items, a high-res preview image (e.g., the Cafe website mockup, or a sleek graphic for Automations) smoothly materializes and physically trails their custom cursor across the screen.

### Why this architecture works:
It tells the perfect story. The **Products** get a cinematic, slow-paced 3D presentation because they are massive individual assets. The **Services/Templates** get a lightning-fast, highly interactive list because they represent a wide, versatile arsenal of capabilities.

---

## Open Questions

> [!TIP]
> **Does this narrative perfectly represent Peyk?** 
> 
> We have the Deck-of-Cards for the Products, and the Interactive Roster for the Agency Services. If you approve, I will begin coding these two massive components!
