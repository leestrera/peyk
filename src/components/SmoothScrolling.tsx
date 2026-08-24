"use client";

import { ReactLenis, useLenis } from 'lenis/react'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

export default function SmoothScrolling({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<any>(null)

  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000)
    }

    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(update)
    }
  }, [])

  return (
    <ReactLenis 
      root 
      ref={lenisRef} 
      autoRaf={false} 
      options={{ 
        lerp: 0.05,            // Lower lerp makes the scroll feel slightly heavier/slower to settle
        wheelMultiplier: 0.6,  // Reduces mouse wheel scroll speed by 40%
        touchMultiplier: 1.0,  // Reduces mobile swipe scroll distance (default is 2)
      }}
    >
      {children}
    </ReactLenis>
  )
}
