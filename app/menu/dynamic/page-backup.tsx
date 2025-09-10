// Dynamic Menu Page - Immersive fullscreen menu with scroll effects
// Features snap scrolling, dynamic backgrounds, and 3D dish presentations
// Includes navigation bar and improved UI design

'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import NavigationHeader from '@/components/navigation-header';
import { FloatingDish } from '@/components/dynamic-menu/floating-dish';
import { NavigationDots } from '@/components/dynamic-menu/navigation-dots';
import { NavigationDotsEnhanced } from '@/components/dynamic-menu/navigation-dots-enhanced';
import { CategorySwitcher } from '@/components/dynamic-menu/category-switcher';
import { dishes, getDishesByCategory, DishCategory, Dish, categoryLabels } from '@/lib/menu-data';
import { getDishTypePalette, extractColors, ColorPalette } from '@/components/dynamic-menu/color-extractor';
import { useSmartColorExtraction } from '@/hooks/useSmartColorExtraction';

export default function DynamicMenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<DishCategory | 'all'>('汤底');
  const [currentDishIndex, setCurrentDishIndex] = useState(0);
  const [filteredDishes, setFilteredDishes] = useState<Dish[]>(getDishesByCategory('汤底'));
  const [currentPalette, setCurrentPalette] = useState<ColorPalette>(getDishTypePalette('汤底'));
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [nextPalette, setNextPalette] = useState<ColorPalette>(getDishTypePalette('all'));
  const [isScrolling, setIsScrolling] = useState(false);
  const [realtimeScrollOffset, setRealtimeScrollOffset] = useState(0); // Real-time scroll position - moved after other state declarations
  const [isCategorySwitching, setIsCategorySwitching] = useState(false); // Track category switching to prevent animation glitches
  const [imageScrollOffset, setImageScrollOffset] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set()); // Track loaded images
  const [isMobileDevice, setIsMobileDevice] = useState(false); // Track if device is mobile
  
  // Get current dish for smart color extraction
  const currentDish = filteredDishes[currentDishIndex];
  // Only extract colors if image is loaded
  const shouldExtractColors = currentDish?.image && 
    !currentDish.image.includes('placeholder') && 
    loadedImages.has(currentDish.image);
  const smartColors = useSmartColorExtraction(
    shouldExtractColors ? currentDish.image : null
  );
  
  
  // Refs for scroll handling
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollAccumulator = useRef(0);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth <= 768;
      const isMobileUA = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      setIsMobileDevice(hasTouch && (isSmallScreen || isMobileUA));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Preload all non-placeholder images on initial mount
  useEffect(() => {
    const preloadAllImages = async () => {
      const allImageUrls = dishes
        .filter(dish => dish.image && !dish.image.includes('placeholder'))
        .map(dish => dish.image);
      
      const uniqueImages = [...new Set(allImageUrls)];
      
      const imagePromises = uniqueImages.map(src => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => {
            setLoadedImages(prev => new Set(prev).add(src));
            resolve();
          };
          img.onerror = () => resolve();
          img.src = src;
        });
      });
      
      await Promise.all(imagePromises);
    };
    
    preloadAllImages();
  }, []); // Only run once on mount

  // Also preload images when category changes (for any new images)
  useEffect(() => {
    const preloadCategoryImages = async () => {
      const imagePromises = filteredDishes
        .filter(dish => dish.image && !dish.image.includes('placeholder') && !loadedImages.has(dish.image))
        .map(dish => {
          return new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = () => {
              setLoadedImages(prev => new Set(prev).add(dish.image));
              resolve();
            };
            img.onerror = () => resolve();
            img.src = dish.image;
          });
        });
      
      if (imagePromises.length > 0) {
        await Promise.all(imagePromises);
      }
    };
    
    preloadCategoryImages();
  }, [filteredDishes]);

  // Filter dishes when category changes
  useEffect(() => {
    setIsCategorySwitching(true); // Start category switch
    
    // Immediate update without delay for better performance
    const filtered = getDishesByCategory(selectedCategory);
    setFilteredDishes(filtered);
    setCurrentDishIndex(0);
    setRealtimeScrollOffset(0); // Reset real-time scroll position
    
    // Scroll to top when category changes
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
    
    // End category switch after a minimal delay
    requestAnimationFrame(() => {
      setIsCategorySwitching(false);
    });
  }, [selectedCategory]);

  // Update color palette with smooth transitions based on scroll position
  useEffect(() => {
    if (filteredDishes.length === 0 || realtimeScrollOffset === undefined) return;
    
    // Get the current and next dish based on real-time scroll position
    const currentIndex = Math.floor(realtimeScrollOffset);
    const nextIndex = Math.ceil(realtimeScrollOffset);
    const transitionProgress = realtimeScrollOffset - currentIndex;
    
    const currentDish = filteredDishes[Math.max(0, Math.min(currentIndex, filteredDishes.length - 1))];
    const nextDish = filteredDishes[Math.max(0, Math.min(nextIndex, filteredDishes.length - 1))];
    
    if (currentDish && (!currentDish.image || currentDish.image.includes('placeholder'))) {
      // Use category-based palette as fallback
      const palette = getDishTypePalette(currentDish.category);
      setCurrentPalette(palette);
    }
    
    if (nextDish && transitionProgress > 0.1) {
      const nextPalette = getDishTypePalette(nextDish.category);
      setNextPalette(nextPalette);
      setScrollProgress(transitionProgress);
    } else {
      setScrollProgress(0);
    }
  }, [realtimeScrollOffset, filteredDishes]);

  // Set initial load to false after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Smooth scroll tracking
  const animationFrameRef = useRef<number | null>(null);
  const velocityRef = useRef(0);
  const targetOffsetRef = useRef(0);
  const lastTimeRef = useRef(0);


  // Simplified scroll handling without continuous animation loop
  useEffect(() => {
    // Only update when scrolling stops
    if (!isScrolling && Math.abs(velocityRef.current) > 0.01) {
      const nearestIndex = Math.round(targetOffsetRef.current);
      const normalizedIndex = ((nearestIndex % filteredDishes.length) + filteredDishes.length) % filteredDishes.length;
      
      if (normalizedIndex !== currentDishIndex) {
        setCurrentDishIndex(normalizedIndex);
        setRealtimeScrollOffset(normalizedIndex);
        
        // Update palette
        if (filteredDishes[normalizedIndex]) {
          setCurrentPalette(getDishTypePalette(filteredDishes[normalizedIndex].category));
          const nextIndex = (normalizedIndex + 1) % filteredDishes.length;
          setNextPalette(getDishTypePalette(filteredDishes[nextIndex].category));
        }
      }
      
      velocityRef.current = 0;
    }
  }, [currentDishIndex, filteredDishes, isScrolling]);

  // Handle scroll input with smooth following
  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      // Don't prevent default for trackpad pinch-to-zoom
      if (e.ctrlKey || e.metaKey) return;
      
      e.preventDefault();
      
      // Detect if it's a trackpad or mouse wheel
      // Trackpad usually has smaller deltaY values and can have deltaX
      const isTrackpad = Math.abs(e.deltaY) < 50 || e.deltaX !== 0;
      
      // Adjust sensitivity based on input device
      const scrollSensitivity = isTrackpad ? 0.008 : 0.003; // Higher for trackpad
      const inertia = isTrackpad ? 0.92 : 0.95;
      
      // For trackpad, use raw delta; for mouse wheel, apply easing
      const deltaY = isTrackpad ? e.deltaY : Math.sign(e.deltaY) * 100;
      const easedDelta = deltaY * scrollSensitivity;
      
      // Cancel any ongoing animation
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      
      // Direct update for more responsive feel on PC
      setRealtimeScrollOffset(prev => {
        const newOffset = prev + easedDelta;
        
        // Clamp with elastic boundaries
        if (newOffset < 0) {
          return Math.max(-0.3, newOffset * 0.5);
        } else if (newOffset > filteredDishes.length - 1) {
          const max = filteredDishes.length - 1;
          return Math.min(max + 0.3, max + (newOffset - max) * 0.5);
        }
        
        return newOffset;
      });
      
      // Update velocity for momentum
      velocityRef.current = velocityRef.current * inertia + easedDelta * (1 - inertia);
      
      // Clear and reset snap timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      setIsScrolling(true);
      
      // Snap after scrolling stops
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
        
        // Find nearest dish
        const targetIndex = Math.round(realtimeScrollOffset);
        const clampedIndex = Math.max(0, Math.min(targetIndex, filteredDishes.length - 1));
        
        // Smooth snap animation
        const snapToIndex = () => {
          const distance = clampedIndex - realtimeScrollOffset;
          
          if (Math.abs(distance) > 0.01) {
            const springStrength = 0.15;
            const damping = 0.85;
            
            setRealtimeScrollOffset(prev => {
              const next = prev + distance * springStrength;
              
              if (Math.abs(clampedIndex - next) < 0.01) {
                setCurrentDishIndex(clampedIndex);
                velocityRef.current = 0;
                
                // Update colors
                if (filteredDishes[clampedIndex]) {
                  setCurrentPalette(getDishTypePalette(filteredDishes[clampedIndex].category));
                }
                
                return clampedIndex;
              }
              
              return next;
            });
            
            requestAnimationFrame(snapToIndex);
          } else {
            setRealtimeScrollOffset(clampedIndex);
            setCurrentDishIndex(clampedIndex);
            velocityRef.current = 0;
          }
        };
        
        requestAnimationFrame(snapToIndex);
      }, isTrackpad ? 50 : 100); // Faster response for trackpad
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleScroll, { passive: false });
      return () => {
        container.removeEventListener('wheel', handleScroll);
      };
    }
  }, [realtimeScrollOffset, filteredDishes, currentDishIndex]);

  // Handle dot navigation with smooth animation
  const scrollToDish = (index: number) => {
    targetOffsetRef.current = index;
    velocityRef.current = 0; // Stop any existing velocity
    setCurrentDishIndex(index);
    setRealtimeScrollOffset(index); // IMPORTANT: Update the real-time scroll offset to sync image position
    
    // Update palette for the new dish
    if (filteredDishes[index]) {
      setCurrentPalette(getDishTypePalette(filteredDishes[index].category));
      const nextIndex = (index + 1) % filteredDishes.length;
      setNextPalette(getDishTypePalette(filteredDishes[nextIndex].category));
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' && currentDishIndex < filteredDishes.length - 1) {
        scrollToDish(currentDishIndex + 1);
      } else if (e.key === 'ArrowUp' && currentDishIndex > 0) {
        scrollToDish(currentDishIndex - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentDishIndex, filteredDishes.length]);

  // Handle touch gestures for dish navigation on mobile
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [lastTouchY, setLastTouchY] = useState<number | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const [isDraggingDish, setIsDraggingDish] = useState(false);
  const [dragStartOffset, setDragStartOffset] = useState(0);
  const touchVelocityRef = useRef(0);

  const onTouchStart = (e: React.TouchEvent) => {
    const touch = e.targetTouches[0];
    const touchY = touch.clientY;
    const touchX = touch.clientX;
    
    // Check if touch is in the navigation dots area (right side)
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 375;
    const isInNavigationZone = touchX > screenWidth * 0.97; // Right 3% of screen reserved for navigation dots
    
    // If touching navigation dots area, don't handle the touch event here
    if (isInNavigationZone) {
      return; // Let the navigation dots component handle it
    }
    
    // Determine if we're in the dish scrolling zone (center area) or category zone (top)
    const isInCategoryZone = touchY < 150; // Top 150px for category switcher
    const isInDishZone = touchY >= 150 && touchY <= (typeof window !== 'undefined' ? window.innerHeight - 100 : 900);
    
    if (isInDishZone) {
      setTouchStartY(touchY);
      setTouchStartX(touchX);
      setLastTouchY(touchY);
      setIsSwiping(true);
      setIsDraggingDish(true);
      setDragStartOffset(realtimeScrollOffset);
      touchVelocityRef.current = 0;
      velocityRef.current = 0; // Stop any existing scroll velocity
    } else if (!isInCategoryZone) {
      // Still track for potential horizontal swipe in other zones
      setTouchStartX(touchX);
      setTouchStartY(touchY);
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingDish || !touchStartY || !lastTouchY) return;
    
    const touch = e.targetTouches[0];
    const currentY = touch.clientY;
    const deltaY = touchStartY - currentY;
    
    // Enhanced touch sensitivity with smooth response curve
    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    const touchSensitivity = 3.5 / viewportHeight; // Slightly reduced for smoother control
    
    // Apply easing to touch movement for natural feel
    const easedDelta = Math.sign(deltaY) * Math.pow(Math.abs(deltaY), 0.9);
    const newOffset = dragStartOffset + (easedDelta * touchSensitivity);
    
    // Smooth offset update with elastic boundaries
    const clampedOffset = (() => {
      if (newOffset < 0) {
        return newOffset * 0.3; // Elastic resistance at top
      } else if (newOffset > filteredDishes.length - 1) {
        const overflow = newOffset - (filteredDishes.length - 1);
        return (filteredDishes.length - 1) + overflow * 0.3; // Elastic at bottom
      }
      return newOffset;
    })();
    
    setRealtimeScrollOffset(clampedOffset);
    
    // Calculate velocity for momentum
    const instantDelta = lastTouchY - currentY;
    const instantVelocity = instantDelta * touchSensitivity * 1.2; // Boost for responsiveness
    
    // Smooth velocity with averaging
    touchVelocityRef.current = touchVelocityRef.current * 0.7 + instantVelocity * 0.3;
    
    setLastTouchY(currentY);
    setIsScrolling(true);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (isDraggingDish && realtimeScrollOffset !== undefined) {
      // Find nearest dish based on current position
      const velocity = touchVelocityRef.current;
      
      let targetIndex: number;
      if (Math.abs(velocity) > 0.5) {
        // Strong swipe - go to next/previous dish
        targetIndex = velocity > 0 
          ? Math.min(Math.floor(realtimeScrollOffset) + 1, filteredDishes.length - 1)
          : Math.max(Math.ceil(realtimeScrollOffset) - 1, 0);
      } else {
        // Gentle release - snap to nearest
        targetIndex = Math.round(realtimeScrollOffset);
      }
      
      // Clamp to valid range
      targetIndex = Math.max(0, Math.min(filteredDishes.length - 1, targetIndex));
      
      // Update both the index and offset
      setCurrentDishIndex(targetIndex);
      setRealtimeScrollOffset(targetIndex);
      
      // Update palette
      if (filteredDishes[targetIndex]) {
        setCurrentPalette(getDishTypePalette(filteredDishes[targetIndex].category));
      }
      
      setIsDraggingDish(false);
      touchVelocityRef.current = 0;
    } else if (!isDraggingDish && touchStartX && touchStartY) {
      // Check for horizontal swipe for category switching
      const touch = e.changedTouches[0];
      const distanceY = touchStartY - touch.clientY;
      const distanceX = touchStartX - touch.clientX;
      const absDistanceX = Math.abs(distanceX);
      
      if (absDistanceX > 80 && absDistanceX > Math.abs(distanceY)) {
        const categories: DishCategory[] = [
          '汤底', '陆鲜', '海鲜', '素菜', '热菜', '小吃', '饮品'
        ];
        const actualCategory = selectedCategory === 'all' ? '汤底' : selectedCategory;
        const currentCategoryIndex = categories.indexOf(actualCategory as DishCategory);
        
        if (distanceX > 0 && currentCategoryIndex < categories.length - 1) {
          setSelectedCategory(categories[currentCategoryIndex + 1]);
        } else if (distanceX < 0 && currentCategoryIndex > 0) {
          setSelectedCategory(categories[currentCategoryIndex - 1]);
        }
      }
    }
    
    setIsSwiping(false);
    setIsScrolling(false);
    touchVelocityRef.current = 0;
  };

  return (
    <div 
      ref={containerRef}
      className="relative h-screen overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Dynamic background with smooth color transitions */}
      <motion.div
        className="absolute inset-0"
        animate={{
          opacity: 1
        }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
      >
        {/* Base gradient layer - use smart colors when available */}
        <div 
          className="absolute inset-0 transition-all duration-300"
          style={{
            background: smartColors 
              ? smartColors.backgroundGradient
              : currentPalette.background,
            willChange: 'background'
          }}
        />
        
        {/* Transition overlay for smooth color blending */}
        {scrollProgress > 0 && nextPalette && !smartColors && (
          <div 
            className="absolute inset-0"
            style={{
              background: nextPalette.background,
              opacity: scrollProgress * 0.8 // Gradual transition based on scroll
            }}
          />
        )}
      </motion.div>

      {/* Dark overlay to tone down brightness - adjust opacity as needed */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.85), rgba(0,0,0,0.75))',
          mixBlendMode: 'multiply'
        }}
      />

      {/* Subtle accent overlay using smart extracted accent color */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute rounded-full"
          style={{
            width: '80%',
            height: '80%',
            background: smartColors 
              ? `radial-gradient(circle, ${smartColors.accent}30 0%, transparent 70%)`
              : `radial-gradient(circle, ${currentPalette.accent}20 0%, transparent 70%)`,
            left: '10%',
            top: '10%',
          }}
        />
      </div>

      {/* Navigation Header */}
      <NavigationHeader />
      
      {/* Top gradient overlay for navigation area */}
      <div className="fixed top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/50 via-black/25 to-transparent z-10 pointer-events-none" />
      
      {/* Category switcher - minimal and swipeable */}
      <div className="relative z-30">
        <CategorySwitcher
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>

      {/* Navigation dots - use enhanced version on mobile */}
      {filteredDishes.length > 0 && (
        isMobileDevice ? (
          <NavigationDotsEnhanced
            total={filteredDishes.length}
            current={currentDishIndex}
            dishes={filteredDishes}
            onDotClick={scrollToDish}
          />
        ) : (
          <NavigationDots
            total={filteredDishes.length}
            current={currentDishIndex}
            onDotClick={scrollToDish}
          />
        )
      )}

{/* Fixed image carousel container - properly centered */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-15">
        <div 
          className="relative flex items-center justify-center"
          style={{
            height: '100%',
            width: '100%',
            opacity: isCategorySwitching ? 0 : 1,
            transition: 'opacity 0.2s ease-in-out'
          }}
        >
          {filteredDishes.map((dish, index) => {
            // Calculate position based on real-time scroll offset
            const relativePosition = index - realtimeScrollOffset;
            
            // Render only current and adjacent dishes for performance
            if (Math.abs(relativePosition) > 1) return null;
            
            // Use viewport height for spacing - dishes are exactly one screen apart
            const yPosition = relativePosition * (typeof window !== 'undefined' ? window.innerHeight : 800);
            
            // Calculate opacity based on distance from center
            const distance = Math.abs(relativePosition);
            const opacity = distance === 0 ? 1 : 0.2;
            
            // Calculate scale for depth effect
            const scale = 1 - Math.abs(relativePosition) * 0.15;
            
            return (
              <motion.div
                key={dish.id}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                initial={{ 
                  opacity: 0,
                  y: yPosition,
                  scale: scale
                }}
                animate={{
                  opacity: opacity,
                  y: yPosition,
                  scale: scale,
                  filter: `blur(${Math.abs(relativePosition) * 2}px)`
                }}
                transition={{ 
                  type: "tween",
                  duration: 0.3,
                  ease: "easeOut"
                }}
              >
                {/* Dish with responsive size */}
                <div className="w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px] lg:w-[450px] lg:h-[450px]">
                  <FloatingDish
                    image={dish.image}
                    name={dish.name}
                    isActive={index === currentDishIndex}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Fixed text containers that fade in/out based on current dish */}
      {filteredDishes[currentDishIndex] && !isCategorySwitching && (
        <>
          {/* Container 1: Dish name at top-left */}
          <motion.div
            key={`name-${currentDishIndex}`}
            className="absolute top-[20%] left-[8%] md:left-[10%] lg:left-[12%] text-white pointer-events-none z-30"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ 
              duration: 0.5,
              ease: [0.19, 1, 0.22, 1]
            }}
          >
            {/* Main dish name */}
            <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-thin tracking-wide leading-tight text-left">
              {filteredDishes[currentDishIndex].name}
            </h2>
            <p className="text-xl sm:text-2xl lg:text-3xl font-light opacity-75 italic mt-3 text-left">
              {filteredDishes[currentDishIndex].nameEn}
            </p>
          </motion.div>

          {/* Container 2: Description at bottom-right, aligned with menu selection button padding */}
          <motion.div
            key={`desc-${currentDishIndex}`}
            className="absolute bottom-[15%] right-[8%] md:right-[10%] lg:right-[12%] text-white pointer-events-none z-25 w-auto"
            style={{
              maxWidth: 'min(40%, 350px)'  // Better responsive max-width for mobile
            }}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ 
              duration: 0.5,
              delay: 0.1,
              ease: [0.19, 1, 0.22, 1]
            }}
          >
            <p className="text-base lg:text-lg xl:text-xl opacity-90 leading-relaxed text-right">
              {filteredDishes[currentDishIndex].description}
            </p>
            <p className="text-sm lg:text-base xl:text-lg opacity-60 leading-relaxed italic text-right mt-2">
              {filteredDishes[currentDishIndex].descriptionEn}
            </p>
          </motion.div>

          {/* Container 3: Price at bottom-left, raised higher */}
          <motion.div
            key={`price-${currentDishIndex}`}
            className="absolute bottom-[25%] left-[8%] md:left-[10%] lg:left-[12%] text-white pointer-events-none z-30"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ 
              duration: 0.5,
              delay: 0.2,
              ease: [0.19, 1, 0.22, 1]
            }}
          >
            <p className="text-xs uppercase tracking-widest opacity-50 mb-2">价格 Price</p>
            <p className="text-5xl lg:text-6xl xl:text-7xl font-thin">
              <span className="text-3xl lg:text-4xl align-top opacity-75">¥</span>
              {filteredDishes[currentDishIndex].price}
            </p>
          </motion.div>
        </>
      )}

      {/* Empty state when no dishes */}
      {filteredDishes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-3xl font-light mb-4">暂无菜品</h2>
            <p className="text-xl opacity-80">No dishes available</p>
          </div>
        </div>
      )}
      
    </div>
  );
}