---
name: web-quality-audit
description: Comprehensive web quality audit covering performance, accessibility, SEO, and best practices. Use when asked to "audit", "quality check", "web audit", "lighthouse", or performing a full site review.
license: MIT
metadata:
  author: web-quality-skills
  version: "1.0"
---

# Web Quality Audit

Comprehensive audit framework for evaluating web application quality across performance, accessibility, SEO, and best practices.

## Audit Categories

| Category | Tools | Priority |
|----------|-------|----------|
| Performance | Lighthouse, WebPageTest, web-vitals | CRITICAL |
| Accessibility | axe, Lighthouse, manual testing | CRITICAL |
| SEO | Lighthouse SEO, Screaming Frog | HIGH |
| Best Practices | Lighthouse, security headers | HIGH |

---

## Performance Audit

### Automated Testing

```bash
# Lighthouse CLI
npx lighthouse https://example.com \
  --output=html \
  --output-path=./lighthouse-report.html \
  --preset=desktop

# With specific categories
npx lighthouse https://example.com \
  --only-categories=performance \
  --only-categories=accessibility
```

### Performance Metrics to Check

| Metric | Target | Tool |
|--------|--------|------|
| LCP | <2.5s | Lighthouse, web-vitals |
| CLS | <0.1 | Lighthouse, web-vitals |
| INP | <200ms | web-vitals |
| TTFB | <600ms | WebPageTest |
| TTI | <3.8s | Lighthouse |

### Manual Performance Testing

1. **Simulate throttled conditions**
   - DevTools > Performance tab
   - CPU: 4x slowdown
   - Network: Slow 3G

2. **Check render-blocking resources**
   - DevTools > Network > Waterfall
   - Look for long pink bars (blocking time)

3. **Analyze JavaScript execution**
   - DevTools > Performance > JS Profile
   - Identify long tasks (>50ms)

---

## Accessibility Audit

### Automated Testing

```bash
# axe-core CLI
npm install -g @axe-core/cli
axe https://example.com

# Lighthouse accessibility
npx lighthouse https://example.com --only-categories=accessibility
```

### Manual Accessibility Checklist

- [ ] **Keyboard navigation**: Tab through entire page
- [ ] **Focus visible**: Can see where focus is
- [ ] **Screen reader**: Test with VoiceOver/NVDA
- [ ] **Color contrast**: Use browser extension or DevTools
- [ ] **Zoom**: Test at 200% zoom
- [ ] **Reduced motion**: Test with `prefers-reduced-motion: reduce`

### WCAG Checklist by Level

**Level A (Minimum)**
- [ ] All images have alt text
- [ ] Form inputs have labels
- [ ] Links have discernible text
- [ ] Pages have titles
- [ ] Language is declared

**Level AA (Standard)**
- [ ] Color contrast 4.5:1 (text), 3:1 (UI)
- [ ] Focus visible
- [ ] Navigation has skip link
- [ ] Headings are nested correctly
- [ ] Errors are identified and described

---

## SEO Audit

### Technical SEO Checklist

```bash
# Screaming Frog for comprehensive crawl
screamingfrogseo --crawl https://example.com --headless
```

### On-Page SEO

- [ ] Title tag: 50-60 chars, unique, includes keyword
- [ ] Meta description: 150-160 chars, unique
- [ ] H1: One per page, includes target keyword
- [ ] Heading structure: Logical H1 > H2 > H3 hierarchy
- [ ] Images: Alt text, compressed, modern format
- [ ] Internal linking: Descriptive anchor text

### Technical Requirements

- [ ] robots.txt allows crawling important pages
- [ ] Sitemap.xml exists and is updated
- [ ] Canonical URLs set correctly
- [ ] HTTPS enabled
- [ ] Structured data implemented (JSON-LD)
- [ ] No duplicate content issues

### Structured Data Testing

