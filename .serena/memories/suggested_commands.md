# Suggested Commands for Development

## Development Server
```bash
npm run dev      # Start development server with Turbopack on http://localhost:3000
```

## Build & Production
```bash
npm run prebuild # Extract colors from images (runs automatically before build)
npm run build    # Build for production with Turbopack
npm run start    # Start production server
```

## Code Quality
```bash
npm run lint     # Run ESLint for code linting
```

## Image Processing
```bash
npm run extract-colors   # Extract color palettes from dish images
npm run optimize-images  # Compress images to <500KB
npm run apply-optimized  # Replace original images with optimized versions
node scripts/remove-black-background.js  # Remove black backgrounds, add transparency
```

## Package Management
```bash
npm install      # Install dependencies
npm install [package-name]  # Add new package
npm update       # Update packages
```

## Git Commands (Darwin/macOS)
```bash
git status       # Check current changes
git add .        # Stage all changes
git commit -m "message"  # Commit changes
git push         # Push to remote
git pull         # Pull latest changes
```

## File System Commands (Darwin/macOS)
```bash
ls -la           # List all files with details
cd [directory]   # Change directory
pwd              # Print working directory
mkdir [name]     # Create directory
rm -rf [name]    # Remove directory/file (careful!)
find . -name "*.tsx"  # Find files by pattern
grep -r "pattern" .   # Search in files
```

## Testing with Playwright MCP
- Use Playwright MCP to test UI changes after implementation
- Navigate to http://localhost:3000 for testing

## TypeScript
```bash
npx tsc --noEmit  # Type check without emitting files
```

## Process Management
```bash
ps aux | grep node   # Find Node.js processes
kill -9 [PID]        # Kill process by ID
lsof -i :3000        # Check what's using port 3000
```

## Background Process Management (Claude Code)
```bash
# When running npm run dev in background:
# Use BashOutput tool to check output
# Use KillBash tool to stop the server if needed
```