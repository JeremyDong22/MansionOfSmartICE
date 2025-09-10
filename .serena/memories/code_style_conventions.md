# Code Style and Conventions

## TypeScript Configuration
- **Strict Mode**: Enabled (`"strict": true`)
- **Target**: ES2017
- **Module Resolution**: Bundler
- **JSX**: Preserve
- **Path Alias**: `@/*` maps to root directory

## Naming Conventions
- **Components**: PascalCase (e.g., `CategorySwitcher`, `NavigationHeader`)
- **Files**: kebab-case for components (e.g., `category-switcher.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useScrollPosition`)
- **Types/Interfaces**: PascalCase with descriptive names (e.g., `DishCategory`)
- **Constants**: UPPER_SNAKE_CASE or camelCase for objects

## File Organization
- Each component gets its own file
- Related components grouped in directories
- Type definitions in separate `types/` directory or inline
- Utility functions in `lib/` directory

## Component Structure
```typescript
// Comment describing component purpose
'use client';  // For client components

import statements  // External imports first, then internal

interface ComponentProps {
  // Props definition
}

export function ComponentName({ props }: ComponentProps) {
  // Hooks first
  // State and refs
  // Effects
  // Handler functions
  // Return JSX
}
```

## Styling
- Tailwind CSS classes for styling
- Use `cn()` utility for conditional classes
- Responsive design with Tailwind breakpoints
- Animation with Framer Motion

## Best Practices
- Use functional components with hooks
- Proper TypeScript typing (avoid `any`)
- Comments at top of files describing purpose
- Extract reusable logic into custom hooks
- Keep components focused and single-purpose

## ESLint Rules
- Next.js Core Web Vitals rules
- TypeScript ESLint rules
- Auto-fixable issues should be fixed before commit