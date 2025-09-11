// Optimized Dynamic Menu Page - Performance improvements
// Features: Precomputed colors, virtual rendering, optimized state management

'use client';

import { useState, useEffect, useRef, useReducer, useCallback } from 'react';
import { motion } from 'framer-motion';
import NavigationHeader from '@/components/navigation-header';
import { FloatingDish } from '@/components/dynamic-menu/floating-dish';
import { NavigationDots } from '@/components/dynamic-menu/navigation-dots';
import { NavigationDotsEnhanced } from '@/components/dynamic-menu/navigation-dots-enhanced';
import { CategorySwitcher } from '@/components/dynamic-menu/category-switcher';
import { dishes, getDishesByCategory, DishCategory, Dish, categoryLabels } from '@/lib/menu-data';
import { getDishTypePalette, ColorPalette } from '@/components/dynamic-menu/color-extractor';
import { usePrecomputedColors, getPrecomputedColors } from '@/hooks/usePrecomputedColors';
import './animations.css';

// Merged scroll state for fewer re-renders
interface ScrollState {
  offset: number;
  currentIndex: number;
  isScrolling: boolean;
  velocity: number;
}

// Merged visual state
interface VisualState {
  currentPalette: ColorPalette;
  nextPalette: ColorPalette;
  scrollProgress: number;
  isCategorySwitching: boolean;
}

// Combined reducer for state management
type AppState = {
  scroll: ScrollState;
  visual: VisualState;
};

type AppAction = 
  | { type: 'SET_SCROLL'; payload: Partial<ScrollState> }
  | { type: 'SET_VISUAL'; payload: Partial<VisualState> }
  | { type: 'RESET_FOR_CATEGORY' };

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_SCROLL':
      return {
        ...state,
        scroll: { ...state.scroll, ...action.payload }
      };
    case 'SET_VISUAL':
      return {
        ...state,
        visual: { ...state.visual, ...action.payload }
      };
    case 'RESET_FOR_CATEGORY':
      return {
        scroll: {
          offset: 0,
          currentIndex: 0,
          isScrolling: false,
          velocity: 0
        },
        visual: {
          ...state.visual,
          isCategorySwitching: true,
          scrollProgress: 0
        }
      };
    default:
      return state;
  }
}

