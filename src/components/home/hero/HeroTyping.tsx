'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';


interface HeroTypingProps {
  onComplete?: () => void;
}

// Forced Two-Line Structure
const LINE_1 = "Discover India's Sacred Heritage";
const LINE_2 = "Beyond the Journey";
const FULL_TEXT = `${LINE_1}\n${LINE_2}`;
const TYPING_SPEED = 50;

export default function HeroTyping({ onComplete }: HeroTypingProps) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= FULL_TEXT.length) {
        setDisplayedText(FULL_TEXT.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
        // Trigger completion for component reveal, but keep cursor blinking
        if (onComplete) onComplete();
      }
    }, TYPING_SPEED);

    return () => clearInterval(interval);
  }, [onComplete]);

  // Gradient cursor animation
  const cursorGradient = {
    background: "linear-gradient(to bottom, #FF9933, #EC4899, #3B82F6)", // Orange -> Pink -> Blue
  };

  return (
    <div className="relative z-40 max-w-6xl mx-auto px-4 text-center">
      <div className="min-h-[160px] md:min-h-[200px] flex flex-col items-center justify-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-playfair font-bold leading-[1.2] tracking-tight text-gray-900 drop-shadow-[0_0_15px_rgba(255,153,51,0.3)]">
          {/* Line 1 - Reserved Height */}
          <span className="block whitespace-pre-wrap min-h-[1.2em]">
            {displayedText.split('\n')[0]}
            {/* Show cursor on line 1 if we haven't started line 2 yet */}
            {!displayedText.includes('\n') && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                style={cursorGradient}
                className="inline-block w-[4px] h-[0.9em] ml-1 align-bottom rounded-sm"
              />
            )}
          </span>

          {/* Line 2 - Reserved Height */}
          <span className="block text-gray-800 mt-2 min-h-[1.2em]">
            {displayedText.split('\n')[1] || ""}
            {/* Show cursor on line 2 if we are typing line 2 */}
            {displayedText.includes('\n') && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                style={cursorGradient}
                className="inline-block w-[4px] h-[0.9em] ml-1 align-bottom rounded-sm"
              />
            )}
          </span>
        </h1>
      </div>
    </div>
  );
}
