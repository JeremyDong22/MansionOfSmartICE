// Enhanced Navigation Dots Component - Mobile-optimized scrollbar with iOS-like preview
// Features touch detection, magnification effect, and dish name preview

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Dish } from '@/lib/menu-data';

interface NavigationDotsEnhancedProps {
  total: number;
  current: number;
  dishes: Dish[];
  onDotClick: (index: number) => void;
}

export function NavigationDotsEnhanced({ 
  total, 
  current, 
  dishes,
  onDotClick 
}: NavigationDotsEnhancedProps) {
  // State for touch interactions
  const [isTouching, setIsTouching] = useState(false);
  const [touchY, setTouchY] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Refs for DOM elements
  const containerRef = useRef<HTMLDivElement>(null);
  const dotsRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const touchStartTimeRef = useRef<number>(0);
  const lastHapticTimeRef = useRef<number>(0);
  
  // Detect if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth <= 768;
      const isMobileUA = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      setIsMobile(hasTouch && (isSmallScreen || isMobileUA));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Calculate which dot corresponds to touch position
  const calculateIndexFromTouch = useCallback((clientY: number): number | null => {
    if (!containerRef.current) return null;
    
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const relativeY = clientY - rect.top;
    const containerHeight = rect.height;
    
    // Map touch position to dish index
    const index = Math.round((relativeY / containerHeight) * (total - 1));
    
    // Clamp to valid range
    return Math.max(0, Math.min(total - 1, index));
  }, [total]);
  
  // Trigger haptic feedback (if supported)
  const triggerHaptic = useCallback(() => {
    const now = Date.now();
    // Throttle haptic feedback to prevent too frequent vibrations
    if (now - lastHapticTimeRef.current > 50) {
      if ('vibrate' in navigator) {
        navigator.vibrate(10); // Short haptic pulse
      }
      lastHapticTimeRef.current = now;
    }
  }, []);
  
  // Handle touch start
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!isMobile) return;
    
    // Don't call preventDefault - use CSS touch-action instead
    e.stopPropagation(); // Stop event from bubbling to parent container
    const touch = e.touches[0];
    
    setIsTouching(true);
    setTouchY(touch.clientY);
    touchStartTimeRef.current = Date.now();
    
    const index = calculateIndexFromTouch(touch.clientY);
    if (index !== null) {
      setHoveredIndex(index);
      triggerHaptic();
      // Immediately update the dish on touch start
      onDotClick(index);
    }
  }, [isMobile, calculateIndexFromTouch, triggerHaptic, onDotClick]);
  
  // Handle touch move
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isMobile || !isTouching) return;
    
    // Don't call preventDefault here - it causes issues with passive listeners
    // Instead, we'll handle this with native event listeners if needed
    e.stopPropagation(); // Stop event from bubbling to parent container
    const touch = e.touches[0];
    setTouchY(touch.clientY);
    
    const index = calculateIndexFromTouch(touch.clientY);
    if (index !== null && index !== hoveredIndex) {
      setHoveredIndex(index);
      triggerHaptic();
      
      // Immediately update the current dish while dragging for real-time preview
      onDotClick(index);
    }
  }, [isMobile, isTouching, calculateIndexFromTouch, hoveredIndex, triggerHaptic, onDotClick]);
  
  // Handle touch end
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!isMobile || !isTouching) return;
    
    // Don't call preventDefault - use CSS touch-action instead
    e.stopPropagation(); // Stop event from bubbling to parent container
    
    // The page has already been updated during touchmove, 
    // so we just need to confirm the selection with haptic feedback
    if (hoveredIndex !== null) {
      // Longer haptic for selection confirmation
      if ('vibrate' in navigator) {
        navigator.vibrate(20);
      }
    }
    
    // Reset touch state
    setIsTouching(false);
    setTouchY(null);
    setHoveredIndex(null);
  }, [isMobile, isTouching, hoveredIndex]);
  
  // Calculate visible dots (limit for better UX)
  const maxVisibleDots = isMobile ? 15 : 10;
  const showScrollIndicators = total > maxVisibleDots;
  
  let startIndex = 0;
  let endIndex = total;
  
  if (showScrollIndicators) {
    const halfVisible = Math.floor(maxVisibleDots / 2);
    startIndex = Math.max(0, current - halfVisible);
    endIndex = Math.min(total, startIndex + maxVisibleDots);
    
    if (endIndex === total) {
      startIndex = Math.max(0, total - maxVisibleDots);
    }
  }
  
  const visibleDots = [...Array(endIndex - startIndex)].map((_, i) => i + startIndex);
  
  return (
    <>
      {/* Main navigation dots container */}
      <div 
        ref={containerRef}
        className={`
          fixed right-[1%] sm:right-[2%] md:right-[3%] lg:right-[4%] top-1/2 transform -translate-y-1/2 z-40 
          flex flex-col items-center
          ${isMobile && isTouching ? 'scale-110' : ''}
          transition-transform duration-200
        `}
        style={{
          touchAction: 'none' // Prevent default touch scrolling in this area
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
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
        <div className={`
          flex flex-col 
          ${isMobile && isTouching ? 'space-y-2' : 'space-y-1'}
          transition-all duration-200
        `}>
          {visibleDots.map((index) => {
            const isHovered = isTouching && hoveredIndex === index;
            const isCurrent = index === current;
            
            return (
              <motion.button
                key={index}
                ref={el => dotsRefs.current[index] = el}
                onClick={() => !isTouching && onDotClick(index)}
                className={`
                  relative p-1 group
                  ${isMobile ? 'touch-none' : ''}
                `}
                whileHover={!isMobile ? { scale: 1.2 } : {}}
                whileTap={!isMobile ? { scale: 0.9 } : {}}
                animate={{
                  scale: isHovered ? 1.5 : (isCurrent ? 1.15 : 1),
                  transition: { type: "spring", stiffness: 300, damping: 20 }
                }}
              >
                {/* Center dot container for proper alignment */}
                <div className="relative flex items-center justify-center w-3 h-3">
                  <div
                    className={`
                      rounded-full transition-all duration-300
                      ${isHovered 
                        ? 'w-3 h-3 bg-white shadow-lg shadow-white/50' 
                        : isCurrent 
                          ? 'w-1.5 h-1.5 bg-white' 
                          : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/60'
                      }
                    `}
                  />
                </div>
                
                {/* Desktop tooltip */}
                {!isMobile && (
                  <div className="absolute right-full mr-2 px-2 py-1 bg-black/70 text-white text-xs rounded 
                              opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {dishes[index]?.name || `${index + 1} / ${total}`}
                  </div>
                )}
              </motion.button>
            );
          })}
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
      
      {/* Mobile preview tooltip - shows dish name when touching */}
      <AnimatePresence>
        {isMobile && isTouching && hoveredIndex !== null && dishes[hoveredIndex] && (
          <motion.div
            className="fixed z-50 pointer-events-none"
            style={{
              right: '8%', // Adjusted to be left of the dots
              top: touchY ? `${touchY}px` : '50%',
              transform: 'translateY(-50%)'
            }}
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <div className="bg-black/90 backdrop-blur-md px-4 py-3 rounded-lg shadow-2xl border border-white/20">
              <div className="flex items-center space-x-3">
                {/* Index indicator */}
                <div className="text-white/50 text-sm font-mono">
                  {(hoveredIndex + 1).toString().padStart(2, '0')}
                </div>
                
                {/* Dish name */}
                <div>
                  <div className="text-white font-medium text-base whitespace-nowrap">
                    {dishes[hoveredIndex].name}
                  </div>
                  <div className="text-white/60 text-xs whitespace-nowrap">
                    {dishes[hoveredIndex].nameEn}
                  </div>
                </div>
                
                {/* Price */}
                <div className="text-white/80 text-sm">
                  ¥{dishes[hoveredIndex].price}
                </div>
              </div>
              
              {/* Arrow pointing to dot */}
              <div className="absolute right-0 top-1/2 transform translate-x-full -translate-y-1/2">
                <div className="w-0 h-0 border-t-8 border-b-8 border-l-8 
                            border-t-transparent border-b-transparent border-l-black/90" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}