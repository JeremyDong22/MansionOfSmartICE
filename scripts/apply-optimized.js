// Script to replace original images with optimized versions
// Run this after reviewing the optimized images quality

const fs = require('fs').promises;
const path = require('path');

async function applyOptimized() {
  console.log('📦 Applying optimized images...\n');
  
  const optimizedDir = path.join(__dirname, '../public/dishes-optimized');
  const dishesDir = path.join(__dirname, '../public/dishes');
  
  try {
    // Get all optimized files
    const files = await fs.readdir(optimizedDir);
    const jpegFiles = files.filter(f => f.endsWith('.jpg'));
    const webpFiles = files.filter(f => f.endsWith('.webp'));
    
    console.log(`Found ${jpegFiles.length} JPEG and ${webpFiles.length} WebP files\n`);
    
    // Copy optimized files to dishes directory
    for (const file of [...jpegFiles, ...webpFiles]) {
      const source = path.join(optimizedDir, file);
      const dest = path.join(dishesDir, file);
      
      await fs.copyFile(source, dest);
      console.log(`  ✅ Copied: ${file}`);
    }
    
    // Remove old PNG files (they're backed up in dishes-original)
    const dishFiles = await fs.readdir(dishesDir);
    const pngFiles = dishFiles.filter(f => f.endsWith('.png'));
    
    console.log(`\n🗑️  Removing ${pngFiles.length} original PNG files...`);
    
    for (const png of pngFiles) {
      const pngPath = path.join(dishesDir, png);
      await fs.unlink(pngPath);
      console.log(`  ❌ Removed: ${png}`);
    }
    
    // Calculate space saved
    const backupDir = path.join(__dirname, '../public/dishes-original');
    const originalFiles = await fs.readdir(backupDir);
    let originalSize = 0;
    let optimizedSize = 0;
    
    for (const file of originalFiles) {
      const stats = await fs.stat(path.join(backupDir, file));
      originalSize += stats.size;
    }
    
    for (const file of [...jpegFiles, ...webpFiles]) {
      const stats = await fs.stat(path.join(dishesDir, file));
      optimizedSize += stats.size;
    }
    
    const savedMB = ((originalSize - optimizedSize) / 1024 / 1024).toFixed(1);
    const savedPercent = ((1 - optimizedSize / originalSize) * 100).toFixed(1);
    
    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║                     COMPLETE! 🎉                          ║');
    console.log('╚═══════════════════════════════════════════════════════════╝');
    console.log(`\n📊 Results:`);
    console.log(`  • Original size: ${(originalSize / 1024 / 1024).toFixed(1)}MB`);
    console.log(`  • Optimized size: ${(optimizedSize / 1024 / 1024).toFixed(1)}MB`);
    console.log(`  • Space saved: ${savedMB}MB (${savedPercent}%)`);
    console.log(`\n✅ Images have been optimized and replaced!`);
    console.log(`📁 Original backups are in: public/dishes-original/`);
    console.log(`\n⚠️  Don't forget to:`);
    console.log(`  1. Update your code to use the new .jpg/.webp files`);
    console.log(`  2. Implement Next.js Image component`);
    console.log(`  3. Test the website with optimized images`);
    
  } catch (error) {
    console.error('❌ Error applying optimized images:', error);
    process.exit(1);
  }
}

// Run the script
applyOptimized();