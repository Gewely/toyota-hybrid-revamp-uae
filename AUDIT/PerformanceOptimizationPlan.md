# Performance Optimization Plan
**Date:** 2025-10-03  
**Focus:** Long Animation Frames (50-260ms)

---

## Problem Statement

Console logs show consistent long animation frames exceeding 50ms threshold:
- **Worst:** 261ms frame
- **Frequent:** 147-222ms frames
- **Threshold:** 50ms for smooth 60fps experience

**Impact:**
- Janky scrolling
- Delayed interactions
- Poor user experience on mid-range devices
- Especially bad on mobile iOS

---

## Root Cause Analysis

### 1. ResizeObserver + VisualViewport Overhead
**File:** `MobileStickyNav.tsx:348-378`

```tsx
useEffect(() => {
  const updateNavHeight = () => {
    const h = navRef.current?.getBoundingClientRect().height;
    if (h) {
      document.documentElement.style.setProperty("--mobile-nav-height", `${Math.round(h)}px`);
    }
  };

  // Multiple listeners without throttling
  let resizeObserver = new ResizeObserver(() => updateNavHeight());
  window.addEventListener("resize", updateNavHeight);
  window.addEventListener("orientationchange", updateNavHeight);
  vv?.addEventListener("resize", updateNavHeight);
  vv?.addEventListener("scroll", updateNavHeight);
  // ...
}, [deviceInfo, isGR, isScrolled, navigationState]);
```

**Issues:**
- Multiple event listeners firing simultaneously
- No throttling on resize/scroll events  
- `getBoundingClientRect()` forces layout recalculation
- Runs on every dependency change (frequent re-mounts)

**Fix Strategy:**
1. Throttle `updateNavHeight` to max 1 call per 16ms (RAF)
2. Reduce dependencies - remove `isScrolled`, `navigationState` from deps
3. Use `requestAnimationFrame` for batched updates

### 2. Attract Animation Loop
**File:** `MobileStickyNav.tsx:421-482`

```tsx
useEffect(() => {
  // Idle timer + cycle interval
  let idleTimer: number | null = null;
  let cycleTimer: number | null = null;
  
  const kickOff = () => {
    setAttractOn(true);
    setAttractCycles(1);
    cycleTimer = window.setInterval(() => {
      setAttractCycles((c) => {
        const next = c + 1;
        if (next >= 3) {
          setAttractOn(false);
        } else {
          setAttractOn(false);
          requestAnimationFrame(() => setAttractOn(true)); // Double RAF!
        }
        return next;
      });
    }, 4000);
  };
  // ...
}, [dependencies]);
```

**Issues:**
- Multiple `setInterval` running simultaneously
- Double `requestAnimationFrame` in cycle
- State updates causing re-renders of entire nav

**Fix Strategy:**
1. Move attract logic to separate hook
2. Use single RAF loop instead of setInterval
3. Memoize attract state to prevent cascading re-renders

### 3. Unmemoized Event Handlers
**File:** `MobileStickyNav.tsx:500-600+`

Multiple handlers defined inline without `useCallback`:
- `handleSectionToggle`
- `handleCategoryClick`
- `toggleMenu`
- `handleShare`
- `handleBrochureDownload`

**Issue:** New function instances on every render → child re-renders

**Fix Strategy:**
1. Wrap all handlers in `useCallback`
2. Memoize dependencies properly
3. Use `React.memo` on `NavItem` component

### 4. Heavy Carousel Rendering
**File:** Multiple carousel components in menu

```tsx
<Carousel opts={{ align: "start" }}>
  <CarouselContent>
    {filteredVehicles.map((v) => (
      <CarouselItem key={v.name}>
        {/* Heavy cards with images */}
      </CarouselItem>
    ))}
  </CarouselContent>
</Carousel>
```

**Issues:**
- All vehicles rendered even if not visible
- No virtualization
- No lazy loading of images in carousel
- `filteredVehicles` recalculated on every render

**Fix Strategy:**
1. Add `useMemo` for `filteredVehicles`
2. Implement image lazy loading with IntersectionObserver
3. Consider virtual scrolling for long lists

### 5. Framer Motion Overhead
**Global Issue**

Many components use motion without checking `prefers-reduced-motion`:

```tsx
<motion.div
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
>
```

**Issues:**
- Animations run even when user prefers reduced motion
- `whileHover` causes layout recalculations on every mousemove
- Multiple motion components in nested hierarchy

