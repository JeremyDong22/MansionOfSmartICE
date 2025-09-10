// Smart color extraction hook with appetite-enhancing color selection
// Prioritizes warm, deep colors that enhance food appeal

import { useState, useEffect } from 'react';

export interface SmartExtractedColors {
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

// Appetizing default colors (warm browns and deep reds)
const DEFAULT_COLORS: SmartExtractedColors = {
  primary: '#3d2314',      // Deep chocolate brown
  secondary: '#5d3a1a',    // Medium brown
  accent: '#8b4513',       // Saddle brown
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
 * Check if a color is appetizing (warm tones)
 * Avoid blues and purples which can reduce appetite
 */
function isAppetizingColor(hex: string | null): boolean {
  if (!hex) return false;
  
  // Convert hex to RGB
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  
  // Avoid blue/purple dominated colors (where blue is highest)
  if (b > r && b > g) return false;
  
  // Prefer warm colors (red/orange/brown tones)
  // These have higher red values or balanced red/green (for browns)
  return r >= g * 0.8;
}

/**
 * Get color brightness (0-255)
 */
function getColorBrightness(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000;
}

/**
 * Select the best color from available options
 * Prioritizes dark, appetizing colors
 */
function selectBestColor(
  colors: (string | null)[],
  preferDark: boolean = true
): string | null {
  const validColors = colors.filter(c => c && isAppetizingColor(c)) as string[];
  
  if (validColors.length === 0) {
    // If no appetizing colors, just avoid blues/purples
    const nonBlueColors = colors.filter(c => c && !c.includes('8') && !c.includes('9') && !c.includes('a') && !c.includes('b')) as string[];
    if (nonBlueColors.length > 0) {
      return preferDark 
        ? nonBlueColors.reduce((darkest, color) => 
            getColorBrightness(color) < getColorBrightness(darkest) ? color : darkest)
        : nonBlueColors[0];
    }
    return colors.find(c => c) || null;
  }
  
  // Sort by brightness and return based on preference
  if (preferDark) {
    return validColors.reduce((darkest, color) => 
      getColorBrightness(color) < getColorBrightness(darkest) ? color : darkest);
  }
  
  return validColors[0];
}

/**
 * Create an appetite-enhancing gradient
 */
function createAppetizingGradient(color1: string, color2: string, color3?: string): string {
  // Create a rich, deep gradient with minimal transparency
  if (color3) {
    return `linear-gradient(135deg, ${color1}F5 0%, ${color2} 45%, ${color3}F5 100%)`;
  }
  return `linear-gradient(135deg, ${color1}F5 0%, ${color2} 100%)`;
}

export function useSmartColorExtraction(imageUrl: string | null): SmartExtractedColors | null {
  const [colors, setColors] = useState<SmartExtractedColors | null>(null);

  useEffect(() => {
    if (!imageUrl || imageUrl.includes('placeholder')) {
      setColors(DEFAULT_COLORS);
      return;
    }

    let mounted = true;

    async function extractColors() {
      try {
        // Dynamic import for browser environment - Vibrant is a named export
        const { Vibrant } = await import('node-vibrant/browser');
        
        if (!mounted) return;

        // Vibrant in browser mode is a constructor
        const palette = await new Vibrant(imageUrl).getPalette();
        
        if (!mounted) return;

        const allColors = {
          vibrant: palette.Vibrant?.hex || null,
          darkVibrant: palette.DarkVibrant?.hex || null,
          lightVibrant: palette.LightVibrant?.hex || null,
          muted: palette.Muted?.hex || null,
          darkMuted: palette.DarkMuted?.hex || null,
          lightMuted: palette.LightMuted?.hex || null
        };

        // Smart selection prioritizing dark, appetizing colors
        // Priority order: darkVibrant, darkMuted, vibrant, muted
        const primary = selectBestColor([
          allColors.darkVibrant,
          allColors.darkMuted,
          allColors.vibrant,
          allColors.muted
        ], true) || DEFAULT_COLORS.primary;

        const secondary = selectBestColor([
          allColors.darkMuted,
          allColors.muted,
          allColors.darkVibrant,
          allColors.vibrant
        ], true) || DEFAULT_COLORS.secondary;

        const accent = selectBestColor([
          allColors.vibrant,
          allColors.darkVibrant,
          allColors.muted
        ], false) || DEFAULT_COLORS.accent;

        // Create gradient with selected colors
        const backgroundGradient = createAppetizingGradient(primary, secondary, accent);

        // Determine text color based on primary background
        const textColor = getColorBrightness(primary) < 128 ? '#ffffff' : '#000000';

        setColors({
          primary,
          secondary,
          accent,
          backgroundGradient,
          textColor,
          allColors
        });
      } catch (error) {
        console.error('Error in smart color extraction:', error);
        setColors(DEFAULT_COLORS);
      }
    }

    extractColors();

    return () => {
      mounted = false;
    };
  }, [imageUrl]);

  return colors;
}