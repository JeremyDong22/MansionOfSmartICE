// Color Extraction Utilities - Extract dominant colors from images
// Uses canvas API to analyze image pixels and generate color schemes

export interface ColorPalette {
  dominant: string;
  accent: string;
  background: string;
  text: string;
}

/**
 * Extract dominant colors from an image URL
 */
export async function extractColors(imageUrl: string): Promise<ColorPalette> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        // Return default colors if canvas is not supported
        resolve(getDefaultPalette());
        return;
      }
      
      // Set canvas size (smaller for performance)
      const sampleSize = 100;
      canvas.width = sampleSize;
      canvas.height = sampleSize;
      
      // Draw and scale image
      ctx.drawImage(img, 0, 0, sampleSize, sampleSize);
      
      // Get image data
      const imageData = ctx.getImageData(0, 0, sampleSize, sampleSize);
      const pixels = imageData.data;
      
      // Color buckets for grouping similar colors
      const colorMap = new Map<string, number>();
      
      // Sample pixels (skip every 4th for performance)
      for (let i = 0; i < pixels.length; i += 16) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const a = pixels[i + 3];
        
        // Skip transparent pixels
        if (a < 128) continue;
        
        // Round colors to reduce variations
        const roundedR = Math.round(r / 32) * 32;
        const roundedG = Math.round(g / 32) * 32;
        const roundedB = Math.round(b / 32) * 32;
        
        const key = `${roundedR},${roundedG},${roundedB}`;
        colorMap.set(key, (colorMap.get(key) || 0) + 1);
      }
      
      // Sort colors by frequency
      const sortedColors = Array.from(colorMap.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([color]) => {
          const [r, g, b] = color.split(',').map(Number);
          return { r, g, b, hex: rgbToHex(r, g, b) };
        });
      
      // Get dominant color (most frequent)
      const dominant = sortedColors[0] || { hex: '#D2691E' };
      
      // Find accent color (complementary or contrasting)
      const accent = findAccentColor(sortedColors, dominant);
      
      // Generate background gradient
      const background = generateBackgroundGradient(dominant.hex, accent);
      
      // Determine text color based on background
      const text = '#FFFFFF'; // White text for dark backgrounds
      
      resolve({
        dominant: dominant.hex,
        accent,
        background,
        text
      });
    };
    
    img.onerror = () => {
      // Return default palette on error
      resolve(getDefaultPalette());
    };
    
    img.src = imageUrl;
  });
}

/**
 * Convert RGB to Hex color
 */
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

/**
 * Find a good accent color from the palette
 */
function findAccentColor(colors: {hex: string; r: number; g: number; b: number}[], dominant: {hex: string; r: number; g: number; b: number}): string {
  // Try to find a contrasting color
  for (const color of colors.slice(1, 5)) {
    const distance = colorDistance(dominant, color);
    if (distance > 100) {
      return color.hex;
    }
  }
  
  // If no good contrast, create a shifted version
  return shiftHue(dominant.hex, 60);
}

/**
 * Calculate color distance (Euclidean)
 */
function colorDistance(c1: {r: number; g: number; b: number}, c2: {r: number; g: number; b: number}): number {
  return Math.sqrt(
    Math.pow(c1.r - c2.r, 2) +
    Math.pow(c1.g - c2.g, 2) +
    Math.pow(c1.b - c2.b, 2)
  );
}

/**
 * Shift hue of a color
 */
function shiftHue(hex: string, degrees: number): string {
  // Convert hex to HSL
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  
  // Shift hue
  h = (h + degrees / 360) % 1;
  
  // Convert back to RGB
  const hslToRgb = (h: number, s: number, l: number) => {
    let r, g, b;
    
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    
    return rgbToHex(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255));
  };
  
  return hslToRgb(h, s, l);
}

/**
 * Generate a background gradient from colors
 */
function generateBackgroundGradient(dominant: string, accent: string): string {
  // Create a diagonal gradient with some transparency
  return `linear-gradient(135deg, ${dominant}dd 0%, ${accent}dd 100%)`;
}

/**
 * Get default color palette
 */
function getDefaultPalette(): ColorPalette {
  return {
    dominant: '#D2691E',
    accent: '#8B4513',
    background: 'linear-gradient(135deg, #D2691Edd 0%, #8B4513dd 100%)',
    text: '#FFFFFF'
  };
}

/**
 * Get palette for specific dish types (fallback)
 */
export function getDishTypePalette(category: string): ColorPalette {
  const palettes: Record<string, ColorPalette> = {
    '汤底': {
      dominant: '#FF8C42',
      accent: '#FF6B1A',
      background: 'linear-gradient(135deg, #FF8C42dd 0%, #FF6B1Add 100%)',
      text: '#FFFFFF'
    },
    '陆鲜': {
      dominant: '#8B4513',
      accent: '#654321',
      background: 'linear-gradient(135deg, #8B4513dd 0%, #654321dd 100%)',
      text: '#FFFFFF'
    },
    '海鲜': {
      dominant: '#4ECDC4',
      accent: '#1A8A87',
      background: 'linear-gradient(135deg, #4ECDC4dd 0%, #1A8A87dd 100%)',
      text: '#FFFFFF'
    },
    '素菜': {
      dominant: '#95E77E',
      accent: '#52B448',
      background: 'linear-gradient(135deg, #95E77Edd 0%, #52B448dd 100%)',
      text: '#FFFFFF'
    },
    '凉菜': {
      dominant: '#FF6B6B',
      accent: '#C92A2A',
      background: 'linear-gradient(135deg, #FF6B6Bdd 0%, #C92A2Add 100%)',
      text: '#FFFFFF'
    },
    '小吃甜点': {
      dominant: '#FFB6D9',
      accent: '#FF69B4',
      background: 'linear-gradient(135deg, #FFB6D9dd 0%, #FF69B4dd 100%)',
      text: '#FFFFFF'
    },
    '饮品': {
      dominant: '#9B59B6',
      accent: '#6C3483',
      background: 'linear-gradient(135deg, #9B59B6dd 0%, #6C3483dd 100%)',
      text: '#FFFFFF'
    },
    all: {
      dominant: '#D2691E',
      accent: '#8B4513',
      background: 'linear-gradient(135deg, #D2691Edd 0%, #8B4513dd 100%)',
      text: '#FFFFFF'
    }
  };
  
  return palettes[category] || getDefaultPalette();
}