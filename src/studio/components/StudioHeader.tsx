import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

interface StudioHeaderProps {
  title: string;
}

export function StudioHeader({ title }: StudioHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-border bg-background px-6">
      <SidebarTrigger className="text-foreground" />
      <Separator orientation="vertical" className="h-6" />
      <h2 className="font-serif text-xl font-light tracking-tight text-foreground">
        {title}
      </h2>
    </header>
  );
}
