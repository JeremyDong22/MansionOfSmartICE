// Dish Info Component - Display dish details with animations
// Features bilingual text and order button

'use client';

import { motion } from 'framer-motion';
import { Dish } from '@/lib/menu-data';

interface DishInfoProps {
  dish: Dish;
  isActive: boolean;
}

export function DishInfo({ dish, isActive }: DishInfoProps) {
  return (
    <motion.div
      className="text-center text-white max-w-2xl mx-auto px-6"
      initial={{ opacity: 0, y: 50 }}
      animate={{
        opacity: isActive ? 1 : 0,
        y: isActive ? 0 : 50,
      }}
      transition={{ duration: 0.5, delay: isActive ? 0.2 : 0 }}
    >
      {/* Dish name */}
      <motion.h2
        className="text-4xl md:text-5xl lg:text-6xl font-light mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: isActive ? 1 : 0,
          y: isActive ? 0 : 20,
        }}
        transition={{ duration: 0.5, delay: isActive ? 0.3 : 0 }}
      >
        {dish.name}
      </motion.h2>
      
      {/* English name */}
      <motion.p
        className="text-xl md:text-2xl font-light opacity-80 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: isActive ? 1 : 0,
          y: isActive ? 0 : 20,
        }}
        transition={{ duration: 0.5, delay: isActive ? 0.4 : 0 }}
      >
        {dish.nameEn}
      </motion.p>
      
      {/* Description */}
      <motion.p
        className="text-base md:text-lg opacity-90 mb-2 leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: isActive ? 1 : 0,
          y: isActive ? 0 : 20,
        }}
        transition={{ duration: 0.5, delay: isActive ? 0.5 : 0 }}
      >
        {dish.description}
      </motion.p>
      
      {/* English description */}
      <motion.p
        className="text-sm md:text-base opacity-70 mb-8 leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: isActive ? 1 : 0,
          y: isActive ? 0 : 20,
        }}
        transition={{ duration: 0.5, delay: isActive ? 0.6 : 0 }}
      >
        {dish.descriptionEn}
      </motion.p>
      
      {/* Price and Order button */}
      <motion.div
        className="flex items-center justify-center space-x-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: isActive ? 1 : 0,
          y: isActive ? 0 : 20,
        }}
        transition={{ duration: 0.5, delay: isActive ? 0.7 : 0 }}
      >
        <span className="text-3xl md:text-4xl font-light">
          ¥{dish.price}
        </span>
        
        <motion.button
          className="px-8 py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-full
                   hover:bg-white/30 transition-all duration-300 font-light"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          立即下单 Order Now
        </motion.button>
      </motion.div>
    </motion.div>
  );
}