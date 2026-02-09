import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Robust scroll-to-top helper with multiple fallbacks
function scrollToTop({ behavior = "smooth" } = {}) {
  // Primary: native smooth/instant scroll
  try {
    window.scrollTo({ top: 0, behavior });
  } catch (e) {
    // ignore
  }

  // Secondary: try scrolling documentElement and body
  const docEl = document.documentElement;
  const body = document.scrollingElement || document.body;
  if (docEl) docEl.scrollTop = 0;
  if (body) body.scrollTop = 0;

  // If smooth behavior requested, also perform an animated fallback using RAF
  if (behavior === "smooth") {
    const start = window.pageYOffset || docEl.scrollTop || body.scrollTop || 0;
    const duration = 300;
    let startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // ease-out
      const current = Math.round(start - start * ease);
      try {
        window.scrollTo(0, current);
      } catch (e) {}
      if (progress < 1) requestAnimationFrame(step);
    }

    if (start > 0) requestAnimationFrame(step);
  }

  // Final fallback after a small timeout to ensure it's at top
  setTimeout(() => {
    try {
      window.scrollTo(0, 0);
      if (docEl) docEl.scrollTop = 0;
      if (body) body.scrollTop = 0;
    } catch (e) {}
  }, 250);
}

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll on route change
    scrollToTop({ behavior: "smooth" });

    // Also ensure scroll on hashchange (anchors)
    const onHash = () => scrollToTop({ behavior: "smooth" });
    window.addEventListener("hashchange", onHash, { passive: true });

    return () => {
      window.removeEventListener("hashchange", onHash);
    };
  }, [pathname]);

  return null;
};

export default ScrollToTop;
