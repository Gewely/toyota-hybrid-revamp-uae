# Test Matrix & Verification Plan

## Device Testing Matrix

### Mobile Devices (Primary Focus)

| Device | Viewport | OS | Browser | Priority | Test Scenarios |
|--------|----------|-----|---------|----------|----------------|
| **iPhone 12** | 390x844 | iOS 16+ | Safari | **Critical** | Sticky nav, browser chrome, safe-area, swipe |
| **iPhone 15 Pro** | 393x852 | iOS 17+ | Safari | **Critical** | Dynamic Island, visualViewport, notch handling |
| **iPhone SE (3rd)** | 375x667 | iOS 15+ | Safari | High | Small screen, 320px layouts, compact UI |
| **Pixel 7** | 412x915 | Android 13+ | Chrome | **Critical** | Android gestures, scroll behavior |
| **Samsung S22** | 360x800 | Android 12+ | Chrome/Samsung | High | Small viewport (360px), touch targets |
| **iPad Air** | 820x1180 | iPadOS 16+ | Safari | Medium | Tablet layout, orientation changes |
| **Xiaomi Redmi** | 393x851 | Android 11+ | Chrome | Medium | Budget device performance |

### Desktop/Laptop

| Device Type | Resolution | OS | Browser | Priority | Test Scenarios |
|-------------|-----------|-----|---------|----------|----------------|
| **MacBook Pro 14"** | 1512x982 | macOS | Safari | High | Retina display, trackpad gestures |
| **Standard Laptop** | 1440x900 | Windows/macOS | Chrome | **Critical** | Most common resolution |
| **Standard Laptop** | 1920x1080 | Windows | Edge | High | Full HD, Windows specific |
| **4K Monitor** | 3840x2160 | macOS/Windows | Chrome/Safari | Medium | High-res scaling, image quality |

### Edge Cases

| Scenario | Device | Expected Behavior |
|----------|--------|-------------------|
| **Landscape Rotation** | iPhone 12 | Nav repositions, safe-area updates |
| **Browser Chrome Toggle** | iPhone 15 Pro Safari | Nav stays above browser controls |
| **Split Screen** | iPad | Adapts to reduced viewport |
| **Zoom 200%** | All devices | Text readable, no overflow |
| **Reduced Motion** | All devices | Animations disabled/simplified |

---

## Test Scenarios (Checklist)

### 1. Mobile Sticky Navigation ✅

#### iOS Safari
- [ ] Sticky nav visible on page load
- [ ] Nav stays at bottom when scrolling
- [ ] Nav doesn't overlap content
- [ ] Nav repositions when browser controls appear/disappear
- [ ] Safe-area-inset respected (notch devices)
- [ ] Actions drawer opens above nav (not behind)
- [ ] Modal overlays render above nav
- [ ] z-index stacking correct (backdrop → nav → drawer → modal)

#### Android Chrome
- [ ] Sticky nav visible on page load
- [ ] No jank during scroll
- [ ] Swipe gestures don't conflict with browser back gesture
- [ ] Touch targets minimum 44px
- [ ] No accidental taps

### 2. Visual Viewport & Browser Chrome 🔄

**Test on iOS Safari**:
- [ ] Load page with browser chrome visible
- [ ] Scroll down → browser chrome hides → nav stays visible
- [ ] Scroll up → browser chrome appears → nav repositions correctly
- [ ] No white space gap between nav and bottom
- [ ] CSS variable `--viewport-height` updates correctly
- [ ] CSS variable `--mobile-nav-height` calculates correctly

**Manual Test Steps**:
1. Open DevTools → inspect element on sticky nav
2. Check computed styles for `bottom` value
3. Scroll slowly and verify smooth repositioning
4. Check for layout shift (CLS)

### 3. Scroll Performance 🔄

**Metrics to Monitor**:
- [ ] No long animation frames (>50ms) during scroll
- [ ] 60fps maintained
- [ ] No layout thrash (read/write cycles)
- [ ] Passive listeners working
- [ ] RAF throttling active

**Tools**:
- Chrome DevTools Performance tab
- `window.addEventListener('scroll', ...)` should show `{passive: true}`

**Test Procedure**:
1. Open Performance tab
2. Start recording
3. Scroll aggressively for 5 seconds
4. Stop recording
5. Check for:
   - Long tasks >50ms (should be <5)
   - Dropped frames (should be <1%)
   - Scripting time (should be <20% of frame time)

### 4. Touch Gestures & Swipe 🔄

**Carousel Swipe**:
- [ ] Swipe left → next slide
- [ ] Swipe right → previous slide
- [ ] Vertical scroll not hijacked during horizontal swipe
- [ ] Momentum scroll feels natural
- [ ] No bounce-back at edges
- [ ] Works with both touch and pointer events

