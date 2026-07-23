import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { RecentCustomer } from "../types/dashboard";

interface RecentCustomersProps {
  data: RecentCustomer[] | undefined;
  loading: boolean;
}

export function RecentCustomers({ data, loading }: RecentCustomersProps) {
  return (
    <Card className="border border-border/50 bg-card">
      <CardHeader>
        <CardTitle className="font-serif text-lg font-light text-foreground">
          Recent Customers
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 rounded bg-muted animate-pulse" />
            ))}
          </div>
        ) : !data || data.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">
            No customers yet.
          </p>
        ) : (
          <div className="space-y-3">
            {data.map((customer) => (
              <div key={customer.id} className="flex items-center justify-between py-1">
                <div>
                  <p className="text-sm font-medium text-foreground">{customer.full_name}</p>
                  <p className="text-xs text-muted-foreground">{customer.email}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
