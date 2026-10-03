import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * StickyCta — quiet mobile-only purchase bar.
 *
 * Shows a fixed bottom action bar on small screens only while the page's
 * inline primary CTA is scrolled out of view. Hides when:
 * - the inline CTA is visible (no duplication),
 * - a text field is focused (never cover the iOS/Android keyboard),
 * - the viewport is desktop width (CSS `lg:hidden`).
 *
 * Visual restraint: paper background, hairline top border, safe-area padding.
 */
export function StickyCta({
  inlineRef,
  children,
  label,
}: {
  /** Ref of the inline CTA container to observe. */
  inlineRef: React.RefObject<HTMLElement | null>;
  children: ReactNode;
  /** Accessible label for the bar region. */
  label: string;
}) {
  const barRef = useRef<HTMLDivElement>(null);
  const [inlineVisible, setInlineVisible] = useState(true);
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  useEffect(() => {
    const target = inlineRef.current;
    if (!target || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setInlineVisible(entry.isIntersecting), {
      threshold: 0,
    });
    io.observe(target);
    return () => io.disconnect();
  }, [inlineRef]);

  useEffect(() => {
    const onFocusIn = (e: FocusEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT")) {
        setKeyboardOpen(true);
      }
    };
    const onFocusOut = () => setKeyboardOpen(false);
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  const show = !inlineVisible && !keyboardOpen;

  // Keep the bar out of the tab order and the accessibility tree while it is
  // parked off-screen, without killing the slide transition (unlike `hidden`).
  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    try {
      (el as HTMLElement & { inert?: boolean }).inert = !show;
    } catch {
      /* inert unsupported — aria-hidden still applies */
    }
  }, [show]);

  return (
    <div
      ref={barRef}
      role="region"
      aria-label={label}
      aria-hidden={!show}
      className={`lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-line/20 bg-paper-ivory/95 backdrop-blur-sm transition-transform duration-300 ease-out ${
        show ? "translate-y-0" : "translate-y-full pointer-events-none"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-center justify-between gap-4 px-5 py-3 min-h-[68px]">{children}</div>
    </div>
  );
}
