import { useMemo } from "react";
import { CheckCircle2, Circle } from "lucide-react";

interface EditorialChecklistProps {
  items: { label: string; key: string; done: boolean }[];
  progress: number;
  heroImageExists: boolean;
}

export function EditorialChecklist({ items, progress: _ignored, heroImageExists }: EditorialChecklistProps) {
  const updatedItems = useMemo(
    () => items.map((item) =>
      item.key === "hero" ? { ...item, done: heroImageExists } : item,
    ),
    [items, heroImageExists],
  );

  const actualProgress = useMemo(() => {
    const done = updatedItems.filter((c) => c.done).length;
    return updatedItems.length > 0 ? Math.round((done / updatedItems.length) * 100) : 0;
  }, [updatedItems]);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-lg font-light text-foreground tracking-tight">Editorial Checklist</h3>
        <span className="text-sm font-medium text-teal-deep">{actualProgress}%</span>
      </div>

      <div className="h-2 rounded-full bg-jasmine-deep overflow-hidden">
        <div
          className="h-full rounded-full bg-teal-deep transition-all duration-500"
          style={{ width: `${actualProgress}%` }}
        />
      </div>

      <div className="space-y-2">
        {updatedItems.map((item) => (
          <div key={item.key} className="flex items-center gap-2.5 text-sm">
            {item.done ? (
              <CheckCircle2 className="h-4 w-4 text-teal-deep shrink-0" />
            ) : (
              <Circle className="h-4 w-4 text-muted-foreground/40 shrink-0" />
            )}
            <span className={item.done ? "text-foreground" : "text-muted-foreground"}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
