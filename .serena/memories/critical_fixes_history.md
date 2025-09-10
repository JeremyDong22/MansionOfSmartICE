# Critical Fixes History

## Menu Performance Crisis & Complete Optimization (2025-09-09)
**Issue**: Extreme lag in dynamic menu - 7 FPS, 141ms per scroll, making page unusable
**User Report**: "为什么这么卡？" (Why is it so laggy?) 
**Root Causes**:
1. Runtime color extraction taking 90ms per image
2. All dishes rendering simultaneously (no virtual rendering)
3. Multiple state updates causing cascading re-renders
4. Heavy Framer Motion animations on all elements

**Fix Applied - Complete Performance Overhaul**:
1. **Build-time color extraction**: Created `/scripts/extract-colors.js` to precompute all colors
2. **Virtual rendering**: Only render 3 dishes at once (current ± 1)
3. **State optimization**: Merged states into single useReducer
4. **Animation optimization**: Replaced Framer Motion with CSS transitions
5. **Platform-specific fixes**: 
   - PC: Disabled scroll/drag, click-only navigation
   - Mobile: Fixed passive event listener warnings

**Results**: 7 FPS → 96 FPS (13.7x improvement!)
**User Feedback**: Successfully resolved all lag issues

## Category Data Fix (2025-09-09)
**Issue**: Missing snack (小吃) images, incorrect categorization of dishes
**Fix**: Added 5 snack items to menu-data.ts, moved dishes from 热菜 to correct categories
**Verification**: All categories now display correct dishes with images

## Tailwind CSS Complete Failure (2025-09-09)
**Issue**: Complete loss of page styling - white background, no layout, broken positioning
**User Impact**: "页面没恢复。我好伤心" (Page not restored. I'm so sad)
**Root Cause**: Invalid `@import "tw-animate-css"` in globals.css when package wasn't installed
**Fix Applied**: Removed the invalid import line from globals.css
**Verification**: All styling restored - gradients, z-index layers, positioning work correctly

## Performance Optimization Attempt & Revert
**Initial Issue**: Devices overheating from high CPU usage
**User Decision**: Requested full revert to keep all visual effects
**Lesson Learned**: User prioritizes visual experience over performance optimization

## Important Files to Monitor
1. `/app/globals.css` - CRITICAL: Invalid imports break entire app
2. `/app/menu/dynamic/page.tsx` - Optimized version with virtual rendering
3. `/scripts/extract-colors.js` - Build-time color extraction
4. `/lib/dish-colors.json` - Precomputed color data
5. `/hooks/usePrecomputedColors.ts` - Performance-critical hook
6. `/components/dynamic-menu/category-switcher.tsx` - Platform-specific navigation

## Recovery Procedures
**If Performance Degrades**:
1. Check if dish-colors.json exists and is up to date
2. Verify virtual rendering is working (only 3 images in DOM)
3. Ensure build scripts are running (`npm run prebuild`)
4. Check for accidental re-introduction of runtime color extraction

**If Styling Breaks Again**:
1. Check browser console for CSS import errors
2. Inspect globals.css for invalid imports
3. Verify Tailwind CSS is loading
4. Check animations.css is properly imported

## Git Safety Protocol
User explicitly requested: "赶紧git一下，以免再弄丢了"
- Always commit after critical fixes
- Use descriptive commit messages
- Don't create branches unless asked
- Preserve working states immediately