export default function OptimizedDynamicMenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<DishCategory | 'all'>('汤底');
  const [filteredDishes, setFilteredDishes] = useState<Dish[]>(getDishesByCategory('汤底'));
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [preloadIndex, setPreloadIndex] = useState<number | null>(null); // For virtual rendering optimization
  const [enableSingleStep, setEnableSingleStep] = useState(true); // Single-step scroll mode (default enabled)
  
  // Use reducer for combined state management (fewer re-renders)
  const [state, dispatch] = useReducer(appReducer, {
    scroll: {
      offset: 0,
      currentIndex: 0,
      isScrolling: false,
      velocity: 0
    },
    visual: {
      currentPalette: getDishTypePalette('汤底'),
      nextPalette: getDishTypePalette('汤底'),
      scrollProgress: 0,
      isCategorySwitching: false
    }
  });
  
  // Get current dish for color extraction
  const currentDish = filteredDishes[state.scroll.currentIndex];
  
  // Use precomputed colors instead of runtime extraction (MAJOR OPTIMIZATION)
  const precomputedColors = usePrecomputedColors(
    currentDish?.image && !currentDish.image.includes('placeholder') 
      ? currentDish.image 
      : null
  );
  
  // Refs for scroll handling
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const velocityRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const pendingScrollRef = useRef<number | null>(null);
  const lastScrollTime = useRef<number>(0); // Track last scroll time for debouncing
  const scrollAccumulator = useRef<number>(0); // Accumulate small scroll deltas
  const isAnimating = useRef<boolean>(false); // Track animation state
  
  // Touch handling refs
  const touchStartY = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const lastTouchY = useRef<number | null>(null);
  const dragStartOffset = useRef(0);
  const touchVelocityRef = useRef(0);
  const lastTouchTime = useRef<number>(0);
  const inertiaAnimationId = useRef<number | null>(null);

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

  // Aggressive image preloading for smooth transitions
  useEffect(() => {
    const preloadCategoryImages = async () => {
      // Preload all images in the category at once
      const imagePromises = filteredDishes
        .filter(dish => dish.image && !dish.image.includes('placeholder') && !loadedImages.has(dish.image))
        .map(dish => {
          return new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = () => {
              setLoadedImages(prev => new Set(prev).add(dish.image));
              resolve();
            };
            img.onerror = () => {
              console.warn(`Failed to load image: ${dish.image}`);
              resolve();
            };
            // Use WebP format for better performance
            const imageSrc = dish.image.endsWith('.jpg') ? dish.image.replace('.jpg', '.webp') : dish.image;
            img.src = imageSrc;
          });
        });
      
      if (imagePromises.length > 0) {
        // Load first 3 images immediately
        const priorityImages = imagePromises.slice(0, 3);
        await Promise.all(priorityImages);
        
        // Load rest in background
        if (imagePromises.length > 3) {
          Promise.all(imagePromises.slice(3));
        }
      }
    };
    
    preloadCategoryImages();
  }, [filteredDishes]);

  // Filter dishes when category changes
  useEffect(() => {
    dispatch({ type: 'RESET_FOR_CATEGORY' });
    
    const filtered = getDishesByCategory(selectedCategory);
    setFilteredDishes(filtered);
    
    // Quick reset of visual state
    requestAnimationFrame(() => {
      dispatch({ type: 'SET_VISUAL', payload: { isCategorySwitching: false } });
    });
  }, [selectedCategory]);
  
  // Preload adjacent images when scrolling
  useEffect(() => {
    const currentIndex = Math.round(state.scroll.offset);
    
    // Preload next 2 images for smoother transitions
    [currentIndex + 1, currentIndex + 2].forEach(index => {
      if (index >= 0 && index < filteredDishes.length) {
        const dish = filteredDishes[index];
        if (dish?.image && !loadedImages.has(dish.image)) {
          const img = new Image();
          img.onload = () => setLoadedImages(prev => new Set(prev).add(dish.image));
          img.src = dish.image;
        }
      }
    });
    
    setPreloadIndex(currentIndex + 1);
  }, [state.scroll.offset, filteredDishes]);

  // Update color palette based on scroll (using precomputed colors)
  useEffect(() => {
    if (filteredDishes.length === 0) return;
    
    const currentIndex = Math.floor(state.scroll.offset);
    const nextIndex = Math.ceil(state.scroll.offset);
    const transitionProgress = state.scroll.offset - currentIndex;
    
    const currentDish = filteredDishes[Math.max(0, Math.min(currentIndex, filteredDishes.length - 1))];
    const nextDish = filteredDishes[Math.max(0, Math.min(nextIndex, filteredDishes.length - 1))];
    
    // Use precomputed colors or fallback to category palette
    const currentPalette = currentDish?.image && !currentDish.image.includes('placeholder')
      ? {
          ...getDishTypePalette(currentDish.category),
          ...(getPrecomputedColors(currentDish.image) || {})
        }
      : getDishTypePalette(currentDish?.category || '汤底');
    
    const nextPalette = nextDish?.image && !nextDish.image.includes('placeholder')
      ? {
          ...getDishTypePalette(nextDish.category),
          ...(getPrecomputedColors(nextDish.image) || {})
        }
      : getDishTypePalette(nextDish?.category || '汤底');
    
    dispatch({ 
      type: 'SET_VISUAL', 
      payload: {
        currentPalette,
        nextPalette,
        scrollProgress: transitionProgress > 0.1 ? transitionProgress : 0
      }
    });
  }, [state.scroll.offset, filteredDishes]);

  // RAF-scheduled scroll update for smoother performance
  const updateScroll = () => {
    if (pendingScrollRef.current !== null) {
      const newOffset = pendingScrollRef.current;
      dispatch({ 
        type: 'SET_SCROLL', 
        payload: { 
          offset: newOffset,
          isScrolling: true,
          velocity: velocityRef.current
        }
      });
      pendingScrollRef.current = null;
    }
    rafIdRef.current = null;
  };

  // Store refs to avoid stale closures
  const stateRef = useRef(state);
  const filteredDishesRef = useRef(filteredDishes);
  
  useEffect(() => {
    stateRef.current = state;
  }, [state]);
  
  useEffect(() => {
    filteredDishesRef.current = filteredDishes;
  }, [filteredDishes]);
  
  // Smooth animation to target
  const animateToTarget = useCallback((targetOffset: number) => {
    const startOffset = stateRef.current.scroll.offset;
    const distance = targetOffset - startOffset;
    const duration = 300;
    const startTime = performance.now();
    
    isAnimating.current = true;
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeInOutCubic = (t: number) => {
        return t < 0.5 
          ? 4 * t * t * t 
          : 1 - Math.pow(-2 * t + 2, 3) / 2;
      };
      
      const easedProgress = easeInOutCubic(progress);
      const newOffset = startOffset + (distance * easedProgress);
      
      dispatch({
        type: 'SET_SCROLL',
        payload: {
          offset: newOffset,
          currentIndex: Math.round(newOffset),
          isScrolling: true
        }
      });
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Clear accumulator when animation completes
        scrollAccumulator.current = 0;
        
        // Add small cooldown before allowing next scroll
        setTimeout(() => {
          isAnimating.current = false;
        }, 50);
        
        dispatch({
          type: 'SET_SCROLL',
          payload: {
            offset: targetOffset,
            currentIndex: Math.round(targetOffset),
            isScrolling: false
          }
        });
      }
    };
    
    requestAnimationFrame(animate);
  }, []);

  // Optimized scroll handler with accumulator
  const handleScroll = useCallback((e: WheelEvent) => {
    if (e.ctrlKey || e.metaKey) return;
    e.preventDefault();
    
    // Improved trackpad detection
    const isTrackpad = Math.abs(e.deltaY) < 50 || e.deltaX !== 0;
    
    if (enableSingleStep) {
      // Don't process new scrolls while animating
      if (isAnimating.current) return;
      
      // Accumulate scroll delta with direction-aware sensitivity
      const sensitivity = isTrackpad ? 0.008 : 0.004;
      const delta = e.deltaY * sensitivity;
      
      // Add to accumulator
      scrollAccumulator.current += delta;
      
      // Check if accumulated enough to trigger a scroll
      const threshold = 0.8; // Lowered threshold for more responsive feel
      
      if (Math.abs(scrollAccumulator.current) >= threshold) {
        const direction = scrollAccumulator.current > 0 ? 1 : -1;
        
        // Use floor for current index to prevent rounding issues
        const currentIndex = Math.floor(stateRef.current.scroll.offset + 0.5);
        const targetIndex = Math.max(0, Math.min(
          currentIndex + direction,
          filteredDishesRef.current.length - 1
        ));
        
        // Reset accumulator but keep remainder for smoother continuous scrolling
        const remainder = Math.abs(scrollAccumulator.current) - threshold;
        scrollAccumulator.current = direction * remainder * 0.5; // Keep some momentum
        
        // If already at the target, reset accumulator completely
        if (currentIndex === targetIndex) {
          scrollAccumulator.current = 0;
          return;
        }
        
        // Animate to target
        animateToTarget(targetIndex);
      }
      
    } else {
      // Smooth continuous scroll mode with mouse following
      const scrollSensitivity = isTrackpad ? 0.006 : 0.003;
      const deltaY = e.deltaY;
      
      // Apply easing to the delta
      const easedDelta = deltaY * scrollSensitivity;
      
      // Calculate new offset with smooth following
      const currentOffset = stateRef.current.scroll.offset;
      const targetOffset = Math.max(0, Math.min(
        currentOffset + easedDelta,
        filteredDishesRef.current.length - 1
      ));
      
      // Immediately update with smooth transition
      dispatch({
        type: 'SET_SCROLL',
        payload: {
          offset: targetOffset,
          currentIndex: Math.round(targetOffset),
          isScrolling: true
        }
      });
      
      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      // Snap to nearest after scrolling stops
      scrollTimeoutRef.current = setTimeout(() => {
        const snapTarget = Math.round(stateRef.current.scroll.offset);
        animateToTarget(snapTarget);
      }, 150);
    }
  }, [enableSingleStep, animateToTarget]);

  // Attach scroll listener
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleScroll, { passive: false });
      return () => container.removeEventListener('wheel', handleScroll);
    }
  }, [handleScroll]);

  // Optimized navigation with preloading for large jumps
  const scrollToDish = (index: number) => {
    const jumpDistance = Math.abs(index - state.scroll.currentIndex);
    
    if (jumpDistance > 3) {
      // Large jump: preload target first
      setPreloadIndex(index);
      
      // Small delay to allow preload
      setTimeout(() => {
        dispatch({ 
          type: 'SET_SCROLL', 
          payload: { 
            offset: index,
            currentIndex: index,
            isScrolling: false
          }
        });
        setPreloadIndex(null);
      }, 16);
    } else {
      // Small jump: immediate
      dispatch({ 
        type: 'SET_SCROLL', 
        payload: { 
          offset: index,
          currentIndex: index,
          isScrolling: false
        }
      });
    }
  };

  // Touch handlers (simplified)
  const onTouchStart = (e: React.TouchEvent) => {
    const touch = e.targetTouches[0];
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 375;
    
    if (touch.clientX > screenWidth * 0.97) return; // Navigation dots area
    
    touchStartY.current = touch.clientY;
    touchStartX.current = touch.clientX;
    lastTouchY.current = touch.clientY;
    dragStartOffset.current = state.scroll.offset;
    touchVelocityRef.current = 0;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStartY.current || !lastTouchY.current) return;
    
    const touch = e.targetTouches[0];
    const currentY = touch.clientY;
    const deltaY = touchStartY.current - currentY;
    
    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    const touchSensitivity = 3.5 / viewportHeight;
    const easedDelta = Math.sign(deltaY) * Math.pow(Math.abs(deltaY), 0.9);
    const newOffset = Math.max(0, Math.min(
      dragStartOffset.current + (easedDelta * touchSensitivity),
      filteredDishes.length - 1
    ));
    
    // Calculate velocity for inertia
    const currentTime = Date.now();
    const timeDelta = currentTime - lastTouchTime.current;
    if (timeDelta > 0) {
      const velocity = (currentY - lastTouchY.current) / timeDelta * -0.05;
      touchVelocityRef.current = velocity;
    }
    
    dispatch({ 
      type: 'SET_SCROLL', 
      payload: { 
        offset: newOffset,
        isScrolling: true 
      }
    });
    
    lastTouchY.current = currentY;
    lastTouchTime.current = currentTime;
  };

  // Inertia animation for smooth deceleration
  const animateInertia = (velocity: number) => {
    const damping = 0.92; // Damping factor for inertia
    const minVelocity = 0.01;
    
    if (Math.abs(velocity) < minVelocity) {
      // Snap to nearest when velocity is low
      const targetIndex = Math.round(state.scroll.offset);
      dispatch({ 
        type: 'SET_SCROLL', 
        payload: { 
          offset: targetIndex,
          currentIndex: targetIndex,
          isScrolling: false,
          velocity: 0
        }
      });
      return;
    }
    
    // Apply velocity with damping
    const newOffset = Math.max(0, Math.min(
      state.scroll.offset + velocity,
      filteredDishes.length - 1
    ));
    
    dispatch({ 
      type: 'SET_SCROLL', 
      payload: { 
        offset: newOffset,
        isScrolling: true,
        velocity: velocity
      }
    });
    
    // Continue animation with reduced velocity
    inertiaAnimationId.current = requestAnimationFrame(() => {
      animateInertia(velocity * damping);
    });
  };

  const onTouchEnd = () => {
    if (state.scroll.offset !== undefined) {
      // Calculate final velocity for inertia
      const currentTime = Date.now();
      const timeDelta = currentTime - lastTouchTime.current;
      
      if (timeDelta < 100 && Math.abs(touchVelocityRef.current) > 0.02) {
        // Apply inertia if there's sufficient velocity
        animateInertia(touchVelocityRef.current * 0.5);
      } else {
        // Snap immediately if no velocity
        const targetIndex = Math.round(state.scroll.offset);
        dispatch({ 
          type: 'SET_SCROLL', 
          payload: { 
            offset: targetIndex,
            currentIndex: targetIndex,
            isScrolling: false,
            velocity: 0
          }
        });
      }
    }
    
    touchStartY.current = null;
    touchStartX.current = null;
    lastTouchY.current = null;
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
      {/* Optimized background with precomputed colors */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 transition-all duration-300"
          style={{
            background: precomputedColors 
              ? precomputedColors.backgroundGradient
              : state.visual.currentPalette.background,
            willChange: 'background'
          }}
        />
        
        {/* Transition overlay */}
        {state.visual.scrollProgress > 0 && !precomputedColors && (
          <div 
            className="absolute inset-0"
            style={{
              background: state.visual.nextPalette.background,
              opacity: state.visual.scrollProgress * 0.8
            }}
          />
        )}
      </div>

      {/* Dark overlay with GPU acceleration */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.85), rgba(0,0,0,0.75))',
          mixBlendMode: 'multiply',
          transform: 'translateZ(0)',
          willChange: 'auto'
        }}
      />

      {/* Navigation Header */}
      <NavigationHeader />
      
      {/* Top gradient overlay */}
      <div className="fixed top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/50 via-black/25 to-transparent z-10 pointer-events-none" />
      
      {/* Category switcher */}
      <div className="relative z-30">
        <CategorySwitcher
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>

      {/* Settings toggle for single-step mode - Hidden by default */}
      {/* Uncomment to show toggle button
      <div className="fixed bottom-8 left-8 z-40">
        <button
          onClick={() => setEnableSingleStep(!enableSingleStep)}
          className="bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-lg 
                     hover:bg-white/20 transition-all duration-200 text-sm font-light"
          aria-label="Toggle single-step scrolling"
        >
          {enableSingleStep ? '单步滚动: 开' : '单步滚动: 关'}
        </button>
      </div>
      */}

      {/* Navigation dots */}
      {filteredDishes.length > 0 && (
        isMobileDevice ? (
          <NavigationDotsEnhanced
            total={filteredDishes.length}
            current={state.scroll.currentIndex}
            dishes={filteredDishes}
            onDotClick={scrollToDish}
          />
        ) : (
          <NavigationDots
            total={filteredDishes.length}
            current={state.scroll.currentIndex}
            onDotClick={scrollToDish}
          />
        )
      )}

      {/* VIRTUAL RENDERING - Only render visible dishes */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-15">
        <div 
          className="relative flex items-center justify-center"
          style={{
            height: '100%',
            width: '100%',
            opacity: state.visual.isCategorySwitching ? 0 : 1,
            transition: 'opacity 0.2s ease-in-out'
          }}
        >
          {filteredDishes.map((dish, index) => {
            const relativePosition = index - state.scroll.offset;
            
            // EXPANDED VIRTUAL RENDERING: Render current ± 2 for smoother transitions
            const shouldRender = 
              Math.abs(relativePosition) <= 2 || 
              index === preloadIndex;
            
            if (!shouldRender) return null;
            
            const yPosition = relativePosition * (typeof window !== 'undefined' ? window.innerHeight : 800);
            const distance = Math.abs(relativePosition);
            const opacity = distance === 0 ? 1 : 0.2;
            const scale = 1 - Math.abs(relativePosition) * 0.15;
            
            return (
              <div
                key={dish.id}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{
                  opacity: opacity,
                  transform: `translate3d(0, ${yPosition}px, 0) scale(${scale})`,
                  filter: distance > 1 ? `blur(${Math.min(distance * 1.5, 4)}px)` : 'none',
                  transition: enableSingleStep 
                    ? 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease-out'
                    : 'transform 0.1s linear, opacity 0.1s linear',
                  willChange: 'transform, opacity',
                  backfaceVisibility: 'hidden',
                  perspective: '1000px'
                }}
              >
                <div className="w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] md:w-[500px] md:h-[500px] lg:w-[550px] lg:h-[550px]">
                  <FloatingDish
                    image={dish.image}
                    name={dish.name}
                    isActive={index === state.scroll.currentIndex}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Text containers */}
      {filteredDishes[state.scroll.currentIndex] && !state.visual.isCategorySwitching && (
        <>
          {/* Dish name */}
          <div
            key={`name-${state.scroll.currentIndex}`}
            className="absolute top-[20%] left-[8%] md:left-[10%] lg:left-[12%] text-white pointer-events-none z-30"
            style={{
              opacity: 1,
              transform: 'translateX(0)',
              transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
              animation: 'fadeInLeft 0.2s ease-out'
            }}
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-thin tracking-wide leading-tight text-left">
              {filteredDishes[state.scroll.currentIndex].name}
            </h2>
            <p className="text-xl sm:text-2xl lg:text-3xl font-light opacity-75 italic mt-3 text-left">
              {filteredDishes[state.scroll.currentIndex].nameEn}
            </p>
          </div>

          {/* Description */}
          <div
            key={`desc-${state.scroll.currentIndex}`}
            className="absolute bottom-[15%] right-[8%] md:right-[10%] lg:right-[12%] text-white pointer-events-none z-25 w-auto"
            style={{ 
              maxWidth: 'min(40%, 350px)',
              opacity: 1,
              transform: 'translateX(0)',
              transition: 'opacity 0.2s ease-out 0.05s, transform 0.2s ease-out 0.05s',
              animation: 'fadeInRight 0.2s ease-out 0.05s'
            }}
          >
            <p className="text-base lg:text-lg xl:text-xl opacity-90 leading-relaxed text-right">
              {filteredDishes[state.scroll.currentIndex].description}
            </p>
            <p className="text-sm lg:text-base xl:text-lg opacity-60 leading-relaxed italic text-right mt-2">
              {filteredDishes[state.scroll.currentIndex].descriptionEn}
            </p>
          </div>

          {/* Price */}
          <div
            key={`price-${state.scroll.currentIndex}`}
            className="absolute bottom-[25%] left-[8%] md:left-[10%] lg:left-[12%] text-white pointer-events-none z-30"
            style={{
              opacity: 1,
              transform: 'translateY(0)',
              transition: 'opacity 0.2s ease-out 0.1s, transform 0.2s ease-out 0.1s',
              animation: 'fadeInUp 0.2s ease-out 0.1s'
            }}
          >
            <p className="text-xs uppercase tracking-widest opacity-50 mb-2">价格 Price</p>
            <p className="text-5xl lg:text-6xl xl:text-7xl font-thin">
              <span className="text-3xl lg:text-4xl align-top opacity-75">¥</span>
              {filteredDishes[state.scroll.currentIndex].price}
            </p>
          </div>
        </>
      )}

      {/* Empty state */}
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