**Conflict Resolution**:
- [ ] Horizontal swipe doesn't trigger vertical scroll
- [ ] Vertical scroll doesn't trigger horizontal swipe
- [ ] Angle threshold working (30° minimum)

### 5. Modal Stacking Context 🔄

**Test Flow**:
1. [ ] Open vehicle details page
2. [ ] Mobile sticky nav visible at bottom
3. [ ] Click "Actions" button → drawer opens above nav
4. [ ] Click "Configure" → modal opens above drawer
5. [ ] Verify stacking: content → backdrop → nav → drawer → modal
6. [ ] Close modal → drawer still visible
7. [ ] Close drawer → nav still visible

**z-index Values** (from `src/lib/z-index.ts`):
```
backdrop: 900
stickyNav: 80
drawer: 950
modal: 1000
```

### 6. Responsive Breakpoints 🔄

| Breakpoint | Width | Test | Expected |
|-----------|-------|------|----------|
| **xs** | 320px | Ultra-small phones | No horizontal scroll, readable text |
| **sm-mobile** | 375px | iPhone SE | Touch targets ≥44px, no overlap |
| **mobile** | 414px | Standard mobile | Optimal layout |
| **lg-mobile** | 430px | Large phones | Comfortable spacing |
| **tablet** | 768px | iPad | Desktop or adapted mobile nav |
| **desktop** | 1440px | Laptop | Desktop layout, action panel visible |
| **4K** | 3840px | Large monitor | Proper scaling, crisp images |

### 7. Safe-Area Utilities 🔄

**Test on iPhone X or newer**:
- [ ] `env(safe-area-inset-top)` applied to header
- [ ] `env(safe-area-inset-bottom)` applied to sticky nav
- [ ] `env(safe-area-inset-left)` and `right` for landscape
- [ ] No content hidden behind notch
- [ ] No content hidden behind home indicator

**CSS Classes** (from tailwind.config.ts):
```css
.safe-area-inset-top
.safe-area-inset-bottom
.pt-safe-area-inset-top
.pb-safe-area-inset-bottom
```

### 8. Accessibility (A11y) 🔄

**Keyboard Navigation**:
- [ ] Tab through all interactive elements
- [ ] Focus visible at all times
- [ ] Tab order logical
- [ ] No keyboard traps
- [ ] Escape closes modals/drawers

**Screen Reader**:
- [ ] Semantic HTML (header, nav, main, footer)
- [ ] ARIA labels on icon buttons
- [ ] Modal announced when opened
- [ ] Focus moved to modal when opened
- [ ] Focus restored to trigger when closed

**Focus Management**:
- [ ] Modal: focus trapped inside
- [ ] Drawer: focus trapped inside
- [ ] Background: inert when modal/drawer open

**Color Contrast**:
- [ ] Text contrast ≥ 4.5:1 (WCAG AA)
- [ ] Icon buttons ≥ 3:1
- [ ] Focus indicators ≥ 3:1

### 9. Performance Budget 🔄

| Resource | Current | Target | Status |
|----------|---------|--------|--------|
| Total JS | TBD | <400KB | 🔄 Monitor |
| Total CSS | TBD | <50KB | 🔄 Monitor |
| Images | TBD | <2MB | 🔄 Monitor |
| Fonts | TBD | <100KB | 🔄 Monitor |
| **Total** | TBD | <3MB | 🔄 Monitor |

**Lighthouse Scores** (Mobile):
| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Performance | TBD | ≥90 | 🔄 Monitor |
| Accessibility | TBD | ≥90 | 🔄 Monitor |
| Best Practices | TBD | ≥90 | 🔄 Monitor |
| SEO | TBD | ≥90 | 🔄 Monitor |

**Core Web Vitals**:
| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| **LCP** (Largest Contentful Paint) | TBD | <2.5s | 🔄 Monitor |
| **FID** (First Input Delay) | TBD | <100ms | 🔄 Monitor |
| **CLS** (Cumulative Layout Shift) | 0.00001 | <0.1 | ✅ Good |
| **INP** (Interaction to Next Paint) | TBD | <200ms | 🔄 Monitor |

### 10. Reduced Motion 🔄

**Test**:
1. Enable reduced motion in OS settings
2. Reload page
3. Verify:
   - [ ] No scale animations
   - [ ] No rotation animations
   - [ ] Only opacity/position changes
   - [ ] Duration <0.2s
   - [ ] Transitions use `linear` easing

**Components to Test**:
- [ ] MobileStickyNav (attract animation disabled)
- [ ] Header (simplified scroll animation)
- [ ] PremiumHeroSection (reduced carousel transitions)
- [ ] Modals (fade only, no scale)

