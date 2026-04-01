---
name: core-web-vitals
description: Optimize Core Web Vitals (LCP, CLS, INP). Use when asked to "improve performance", "fix LCP", "Core Web Vitals", "Largest Contentful Paint", "Cumulative Layout Shift", or "Interaction to Next Paint".
license: MIT
metadata:
  author: web-quality-skills
  version: "1.0"
---

# Core Web Vitals

Core Web Vitals are Google's metrics for measuring real-world user experience. Focus on LCP, CLS, and INP (replaced FID in 2024).

## The Three Metrics

| Metric | Measures | Good | Needs Work | Poor |
|--------|----------|------|------------|------|
| **LCP** | Load performance | ≤2.5s | 2.5-4s | >4s |
| **CLS** | Visual stability | ≤0.1 | 0.1-0.25 | >0.25 |
| **INP** | Interactivity | ≤200ms | 200-500ms | >500ms |

---

## LCP - Largest Contentful Paint

**What:** How quickly the main content loads.

### Common Causes of Poor LCP

1. Slow server response times
2. Render-blocking JavaScript and CSS
3. Large images not optimized
4. Client-side rendering with heavy JS

### Optimization Checklist

```bash
# Lighthouse audit
npx lighthouse https://example.com --only-categories=performance

# Check in DevTools
# Performance tab > Timings > LCP
```

### Image Optimization

```html
<!-- ❌ No preload, no sizes -->
<img src="hero.jpg" alt="Hero">

<!-- ✅ Preload, responsive, modern format -->
<link rel="preload" as="image" href="hero.webp" imagesrcset="hero-400.webp 400w, hero-800.webp 800w" imagesizes="100vw">
<img src="hero-800.webp" srcset="hero-400.webp 400w, hero-800.webp 800w" sizes="100vw" alt="Hero" fetchpriority="high">

<!-- ❌ For hero images: lazy load delays LCP -->
<img src="hero.jpg" loading="lazy" alt="Hero">

<!-- ✅ Hero images: eager load -->
<img src="hero.webp" loading="eager" fetchpriority="high" alt="Hero">
```

### Font Optimization

```html
<!-- ❌ Blocks render -->
<link rel="stylesheet" href="fonts.css">
<style>
  body { font-family: 'CustomFont', sans-serif; }
</style>

<!-- ✅ Preload critical fonts -->
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>
<style>
  @font-face {
    font-family: 'CustomFont';
    src: url('font.woff2') format('woff2');
    font-display: swap;
  }
</style>
```

### Server Response (TTFB)

```typescript
// Cache responses at CDN edge
export async function GET(request: Request) {
  return new Response(jsonData, {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      'Content-Type': 'application/json',
    }
  })
}
```

---

## CLS - Cumulative Layout Shift

**What:** How much the page layout shifts unexpectedly.

### Common Causes of CLS

1. Images without dimensions
2. Dynamic content injected above existing content
3. Web Fonts causing FOIT/FOUT
4. Ads and embeds without reserved space

### Prevention Techniques

```html
<!-- ❌ No dimensions = layout shift -->
<img src="thumbnail.jpg" alt="Thumbnail">

<!-- ✅ Explicit dimensions prevent layout shift -->
<img src="thumbnail.webp" width="400" height="300" alt="Thumbnail">

<!-- ✅ CSS aspect-ratio as fallback -->
<style>
  .thumbnail {
    width: 100%;
    aspect-ratio: 4/3;
    background: #f0f0f0; /* Placeholder color */
  }
</style>
<img src="thumbnail.webp" class="thumbnail" alt="Thumbnail">
```

### Reserved Space for Dynamic Content

```css
/* ❌ Ad pushes content down */
.ad-container {
  /* No height specified */
}

/* ✅ Reserve space to prevent shift */
.ad-container {
  min-height: 250px;
  contain: layout;
}
```

### Skeleton Loading

