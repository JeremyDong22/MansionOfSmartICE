// Client-side hook for color extraction from images
// Uses dynamic import to avoid SSR issues with node-vibrant

import { useState, useEffect } from 'react';

export interface ExtractedColors {
  vibrant: string | null;
  darkVibrant: string | null;
  lightVibrant: string | null;
  muted: string | null;
  darkMuted: string | null;
  lightMuted: string | null;
  backgroundGradient: string;
  subtleGradient: string;
  accentColor: string;
  textColor: string;
}

// Default colors inspired by appetizing food tones (dark reds, browns, greens)
const DEFAULT_COLORS: ExtractedColors = {
  vibrant: '#d2691e',      // Chocolate brown
  darkVibrant: '#8b4513',   // Saddle brown (dark brown)
  lightVibrant: '#daa520',  // Goldenrod
  muted: '#8b7355',         // Muted brown
  darkMuted: '#3d2817',     // Dark chocolate
  lightMuted: '#d2b48c',    // Tan
  backgroundGradient: 'linear-gradient(135deg, #3d2817 0%, #8b4513 50%, #5d4037 100%)',
  subtleGradient: 'linear-gradient(135deg, #8b7355 0%, #d2691e 100%)',
  accentColor: '#d2691e',
  textColor: '#ffffff'
};

function createGradient(color1: string, color2: string, color3: string): string {
  // Create deeper, more appetite-stimulating gradients
  // Less transparency, more rich colors
  return `radial-gradient(ellipse at top left, ${color1}40 0%, transparent 40%),
          radial-gradient(ellipse at bottom right, ${color3}50 0%, transparent 40%),
          linear-gradient(135deg, ${color1}E6 0%, ${color2}F2 50%, ${color3}E6 100%)`;
}

function createSubtleGradient(color1: string, color2: string): string {
  return `linear-gradient(135deg, ${color1}40 0%, ${color2}60 100%)`;
}

export function useColorExtraction(imageUrl: string | null): ExtractedColors | null {
  const [colors, setColors] = useState<ExtractedColors | null>(null);

  useEffect(() => {
    if (!imageUrl || imageUrl.includes('placeholder')) {
      setColors(null);
      return;
    }

    let mounted = true;

    async function extractColors() {
      try {
        // Dynamic import to avoid SSR issues - use browser version
        const { Vibrant } = await import('node-vibrant/browser');
        
        if (!mounted) return;

        const palette = await new Vibrant(imageUrl).getPalette();
        
        if (!mounted) return;

        const vibrant = palette.Vibrant?.hex || null;
        const darkVibrant = palette.DarkVibrant?.hex || null;
        const lightVibrant = palette.LightVibrant?.hex || null;
        const muted = palette.Muted?.hex || null;
        const darkMuted = palette.DarkMuted?.hex || null;
        const lightMuted = palette.LightMuted?.hex || null;
        
        // Create appetite-stimulating color scheme with dark tones
        // Priority: Dark colors that enhance appetite (dark red, dark green, dark brown)
        const primaryBg = darkMuted || darkVibrant || muted || DEFAULT_COLORS.darkMuted;
        const secondaryBg = darkVibrant || darkMuted || vibrant || DEFAULT_COLORS.darkVibrant;
        const tertiaryBg = muted || darkMuted || DEFAULT_COLORS.muted;

        const backgroundGradient = createGradient(
          secondaryBg!,
          primaryBg!,
          tertiaryBg!
        );

        const subtleGradient = createSubtleGradient(
          lightMuted || lightVibrant || DEFAULT_COLORS.lightMuted!,
          muted || vibrant || DEFAULT_COLORS.muted!
        );

        const accentColor = vibrant || darkVibrant || muted || DEFAULT_COLORS.vibrant!;
        const textColor = palette.Muted?.bodyTextColor || 
                         palette.LightMuted?.bodyTextColor || 
                         '#ffffff';

        setColors({
          vibrant,
          darkVibrant,
          lightVibrant,
          muted,
          darkMuted,
          lightMuted,
          backgroundGradient,
          subtleGradient,
          accentColor,
          textColor
        });
      } catch (error) {
        console.error('Error extracting colors:', error);
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