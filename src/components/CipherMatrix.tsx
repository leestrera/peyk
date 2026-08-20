import React, { useEffect, useRef } from 'react';

const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+=-{}[]|:;<>,.?/";

function generateRandomString(length: number) {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
  }
  return result;
}

interface CipherMatrixProps {
  colorClass: string;
  keywords: string[];
}

export function CipherMatrix({ colorClass, keywords }: CipherMatrixProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    // Generate the initial grid
    const rowHeight = 24;
    const colWidth = 14;
    const rowCount = Math.floor(window.innerHeight / rowHeight) + 4; // slight overflow
    const colCount = Math.floor(window.innerWidth / colWidth) + 4;

    if (containerRef.current) {
      containerRef.current.innerHTML = "";
      rowsRef.current = [];
      for (let i = 0; i < rowCount; i++) {
        const row = document.createElement("div");
        row.className = `whitespace-nowrap font-mono text-[14px] tracking-[0.25em] opacity-[0.15] select-none ${colorClass}`;
        row.innerText = generateRandomString(colCount);
        containerRef.current.appendChild(row);
        rowsRef.current.push(row);
      }
    }

    let animationFrameId: number;
    let lastUpdate = 0;
    
    // We only want a few keywords to be visible at any given time
    const activeKeywords: { row: number, col: number, text: string, timer: number }[] = [];

    const updateMatrix = (timestamp: number) => {
      // Throttle updates to ~15fps for that "terminal" feel (60ms)
      if (timestamp - lastUpdate > 60) {
        lastUpdate = timestamp;
        
        // Randomly mutate some characters in every row
        rowsRef.current.forEach((row, i) => {
          let text = row.innerText.split('');
          
          // Mutate 3% of the string
          const mutations = Math.floor(colCount * 0.03);
          for (let m = 0; m < mutations; m++) {
            const randomIdx = Math.floor(Math.random() * colCount);
            text[randomIdx] = CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
          }

          // Apply active keywords to this row if any
          const keywordForThisRow = activeKeywords.find(k => k.row === i);
          if (keywordForThisRow) {
            const start = keywordForThisRow.col;
            for (let j = 0; j < keywordForThisRow.text.length; j++) {
              if (start + j < text.length) {
                text[start + j] = keywordForThisRow.text[j];
              }
            }
          }
          
          row.innerText = text.join('');
        });

        // Manage keywords
        // Every frame, small chance to spawn a new keyword
        if (Math.random() < 0.05 && activeKeywords.length < 4 && keywords.length > 0) {
          const randomKeyword = ` [ ${keywords[Math.floor(Math.random() * keywords.length)]} ] `;
          const randomRow = Math.floor(Math.random() * rowCount);
          const randomCol = Math.floor(Math.random() * Math.max(1, (colCount - randomKeyword.length)));
          activeKeywords.push({ row: randomRow, col: randomCol, text: randomKeyword, timer: 30 }); // Lasts 30 updates
        }

        // Countdown keywords and remove dead ones
        for (let k = activeKeywords.length - 1; k >= 0; k--) {
          activeKeywords[k].timer -= 1;
          if (activeKeywords[k].timer <= 0) {
            activeKeywords.splice(k, 1);
          }
        }
      }
      animationFrameId = requestAnimationFrame(updateMatrix);
    };

    animationFrameId = requestAnimationFrame(updateMatrix);

    return () => cancelAnimationFrame(animationFrameId);
  }, [colorClass, keywords]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-[5]">
      {/* The Matrix Container */}
      <div ref={containerRef} className="absolute inset-0 flex flex-col items-center justify-center w-full h-full" />
      
      {/* Foreground Vignette to soften the edges without maskImage lag */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_200px_rgba(9,9,11,1)]" />
    </div>
  );
}
