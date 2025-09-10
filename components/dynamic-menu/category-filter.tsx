// Category Filter Component - Filter dishes by category
// Features smooth animations and active state indicators

'use client';

import { motion } from 'framer-motion';
import { DishCategory, categoryLabels } from '@/lib/menu-data';

interface CategoryFilterProps {
  selectedCategory: DishCategory | 'all';
  onCategoryChange: (category: DishCategory | 'all') => void;
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const categories: (DishCategory | 'all')[] = [
    'all',
    '汤底',
    '陆鲜',
    '海鲜',
    '素菜',
    '热菜',
    '小吃',
    '饮品'
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-center space-x-2 md:space-x-4 overflow-x-auto">
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`
                relative px-4 py-2 rounded-full text-sm md:text-base font-light
                transition-all duration-300 whitespace-nowrap
                ${selectedCategory === category 
                  ? 'text-white' 
                  : 'text-white/60 hover:text-white/80'
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Active indicator */}
              {selectedCategory === category && (
                <motion.div
                  className="absolute inset-0 bg-white/20 rounded-full"
                  layoutId="categoryIndicator"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              <span className="relative z-10">
                {categoryLabels[category].zh}
                <span className="hidden md:inline ml-2 text-xs opacity-70">
                  {categoryLabels[category].en}
                </span>
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}