**Fix Strategy:**
1. Conditionally disable animations based on `useReducedMotionSafe`
2. Replace simple motion.div with CSS transitions where possible
3. Use `layoutId` for shared element transitions instead of separate animations

---

## Optimization Priorities

### Priority 1: MobileStickyNav (Biggest Impact)
- [ ] Throttle ResizeObserver + event listeners
- [ ] Remove unnecessary effect dependencies
- [ ] Memoize all event handlers with useCallback
- [ ] Move attract animation to separate hook
- [ ] Add React.memo to NavItem

### Priority 2: Carousel Optimization
- [ ] Memoize filteredVehicles, searchResults, filteredPreOwnedVehicles
- [ ] Add lazy loading to carousel images
- [ ] Implement intersection observer for viewport detection

### Priority 3: Global Animation Respect
- [ ] Audit all framer-motion usage
- [ ] Conditionally disable based on prefers-reduced-motion
- [ ] Replace simple animations with CSS where possible

### Priority 4: Component Memoization
- [ ] Add React.memo to heavy components:
  - NavItem
  - ShowroomCard
  - VehicleCard
  - FeatureCard

---

## Implementation Plan

### Step 1: Fix MobileStickyNav (Highest ROI)
**File:** `src/components/MobileStickyNav.tsx`

```tsx
// Throttled nav height update
const updateNavHeightThrottled = useCallback(() => {
  if (rafId.current) return;
  rafId.current = requestAnimationFrame(() => {
    const h = navRef.current?.getBoundingClientRect().height;
    if (h) {
      document.documentElement.style.setProperty("--mobile-nav-height", `${Math.round(h)}px`);
    }
    rafId.current = null;
  });
}, []);

// Minimal dependencies
useEffect(() => {
  const ro = new ResizeObserver(updateNavHeightThrottled);
  if (navRef.current) ro.observe(navRef.current);
  
  window.addEventListener("resize", updateNavHeightThrottled, { passive: true });
  
  return () => {
    ro.disconnect();
    window.removeEventListener("resize", updateNavHeightThrottled);
    if (rafId.current) cancelAnimationFrame(rafId.current);
  };
}, []); // Empty deps!
```

### Step 2: Memoize Handlers
```tsx
const handleSectionToggle = useCallback((section: string) => {
  contextualHaptic.stepProgress();
  if (navigationState.activeSection === section) {
    navigationState.resetNavigation();
  } else {
    navigationState.setActiveSection(section);
  }
}, [navigationState]);

// ... repeat for all handlers
```

### Step 3: Memoize NavItem
```tsx
const NavItem = React.memo<NavItemProps>(({ icon, label, ... }) => {
  // ... component logic
});
```

### Step 4: Memoize Filtered Data
```tsx
const filteredVehicles = useMemo(
  () => vehicles
    .filter((v) => selectedCategory === "all" || v.category.toLowerCase() === selectedCategory)
    .slice(0, 12),
  [selectedCategory]
);
```

---

## Expected Impact

| Optimization | Expected Frame Reduction | Confidence |
|--------------|-------------------------|------------|
| Throttle ResizeObserver | -30 to -50ms | High |
| Memoize handlers | -10 to -20ms | High |
| Memoize NavItem | -15 to -25ms | Medium |
| Carousel lazy loading | -20 to -40ms | High |
| Reduce motion animations | -10 to -20ms | Medium |

**Total Expected:** 85-155ms reduction  
**Target:** Bring 260ms frames down to <50ms ✅

---

## Testing Protocol

1. **Before:** Profile with React DevTools Profiler
2. **Implement:** Make changes in isolated commits
3. **After:** Re-profile and compare
4. **Validate:** Check console for long animation frames
5. **Device Test:** Test on real iOS device

---

## Monitoring

Add performance tracking:

```tsx
// In MobileStickyNav
useEffect(() => {
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.duration > 50) {
        console.warn('Long frame:', entry.duration, entry);
      }
    }
  });
  observer.observe({ entryTypes: ['long-animation-frame'] });
  return () => observer.disconnect();
}, []);
```

---

## Next Actions

1. ✅ Create optimization plan
2. 🔄 Implement Step 1: Fix MobileStickyNav
3. ⏳ Test and measure impact
4. ⏳ Proceed to Steps 2-4 based on results
