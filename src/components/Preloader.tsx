"use client";

import React, { useState, useEffect, useRef } from "react";

// =========================================================================
// 🎛️ PRELOADER MANUAL ALIGNMENT CONTROLS
// =========================================================================
// Set to true to freeze on final frame and overlay over Hero for live tuning
export const FREEZE_COMPARISON_MODE = false;

const PRELOADER_SCALE_X = 1.000;
const PRELOADER_SCALE_Y = 0.995;
const PRELOADER_NUDGE_X_PX = -7;
const PRELOADER_NUDGE_Y_PX = 2;
const PRELOADER_CONTAINER_MAX_WIDTH = "1147px";
const PRELOADER_PLAYBACK_SPEED = 1.0;
// =========================================================================

interface PreloaderProps {
  onComplete?: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Live adjustment state (active in Freeze Mode)
  const [scaleX, setScaleX] = useState(PRELOADER_SCALE_X);
  const [scaleY, setScaleY] = useState(PRELOADER_SCALE_Y);
  const [nudgeX, setNudgeX] = useState(PRELOADER_NUDGE_X_PX);
  const [nudgeY, setNudgeY] = useState(PRELOADER_NUDGE_Y_PX);
  const [blendMode, setBlendMode] = useState<any>("multiply");
  const [overlayOpacity, setOverlayOpacity] = useState(100);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [bgColor, setBgColor] = useState("rgb(0,0,0)");

  const handleFinish = () => {
    if (FREEZE_COMPARISON_MODE || isExiting || isDone) return;
    setIsExiting(true);
      setTimeout(() => {
        setIsDone(true);
        if (onComplete) onComplete();
        window.dispatchEvent(new CustomEvent("preloaderComplete"));
      }, 800); // Matches CSS transition duration
  };

  // Real-time Video Background Removal (Chroma Key)
  useEffect(() => {
    let animationFrameId: number;

    const processFrame = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || isExiting) return;

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (ctx && video.readyState >= 2 && video.videoWidth > 0) {
        // Match canvas size to video size
        if (canvas.width !== video.videoWidth) canvas.width = video.videoWidth;
        if (canvas.height !== video.videoHeight) canvas.height = video.videoHeight;

        // Draw the current video frame
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Process pixels to remove background and make lines black
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // 1. Calculate overall average brightness to determine if background is Black or White
        let totalBrightness = 0;
        const sampleStep = 4 * 10;
        let samples = 0;
        for (let i = 0; i < data.length; i += sampleStep) {
          totalBrightness += (data[i] + data[i + 1] + data[i + 2]) / 3;
          samples++;
        }
        const avgBrightness = totalBrightness / samples;
        const isBackgroundBlack = avgBrightness < 128;

        // PRECOMPUTE EDGE FADE (Smoothstep feathering)
        // This makes the lines dissolve organically into the background before hitting the hard boundaries
        const width = canvas.width;
        const height = canvas.height;
        const fadeZoneX = width * 0.25; // Fade outer 25% on X
        const fadeZoneY = height * 0.25; // Fade outer 25% on Y
        
        const fadeXArray = new Float32Array(width);
        for (let x = 0; x < width; x++) {
          const fadeX = Math.min(x / fadeZoneX, (width - x) / fadeZoneX, 1.0);
          fadeXArray[x] = fadeX * fadeX * (3 - 2 * fadeX); // Smoothstep curve
        }

        // 2. Process all pixels with nested loop for coordinate-aware fading
        let i = 0;
        for (let y = 0; y < height; y++) {
          const fadeY = Math.min(y / fadeZoneY, (height - y) / fadeZoneY, 1.0);
          const smoothFadeY = fadeY * fadeY * (3 - 2 * fadeY);
          
          for (let x = 0; x < width; x++) {
            const edgeFade = fadeXArray[x] * smoothFadeY;

            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const brightness = (r + g + b) / 3;

            let alpha = 0;
            if (isBackgroundBlack) {
              alpha = brightness;
            } else {
              alpha = 255 - brightness;
            }
            
            // STRICT LUMA KEY
            if (alpha < 150) {
              alpha = 0;
            } else {
              alpha = Math.min(255, (alpha - 150) * 2.5);
            }

            // Apply the organic edge fade
            alpha = alpha * edgeFade;

            // Force all lines to be pure pitch black
            data[i] = 0;     // R
            data[i + 1] = 0; // G
            data[i + 2] = 0; // B
            data[i + 3] = alpha; // A
            
            i += 4;
          }
        }

        ctx.putImageData(imageData, 0, 0);
      }
      
      animationFrameId = requestAnimationFrame(processFrame);
    };

