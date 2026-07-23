# Animation Standards — House of Padmavati

## Philosophy

Animations at House of Padmavati are subtle, purposeful, and luxurious. They enhance the user experience without being distracting or causing motion sickness.

## Principles

1. **Purposeful** — every animation serves a function (feedback, orientation, delight)
2. **Subtle** — animations are barely noticeable; they feel natural, not performative
3. **Performance** — animations run at 60fps (use `transform` and `opacity` only)
4. **Accessible** — respect `prefers-reduced-motion`
5. **Brand-aligned** — reflect the calm, refined luxury of the brand

## Motion Tokens

```typescript
// Duration
const durations = {
  fast: 200,   // Micro-interactions (hover, click)
  normal: 400, // Standard transitions
  slow: 600,   // Page transitions, entrance animations
} as const;

// Easing
const easings = {
  default: "cubic-bezier(0.4, 0, 0.2, 1)",
  ease: "cubic-bezier(0.25, 0.1, 0.25, 1)",
  easeIn: "cubic-bezier(0.4, 0, 1, 1)",
  easeOut: "cubic-bezier(0, 0, 0.2, 1)",
  easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
};
```

## Available Animations (from `src/index.css`)

```css
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes drift {
  /* Slow, subtle movement for hero sections */
}

@keyframes kenburns {
  /* Slow zoom effect for hero images */
}
```

## Usage Guidelines

### Page Transitions
- Fade-in on route change (`fade-in`, 400ms)
- Content sections fade-up on scroll into view
- No slide transitions (too distracting for a luxury brand)

### Micro-interactions
- Buttons: subtle opacity/scale change on hover (`opacity-90`, `scale-[1.02]`)
- Cards: slight elevation on hover (`shadow-md` → `shadow-lg`)
- Links: underline animation on hover
- Images: subtle zoom on hover (within product cards)

```typescript
// Component-level animation with Tailwind
<button className="transition-all duration-200 hover:opacity-90 hover:scale-[1.02]">
  Add to Cart
</button>
```

### Entrance Animations
- Sections animate in as user scrolls (use Intersection Observer)
- Product grid items stagger entrance (50ms delay per item)
- Hero content fades up on page load
- No entrance animation for below-fold content (instant render, animate on scroll)

### Modal/Dialog Animations
- Scale + fade in (200ms)
- Backdrop fade (200ms)
- Content should not slide in from edges

### Loading States
- Skeleton screens (not spinners) for content loading
- Pulse animation for skeleton elements
- Button loading: spinner icon replaces text
- Full-page loader: subtle fade with monogram (only for lazy-loaded routes)

## Implementation

```typescript
// Using Tailwind classes
<div className="animate-fade-up">
  {/* Content */}
</div>

// Using CSS classes for scroll-triggered animations
function AnimatedSection({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-600 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      }`}
    >
      {children}
    </div>
  );
}
```

## Reduced Motion

Always respect user preferences:

```typescript
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

// Disable or simplify animations
if (prefersReducedMotion) {
  // Only use opacity transitions, no transforms
  // Remove parallax effects
  // Reduce animation duration to 0
}
```

## What NOT to Animate

- Layout properties (`width`, `height`, `top`, `left`, `margin`, `padding`)
- Expensive CSS properties (`box-shadow`, `filter`, `border-radius`)
- Background images
- Text content changes (use `opacity` fade for content swaps)
- Multiple properties simultaneously (stick to `opacity` + `transform`)
