// Fix transparent background images - Keep PNG format for transparency
// Converts JPEG back to PNG with transparency preserved

const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

async function fixTransparentImages() {
  console.log('🔧 Fixing transparent background images...\n');
  
  const dishesDir = path.join(__dirname, '../public/dishes');
  const originalDir = path.join(__dirname, '../public/dishes-original');
  
  try {
    // Get all original PNG files
    const originalFiles = await fs.readdir(originalDir);
    const pngFiles = originalFiles.filter(f => f.endsWith('.png'));
    
    console.log(`Found ${pngFiles.length} original PNG files to process\n`);
    
    for (const file of pngFiles) {
      const basename = path.basename(file, '.png');
      const originalPath = path.join(originalDir, file);
      const outputPath = path.join(dishesDir, file);
      const webpPath = path.join(dishesDir, `${basename}.webp`);
      
      console.log(`Processing: ${file}`);
      
      // Compress PNG while preserving transparency
      await sharp(originalPath)
        .resize(1920, 1080, {
          fit: 'inside',
          withoutEnlargement: true,
          background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparent background
        })
        .png({
          compressionLevel: 9,
          quality: 85,
          effort: 10
        })
        .toFile(outputPath);
      
      // Also create WebP with transparency
      await sharp(originalPath)
        .resize(1920, 1080, {
          fit: 'inside',
          withoutEnlargement: true,
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .webp({
          quality: 85,
          effort: 6,
          alphaQuality: 100 // Preserve alpha channel
        })
        .toFile(webpPath);
      
      // Remove the JPEG versions
      const jpegPath = path.join(dishesDir, `${basename}.jpg`);
      try {
        await fs.unlink(jpegPath);
        console.log(`  ✅ Removed JPEG: ${basename}.jpg`);
      } catch (e) {
        // JPEG might not exist
      }
      
      const stats = await fs.stat(outputPath);
      const size = (stats.size / 1024).toFixed(0);
      console.log(`  ✅ Created PNG: ${size}KB with transparency\n`);
    }
    
    console.log('✅ All images fixed with transparent backgrounds!');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixTransparentImages();