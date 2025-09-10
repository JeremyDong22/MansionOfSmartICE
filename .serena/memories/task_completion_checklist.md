# Task Completion Checklist

## When a Task is Completed

### 1. Code Quality Checks
- [ ] Run linting: `npm run lint`
- [ ] Fix any linting errors that appear
- [ ] Ensure no TypeScript errors (check IDE/editor for red underlines)

### 2. Testing Requirements
- [ ] Test the feature using Playwright MCP or Puppeteer MCP
- [ ] Navigate to http://localhost:3000 and verify changes work
- [ ] Test on different screen sizes (responsive design)
- [ ] Verify no console errors in browser DevTools
- [ ] If tests fail, adjust and test again until successful

### 3. Code Review
- [ ] Ensure code follows project conventions
- [ ] Add comments at top of new files describing changes
- [ ] Remove any test files that are no longer needed
- [ ] Clean up any debugging console.log statements
- [ ] Verify no hardcoded values that should be configurable

### 4. Build Verification
- [ ] Run `npm run build` to ensure production build works
- [ ] Address any build warnings or errors

### 5. Documentation
- [ ] Update comments if logic changed significantly
- [ ] Do NOT create markdown files unless explicitly requested
- [ ] Keep codebase clean - remove unused files

### 6. Git (Only if explicitly requested)
- [ ] Stage changes: `git add .`
- [ ] Commit with descriptive message
- [ ] Do NOT create new branches unless explicitly told

### 7. Final Instructions
- [ ] Provide clear instructions on how to use/start the project
- [ ] Include any specific commands needed to see the changes

## Important Reminders
- Always test with Playwright/Puppeteer MCP after implementation
- Keep the codebase clean - delete test files after testing
- Use descriptive, business-feature-based naming (not abbreviations)
- Follow existing patterns in the codebase