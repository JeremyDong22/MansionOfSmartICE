// Build-time color extraction script
// Extracts colors from all dish images at build time to avoid runtime computation

const fs = require('fs').promises;
const path = require('path');
const { Vibrant } = require('node-vibrant/node');

// Appetizing color selection functions (same logic as frontend)
function isAppetizingColor(hex) {
  if (!hex) return false;
  
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  
  // Avoid blue/purple dominated colors
  if (b > r && b > g) return false;
  
  // Prefer warm colors
  return r >= g * 0.8;
}

function getColorBrightness(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000;
}

function selectBestColor(colors, preferDark = true) {
  const validColors = colors.filter(c => c && isAppetizingColor(c));
  
  if (validColors.length === 0) {
    const nonBlueColors = colors.filter(c => c && !c.includes('8') && !c.includes('9') && !c.includes('a') && !c.includes('b'));
    if (nonBlueColors.length > 0) {
      return preferDark 
        ? nonBlueColors.reduce((darkest, color) => 
            getColorBrightness(color) < getColorBrightness(darkest) ? color : darkest)
        : nonBlueColors[0];
    }
    return colors.find(c => c) || null;
  }
  
  if (preferDark) {
    return validColors.reduce((darkest, color) => 
      getColorBrightness(color) < getColorBrightness(darkest) ? color : darkest);
  }
  
  return validColors[0];
}

function createAppetizingGradient(color1, color2, color3) {
  if (color3) {
    return `linear-gradient(135deg, ${color1}F5 0%, ${color2} 45%, ${color3}F5 100%)`;
  }
  return `linear-gradient(135deg, ${color1}F5 0%, ${color2} 100%)`;
}

// Default colors for fallback
const DEFAULT_COLORS = {
  primary: '#3d2314',
  secondary: '#5d3a1a',
  accent: '#8b4513',
  backgroundGradient: 'linear-gradient(135deg, #2d1810 0%, #3d2314 35%, #5d3a1a 100%)',
  textColor: '#ffffff'
};

async function extractColorFromImage(imagePath) {
  try {
    console.log(`  Extracting colors from: ${path.basename(imagePath)}`);
    
    const palette = await Vibrant.from(imagePath).getPalette();
    
    const allColors = {
      vibrant: palette.Vibrant?.hex || null,
      darkVibrant: palette.DarkVibrant?.hex || null,
      lightVibrant: palette.LightVibrant?.hex || null,
      muted: palette.Muted?.hex || null,
      darkMuted: palette.DarkMuted?.hex || null,
      lightMuted: palette.LightMuted?.hex || null
    };

    // Smart color selection
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

    const backgroundGradient = createAppetizingGradient(primary, secondary, accent);
    const textColor = getColorBrightness(primary) < 128 ? '#ffffff' : '#000000';

    return {
      primary,
      secondary,
      accent,
      backgroundGradient,
      textColor,
      allColors
    };
  } catch (error) {
    console.error(`  Error extracting colors from ${imagePath}:`, error.message);
    return DEFAULT_COLORS;
  }
}

async function main() {
  console.log('🎨 Starting color extraction for all dish images...\n');
  
  const dishesDir = path.join(__dirname, '../public/dishes');
  const outputFile = path.join(__dirname, '../lib/dish-colors.json');
  
  try {
    // Read all files in dishes directory
    const files = await fs.readdir(dishesDir);
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|webp)$/i.test(file) && 
      !file.includes('placeholder')
    );
    
    console.log(`Found ${imageFiles.length} dish images to process\n`);
    
    // Extract colors from each image
    const colorMap = {};
    
    for (const file of imageFiles) {
      const imagePath = path.join(dishesDir, file);
      const imageKey = `/dishes/${file}`;
      
      const colors = await extractColorFromImage(imagePath);
      colorMap[imageKey] = colors;
    }
    
    // Save to JSON file
    await fs.writeFile(
      outputFile, 
      JSON.stringify(colorMap, null, 2),
      'utf8'
    );
    
    console.log(`\n✅ Color extraction complete!`);
    console.log(`📁 Colors saved to: ${outputFile}`);
    console.log(`📊 Processed ${Object.keys(colorMap).length} images`);
    
  } catch (error) {
    console.error('❌ Error during color extraction:', error);
    process.exit(1);
  }
}

// Run the script
main();