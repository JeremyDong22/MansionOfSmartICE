// Category Switcher Component - Center-fixed scrollable category selector with center indicator
// Categories scroll horizontally, snap to center on release

'use client';

import { useEffect, useRef, useState } from 'react';
import { DishCategory } from '@/lib/menu-data';

interface CategorySwitcherProps {
  selectedCategory: DishCategory | 'all';
  onCategoryChange: (category: DishCategory | 'all') => void;
}

export function CategorySwitcher({ selectedCategory, onCategoryChange }: CategorySwitcherProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [centerIndex, setCenterIndex] = useState(0);
  const [showCategoryName, setShowCategoryName] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const fadeTimeout = useRef<NodeJS.Timeout | null>(null);
  const isDragging = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  
  // Remove 'all' from categories
  const categories: DishCategory[] = [
    '汤底', '陆鲜', '海鲜', '素菜', '凉菜', '小吃甜点', '饮品'
  ];

  const categoryLabels: Record<DishCategory, string> = {
    '汤底': '汤底',
    '陆鲜': '陆鲜',
    '海鲜': '海鲜',
    '素菜': '素菜',
    '凉菜': '凉菜',
    '小吃甜点': '小吃甜点',
    '饮品': '饮品'
  };

  // Handle category selection from 'all' to first category
  const actualCategory = selectedCategory === 'all' ? '汤底' : selectedCategory;
  const currentIndex = categories.indexOf(actualCategory as DishCategory);
  
  // Find which item is closest to the center line
  const findClosestToCenter = () => {
    if (!scrollRef.current) return 0;
    
    const container = scrollRef.current;
    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;
    
    // Get all category items
    const items = container.querySelectorAll('button');
    let closestIndex = 0;
    let minDistance = Infinity;
    
    items.forEach((item, index) => {
      const itemRect = item.getBoundingClientRect();
      const itemCenter = itemRect.left + itemRect.width / 2;
      const distance = Math.abs(itemCenter - containerCenter);
      
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });
    
    return closestIndex;
  };
  
  // Update which category is selected based on what's in center
  const updateSelection = () => {
    const closestIndex = findClosestToCenter();
    
    // Always update the index and trigger category change
    setCenterIndex(closestIndex);
    onCategoryChange(categories[closestIndex]);
    
    // Always show category name during any interaction
    setShowCategoryName(true);
    
    // Clear existing fade timeout
    if (fadeTimeout.current) {
      clearTimeout(fadeTimeout.current);
    }
    
    // Set new timeout to hide after scrolling stops
    fadeTimeout.current = setTimeout(() => {
      setShowCategoryName(false);
    }, 1000);
  };
  
  // Snap to center the closest item
  const snapToCenter = () => {
    if (!scrollRef.current || isDragging.current) return;
    
    const container = scrollRef.current;
    const closestIndex = findClosestToCenter();
    const items = container.querySelectorAll('button');
    
    if (items[closestIndex]) {
      const containerRect = container.getBoundingClientRect();
      const itemRect = items[closestIndex].getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;
      const itemCenter = itemRect.left + itemRect.width / 2;
      const offset = itemCenter - containerCenter;
      
      container.scrollBy({
        left: offset,
        behavior: 'smooth'
      });
      
      setCenterIndex(closestIndex);
      onCategoryChange(categories[closestIndex]);
    }
  };
  
  // Handle scroll with debounced snap
  const handleScroll = () => {
    if (!isDragging.current) {
      updateSelection();
      
      // Clear existing timeout
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      
      // Set new timeout for snap
      scrollTimeout.current = setTimeout(() => {
        snapToCenter();
      }, 100);
    }
  };
  
  // Initial positioning
  useEffect(() => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      // Use RAF to ensure DOM is ready but without visible delay
      requestAnimationFrame(() => {
        const items = container.querySelectorAll('button');
        if (items[currentIndex]) {
          const containerRect = container.getBoundingClientRect();
          const itemRect = items[currentIndex].getBoundingClientRect();
          const containerCenter = containerRect.left + containerRect.width / 2;
          const itemCenter = itemRect.left + itemRect.width / 2;
          const offset = itemCenter - containerCenter;
          
          // Set initial position without animation
          container.scrollLeft = container.scrollLeft + offset;
          setCenterIndex(currentIndex);
          // Mark as initialized after positioning
          setIsInitialized(true);
        }
      });
    }
  }, []);
  
  // Calculate line properties based on distance from center
  const getLineStyle = (index: number) => {
    const distance = Math.abs(index - centerIndex);
    
    let height = 6;
    let opacity = 0.3;
    
    if (distance === 0) {
      height = 20;
      opacity = 1;
    } else if (distance === 1) {
      height = 15;
      opacity = 0.6;
    } else if (distance === 2) {
      height = 10;
      opacity = 0.4;
    } else if (distance === 3) {
      height = 8;
      opacity = 0.3;
    }
    
    return {
      height: `${height}px`,
      width: distance === 0 ? '2.5px' : '1.5px',
      opacity,
      backgroundColor: 'white',
      boxShadow: distance === 0 ? '0 0 12px rgba(255,255,255,0.8)' : 'none',
      transition: 'all 0.3s ease-out'
    };
  };
  
  return (
    <div className="fixed top-16 left-20 right-20 z-30 pointer-events-none">
      <div className="w-full py-2">
        <div className="relative flex justify-center">
          {/* Scrollable category container */}
          <div 
            ref={scrollRef}
            className="flex items-center gap-8 overflow-x-auto scrollbar-hide pointer-events-auto transition-opacity duration-300"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
              cursor: 'grab',
              maxWidth: 'calc(100vw - 120px)', // Account for right navigation dots
              paddingLeft: 'calc(50vw - 60px)',
              paddingRight: 'calc(50vw - 60px)',
              opacity: isInitialized ? 1 : 0
            }}
            onScroll={handleScroll}
            onMouseDown={(e) => {
              // Prevent if clicking on a button
              if ((e.target as HTMLElement).tagName === 'BUTTON') return;
              
              isDragging.current = true;
              updateSelection(); // Show category name immediately on drag start
              const container = e.currentTarget;
              const startX = e.pageX;
              const scrollLeft = container.scrollLeft;
              container.style.cursor = 'grabbing';
              
              const handleMouseMove = (e: MouseEvent) => {
                e.preventDefault();
                const x = e.pageX;
                const walk = (startX - x) * 1.5;
                container.scrollLeft = scrollLeft + walk;
                updateSelection();
              };
              
              const handleMouseUp = () => {
                container.style.cursor = 'grab';
                isDragging.current = false;
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
                // Snap to center after dragging stops
                setTimeout(() => {
                  snapToCenter();
                }, 50);
              };
              
              document.addEventListener('mousemove', handleMouseMove);
              document.addEventListener('mouseup', handleMouseUp);
            }}
            onTouchStart={(e) => {
              isDragging.current = true;
              updateSelection(); // Show category name immediately on touch start
              const container = e.currentTarget;
              const touch = e.touches[0];
              const startX = touch.pageX;
              const scrollLeft = container.scrollLeft;
              
              const handleTouchMove = (e: TouchEvent) => {
                const touch = e.touches[0];
                const x = touch.pageX;
                const walk = (startX - x) * 1.5;
                container.scrollLeft = scrollLeft + walk;
                updateSelection();
              };
              
              const handleTouchEnd = () => {
                isDragging.current = false;
                container.removeEventListener('touchmove', handleTouchMove);
                container.removeEventListener('touchend', handleTouchEnd);
                // Snap to center after dragging stops
                setTimeout(() => {
                  snapToCenter();
                }, 50);
              };
              
              container.addEventListener('touchmove', handleTouchMove, { passive: true });
              container.addEventListener('touchend', handleTouchEnd);
            }}
          >
            {categories.map((cat, i) => (
              <button
                key={cat}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent event bubbling
                  
                  if (scrollRef.current) {
                    const container = scrollRef.current;
                    const items = container.querySelectorAll('button');
                    
                    if (items[i]) {
                      const containerRect = container.getBoundingClientRect();
                      const itemRect = items[i].getBoundingClientRect();
                      const containerCenter = containerRect.left + containerRect.width / 2;
                      const itemCenter = itemRect.left + itemRect.width / 2;
                      const offset = itemCenter - containerCenter;
                      
                      container.scrollBy({
                        left: offset,
                        behavior: 'smooth'
                      });
                      
                      setCenterIndex(i);
                      onCategoryChange(categories[i]);
                      
                      // Show category name on click
                      setShowCategoryName(true);
                      
                      // Clear existing fade timeout
                      if (fadeTimeout.current) {
                        clearTimeout(fadeTimeout.current);
                      }
                      
                      // Hide after delay
                      fadeTimeout.current = setTimeout(() => {
                        setShowCategoryName(false);
                      }, 1500);
                    }
                  }
                }}
                className="flex-shrink-0 px-6 py-4 transition-transform hover:scale-110 cursor-pointer"
                style={{
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  MozUserSelect: 'none',
                  msUserSelect: 'none'
                }}
              >
                {/* Vertical line */}
                <div
                  className="rounded-full mx-auto"
                  style={getLineStyle(i)}
                />
              </button>
            ))}
          </div>
          
          {/* Center indicator line (invisible for alignment) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="w-0.5 h-8 bg-transparent rounded-full" />
          </div>
        </div>
        
        {/* Current category name with fade animation */}
        <div className="text-center mt-3 h-5">
          <span 
            className="text-xs text-white transition-opacity duration-500"
            style={{
              opacity: showCategoryName ? 0.5 : 0
            }}
          >
            {categoryLabels[categories[centerIndex]]}
          </span>
        </div>
      </div>
    </div>
  );
}