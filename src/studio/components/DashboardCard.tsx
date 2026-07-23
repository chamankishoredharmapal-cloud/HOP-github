import { Card, CardContent } from "@/components/ui/card";

interface DashboardCardProps {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  loading?: boolean;
}

export function DashboardCard({ label, value, icon: Icon, loading }: DashboardCardProps) {
  return (
    <Card className="border border-border/50 bg-card transition-colors hover:border-teal/30">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground tracking-wide uppercase font-sans">
              {label}
            </p>
            {loading ? (
              <div className="h-9 w-24 rounded bg-muted animate-pulse" />
            ) : (
              <p className="text-3xl font-serif font-light text-foreground">
                {value}
              </p>
            )}
          </div>
          <div className="rounded-full bg-jasmine-deep p-3 text-teal-deep">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
