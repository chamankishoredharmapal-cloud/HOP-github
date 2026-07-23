# Accessibility UX — House of Padmavati

## Philosophy

Accessibility is not a checklist — it's a fundamental part of the luxury experience. True luxury means inclusivity. The experience should be equally refined for every user, regardless of how they interact with the site.

## Inclusive Design Principles

### 1. Equitable Use
The same luxury experience for all users. Screen reader users should feel the same editorial quality as visual users.

### 2. Flexibility in Use
Accommodate a wide range of preferences and abilities. Keyboard navigation, screen readers, zoom, reduced motion.

### 3. Simple and Intuitive
Consistent patterns, clear labeling, predictable behavior. Luxury shouldn't require a manual.

### 4. Perceptible Information
Communicate necessary information regardless of ambient conditions or sensory abilities.

### 5. Tolerance for Error
Minimize hazards and adverse consequences of accidental or unintended actions. Confirm destructive actions. Allow undo.

### 6. Low Physical Effort
Design for efficiency and comfort. Minimum clicks to complete tasks. Large touch targets.

### 7. Size and Space for Approach and Use
Adequate space for all users, including those using assistive devices.

## Implementation

### Navigation
- Skip-to-content link at top of every page
- Logical tab order matching visual order
- Visible focus indicators (2px solid, high contrast)
- Keyboard-operable menus (Enter to open, Escape to close, Arrow keys to navigate)
- Mobile hamburger menu accessible via keyboard

### Product Discovery
- Screen reader announcements for filter/sort changes
- Focus management after filter application
- Keyboard-accessible product cards (Enter to view detail)
- Wishlist toggle announcements
- Pagination with aria-live region for page changes

### Product Page
- Image gallery: keyboard navigable, alt text for all images
- Zoom: available via keyboard
- Variant selection: clearly announced
- Add to cart: confirmation announcement
- Price: clear formatting for screen readers

### Checkout
- Form fields: labels associated, error messages in aria-live
- Required fields: clearly indicated
- Autocomplete: enabled for address fields
- Payment: secure field announcements
- Order review: structured content for screen readers

### Interactive Elements

```typescript
// Accessible button with loading state
function ActionButton({ isLoading, children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      aria-busy={isLoading}
      aria-disabled={isLoading}
    >
      {isLoading ? (
        <>
          <span className="sr-only">Loading</span>
          <SpinnerIcon aria-hidden="true" />
        </>
      ) : children}
    </button>
  );
}

// Accessible image gallery
function ProductGallery({ images }: { images: string[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div role="region" aria-label="Product images">
      <div aria-live="polite">
        <img
          src={images[activeIndex]}
          alt={`Product view ${activeIndex + 1} of ${images.length}`}
        />
      </div>
      <div role="tablist" aria-label="Image thumbnails">
        {images.map((img, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === activeIndex}
            aria-label={`View image ${i + 1}`}
            onClick={() => setActiveIndex(i)}
          >
            <img src={img} alt="" />
          </button>
        ))}
      </div>
    </div>
  );
}
```

## Testing

### Automated (CI)
- axe-core integration in Playwright
- Run on every page in critical journeys
- Fail CI on accessibility violations

### Manual (Pre-release)
- Keyboard-only navigation through entire flow
- Screen reader testing (NVDA on Windows, VoiceOver on Mac)
- Zoom to 200% — all content visible
- High contrast mode — all content visible
- Reduced motion — animations disabled

## Accessibility UX Checklist

- [ ] Skip-to-content link present and functional
- [ ] All images have meaningful alt text
- [ ] All form fields have associated labels
- [ ] Focus indicators are visible and high contrast
- [ ] Tab order follows visual order
- [ ] All interactive elements are keyboard accessible
- [ ] No keyboard traps
- [ ] Color is not the only means of conveying information
- [ ] Text contrast >= 4.5:1 (normal) / 3:1 (large)
- [ ] Heading hierarchy is logical (h1 -> h2 -> h3)
- [ ] ARIA landmarks used correctly
- [ ] Dynamic content has aria-live announcements
- [ ] Forms have clear error messages with suggestions
- [ ] Touch targets >= 44x44px
- [ ] prefers-reduced-motion respected
- [ ] Screen reader testing completed
