# Common Issues and Solutions

## Critical CSS Loading Issue (RESOLVED)
**Problem**: Page loses all styling - white background, no layout, broken positioning
**Root Cause**: Invalid package import in globals.css breaks Tailwind CSS loading
**Solution**: 
```css
// WRONG - This breaks everything if package doesn't exist:
@import "tailwindcss";
@import "tw-animate-css";  // This line breaks Tailwind!

// CORRECT:
@import "tailwindcss";
// Only import packages that are actually installed
```
**Symptoms**: All position classes (fixed, absolute), z-index, and styling fail to apply
**Debug Method**: Check browser console for CSS import errors, inspect computed styles

## Vibrant Library Import Issues
**Problem**: `TypeError: Vibrant is not a function`
**Solution**: 
```typescript
const VibrantModule = await import('node-vibrant/browser');
const Vibrant = VibrantModule.default || VibrantModule;

// Handle both constructor and factory patterns
const vibrantInstance = typeof Vibrant === 'function' 
  ? new Vibrant(imageUrl)
  : Vibrant.from(imageUrl);
```

## Performance Issues - Device Overheating
**Identified Causes**:
1. Large video files (7.3MB avatar-video.mp4)
2. Continuous animations without throttling
3. Real-time color extraction on every scroll
4. 60+ scroll events per second

**Solutions Applied**:
- Throttle scroll events to 16ms (60fps)
- Implement conditional rendering for off-screen elements
- Consider replacing videos with static images
- Add will-change CSS property judiciously

## Component Initialization Jump
**Problem**: Scrollable components jumping to position on page load
**Solution**:
1. Add `isInitialized` state
2. Start with `opacity: 0`
3. Use `requestAnimationFrame` instead of `setTimeout`
4. Set scroll position directly without animation
5. Fade in after positioning

## Scroll Element Centering
**Problem**: First and last items can't reach center position
**Solution**: 
- Set padding to exactly `50vw` on both sides
- This ensures enough scroll space for edge items

## Category Name Display Logic
**Problem**: Category names not showing during scroll
**Solution**:
- Show on `updateSelection()` during any scroll/drag
- Hide with 1-second delay after interaction stops
- Trigger `updateSelection()` on drag/touch start

## Magnetic Snap Behavior
**Problem**: Items not snapping to center correctly
**Solution**:
1. Calculate closest item to center line
2. Get exact offset from center
3. Use `scrollBy()` with smooth behavior
4. Update state after animation

## Testing Approach
**Important**: Always test UI changes with Playwright MCP
- Navigate to development server
- Verify animations and interactions
- Check responsive behavior
- Test both mouse and touch interactions