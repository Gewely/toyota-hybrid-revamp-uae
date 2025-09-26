// src/components/vehicle-details/ModernSectionNavigation.tsx
// Side menu only (no demo sections, no sticky header/footer)

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

/** Types */
type SectionItem = { id: string; label: string; description?: string };

export type ModernSectionNavigationProps = {
  sections?: SectionItem[];
  headerOffset?: number;       // reserve space for your site header; 0 = none
  accentColor?: string;
  mobileTopVh?: number;
  scrollRootSelector?: string; // for custom scroll containers if needed
};

/** Example sections (optional; pass your own via props) */
const DEFAULT_SECTIONS: SectionItem[] = [
  { id: "hero", label: "Overview" },
  { id: "virtual-showroom", label: "Experience" },
  { id: "media-showcase", label: "Gallery" },
  { id: "story-performance", label: "Performance" },
  { id: "story-safety", label: "Safety" },
  { id: "story-connected", label: "Connected" },
  { id: "story-sustainable", label: "Hybrid" },
  { id: "story-comfort", label: "Comfort" },
  { id: "story-ownership", label: "Ownership" },
  { id: "offers", label: "Offers" },
  { id: "tech-experience", label: "Technology" },
  { id: "configuration", label: "Configure" },
  { id: "preowned-similar", label: "Pre-Owned" },
  { id: "related", label: "Similar Models" },
  { id: "faq", label: "FAQs" },
];

/** Public wrapper: renders ONLY the side navigation (no content/placeholder) */
export default function ModernSectionNavigation({
  sections = DEFAULT_SECTIONS,
  headerOffset = 0,
  accentColor = "hsl(var(--neutral-800))", // Use neutral instead of red
  mobileTopVh = 35,
  scrollRootSelector,
}: ModernSectionNavigationProps) {
  return (
    <SideMenuNav
      sections={sections}
      headerOffset={headerOffset}
      accentColor={accentColor}
      mobileTopVh={mobileTopVh}
      scrollRootSelector={scrollRootSelector}
    />
  );
}

