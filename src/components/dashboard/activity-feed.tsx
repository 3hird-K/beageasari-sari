import { ArrowUpRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const activities = [
  {
    name: "Cashier: Maria Santos",
    initials: "MS",
    avatarClass: "bg-emerald-600",
    action: "Completed sale — ₱2,450 for",
    highlight: "Order #TXN-00134",
    location: "Counter 2 — Cash Payment",
    time: "3 min ago",
    badge: "Completed",
  },
  {
    name: "System Inventory",
    initials: "SYS",
    avatarClass: "bg-amber-600",
    action: "Stock alert triggered — quantity fell below minimum for",
    highlight: "Coca-Cola 1.5L (4 units left)",
    location: "Warehouse A — Aisle 3",
    time: "18 min ago",
    badge: "Low Stock" as string | null,
  },
  {
    name: "Supplier: LBC Traders",
    initials: "LBC",
    avatarClass: "bg-sky-600",
    action: "Purchase order received — 240 units restocked for",
    highlight: "Rice Premium 5kg",
    location: "Receiving Dock — PO #PO-20240630",
    time: "1 hour ago",
    badge: "Restocked",
  },
] as const;

export function ActivityFeed({ className }: { className?: string }) {
  return (
    <Card className={cn("flex h-full flex-col", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <div>
          <CardTitle className="text-lg font-bold tracking-tight">
            Recent Activity
          </CardTitle>
          <CardDescription className="text-xs font-medium text-muted-foreground/40">
            Latest sales &amp; inventory events.
          </CardDescription>
        </div>
        <Button
          variant="link"
          className="h-auto p-0 text-[10px] font-black uppercase tracking-[0.2em] text-primary transition-opacity hover:opacity-80"
        >
          View All
        </Button>
      </CardHeader>

      <CardContent className="flex-1 space-y-6 py-2">
        {activities.map((a) => (
          <div key={a.name + a.time} className="flex gap-3">
            <Avatar className="size-10 shrink-0 border border-white/5 ring-1 ring-white/5">
              <AvatarFallback
                className={cn(
                  "text-[12px] font-bold text-white",
                  a.avatarClass,
                )}
              >
                {a.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0 space-y-0.5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-white truncate">
                  {a.name}
                </p>
                <span className="text-[10px] font-medium text-muted-foreground/30 shrink-0 ml-4">
                  {a.time}
                </span>
              </div>
              <p className="text-[13px] font-medium text-muted-foreground/60 leading-snug">
                {a.action}{" "}
                <span className="font-bold text-primary">
                  {a.highlight}
                </span>
              </p>
              <div className="flex flex-wrap gap-2 pt-1.5">
                <span className="inline-flex items-center rounded-full bg-white/5 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-muted-foreground/60">
                  {a.location}
                </span>
                {a.badge && (
                  <Badge
                    variant="outline"
                    className="border-primary/20 bg-primary/5 text-[9px] font-black uppercase tracking-wider text-primary px-1.5 py-0"
                  >
                    {a.badge}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>

      <CardFooter className="border-t border-border/50 justify-center py-6">
        <Button
          variant="link"
          className="group h-auto p-0 text-xs font-bold text-muted-foreground/40 hover:text-foreground transition-all"
        >
          <ArrowUpRight className="mr-2 size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          Open Transaction Logs
        </Button>
      </CardFooter>
    </Card>
  );
}
