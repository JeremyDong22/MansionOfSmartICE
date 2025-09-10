# Recent UI Components and Implementations

## Category Switcher Component
**Location**: `mansion-of-smartice/components/dynamic-menu/category-switcher.tsx`

### Features
- Horizontal scrollable category selector
- Magnetic snap-to-center behavior
- Visual indicators (vertical lines) that change size based on proximity to center
- Category name display with fade-in/fade-out animation
- Touch and mouse drag support
- Smooth initialization without visible jumps

### Key Implementation Details
- Uses `findClosestToCenter()` to determine which item is in the middle
- `snapToCenter()` function for magnetic alignment
- Padding of `50vw` on both sides to allow first/last items to reach center
- Gap of 8 units between items for proper spacing
- Fade timeout of 1 second for category name display
- `requestAnimationFrame` for smooth initial positioning

### State Management
- `centerIndex`: Currently selected category index
- `showCategoryName`: Controls category name visibility
- `isInitialized`: Prevents flash on initial load
- `isDragging`: Tracks drag state
- `scrollTimeout` and `fadeTimeout`: Manage animations

## Smart Color Extraction Hook
**Location**: `mansion-of-smartice/hooks/useSmartColorExtraction.ts`

### Features
- Extracts dominant colors from food images
- Prioritizes appetizing warm colors over cool tones
- Creates dynamic gradients for backgrounds
- Fallback to default brown tones

### Implementation
- Dynamic import of `node-vibrant/browser`
- Handles both constructor and factory patterns for Vibrant
- Filters out blue/purple colors that reduce appetite
- Generates primary, secondary, and accent colors

## Common Patterns
1. **Smooth Animations**: Using Framer Motion and CSS transitions
2. **Responsive Design**: Mobile-first approach with touch support
3. **Performance**: RequestAnimationFrame for DOM operations
4. **User Feedback**: Visual and temporal feedback for interactions