/** ========== Side Menu (self-contained) ========== */
function SideMenuNav({
  sections = DEFAULT_SECTIONS,
  headerOffset = 0,
  accentColor = "hsl(var(--neutral-800))", // Use neutral instead of red
  mobileTopVh = 35,
  scrollRootSelector,
}: ModernSectionNavigationProps) {
  const list = useMemo(() => sections.filter(s => s.id && s.label), [sections]);

  // State
  const [active, setActive] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [autoVisible, setAutoVisible] = useState(true);
  const [pinned, setPinned] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Refs
  const lastScrollTop = useRef(0);
  const clickScrolling = useRef(false);
  const portalEl = useRef<HTMLDivElement | null>(null);

  /** Styles */
  const styles = `
    .sm-surface { background:#fff; color:#111; border:1px solid rgba(0,0,0,.1); }
    .sm-shadow  { box-shadow:0 12px 28px rgba(0,0,0,.16); }
    .sm-focus:focus { outline:2px solid #6366f1; outline-offset:2px; }
    .sm-nohighlight { -webkit-tap-highlight-color: transparent; touch-action: manipulation; }

    .sm-tab {
      position: fixed; right: 0; transform: translateY(-50%);
      top: 50vh; width: 42px; height: 120px; border-top-left-radius: 10px; border-bottom-left-radius: 10px;
      display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; border-left: none;
    }
    .sm-tab.hidden { opacity: 0; transform: translateY(-50%) translateX(8px); pointer-events: none; transition: opacity .16s, transform .16s; }
    .sm-tab.visible { opacity: 1; transform: translateY(-50%) translateX(0); transition: opacity .16s, transform .16s; }
    .sm-tab-btn { display:flex; align-items:center; justify-content:center; width: 30px; height: 30px; border-radius: 8px; background: transparent; border: none; cursor: pointer; }

    .sm-drawer {
      position: fixed; top: 0; right: 0; height: 100vh; width: min(320px, 86vw); transform: translateX(100%);
      display: flex; flex-direction: column; gap: 0; transition: transform .22s ease-out; z-index: 2147483646;
    }
    .sm-drawer.open { transform: translateX(0%); }
    .sm-drawer-header { display: flex; align-items: center; gap: 8px; padding: 10px 10px 8px 12px; }
    .sm-search { width: 100%; padding: 8px 12px 8px 36px; border-radius: 10px; border: 1px solid rgba(0,0,0,.12); font-size: 14px; background: #fff; color: #111; }
    .sm-search-ico { position:absolute; left:14px; top:50%; transform:translateY(-50%); width:16px; height:16px; opacity:.6; }
    .sm-list { padding: 6px 6px 10px 6px; overflow-y: auto; }
    .sm-item { display:flex; align-items:center; gap:10px; width:100%; padding:10px; border-radius:10px; background:transparent; border:none; text-align:left; font-size:14px; cursor:pointer; }
    .sm-item:hover { background: rgba(0,0,0,.05); }
    .sm-active { font-weight: 600; background: rgba(0,0,0,.06); }
    .sm-dot { width: 6px; height: 6px; border-radius: 9999px; background: rgba(0,0,0,.45); }
    .sm-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.28); z-index: 2147483645; }

    @media (max-width: 1023px){ .sm-tab { top: calc(var(--sm-top, 35vh)); height: 100px; } }
    @media (prefers-color-scheme: dark){
      .sm-surface { background:#0b0b0b; color:#fff; border-color: rgba(255,255,255,.12); }
      .sm-search { background:#0b0b0b; color:#fff; border-color: rgba(255,255,255,.12); }
      .sm-item:hover { background: rgba(255,255,255,.08); }
      .sm-active { background: rgba(255,255,255,.12); }
      .sm-dot { background: rgba(255,255,255,.45); }
    }
  `;

  /** Init portal */
  useEffect(() => {
    setMounted(true);
    const pe = document.createElement("div");
    pe.setAttribute("data-side-nav-root", "true");
    pe.style.zIndex = "2147483647";
    document.body.appendChild(pe);
    portalEl.current = pe;

    return () => {
      if (portalEl.current) document.body.removeChild(portalEl.current);
      portalEl.current = null;
    };
  }, [scrollRootSelector]);

  /** Scrollspy */
  useEffect(() => {
    if (!list.length) return;

    const io = new IntersectionObserver(
      entries => {
        if (clickScrolling.current) return;
        let topMostIndex: number | null = null;
        let bestRatio = 0;

        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio >= bestRatio) {
            bestRatio = e.intersectionRatio;
            const idx = list.findIndex(s => s.id === (e.target as HTMLElement).id);
            if (idx !== -1) topMostIndex = idx;
          }
        }
        if (topMostIndex !== null) setActive(topMostIndex);
      },
      { root: null, rootMargin: "-20% 0px -60% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    list.forEach(s => { const el = document.getElementById(s.id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [list]);

  /** Auto-hide side tab */
  useEffect(() => {
    const getTop = () => window.scrollY || window.pageYOffset || 0;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = getTop();
        const goingDown = y > lastScrollTop.current && Math.abs(y - lastScrollTop.current) > 5;
        const goingUp   = y < lastScrollTop.current && Math.abs(y - lastScrollTop.current) > 5;
        if (!pinned) {
          if (goingDown && y > 200) setAutoVisible(false);
          else if (goingUp || y <= 120) setAutoVisible(true);
        }
        lastScrollTop.current = y;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pinned]);

  /** ESC closes drawer */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && drawerOpen) setDrawerOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  /** Smooth scroll (respects headerOffset) */
  const jumpTo = useCallback((id: string, index: number) => {
    const el = document.getElementById(id);
    if (!el) return;

    clickScrolling.current = true;

    const elementTop = el.offsetTop;
    const dest = Math.max(0, elementTop - (headerOffset ?? 0) - 20);
    window.scrollTo({ top: dest, behavior: "smooth" });

    setActive(index);
    setDrawerOpen(false);
    setTimeout(() => { clickScrolling.current = false; }, 800);
  }, [headerOffset]);

  /** Filter */
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? list.filter(s => s.label.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q)) : list;
  }, [query, list]); // <-- FIXED: depend on query, not q

  /** Icons */
  const TabIcon = ({ open }: { open: boolean }) =>
    !open ? (
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h12v2H3z"/></svg>
    ) : (
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M18.3 5.71 12 12l6.3 6.29-1.41 1.42L10.59 13.4 4.29 19.71 2.88 18.3 9.17 12 2.88 5.71 4.29 4.3l6.3 6.3 6.29-6.3z"/></svg>
    );

  /** Drawer portal */
  const drawer = mounted && portalEl.current ? createPortal(
    <>
      {drawerOpen && (
        <button className="sm-backdrop sm-nohighlight" aria-label="Close menu" onClick={() => setDrawerOpen(false)} />
      )}
      <aside className={`sm-drawer sm-surface sm-shadow ${drawerOpen ? "open" : ""}`}>
        <div className="sm-drawer-header">
          <button className="sm-tab-btn sm-nohighlight sm-focus" aria-label="Close" onClick={() => setDrawerOpen(false)}>
            <TabIcon open={true} />
          </button>
          <div style={{ fontWeight: 700, fontSize: 14 }}>Sections</div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
            <label style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12 }}>
              <input type="checkbox" checked={!pinned} onChange={() => setPinned(v => !v)} aria-label="Auto-hide while scrolling" />
              Auto-hide
            </label>
          </div>
        </div>

        <div style={{ position: "relative", padding: "0 10px 8px 10px" }}>
          <svg className="sm-search-ico" viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27a6 6 0 1 0-.71.71l.27.28v.79L20 20.5 21.5 19l-6-6zM6 10a4 4 0 1 1 8 0a4 4 0 0 1-8 0"/></svg>
          <input
            className="sm-search sm-nohighlight sm-focus"
            placeholder="Search sections…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="sm-list">
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {(query ? filtered : list).map((s) => {
              const i = list.findIndex(v => v.id === s.id);
              const isActive = i === active;
              return (
                <li key={s.id} style={{ margin: "4px" }}>
                  <button
                    className={`sm-item sm-nohighlight sm-focus ${isActive ? "sm-active" : ""}`}
                    aria-current={isActive ? "true" : undefined}
                    onClick={() => jumpTo(s.id, i)}
                  >
                    <span className="sm-dot" style={{ background: isActive ? accentColor : undefined }} />
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span>{s.label}</span>
                      {s.description && <span style={{ fontSize: 12, opacity: .7 }}>{s.description}</span>}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>
    </>,
    portalEl.current
  ) : null;

  useEffect(() => setMounted(true), []);

  return (
    <>
      <style>{styles}</style>
      <style>{`:root { --sm-top: ${mobileTopVh}vh; }`}</style>

      <div
        className={`sm-tab sm-surface sm-shadow sm-nohighlight ${(pinned || autoVisible) ? "visible" : "hidden"}`}
        style={{ borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }}
        role="navigation"
        aria-label="Open sections menu"
      >
        <button
          className="sm-tab-btn sm-focus"
          aria-label={drawerOpen ? "Close sections" : "Open sections"}
          onClick={() => setDrawerOpen(v => !v)}
        >
          <TabIcon open={drawerOpen} />
        </button>
        <button
          className="sm-tab-btn sm-focus"
          aria-label={pinned ? "Hide while scrolling (enable auto-hide)" : "Keep visible (disable auto-hide)"}
          title={pinned ? "Disable auto-hide" : "Enable auto-hide"}
          onClick={() => setPinned(v => !v)}
        >
          {pinned ? (
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 6c5.25 0 9 6 9 6s-3.75 6-9 6-9-6-9-6 3.75-6 9-6m0 2a4 4 0 1 0 .001 8.001A4 4 0 0 0 12 8m0 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z"/></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="m2 4.27 1.28-1.27 18 18L20 22.27l-2.57-2.57A11.4 11.4 0 0 1 12 20c-5.25 0-9-6-9-6a20.9 20.9 0 0 1 4.23-4.73L2 4.27Zm6.73 6.73 1.5 1.5a2 2 0 0 0 2.97 2.97l1.5 1.5a4 4 0 0 1-5.97-5.97ZM12 6c1.39 0 2.68.36 3.87.98l-1.5 1.5A6 6 0 0 0 7.48 15.4l-1.49 1.49C3.9 15.92 3 14 3 14s3.75-6 9-6Z"/></svg>
          )}
        </button>
      </div>

      {drawer}
    </>
  );
}