---

## Automated Testing (Playwright)

### Setup
```bash
npm install -D @playwright/test
npx playwright install
```

### Test Scripts

#### 1. Mobile Sticky Nav Test
```typescript
// tests/mobile-sticky-nav.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Mobile Sticky Navigation', () => {
  test.use({ viewport: { width: 390, height: 844 } }); // iPhone 12
  
  test('nav is visible and positioned correctly', async ({ page }) => {
    await page.goto('/vehicle/land-cruiser');
    
    const nav = page.locator('[aria-label="Bottom navigation"]');
    await expect(nav).toBeVisible();
    
    const box = await nav.boundingBox();
    const viewportHeight = page.viewportSize()!.height;
    
    // Nav should be at bottom (within 5px tolerance)
    expect(box!.y + box!.height).toBeCloseTo(viewportHeight, 5);
  });
  
  test('modals render above nav', async ({ page }) => {
    await page.goto('/vehicle/land-cruiser');
    
    // Open actions drawer
    await page.click('[aria-label="Quick actions"]');
    const drawer = page.locator('[aria-label="Vehicle quick actions"]');
    await expect(drawer).toBeVisible();
    
    // Check z-index
    const navZ = await page.locator('[aria-label="Bottom navigation"]').evaluate(
      el => window.getComputedStyle(el).zIndex
    );
    const drawerZ = await drawer.evaluate(
      el => window.getComputedStyle(el).zIndex
    );
    
    expect(parseInt(drawerZ)).toBeGreaterThan(parseInt(navZ));
  });
});
```

#### 2. Scroll Performance Test
```typescript
// tests/scroll-performance.spec.ts
import { test, expect } from '@playwright/test';

test('scroll performance is smooth', async ({ page }) => {
  await page.goto('/vehicle/land-cruiser');
  
  // Start performance profiling
  const session = await page.context().newCDPSession(page);
  await session.send('Performance.enable');
  
  // Scroll
  await page.evaluate(() => {
    window.scrollTo({ top: 1000, behavior: 'smooth' });
  });
  
  await page.waitForTimeout(2000); // Wait for scroll to complete
  
  const metrics = await session.send('Performance.getMetrics');
  const layoutDuration = metrics.metrics.find(
    m => m.name === 'LayoutDuration'
  )!.value;
  
  // Layout duration should be minimal (<100ms total)
  expect(layoutDuration).toBeLessThan(0.1);
});
```

#### 3. Visual Regression Test
```typescript
// tests/visual-regression.spec.ts
import { test } from '@playwright/test';

test('homepage looks correct on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.screenshot({ path: 'screenshots/homepage-mobile.png', fullPage: true });
});

test('vehicle details looks correct on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/vehicle/land-cruiser');
  await page.screenshot({ path: 'screenshots/vehicle-mobile.png', fullPage: true });
});
```

---

## Manual Testing Checklist

### Pre-Deployment

- [ ] Run `npm run build` → no errors
- [ ] Run `npm run type-check` → no errors
- [ ] Run `npm run lint` → no errors
- [ ] Test on 3 devices minimum (iOS, Android, Desktop)
- [ ] Lighthouse Mobile score ≥90
- [ ] No console errors
- [ ] No network errors

### Regression Testing

After each change:
- [ ] Visual inspection on mobile
- [ ] Click through critical flows
- [ ] Test on actual device (not just emulator)
- [ ] Check Performance tab in DevTools
- [ ] Verify no new warnings in console

---

## Troubleshooting Guide

### Issue: Nav hidden behind browser chrome
**Solution**: Check `useVisualViewport` hook is active, verify CSS variables

### Issue: Modal appears behind nav
**Solution**: Verify z-index tokens imported, check modal uses `Z.modal`

### Issue: Scroll jank
**Solution**: Check passive listeners, verify RAF throttling, remove layout reads in scroll handler

### Issue: Swipe not working
**Solution**: Verify touch events not prevented, check angle threshold, ensure overscroll-behavior set

### Issue: Layout shift (CLS)
**Solution**: Reserve space for images, use proper aspect-ratio, avoid dynamic content insertion

---

## Sign-Off Checklist

Before marking as complete:
- [ ] All critical scenarios tested
- [ ] All high-priority devices tested
- [ ] Lighthouse scores meet targets
- [ ] No console errors
- [ ] Visual regression tests pass
- [ ] Accessibility audit passes
- [ ] Performance budget met
- [ ] Documentation updated
- [ ] Team review complete

---

**Last Updated**: 2025-10-15
**Next Review**: After user testing
**Maintained By**: Engineering Team
