// Script to remove black backgrounds from dish images and preserve transparency
// Converts images to PNG and WebP with transparent backgrounds

const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

// Configuration
const CONFIG = {
  inputDir: path.join(__dirname, '../public/dishes'),
  outputDir: path.join(__dirname, '../public/dishes'),
  blackThreshold: 30, // Pixels darker than this are considered black
  maxWidth: 1920,
  maxHeight: 1080,
  pngQuality: 95,
  webpQuality: 90,
};

async function removeBlackBackground(inputPath, outputBasename) {
  const pngPath = path.join(CONFIG.outputDir, `${outputBasename}.png`);
  const webpPath = path.join(CONFIG.outputDir, `${outputBasename}.webp`);
  
  try {
    console.log(`  Processing: ${outputBasename}`);
    
    // Read the image
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    // Calculate resize dimensions if needed
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
    
    // Process the image to remove black background
    const processedImage = await sharp(inputPath)
      .resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .ensureAlpha() // Ensure alpha channel exists
      .raw()
      .toBuffer({ resolveWithObject: true });
    
    const { data, info } = processedImage;
    const pixelArray = new Uint8ClampedArray(data.buffer);
    
    // Process pixels to make black/dark pixels transparent
    for (let i = 0; i < pixelArray.length; i += 4) {
      const r = pixelArray[i];
      const g = pixelArray[i + 1];
      const b = pixelArray[i + 2];
      const a = pixelArray[i + 3];
      
      // Calculate brightness
      const brightness = (r + g + b) / 3;
      
      // If pixel is very dark (near black), make it transparent
      if (brightness < CONFIG.blackThreshold) {
        // Gradual transparency based on how dark it is
        const alphaMultiplier = brightness / CONFIG.blackThreshold;
        pixelArray[i + 3] = Math.floor(a * alphaMultiplier);
      }
      
      // Also handle pure black pixels
      if (r < 10 && g < 10 && b < 10) {
        pixelArray[i + 3] = 0; // Make fully transparent
      }
    }
    
    // Create sharp instance from processed buffer
    const outputImage = sharp(pixelArray, {
      raw: {
        width: info.width,
        height: info.height,
        channels: 4
      }
    });
    
    // Save as PNG with transparency
    await outputImage
      .png({
        compressionLevel: 9,
        quality: CONFIG.pngQuality
      })
      .toFile(pngPath);
    
    console.log(`    ✅ Saved PNG: ${outputBasename}.png`);
    
    // Save as WebP with transparency
    await outputImage
      .webp({
        quality: CONFIG.webpQuality,
        alphaQuality: 100,
        effort: 6,
        lossless: false
      })
      .toFile(webpPath);
    
    console.log(`    ✅ Saved WebP: ${outputBasename}.webp`);
    
    return {
      png: `${outputBasename}.png`,
      webp: `${outputBasename}.webp`,
      success: true
    };
    
  } catch (error) {
    console.error(`    ❌ Error processing ${outputBasename}:`, error.message);
    return { success: false, error: error.message };
  }
}

async function processSpecificImages(imageList) {
  console.log('🎨 Removing black backgrounds from dish images...\n');
  
  const results = [];
  
  for (const imageName of imageList) {
    // Try to find the source image (could be jpg, jpeg, or png)
    const possibleExtensions = ['.jpg', '.jpeg', '.png'];
    let sourceFile = null;
    let sourcePath = null;
    
    for (const ext of possibleExtensions) {
      const testPath = path.join(CONFIG.inputDir, imageName + ext);
      try {
        await fs.access(testPath);
        sourceFile = imageName + ext;
        sourcePath = testPath;
        break;
      } catch {
        // File doesn't exist with this extension, try next
      }
    }
    
    if (!sourcePath) {
      console.log(`  ⚠️  Source not found for: ${imageName}`);
      continue;
    }
    
    const result = await removeBlackBackground(sourcePath, imageName);
    results.push({ name: imageName, ...result });
  }
  
  return results;
}

async function main() {
  // List of images that need black background removal
  // Based on the dishes mentioned in the menu
  const imagesToProcess = [
    'mujiangzi-jizhao',
    'mujiangzi-jizhua', 
    'mujiangzi-xianhuangniurou',
    'ningmeng-shancha',
    'ou',
    'sancui-wan',
    'shanyao',
    'shimo-heidoufu',
    'shougong-shuijing-huarou',
    'sour-soup-base',
    'wuyu-pian',
    'wuzhimaotao-shancha',
    'xian-baihe',
    'xian-huanghua',
    'xifeng-hupi-zhuti',
    'xuepi-cai',
    'yecili-shancha',
    'yelanzi-junguzuhe',
    'yesuan-su-wuhuazhi',
    'yezuoliao-leijiao-pidan',
    'yunshan-xuehua-diaolong',
    'zisu-banbianyun'
  ];
  
  try {
    const results = await processSpecificImages(imagesToProcess);
    
    // Print summary
    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║              BLACK BACKGROUND REMOVAL COMPLETE             ║');
    console.log('╚═══════════════════════════════════════════════════════════╝');
    console.log(`\n📊 Results:`);
    console.log(`  • Images processed: ${results.filter(r => r.success).length}`);
    console.log(`  • Failed: ${results.filter(r => !r.success).length}`);
    
    if (results.some(r => !r.success)) {
      console.log('\n❌ Failed images:');
      results.filter(r => !r.success).forEach(r => {
        console.log(`  • ${r.name}: ${r.error}`);
      });
    }
    
    console.log('\n✅ Images have been updated with transparent backgrounds!');
    console.log('  • PNG files created for maximum quality');
    console.log('  • WebP files created for web optimization');
    
  } catch (error) {
    console.error('❌ Error during processing:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { removeBlackBackground };