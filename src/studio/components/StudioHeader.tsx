import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ExternalLink } from "lucide-react";
import { getStudioEnvironment } from "../utils/environment";
import { useAuth } from "../hooks/useAuth";

interface StudioHeaderProps {
  title: string;
}

export function StudioHeader({ title }: StudioHeaderProps) {
  const env = getStudioEnvironment();
  const { user } = useAuth();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border/60 bg-background/95 backdrop-blur-sm px-4 sm:px-6">
      <div className="flex items-center gap-3 min-w-0">
        <SidebarTrigger className="text-foreground hover:bg-muted min-h-[44px] min-w-[44px]" />
        <Separator orientation="vertical" className="h-5" />
        <h2 className="font-serif text-lg font-light tracking-tight text-foreground truncate">
          {title}
        </h2>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {/* Environment Badge — label hides under 400px, status dot remains */}
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium tracking-wider uppercase border ${env.badgeClass}`}
          title={`Active Environment: ${env.name}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
          <span className="max-[400px]:hidden">{env.badgeLabel}</span>
        </span>

        {user?.email && (
          <span className="hidden md:inline text-xs text-muted-foreground font-sans">
            {user.email}
          </span>
        )}

        <Separator orientation="vertical" className="h-4 hidden sm:block" />

        {/* View Storefront */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-muted"
        >
          <span>Storefront</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </header>
  );
}
