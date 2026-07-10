import { ShoppingBag, Package, TrendingUp, AlertTriangle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const metrics = [
  {
    title: "Today's Sales",
    value: "₱48,250",
    icon: ShoppingBag,
    gradient: "from-rose-500/5",
    iconClass: "text-rose-400",
    badge: "+12.4%",
    badgeClass: "text-emerald-400 bg-emerald-400/10",
    sub: "vs. yesterday ₱42,940",
  },
  {
    title: "Transactions",
    value: "134",
    icon: TrendingUp,
    gradient: "from-sky-500/5",
    iconClass: "text-sky-400",
    badge: "Active",
    badgeClass: "text-emerald-400 bg-emerald-400/10",
    sub: "Avg. ticket: ₱360",
  },
  {
    title: "Low Stock Items",
    value: "7",
    icon: AlertTriangle,
    gradient: "from-amber-500/5",
    iconClass: "text-amber-400",
    badge: "Needs Reorder",
    badgeClass: "text-amber-400 bg-amber-400/10",
    sub: "Below minimum threshold",
  },
  {
    title: "Total SKUs",
    value: "1,248",
    icon: Package,
    gradient: "from-emerald-500/5",
    iconClass: "text-emerald-400",
    badge: "In Stock",
    badgeClass: "text-emerald-400 bg-emerald-400/10",
    sub: "Across 18 categories",
  },
] as const;

export function MetricCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 pt-4">
      {metrics.map((m) => (
        <Card key={m.title} className="bg-card border-border shadow-md rounded-2xl overflow-hidden relative group py-0">
          <div className={cn("absolute inset-0 bg-gradient-to-br via-transparent to-transparent pointer-events-none", m.gradient)} />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-5 pb-2 relative z-10 mb-4">
            <div className="flex items-center gap-2">
              <m.icon className={cn("h-3.5 w-3.5", m.iconClass)} />
              <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{m.title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-0 relative z-10">
            <div className="text-2xl font-bold mb-0.5 tracking-tight">{m.value}</div>
            <div className="flex items-center gap-1.5 mt-3">
              <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-md", m.badgeClass)}>{m.badge}</span>
              <p className="text-[10px] text-muted-foreground/60">{m.sub}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