```css
/* ✅ Skeleton prevents layout shift by reserving space */
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  min-height: 100px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

### Font Display

```css
/* ✅ Prevent FOUT (Flash of Unstyled Text) */
@font-face {
  font-family: 'CustomFont';
  src: url('font.woff2') format('woff2');
  font-display: swap; /* Shows fallback until custom font loads */
}

/* ✅ Or use optional for non-critical fonts */
@font-face {
  font-family: 'DecorativeFont';
  src: url('font.woff2') format('woff2');
  font-display: optional; /* Never shows custom font if it would cause delay */
}
```

---

## INP - Interaction to Next Paint

**What:** How responsive the page is to user interactions (replaced FID in March 2024).

### What INP Measures

INP is the worst interaction latency during a page visit, considering:
- Click/tap
- Keyboard input
- Pointer (hover, drag)

### Long Task Prevention

```typescript
// ❌ Blocking the main thread
function handleClick() {
  heavyComputation(); // Blocks for 500ms
  updateUI();
}

// ✅ Yield to main thread
async function handleClick() {
  updateUI(); // Immediate feedback
  
  // Defer heavy work
  await scheduler.yield(); // Or requestIdleCallback
  heavyComputation();
}
```

### Non-Blocking Updates

```typescript
// ❌ Sync work delays paint
function handleSearch(query: string) {
  const results = expensiveSearch(query); // Blocks
  setResults(results);
}

// ✅ Update UI immediately, results later
function handleSearch(query: string) {
  setQuery(query); // Instant
  
  // Non-blocking search
  requestIdleCallback(() => {
    const results = expensiveSearch(query);
    setResults(results);
  });
}
```

### CSS Containment

```css
/* ❌ Changes propagate to entire layout */
.widget {
  padding: 10px;
}

/* ✅ Isolate widget layout */
.widget {
  contain: layout style paint;
}
```

---

## Measurement Tools

### Field Data (Real Users)

```bash
# Chrome UX Report (CrUX)
# https://pagespeed.web.dev/
# Google Search Console Core Web Vitals report

# PageSpeed Insights API
curl "https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://example.com&strategy=mobile&category=performance"
```

### Lab Data (Simulated)

```bash
# Lighthouse
npx lighthouse https://example.com --preset=desktop

# WebPageTest
# https://webpagetest.org/easy

# Chrome DevTools
# Performance tab > record > interact > analyze
```

### Real User Monitoring (RUM)

```typescript
// Use web-vitals library
import { onLCP, onCLS, onINP } from 'web-vitals';

function sendToAnalytics({ name, value, id }) {
  // Send to your analytics endpoint
  fetch('/api/vitals', {
    method: 'POST',
    body: JSON.stringify({ name, value, id }),
    keepalive: true, // Ensures send even on page unload
  });
}

onLCP(sendToAnalytics);
onCLS(sendToAnalytics);
onINP(sendToAnalytics);
```

---

## Quick Wins by Priority

### High Impact (Do First)

- [ ] Preload hero image with `fetchpriority="high"`
- [ ] Add `width` and `height` to all images
- [ ] Add `font-display: swap` to @font-face
- [ ] Set `contain: layout` on dynamic containers

### Medium Impact

- [ ] Implement skeleton loading states
- [ ] Defer non-critical JavaScript
- [ ] Use modern image formats (WebP, AVIF)
- [ ] Add `rel="preconnect"` for third-party origins

### Low Impact (Polish)

- [ ] Set up real user monitoring
- [ ] Add CSS `content-visibility: auto`
- [ ] Optimize critical CSS path
- [ ] Use Brotli compression

---

## References

- [web.dev Core Web Vitals](https://web.dev/vitals/)
- [Google Web Vitals](https://web.dev/articles/vitals)
- [Lighthouse Performance Audit](https://developer.chrome.com/docs/lighthouse/performance/)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [web-vitals library](https://github.com/GoogleChrome/web-vitals)
