// Floating Dish Component - 3D floating effect for dish images
// Features parallax scrolling, depth perspective, and stylized placeholders

'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

interface FloatingDishProps {
  image: string;
  name: string;
  isActive: boolean;
}

// Dish-specific placeholder designs
const getDishPlaceholder = (name: string) => {
  const designs: Record<string, { gradient: string; icon: string }> = {
    '口水鸡': { 
      gradient: 'from-red-500 via-orange-500 to-yellow-500',
      icon: '🌶️'
    },
    '夫妻肺片': { 
      gradient: 'from-red-600 via-red-500 to-orange-500',
      icon: '🥩'
    },
    '贵州酸汤鱼': { 
      gradient: 'from-orange-500 via-red-500 to-pink-500',
      icon: '🐟'
    },
    '云南野生菌汤': { 
      gradient: 'from-amber-600 via-yellow-600 to-orange-500',
      icon: '🍄'
    },
    '水煮牛肉': { 
      gradient: 'from-red-700 via-red-600 to-orange-600',
      icon: '🥘'
    },
    '毛血旺': { 
      gradient: 'from-red-800 via-red-600 to-red-500',
      icon: '🍲'
    },
    '东坡肉': { 
      gradient: 'from-amber-700 via-orange-600 to-red-600',
      icon: '🍖'
    },
    '剁椒鱼头': { 
      gradient: 'from-red-600 via-orange-500 to-yellow-500',
      icon: '🐠'
    },
    '香辣蟹': { 
      gradient: 'from-orange-600 via-red-500 to-red-600',
      icon: '🦀'
    },
    '麻婆豆腐': { 
      gradient: 'from-red-600 via-orange-500 to-red-500',
      icon: '🌶️'
    },
    '干煸四季豆': { 
      gradient: 'from-green-600 via-green-500 to-lime-500',
      icon: '🥬'
    },
    '杨枝甘露': { 
      gradient: 'from-yellow-400 via-orange-400 to-pink-400',
      icon: '🥭'
    },
    '普洱茶': { 
      gradient: 'from-amber-800 via-amber-700 to-orange-700',
      icon: '🍵'
    },
    '酸梅汤': { 
      gradient: 'from-purple-600 via-pink-500 to-red-500',
      icon: '🥤'
    },
    '老凯里贵州酸汤': {
      gradient: 'from-orange-500 via-red-500 to-pink-500',
      icon: '🍲'
    }
  };

  return designs[name] || { 
    gradient: 'from-orange-500 via-red-500 to-pink-500',
    icon: '🍽️'
  };
};

export function FloatingDish({ image, name, isActive }: FloatingDishProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  // Preload image when component mounts or image changes
  useEffect(() => {
    if (image && !image.includes('placeholder')) {
      const img = new Image();
      img.src = image;
      img.onload = () => {
        setImageLoaded(true);
        setImageError(false);
      };
      img.onerror = () => {
        setImageError(true);
        setImageLoaded(false);
      };
    }
  }, [image]);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });


  // Subtle parallax effect
  const y = useTransform(scrollYProgress, [0, 1], [15, -15]);
  
  const placeholder = getDishPlaceholder(name);
  
  return (
    <div
      ref={ref}
      className="w-full h-full relative"
      style={{
        transform: `scale(${isActive ? 1.2 : 0.95})`,
        opacity: isActive ? 1 : 0.6,
      }}
    >
        {/* Main dish container - flex centered for proper mobile alignment */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Dish plate/container - centered with max size constraint, no boundaries */}
          <div className="relative w-full h-full max-w-full max-h-full">
            {/* Check if image exists and is not placeholder */}
            {image && !image.includes('placeholder') && !imageError ? (
              <>
                {/* Actual image - no placeholder, direct display */}
                <img 
                  src={image} 
                  alt={name}
                  className="absolute inset-0 w-full h-full object-contain transition-opacity duration-300"
                  style={{
                    opacity: imageLoaded ? 1 : 0
                  }}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => {
                    setImageError(true);
                    setImageLoaded(false);
                  }}
                />
              </>
            ) : (
              <div className={`absolute inset-0 bg-gradient-to-br ${placeholder.gradient}`}>
                {/* Pattern overlay */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 20% 50%, transparent 20%, rgba(255,255,255,0.1) 21%, rgba(255,255,255,0.1) 34%, transparent 35%)`,
                    backgroundSize: '50px 50px',
                  }} />
                </div>
                
                {/* Center icon/symbol */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-8xl md:text-9xl opacity-60">
                    {placeholder.icon}
                  </div>
                </div>
                
                {/* Dish name overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-8">
                  <p className="text-white/80 text-xl md:text-2xl font-light text-center">
                    {name}
                  </p>
                </div>
              </div>
            )}
          </div>
          
        </div>
    </div>
  );
}