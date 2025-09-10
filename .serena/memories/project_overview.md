# Mansion of SmartICE - Project Overview

## Project Purpose
This is a restaurant website for "野百灵·贵州酸汤" (Wildlark · Guizhou Sour Soup), a Yunnan-Guizhou-Sichuan cuisine restaurant. The website features a dynamic menu system, gallery, team information, and location details.

## Tech Stack
- **Framework**: Next.js 15.5.2 with App Router and Turbopack
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS v4 with PostCSS
- **UI Components**: Radix UI, shadcn/ui components
- **Animation**: Framer Motion 12.23.12
- **Icons**: Lucide React
- **Color Extraction**: node-vibrant for smart color extraction from images
- **Build Tool**: Next.js with Turbopack
- **Package Manager**: npm

## Project Structure
```
mansion-of-smartice/
├── app/                 # Next.js App Router pages
│   ├── gallery/        # Gallery page
│   ├── ingredients/    # Ingredients page
│   ├── locations/      # Locations page
│   ├── menu/           # Menu pages
│   │   └── dynamic/    # Dynamic scrollable menu
│   ├── our-team/       # Team page
│   └── page.tsx        # Home page
├── components/         # React components
│   ├── ui/            # UI components (button, infinite-slider, etc.)
│   ├── dynamic-menu/  # Menu-related components
│   │   ├── category-switcher.tsx  # Center-aligned category selector
│   │   ├── dish-info.tsx         # Dish information display
│   │   ├── floating-dish.tsx     # Animated dish images
│   │   ├── navigation-dots.tsx   # Scroll navigation
│   │   └── color-extractor.ts    # Color palette extraction
│   └── shared/        # Shared components
├── lib/               # Utility functions and data
│   ├── menu-data.ts   # Menu items and categories
│   └── utils.ts       # Helper functions
├── hooks/             # Custom React hooks
├── public/            # Static assets
│   └── dishes/        # Food images
└── types/             # TypeScript type definitions
```

## Main Features
- Dynamic menu with category switching and magnetic scroll
- Smart color extraction from food images for UI theming
- Animated UI components with smooth transitions
- Responsive design optimized for mobile and desktop
- Multi-language support (Chinese/English)
- Category switcher with center-aligned selection and fade animations
- Fullscreen scroll-based dish navigation
- Real-time background gradients based on dish colors

## Recent Implementations
- **Category Switcher**: Horizontal scrollable selector with magnetic snap-to-center
- **Smart Color Extraction**: Dynamic theming based on food images
- **Fade Animations**: Category names that appear during scroll and fade after selection
- **Performance Optimizations**: Scroll throttling and conditional rendering (can be toggled)

## Known Dependencies
- Duplicate `motion` package (intentionally kept for compatibility)
- Complex scroll physics for smooth dish transitions
- Real-time color extraction for immersive experience