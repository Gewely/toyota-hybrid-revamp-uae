# Unused Files Analysis

## Methodology

Files were analyzed using:
1. **Static analysis** - grep/ripgrep for import statements
2. **TypeScript compilation** - unused export detection
3. **Manual verification** - checking for dynamic imports, side effects, and runtime usage

## Files Analyzed

### Status: No files removed yet

This project will undergo unused file detection using:
```bash
npx ts-prune
npx depcheck
```

## Files Flagged for Review (Pending)

The following will be checked in the next audit phase:

### 1. Duplicate/Similar Functionality
- `src/hooks/use-swipeable.tsx` vs `src/hooks/use-touch-gestures.tsx`
  - **Status**: Need to consolidate
  - **Reason**: Both handle touch gestures, should unify

### 2. Potentially Unused Utilities
- `src/utils/performance-enhancements.ts`
  - **Status**: Verify usage
  - **Reason**: May be superseded by newer performance hooks

### 3. Deprecated Components
- Check for old modal implementations if they've been replaced by new ones

## Safe to Remove (None identified yet)

No files have been confirmed as safe to remove without verification.

## Cannot Remove (Critical Files)

The following files appear unused but are critical:

### 1. Entry Points
- `src/main.tsx` - Application entry point
- `index.html` - HTML entry point

### 2. Configuration
- `vite.config.ts` - Build configuration
- `tailwind.config.ts` - Styling configuration
- `tsconfig.json` - TypeScript configuration

### 3. Type Definitions
- `src/vite-env.d.ts` - Vite environment types
- `src/types/*.ts` - Type definitions (may not have direct imports)

### 4. CSS/Styles
- `src/index.css` - Global styles
- `src/App.css` - App-specific styles

### 5. Public Assets
- `public/**/*` - Static assets referenced in HTML/CSS

### 6. Service Worker
- `public/sw.js` - PWA service worker

## Next Steps

1. **Run automated detection**:
   ```bash
   npx ts-prune > audit/ts-prune-output.txt
   npx depcheck > audit/depcheck-output.txt
   ```

2. **Manual verification**:
   - Check each flagged file for:
     - Dynamic imports (`import()`)
     - Side effects (executed on import)
     - Referenced in HTML/CSS
     - Used in build process
     - Part of public API

3. **Archive before deletion**:
   - Move to `/archive` directory with date and reason
   - Document in git commit message

4. **Test after removal**:
   - Full build succeeds
   - All routes work
   - No runtime errors
   - Visual regression test passes

## Verification Checklist

Before removing any file:
- [ ] Not imported anywhere (static analysis)
- [ ] Not dynamically imported
- [ ] Not referenced in HTML/CSS
- [ ] Not used in build scripts
- [ ] Not part of public API
- [ ] Full test suite passes
- [ ] Visual regression test passes
- [ ] Lighthouse scores maintained

## Archive Format

When archiving files:
```
/archive/
  2025-10-15_unused-modals/
    README.md  (explains why removed)
    OldModal.tsx
    OldModal.test.tsx
```

## Notes

- **Dynamic imports**: Special attention needed for routes, lazy components
- **Side effects**: Some files may be imported for side effects only
- **Public API**: Files may be unused internally but part of published API
- **Test files**: Keep even if code is removed (for regression)

## Summary

- **Files analyzed**: 0 (pending automated scan)
- **Files flagged**: TBD
- **Files removed**: 0
- **Files archived**: 0
- **Build size reduction**: 0KB

---

**Last updated**: 2025-10-15
**Next review**: After ts-prune/depcheck completion
