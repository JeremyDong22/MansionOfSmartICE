# Image Processing and Optimization

## Image Optimization Script
**Location**: `/scripts/optimize-images.js`
**Purpose**: Compress and convert dish images from large files (8-20MB) to optimized formats (<500KB)

### Features
- Converts images to both JPEG and WebP formats
- Resizes to max 1920x1080 while maintaining aspect ratio
- Extracts color palettes for UI theming
- Creates backups in `/public/dishes-original/`
- Outputs optimized images to `/public/dishes-optimized/`

### Configuration
- JPEG Quality: 85 (reduces further if > 500KB)
- WebP Quality: 85
- Target Size: 500KB max
- Uses mozjpeg for better JPEG compression

## Background Removal Script
**Location**: `/scripts/remove-black-background.js`
**Purpose**: Remove black backgrounds from dish images and preserve transparency
**Created**: 2025-09-11

### Features
- Removes black/dark backgrounds (threshold: brightness < 30)
- Creates PNG files with full transparency support
- Creates WebP files with alpha channel preserved
- Gradual transparency based on pixel darkness
- Processes specific images that need background removal

### Output Formats
- **PNG**: High quality with lossless compression, full transparency
- **WebP**: Web-optimized with transparency, 90% quality

### Images Processed (22 total)
- mujiangzi series (chicken dishes)
- Tea beverages (ningmeng-shancha, yecili-shancha, wuzhimaotao-shancha)
- Various dishes (ou, sancui-wan, shanyao, shimo-heidoufu, etc.)
- Sour soup base and accompaniments

## Color Extraction
**Location**: `/scripts/extract-colors.js`
**Output**: `/lib/dish-colors.json`

### Algorithm
1. Extracts 6 color swatches using node-vibrant
2. Filters out blue/purple colors (reduce appetite)
3. Prioritizes warm, appetizing colors
4. Creates gradients for backgrounds
5. Determines text color based on brightness

### Default Fallback Colors
- Primary: #3d2314
- Secondary: #5d3a1a  
- Accent: #8b4513
- Background: Gradient from dark to light brown

## Usage
```bash
npm run optimize-images     # Compress all images
npm run extract-colors      # Extract colors for UI theming
node scripts/remove-black-background.js  # Remove black backgrounds
npm run apply-optimized     # Replace originals with optimized versions
```

## Important Notes
- Always backup originals before processing
- WebP provides best compression with transparency
- PNG is needed for maximum quality/compatibility
- Color extraction runs at build time via `prebuild` script