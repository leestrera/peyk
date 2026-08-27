"use client";

import { ReactLenis } from 'lenis/react'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function SmoothScrolling({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<any>(null)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches
    setIsTouchDevice(isTouch)
  }, [])

  useEffect(() => {
    if (isTouchDevice) return

    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000)
    }

    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(update)
    }
  }, [isTouchDevice])

  // On mobile/touch: skip Lenis entirely.
  // Lenis sets overflow:clip on <html> which causes black borders on iOS Safari.
  // useLenis() in other components safely falls back to {} when no provider exists.
  if (isTouchDevice) {
    return <>{children}</>
  }

  // Desktop only: smooth scroll via Lenis
  return (
    <ReactLenis 
      root 
      ref={lenisRef} 
      autoRaf={false} 
      options={{ 
        lerp: 0.05,
        wheelMultiplier: 0.6,
      }}
    >
      {children}
    </ReactLenis>
  )
}