    processFrame();
    return () => cancelAnimationFrame(animationFrameId);
  }, [isExiting]);

  useEffect(() => {
    if (FREEZE_COMPARISON_MODE && videoRef.current) {
      videoRef.current.currentTime = 3.9;
      videoRef.current.pause();
    }
  }, []);

  const handleTimeUpdate = () => {
    if (!videoRef.current || FREEZE_COMPARISON_MODE) return;
    if (videoRef.current.currentTime >= 3.9) {
      setIsExiting(true);
      setTimeout(() => {
        setIsDone(true);
        if (onComplete) onComplete();
        window.dispatchEvent(new CustomEvent("preloaderComplete"));
      }, 800);
    }
  };

  if (isDone) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center select-none will-change-transform bg-white ${
        FREEZE_COMPARISON_MODE
          ? "pointer-events-auto"
          : isExiting
          ? "opacity-0 pointer-events-none transition-opacity duration-[800ms] ease-out"
          : "opacity-100 pointer-events-auto"
      }`}
    >
      {/* Video Container with Calibrated Scaling */}
      <div
        className="relative flex items-center justify-center transition-transform duration-75 w-[86.05vw] md:w-[66.93vw]"
        style={{
          maxWidth: PRELOADER_CONTAINER_MAX_WIDTH,
          transform: `translate(${nudgeX}px, ${nudgeY}px) scale(${scaleX}, ${scaleY})`,
          mixBlendMode: FREEZE_COMPARISON_MODE ? blendMode : "normal",
          opacity: FREEZE_COMPARISON_MODE ? overlayOpacity / 100 : 1,
        }}
      >
        {/* Hidden source video */}
        <video
          ref={videoRef}
          src="/assets/videos/Motion_graphics_text_animation_1080p_202608211315.mp4"
          muted
          playsInline
          crossOrigin="anonymous"
          autoPlay={!FREEZE_COMPARISON_MODE}
          onTimeUpdate={handleTimeUpdate}
          className="absolute opacity-0 w-px h-px pointer-events-none"
        />
        {/* Transparent Canvas Renderer */}
        <canvas 
          ref={canvasRef} 
          className="w-full h-auto max-h-[75vh] object-contain block !p-0 !m-0"
        />
      </div>

      {/* Floating Tuning Dock */}
      {FREEZE_COMPARISON_MODE && (
        <div className="fixed top-6 right-6 z-[120] bg-neutral-900/95 backdrop-blur-xl border border-white/20 text-white rounded-2xl p-5 shadow-2xl max-w-xs w-full text-xs">
          <div className="font-bold text-sm mb-3 text-amber-400">Freeze Alignment Dock</div>
          <div className="mb-3">
            <div className="flex justify-between mb-1">
              <span className="text-neutral-300">Scale X (Width):</span>
              <span className="text-amber-300 font-bold">{scaleX.toFixed(3)}x</span>
            </div>
            <input type="range" min="0.70" max="1.40" step="0.005" value={scaleX} onChange={(e) => setScaleX(parseFloat(e.target.value))} className="w-full" />
          </div>
          <div className="mb-3">
            <div className="flex justify-between mb-1">
              <span className="text-neutral-300">Scale Y (Height):</span>
              <span className="text-amber-300 font-bold">{scaleY.toFixed(3)}x</span>
            </div>
            <input type="range" min="0.70" max="1.40" step="0.005" value={scaleY} onChange={(e) => setScaleY(parseFloat(e.target.value))} className="w-full" />
          </div>
          <div className="mb-3">
            <div className="flex justify-between mb-1">
              <span className="text-neutral-300">Nudge X:</span>
              <span className="text-amber-300 font-bold">{nudgeX}px</span>
            </div>
            <input type="range" min="-150" max="150" step="1" value={nudgeX} onChange={(e) => setNudgeX(parseInt(e.target.value))} className="w-full" />
          </div>
          <div className="mb-3">
            <div className="flex justify-between mb-1">
              <span className="text-neutral-300">Nudge Y:</span>
              <span className="text-amber-300 font-bold">{nudgeY}px</span>
            </div>
            <input type="range" min="-150" max="150" step="1" value={nudgeY} onChange={(e) => setNudgeY(parseInt(e.target.value))} className="w-full" />
          </div>
          <div className="mb-3">
            <div className="flex justify-between mb-1">
              <span className="text-neutral-300">Blend Mode:</span>
              <select value={blendMode} onChange={(e) => setBlendMode(e.target.value)} className="bg-black/50 border border-white/20 rounded px-2 py-1 outline-none">
                <option value="multiply">Multiply (Hide White)</option>
                <option value="screen">Screen (Hide Black)</option>
                <option value="difference">Difference (Invert overlap)</option>
                <option value="normal">Normal</option>
              </select>
            </div>
          </div>
          <div className="mb-3">
            <div className="flex justify-between mb-1">
              <span className="text-neutral-300">Opacity:</span>
              <span className="text-amber-300 font-bold">{overlayOpacity}%</span>
            </div>
            <input type="range" min="0" max="100" step="1" value={overlayOpacity} onChange={(e) => setOverlayOpacity(parseInt(e.target.value))} className="w-full" />
          </div>
          <div className="bg-black/60 p-2.5 rounded font-mono text-[10px] text-neutral-300 border border-white/10 select-all">
            const PRELOADER_SCALE_X = {scaleX.toFixed(3)};<br/>
            const PRELOADER_SCALE_Y = {scaleY.toFixed(3)};<br/>
            const PRELOADER_NUDGE_X_PX = {nudgeX};<br/>
            const PRELOADER_NUDGE_Y_PX = {nudgeY};
          </div>
        </div>
      )}
    </div>
  );
}
