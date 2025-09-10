// Color extraction utility using Vibrant.js
// Extracts dominant colors from images for dynamic backgrounds

// @ts-expect-error - node-vibrant doesn't have proper TypeScript types
import Vibrant from 'node-vibrant';

export interface ExtractedColors {
  vibrant: string | null;
  darkVibrant: string | null;
  lightVibrant: string | null;
  muted: string | null;
  darkMuted: string | null;
  lightMuted: string | null;
  // Computed gradients for backgrounds
  backgroundGradient: string;
  subtleGradient: string;
  accentColor: string;
  textColor: string;
}

// Default colors when extraction fails
const DEFAULT_COLORS: ExtractedColors = {
  vibrant: '#ef4444',
  darkVibrant: '#dc2626',
  lightVibrant: '#fca5a5',
  muted: '#a78bfa',
  darkMuted: '#7c3aed',
  lightMuted: '#ddd6fe',
  backgroundGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  subtleGradient: 'linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%)',
  accentColor: '#ef4444',
  textColor: '#ffffff'
};

/**
 * Extract prominent colors from an image URL
 * @param imageUrl The URL of the image to extract colors from
 * @returns Promise with extracted colors and computed gradients
 */
export async function extractColors(imageUrl: string): Promise<ExtractedColors> {
  try {
    // Extract palette from image
    const palette = await Vibrant.from(imageUrl).getPalette();
    
    // Get individual swatches
    const vibrant = palette.Vibrant?.hex || null;
    const darkVibrant = palette.DarkVibrant?.hex || null;
    const lightVibrant = palette.LightVibrant?.hex || null;
    const muted = palette.Muted?.hex || null;
    const darkMuted = palette.DarkMuted?.hex || null;
    const lightMuted = palette.LightMuted?.hex || null;
    
    // Determine best colors for backgrounds
    // Priority: Muted colors for subtle backgrounds, Vibrant for accents
    const primaryBg = muted || lightMuted || vibrant || DEFAULT_COLORS.muted;
    const secondaryBg = darkMuted || darkVibrant || muted || DEFAULT_COLORS.darkMuted;
    const tertiaryBg = lightMuted || lightVibrant || DEFAULT_COLORS.lightMuted;
    
    // Create sophisticated gradients
    const backgroundGradient = createGradient(
      secondaryBg!,
      primaryBg!,
      tertiaryBg!
    );
    
    const subtleGradient = createSubtleGradient(
      lightMuted || lightVibrant || DEFAULT_COLORS.lightMuted!,
      muted || vibrant || DEFAULT_COLORS.muted!
    );
    
    // Choose accent color (prefer vibrant for emphasis)
    const accentColor = vibrant || darkVibrant || muted || DEFAULT_COLORS.vibrant!;
    
    // Determine text color based on primary background
    const textColor = palette.Muted?.bodyTextColor || 
                     palette.LightMuted?.bodyTextColor || 
                     '#ffffff';
    
    return {
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
    };
  } catch (error) {
    console.error('Error extracting colors:', error);
    return DEFAULT_COLORS;
  }
}

/**
 * Create a sophisticated gradient from multiple colors
 */
function createGradient(color1: string, color2: string, color3: string): string {
  // Create a radial gradient for depth
  return `radial-gradient(ellipse at top left, ${color1}20 0%, transparent 50%),
          radial-gradient(ellipse at bottom right, ${color3}30 0%, transparent 50%),
          linear-gradient(135deg, ${color1} 0%, ${color2} 50%, ${color3} 100%)`;
}

/**
 * Create a subtle gradient for elegant backgrounds
 */
function createSubtleGradient(color1: string, color2: string): string {
  return `linear-gradient(135deg, ${color1}40 0%, ${color2}60 100%)`;
}

/**
 * Cache for extracted colors to avoid repeated processing
 */
const colorCache = new Map<string, ExtractedColors>();

/**
 * Extract colors with caching
 */
export async function extractColorsWithCache(imageUrl: string): Promise<ExtractedColors> {
  if (colorCache.has(imageUrl)) {
    return colorCache.get(imageUrl)!;
  }
  
  const colors = await extractColors(imageUrl);
  colorCache.set(imageUrl, colors);
  return colors;
}

/**
 * Clear the color cache
 */
export function clearColorCache(): void {
  colorCache.clear();
}