```bash
# Google Rich Results Test
# https://search.google.com/test/rich-results

# Schema.org Validator
# https://validator.schema.org/
```

---

## Security Best Practices

### Security Headers

| Header | Purpose | Recommended Value |
|--------|---------|-------------------|
| Content-Security-Policy | XSS protection | `default-src 'self'` |
| X-Frame-Options | Clickjacking prevention | `DENY` or `SAMEORIGIN` |
| X-Content-Type-Options | MIME sniffing prevention | `nosniff` |
| Strict-Transport-Security | Force HTTPS | `max-age=31536000` |
| Referrer-Policy | Control referrer info | `strict-origin-when-cross-origin` |

### Implementation

```typescript
// Express/Hono middleware
app.use((ctx, next) => {
  ctx.res.setHeader('X-Frame-Options', 'DENY')
  ctx.res.setHeader('X-Content-Type-Options', 'nosniff')
  ctx.res.setHeader('X-XSS-Protection', '1; mode=block')
  ctx.res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  return next()
})
```

### Common Vulnerabilities to Check

- [ ] No sensitive data in URL parameters
- [ ] Input validation on all forms
- [ ] SQL injection prevention
- [ ] XSS prevention (CSP, output encoding)
- [ ] CSRF tokens on state-changing requests
- [ ] Secure cookie settings (`httpOnly`, `secure`, `sameSite`)

---

## Progressive Web App (PWA) Checklist

### Required for Installability

- [ ] HTTPS enabled
- [ ] Web App Manifest exists
- [ ] Service Worker registered
- [ ] Icons: 192x192 and 512x512 PNG

### Recommended PWA Features

- [ ] Offline page
- [ ] Install prompt
- [ ] Push notifications (if appropriate)
- [ ] Background sync (if appropriate)

### Manifest Example

```json
{
  "name": "My App",
  "short_name": "App",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    { "src": "/icons/192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

---

## Best Practices Audit

### Code Quality

- [ ] No `console.log` statements in production
- [ ] No commented-out code
- [ ] Proper error handling
- [ ] TypeScript strict mode enabled
- [ ] ESLint/Prettier configured

### Resource Optimization

- [ ] Images optimized (WebP/AVIF)
- [ ] Fonts subset if possible
- [ ] Critical CSS inlined
- [ ] JavaScript minified/bundled
- [ ] Compression enabled (Brotli/Gzip)

### Browser Compatibility

- [ ] Tested in target browsers
- [ ] No cutting-edge features without fallback
- [ ] CSS vendor prefixes if needed

---

## Audit Report Template

```markdown
# Web Quality Audit Report

**URL:** 
**Date:** 
**Auditor:** 

## Executive Summary
[High-level findings and recommendations]

## Performance
- LCP: [value] ([pass/fail])
- CLS: [value] ([pass/fail])
- INP: [value] ([pass/fail])
- TTFB: [value] ([pass/fail])

### Issues Found
1. [Issue] - [Severity] - [Fix]

## Accessibility
### Issues Found
1. [Issue] - [Severity] - [Fix]

## SEO
### Issues Found
1. [Issue] - [Severity] - [Fix]

## Security
### Issues Found
1. [Issue] - [Severity] - [Fix]

## Priority Fixes
1. [Most critical issue]
2. [Second most critical]
3. [Third most critical]
```

---

## Tools Reference

| Tool | Use Case | Cost |
|------|----------|------|
| Lighthouse | Full audit | Free |
| PageSpeed Insights | Field + Lab data | Free |
| WebPageTest | Detailed waterfall | Free |
| axe DevTools | Accessibility | Free |
| Screaming Frog | SEO crawl | Free/Paid |
| Web Vitals Extension | Real-time metrics | Free |
| WAVE | Accessibility | Free |
| SecurityHeaders.com | Header audit | Free |

---

## References

- [Lighthouse](https://developer.chrome.com/docs/lighthouse/)
- [web.dev](https://web.dev/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
