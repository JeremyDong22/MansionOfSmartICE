// Image optimization script - Compresses and converts dish images
// Reduces file sizes from ~8-20MB to <500KB while maintaining quality

const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');
const { Vibrant } = require('node-vibrant/node');

// Configuration
const CONFIG = {
  inputDir: path.join(__dirname, '../public/dishes'),
  backupDir: path.join(__dirname, '../public/dishes-original'),
  outputDir: path.join(__dirname, '../public/dishes-optimized'),
  maxWidth: 1920,
  maxHeight: 1080,
  jpegQuality: 85,
  webpQuality: 85,
  targetSizeKB: 500,
};

// Color extraction functions (reused from extract-colors.js)
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

async function extractColors(imagePath) {
  try {
    const palette = await Vibrant.from(imagePath).getPalette();
    
    const allColors = {
      vibrant: palette.Vibrant?.hex || null,
      darkVibrant: palette.DarkVibrant?.hex || null,
      lightVibrant: palette.LightVibrant?.hex || null,
      muted: palette.Muted?.hex || null,
      darkMuted: palette.DarkMuted?.hex || null,
      lightMuted: palette.LightMuted?.hex || null
    };

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
    console.error(`Error extracting colors from ${imagePath}:`, error.message);
    return DEFAULT_COLORS;
  }
}

async function getFileSize(filePath) {
  const stats = await fs.stat(filePath);
  return stats.size / 1024; // Return size in KB
}

async function optimizeImage(inputPath, filename) {
  const basename = path.basename(filename, path.extname(filename));
  const jpegPath = path.join(CONFIG.outputDir, `${basename}.jpg`);
  const webpPath = path.join(CONFIG.outputDir, `${basename}.webp`);
  
  console.log(`  Processing: ${filename}`);
  
  try {
    // Get original file size
    const originalSize = await getFileSize(inputPath);
    console.log(`    Original size: ${originalSize.toFixed(0)}KB`);
    
    // Create sharp instance
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    // Calculate resize dimensions
    let width = metadata.width;
    let height = metadata.height;
    
    if (width > CONFIG.maxWidth || height > CONFIG.maxHeight) {
      const aspectRatio = width / height;
      if (width > height) {
        width = CONFIG.maxWidth;
        height = Math.round(width / aspectRatio);
      } else {
        height = CONFIG.maxHeight;
        width = Math.round(height * aspectRatio);
      }
    }
    
    // Generate JPEG version
    await image
      .resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ 
        quality: CONFIG.jpegQuality,
        progressive: true,
        mozjpeg: true
      })
      .toFile(jpegPath);
    
    const jpegSize = await getFileSize(jpegPath);
    console.log(`    JPEG size: ${jpegSize.toFixed(0)}KB`);
    
    // Generate WebP version
    await sharp(inputPath)
      .resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ 
        quality: CONFIG.webpQuality,
        effort: 6
      })
      .toFile(webpPath);
    
    const webpSize = await getFileSize(webpPath);
    console.log(`    WebP size: ${webpSize.toFixed(0)}KB`);
    
    // If sizes are still too large, reduce quality further
    if (jpegSize > CONFIG.targetSizeKB) {
      const reducedQuality = Math.floor(CONFIG.jpegQuality * (CONFIG.targetSizeKB / jpegSize));
      await sharp(inputPath)
        .resize(width, height, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({ 
          quality: Math.max(60, reducedQuality),
          progressive: true,
          mozjpeg: true
        })
        .toFile(jpegPath);
      
      const finalJpegSize = await getFileSize(jpegPath);
      console.log(`    Final JPEG size: ${finalJpegSize.toFixed(0)}KB (quality: ${Math.max(60, reducedQuality)})`);
    }
    
    // Extract colors from optimized image
    const colors = await extractColors(jpegPath);
    
    // Calculate savings
    const savings = ((originalSize - Math.min(jpegSize, webpSize)) / originalSize * 100).toFixed(1);
    console.log(`    ✅ Saved: ${savings}%`);
    
    return {
      original: filename,
      jpeg: `${basename}.jpg`,
      webp: `${basename}.webp`,
      originalSize,
      jpegSize,
      webpSize,
      colors,
      savings: parseFloat(savings)
    };
    
  } catch (error) {
    console.error(`    ❌ Error optimizing ${filename}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🎨 Starting image optimization...\n');
  
  try {
    // Create directories
    await fs.mkdir(CONFIG.backupDir, { recursive: true });
    await fs.mkdir(CONFIG.outputDir, { recursive: true });
    
    // Read all files in dishes directory
    const files = await fs.readdir(CONFIG.inputDir);
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|webp)$/i.test(file) && 
      !file.includes('placeholder')
    );
    
    console.log(`Found ${imageFiles.length} images to optimize\n`);
    
    // Process each image
    const results = [];
    const colorMap = {};
    
    for (const file of imageFiles) {
      const inputPath = path.join(CONFIG.inputDir, file);
      
      // Backup original
      const backupPath = path.join(CONFIG.backupDir, file);
      if (!(await fs.access(backupPath).then(() => true).catch(() => false))) {
        await fs.copyFile(inputPath, backupPath);
        console.log(`  📁 Backed up: ${file}`);
      }
      
      // Optimize image
      const result = await optimizeImage(inputPath, file);
      if (result) {
        results.push(result);
        
        // Store colors for both formats
        colorMap[`/dishes/${result.jpeg}`] = result.colors;
        colorMap[`/dishes/${result.webp}`] = result.colors;
        // Keep original path for compatibility
        colorMap[`/dishes/${file}`] = result.colors;
      }
      
      console.log(''); // Empty line for readability
    }
    
    // Save color map
    const colorMapPath = path.join(__dirname, '../lib/dish-colors.json');
    await fs.writeFile(
      colorMapPath,
      JSON.stringify(colorMap, null, 2),
      'utf8'
    );
    
    // Calculate totals
    const totalOriginal = results.reduce((sum, r) => sum + r.originalSize, 0);
    const totalJpeg = results.reduce((sum, r) => sum + r.jpegSize, 0);
    const totalWebp = results.reduce((sum, r) => sum + r.webpSize, 0);
    const avgSavings = results.reduce((sum, r) => sum + r.savings, 0) / results.length;
    
    // Print summary
    console.log('╔═══════════════════════════════════════════════════════════╗');
    console.log('║                   OPTIMIZATION COMPLETE                    ║');
    console.log('╚═══════════════════════════════════════════════════════════╝');
    console.log(`\n📊 Results:`);
    console.log(`  • Images processed: ${results.length}`);
    console.log(`  • Original total: ${(totalOriginal / 1024).toFixed(1)}MB`);
    console.log(`  • JPEG total: ${(totalJpeg / 1024).toFixed(1)}MB`);
    console.log(`  • WebP total: ${(totalWebp / 1024).toFixed(1)}MB`);
    console.log(`  • Average savings: ${avgSavings.toFixed(1)}%`);
    console.log(`\n📁 Output locations:`);
    console.log(`  • Optimized images: ${CONFIG.outputDir}`);
    console.log(`  • Original backups: ${CONFIG.backupDir}`);
    console.log(`  • Color data: ${colorMapPath}`);
    console.log('\n✅ Next steps:');
    console.log('  1. Review optimized images in dishes-optimized/');
    console.log('  2. If quality is good, run: npm run apply-optimized');
    console.log('  3. Update code to use Next.js Image component');
    
  } catch (error) {
    console.error('❌ Error during optimization:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { optimizeImage, extractColors };