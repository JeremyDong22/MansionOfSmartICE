// Navigation Dots Component - Quick navigation between dishes
// Features active state indication and smooth scrolling

'use client';

import { motion } from 'framer-motion';

interface NavigationDotsProps {
  total: number;
  current: number;
  onDotClick: (index: number) => void;
}

export function NavigationDots({ total, current, onDotClick }: NavigationDotsProps) {
  // Limit visible dots to prevent overflow
  const maxVisibleDots = 10;
  const showScrollIndicators = total > maxVisibleDots;
  
  // Calculate which dots to show
  let startIndex = 0;
  let endIndex = total;
  
  if (showScrollIndicators) {
    // Center current dot in visible range when possible
    const halfVisible = Math.floor(maxVisibleDots / 2);
    startIndex = Math.max(0, current - halfVisible);
    endIndex = Math.min(total, startIndex + maxVisibleDots);
    
    // Adjust if we're near the end
    if (endIndex === total) {
      startIndex = Math.max(0, total - maxVisibleDots);
    }
  }
  
  const visibleDots = [...Array(endIndex - startIndex)].map((_, i) => i + startIndex);
  
  return (
    <div className="fixed right-6 sm:right-8 lg:right-12 top-1/2 transform -translate-y-1/2 z-40 flex flex-col items-center">
      {/* Top scroll indicator */}
      {showScrollIndicators && startIndex > 0 && (
        <motion.div
          className="mb-2 opacity-50"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </motion.div>
      )}
      
      {/* Navigation dots */}
      <div className="flex flex-col space-y-2">
        {visibleDots.map((index) => (
          <motion.button
            key={index}
            onClick={() => onDotClick(index)}
            className="relative p-1.5 group"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <div
              className={`
                w-2 h-2 rounded-full transition-all duration-300
                ${index === current 
                  ? 'bg-white scale-125' 
                  : 'bg-white/40 hover:bg-white/60'
                }
              `}
            />
            {index === current && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="w-3 h-3 border border-white/50 rounded-full" />
              </motion.div>
            )}
            
            {/* Tooltip on hover */}
            <div className="absolute right-full mr-2 px-2 py-1 bg-black/70 text-white text-xs rounded 
                          opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {index + 1} / {total}
            </div>
          </motion.button>
        ))}
      </div>
      
      {/* Bottom scroll indicator */}
      {showScrollIndicators && endIndex < total && (
        <motion.div
          className="mt-2 opacity-50"
          animate={{ y: [0, 3, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      )}
    </div>
  );
}