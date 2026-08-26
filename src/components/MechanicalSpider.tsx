"use client";

import { forwardRef, useEffect, useRef } from "react";
import gsap from "gsap";

interface MechanicalSpiderProps {
  id: string;
  isPatrolling: boolean;
  originRef: React.RefObject<HTMLElement | null>;
  avoidRef?: React.RefObject<HTMLElement | null>;
  avoidRefs?: React.RefObject<HTMLElement | null>[];
  initialScale?: number;
  resetTrigger?: number;
}

const MechanicalSpider = forwardRef<HTMLDivElement, MechanicalSpiderProps>(
  ({ id, isPatrolling, originRef, avoidRef, avoidRefs, initialScale = 1, resetTrigger = 0 }, ref) => {

    // Create an internal ref so we always have access, but also forward to parent
    const internalRef = useRef<HTMLDivElement>(null);

    // We use a callback ref to handle both the forwarded ref and our internal ref
    const setRefs = (node: HTMLDivElement) => {
      internalRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    // Preserve current coordinates across useEffect re-runs
    const currentXRef = useRef(0);
    const currentYRef = useRef(0);

    useEffect(() => {
      if (resetTrigger > 0) {
        currentXRef.current = 0;
        currentYRef.current = 0;
      }
    }, [resetTrigger]);

    useEffect(() => {
      const bug = internalRef.current;
      const dot = originRef.current;

      if (!bug || !dot) return;

      let bugTween: gsap.core.Animation | null = null;

      const wander = () => {
        if (!isPatrolling) return;

        // Orthogonal wandering (strictly horizontal or vertical)
        let targetX = currentXRef.current;
        let targetY = currentYRef.current;

        const pxToVw = 100 / window.innerWidth;
        const dotRect = dot.getBoundingClientRect();

        // Calculate max safe distance to screen edges (with 3vw padding)
        const maxX = Math.max(0, Math.min((window.innerWidth - dotRect.right) * pxToVw - 3, 30));
        const minX = Math.min(0, Math.max(-(dotRect.left * pxToVw) + 3, -40));
        const maxY = Math.max(0, Math.min((window.innerHeight - dotRect.bottom) * pxToVw - 3, 20));
        const minY = Math.min(0, Math.max(-(dotRect.top * pxToVw) + 3, -20));

        const moveHorizontal = Math.random() > 0.5;

        // Pick an initial random target within screen bounds
        if (moveHorizontal) {
          targetX = gsap.utils.random(minX, maxX);
        } else {
          targetY = gsap.utils.random(minY, maxY);
        }

        // Get all avoidance rects
        const refs = avoidRefs ? avoidRefs : (avoidRef ? [avoidRef] : []);
        const avoidRects = refs.map(ref => {
          if (!ref || !ref.current) return null;
          const rect = ref.current.getBoundingClientRect();
          return {
            minX: (rect.left - dotRect.left) * pxToVw - 3,
            maxX: (rect.right - dotRect.left) * pxToVw + 3,
            minY: (rect.top - dotRect.top) * pxToVw - 3,
            maxY: (rect.bottom - dotRect.top) * pxToVw + 3
          };
        }).filter(Boolean) as { minX: number, maxX: number, minY: number, maxY: number }[];

        // Truncate movement if it hits an avoidance rect
        for (const rect of avoidRects) {
          if (moveHorizontal) {
            const inYBand = currentYRef.current >= rect.minY && currentYRef.current <= rect.maxY;
            if (inYBand) {
              if (targetX > currentXRef.current) { // Moving Right
                if (currentXRef.current < rect.minX && targetX > rect.minX) {
                  targetX = rect.minX; // Outside left -> Hit left wall
                } else if (currentXRef.current >= rect.minX && currentXRef.current <= rect.maxX) {
                  // Inside! Can only move towards the closest escape route.
                  if (currentXRef.current - rect.minX < rect.maxX - currentXRef.current) {
                    targetX = currentXRef.current; // Closer to left edge, so moving right is going DEEPER! Block.
                  }
                }
              } else if (targetX < currentXRef.current) { // Moving Left
                if (currentXRef.current > rect.maxX && targetX < rect.maxX) {
                  targetX = rect.maxX; // Outside right -> Hit right wall
                } else if (currentXRef.current >= rect.minX && currentXRef.current <= rect.maxX) {
                  // Inside!
                  if (rect.maxX - currentXRef.current < currentXRef.current - rect.minX) {
                    targetX = currentXRef.current; // Closer to right edge, so moving left is going DEEPER! Block.
                  }
                }
              }
            }
          } else {
            const inXBand = currentXRef.current >= rect.minX && currentXRef.current <= rect.maxX;
            if (inXBand) {
              if (targetY > currentYRef.current) { // Moving Down
                if (currentYRef.current < rect.minY && targetY > rect.minY) {
                  targetY = rect.minY; // Hit top wall
                } else if (currentYRef.current >= rect.minY && currentYRef.current <= rect.maxY) {
                  // Inside!
                  if (currentYRef.current - rect.minY < rect.maxY - currentYRef.current) {
                    targetY = currentYRef.current; // Closer to top, moving down is going DEEPER. Block.
                  }
                }
              } else if (targetY < currentYRef.current) { // Moving Up
                if (currentYRef.current > rect.maxY && targetY < rect.maxY) {
                  targetY = rect.maxY; // Hit bottom wall
                } else if (currentYRef.current >= rect.minY && currentYRef.current <= rect.maxY) {
                  // Inside!
                  if (rect.maxY - currentYRef.current < currentYRef.current - rect.minY) {
                    targetY = currentYRef.current; // Closer to bottom, moving up is going DEEPER. Block.
                  }
                }
              }
            }
          }
        }

        const actualDx = targetX - currentXRef.current;
        const actualDy = targetY - currentYRef.current;
        const distance = Math.sqrt(actualDx * actualDx + actualDy * actualDy);

        // If truncated distance is too short, just skip this turn and try another direction
        if (distance < 2) {
          gsap.delayedCall(0.1, wander);
          return;
        }

        const targetRotation = (Math.atan2(actualDy, actualDx) * 180) / Math.PI + 90;
        const speed = 25;
        const duration = distance / speed;

        currentXRef.current = targetX;
        currentYRef.current = targetY;

        const moveTl = gsap.timeline({
          onComplete: () => {
            bug.classList.remove("bug-walking");
            if (isPatrolling) {
              gsap.delayedCall(gsap.utils.random(0.3, 1.2), wander);
            }
          }
        });

        // 1. Pivot
        moveTl.to(bug, {
          rotation: `${targetRotation}_short`,
          duration: 0.15,
          ease: "power2.inOut"
        });

        // 2. Walk Animation
        moveTl.call(() => {
          bug.classList.add("bug-walking");
        });

        // 3. Scurry
        const actualDuration = Math.max(duration, 0.2);
        moveTl.to(bug, {
          x: `${targetX}vw`,
          y: `${targetY}vw`,
          duration: actualDuration,
          ease: "power2.inOut"
        });

        // 4. Trail
        const trailContainer = document.getElementById(`trail-container-${id}`);
        if (trailContainer) {
          const isHorizontal = Math.abs(actualDx) > Math.abs(actualDy);
          const line = document.createElement("div");
          line.className = "absolute bg-[#f59e0b] mix-blend-screen pointer-events-none";
          line.style.boxShadow = "0 0 8px rgba(245, 158, 11, 0.8)";
          line.style.opacity = "0.8";

          if (isHorizontal) {
            const isRight = actualDx > 0;
            // We use the PREVIOUS coordinate to draw the line from
            const startX = currentXRef.current - actualDx;
            const startY = currentYRef.current;
            
            line.style.left = `calc(50% + ${Math.min(startX, targetX)}vw)`;
            line.style.top = `calc(50% + ${startY}vw)`;
            line.style.height = "1px";
            line.style.marginTop = "-0.5px";
            line.style.transformOrigin = isRight ? "left center" : "right center";
            line.style.width = `${Math.abs(actualDx)}vw`;
            line.style.transform = `scaleX(0)`;
          } else {
            const isDown = actualDy > 0;
            const startX = currentXRef.current;
            const startY = currentYRef.current - actualDy;

            line.style.left = `calc(50% + ${startX}vw)`;
            line.style.top = `calc(50% + ${Math.min(startY, targetY)}vw)`;
            line.style.width = "1px";
            line.style.marginLeft = "-0.5px";
            line.style.transformOrigin = isDown ? "top center" : "bottom center";
            line.style.height = `${Math.abs(actualDy)}vw`;
            line.style.transform = `scaleY(0)`;
          }
          trailContainer.appendChild(line);

          // Cap trail DOM nodes to prevent GPU layer explosion on mobile
          const MAX_TRAILS = 8;
          while (trailContainer.children.length > MAX_TRAILS) {
            trailContainer.removeChild(trailContainer.children[0]);
          }

          moveTl.to(line, {
            scaleX: isHorizontal ? 1 : undefined,
            scaleY: !isHorizontal ? 1 : undefined,
            duration: actualDuration,
            ease: "power2.inOut",
            onComplete: () => {
              gsap.to(line, {
                opacity: 0,
                duration: 1.5,
                ease: "power2.out",
                onComplete: () => line.remove()
              });
            }
          }, "<");
        }

        bugTween = moveTl;
      };

      const cleanupTrails = (instant = false) => {
        const trailContainer = document.getElementById(`trail-container-${id}`);
        if (trailContainer) {
          Array.from(trailContainer.children).forEach(line => {
            if (instant) {
              line.remove();
            } else {
              gsap.to(line, { opacity: 0, duration: 1, onComplete: () => line.remove() });
            }
          });
        }
      };

      if (isPatrolling) {
        wander();
      } else {
        bug.classList.remove("bug-walking");
        cleanupTrails(true);
      }

      return () => {
        if (bugTween) bugTween.kill();
        gsap.killTweensOf(wander);
        cleanupTrails(true);
      };
    }, [isPatrolling, id, originRef, avoidRef]);

    return (
      <>
        {/* The trail container for the circuit lines (z-0 so it renders behind the bug) */}
        <div id={`trail-container-${id}`} className="absolute inset-0 z-0 pointer-events-none" />

        <div ref={setRefs} className={`bug-wrapper bug-wrapper-${id} absolute inset-0 w-full h-full`} style={{ transform: `scale(${initialScale})` }}>
          <div className="bug-wiggle-wrapper absolute inset-0 w-full h-full">
            <div
              className="bug-scaler absolute"
              style={{
                width: "1000%",
                height: "1000%",
                top: "50%",
                left: "50%",
                marginTop: "-500%",
                marginLeft: "-500%",
                transform: "scale(0.1)"
              }}
            >
              {/* Spider Abdomen (rear) */}
              <div className="absolute top-[20%] left-[10%] w-[80%] h-[100%] bg-background rounded-full z-10" />
              {/* Spider Cephalothorax (front) */}
              <div className="absolute -top-[15%] left-[25%] w-[50%] h-[50%] bg-background rounded-full z-10" />

              {/* Left Legs */}
              <div className="absolute inset-0 origin-center -rotate-[40deg]">
                <div className="bug-leg leg-l leg-l-1 bg-background top-[20%] -left-[100%] w-[120%] h-[8%]" />
              </div>
              <div className="absolute inset-0 origin-center -rotate-[15deg]">
                <div className="bug-leg leg-l leg-l-2 bg-background top-[40%] -left-[120%] w-[140%] h-[8%]" />
              </div>
              <div className="absolute inset-0 origin-center rotate-[10deg]">
                <div className="bug-leg leg-l leg-l-3 bg-background top-[60%] -left-[120%] w-[140%] h-[8%]" />
              </div>
              <div className="absolute inset-0 origin-center rotate-[35deg]">
                <div className="bug-leg leg-l leg-l-4 bg-background top-[80%] -left-[100%] w-[120%] h-[8%]" />
              </div>

              {/* Right Legs */}
              <div className="absolute inset-0 origin-center rotate-[40deg]">
                <div className="bug-leg leg-r leg-r-1 bg-background top-[20%] -right-[100%] w-[120%] h-[8%]" />
              </div>
              <div className="absolute inset-0 origin-center rotate-[15deg]">
                <div className="bug-leg leg-r leg-r-2 bg-background top-[40%] -right-[120%] w-[140%] h-[8%]" />
              </div>
              <div className="absolute inset-0 origin-center -rotate-[10deg]">
                <div className="bug-leg leg-r leg-r-3 bg-background top-[60%] -right-[120%] w-[140%] h-[8%]" />
              </div>
              <div className="absolute inset-0 origin-center -rotate-[35deg]">
                <div className="bug-leg leg-r leg-r-4 bg-background top-[80%] -right-[100%] w-[120%] h-[8%]" />
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes walk-left-${id} {
            0% { transform: rotate(-40deg); }
            100% { transform: rotate(20deg); }
          }
          @keyframes walk-right-${id} {
            0% { transform: rotate(40deg); }
            100% { transform: rotate(-20deg); }
          }
          @keyframes bug-wiggle-${id} {
            0% { transform: translateX(-5%) translateY(-5%) rotate(-2deg); }
            100% { transform: translateX(5%) translateY(5%) rotate(2deg); }
          }
          .bug-wrapper-${id} .bug-wiggle-wrapper {
            animation: bug-wiggle-${id} 0.08s infinite alternate ease-in-out;
            animation-play-state: paused;
          }

          .bug-wrapper-${id} .bug-leg {
            position: absolute;
            border-radius: 999px;
            animation-duration: 0.15s;
            animation-iteration-count: infinite;
            animation-direction: alternate;
            animation-timing-function: ease-in-out;
            animation-play-state: paused;
          }

          .bug-wrapper-${id}.bug-walking .bug-wiggle-wrapper,
          .bug-wrapper-${id}.bug-walking .bug-leg {
            animation-play-state: running;
          }

          .bug-wrapper-${id} .leg-l { transform-origin: right center; animation-name: walk-left-${id}; }
          .bug-wrapper-${id} .leg-r { transform-origin: left center; animation-name: walk-right-${id}; }

          .bug-wrapper-${id} .leg-l-1, .bug-wrapper-${id} .leg-r-2, .bug-wrapper-${id} .leg-l-3, .bug-wrapper-${id} .leg-r-4 { animation-delay: 0s; }
          .bug-wrapper-${id} .leg-r-1, .bug-wrapper-${id} .leg-l-2, .bug-wrapper-${id} .leg-r-3, .bug-wrapper-${id} .leg-l-4 { animation-delay: 0.15s; }
        `}</style>
      </>
    );
  }
);

MechanicalSpider.displayName = "MechanicalSpider";
export default MechanicalSpider;
