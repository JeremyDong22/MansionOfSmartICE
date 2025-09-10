// Hook to use precomputed colors from build time
// This replaces the expensive runtime color extraction

import { useState, useEffect } from 'react';
import dishColors from '@/lib/dish-colors.json';

export interface PrecomputedColors {
  primary: string;
  secondary: string;
  accent: string;
  backgroundGradient: string;
  textColor: string;
  allColors: {
    vibrant: string | null;
    darkVibrant: string | null;
    lightVibrant: string | null;
    muted: string | null;
    darkMuted: string | null;
    lightMuted: string | null;
  };
}

// Default colors for fallback
const DEFAULT_COLORS: PrecomputedColors = {
  primary: '#3d2314',
  secondary: '#5d3a1a',
  accent: '#8b4513',
  backgroundGradient: 'linear-gradient(135deg, #2d1810 0%, #3d2314 35%, #5d3a1a 100%)',
  textColor: '#ffffff',
  allColors: {
    vibrant: null,
    darkVibrant: null,
    lightVibrant: null,
    muted: null,
    darkMuted: null,
    lightMuted: null
  }
};

/**
 * Get precomputed colors for a dish image
 * @param imageUrl - The image URL (e.g., '/dishes/dish-name.png')
 * @returns Precomputed colors or default colors
 */
export function usePrecomputedColors(imageUrl: string | null): PrecomputedColors | null {
  const [colors, setColors] = useState<PrecomputedColors | null>(null);

  useEffect(() => {
    if (!imageUrl || imageUrl.includes('placeholder')) {
      setColors(DEFAULT_COLORS);
      return;
    }

    // Look up precomputed colors
    const precomputed = (dishColors as Record<string, PrecomputedColors>)[imageUrl];
    
    if (precomputed) {
      // Use precomputed colors (0ms delay!)
      setColors(precomputed);
    } else {
      // Fallback to default if not found
      console.warn(`No precomputed colors for ${imageUrl}, using defaults`);
      setColors(DEFAULT_COLORS);
    }
  }, [imageUrl]);

  return colors;
}

/**
 * Get precomputed colors synchronously (for immediate use)
 * @param imageUrl - The image URL
 * @returns Precomputed colors or default colors
 */
export function getPrecomputedColors(imageUrl: string | null): PrecomputedColors {
  if (!imageUrl || imageUrl.includes('placeholder')) {
    return DEFAULT_COLORS;
  }

  const precomputed = (dishColors as Record<string, PrecomputedColors>)[imageUrl];
  return precomputed || DEFAULT_COLORS;
}