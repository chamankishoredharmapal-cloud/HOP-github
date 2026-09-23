/** Selvedge seam — proprietary HOP divider (Objective 04)
 * One per viewport max, derived from weave structure (crimson/sand twill).
 * Not decorative Indian motif — material edge, editorial rule.
 * Motion: subtle draw from left (700ms) — stillness is house style, movement the rare guest.
 */
export const Selvedge = ({
  accent = "hsl(var(--teal))",
  className = "",
}: {
  accent?: string;
  className?: string;
}) => (
  <div className={`w-full overflow-hidden ${className}`} aria-hidden="true">
    <div className="h-px w-full origin-left animate-[selvedge-draw_700ms_cubic-bezier(0.22,1,0.36,1)_both]" style={{ background: accent, opacity: 0.6 }} />
    <div className="h-px w-full mt-px opacity-20" style={{ background: "hsl(var(--ink))" }} />
  </div>
);

export const SelvedgeInline = ({ accent = "hsl(var(--teal))" }: { accent?: string }) => (
  <span className="inline-block h-px w-8 align-middle mr-3" style={{ background: accent }} aria-hidden="true" />
);
