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
import { createClient } from "@/lib/supabase/server";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

export async function ActivityFeed({ className }: { className?: string }) {
  const supabase = await createClient();

  // Fetch recent orders
  const { data: recentOrders } = await supabase
    .from("orders")
    .select(`
      id,
      total_amount,
      created_at,
      status,
      cashier_id,
      users ( full_name )
    `)
    .order("created_at", { ascending: false })
    .limit(4);

  // Fetch low stock items for system alerts
  const { data: lowStock } = await supabase
    .from("products")
    .select("name, stock_quantity")
    .lte("stock_quantity", 10)
    .order("stock_quantity", { ascending: true })
    .limit(1);

  const activities = [];

  // Add low stock alert if any
  if (lowStock && lowStock.length > 0) {
    activities.push({
      id: `sys-${lowStock[0].name}`,
      name: "System Inventory",
      initials: "SYS",
      avatarClass: "bg-amber-600",
      action: "Stock alert triggered — quantity fell below minimum for",
      highlight: `${lowStock[0].name} (${lowStock[0].stock_quantity} units left)`,
      location: "System Alert",
      time: "Just now",
      badge: "Low Stock",
    });
  }

  // Add recent orders
  if (recentOrders) {
    recentOrders.forEach((order) => {
      // @ts-ignore
      const cashierName = order.users?.full_name || "Unknown";
      const initials = cashierName.substring(0, 2).toUpperCase();
      
      activities.push({
        id: order.id,
        name: `Cashier: ${cashierName}`,
        initials: initials,
        avatarClass: "bg-emerald-600",
        action: `Completed sale — ₱${Number(order.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })} for`,
        highlight: `Order #TXN-${order.id.substring(0, 5).toUpperCase()}`,
        location: "Counter",
        time: formatDistanceToNow(new Date(order.created_at), { addSuffix: true }),
        badge: order.status === "completed" ? "Completed" : "Pending",
      });
    });
  }

  // Trim to max 4 activities
  const displayActivities = activities.slice(0, 4);

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
          asChild
        >
          <Link href="/reports">View All</Link>
        </Button>
      </CardHeader>

      <CardContent className="flex-1 space-y-6 py-2">
        {displayActivities.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">No recent activity.</p>
        )}
        {displayActivities.map((a) => (
          <div key={a.id} className="flex gap-3">
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
                    className={cn("border-primary/20 bg-primary/5 text-[9px] font-black uppercase tracking-wider text-primary px-1.5 py-0", 
                      a.badge === "Low Stock" ? "border-amber-500/20 text-amber-500 bg-amber-500/5" : ""
                    )}
                  >
                    {a.badge}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>

      <CardFooter className="flex border-t border-border/50 justify-center py-6">
        <Button
          variant="link"
          className="group flex h-auto p-0 text-xs font-bold text-muted-foreground/40 hover:text-foreground transition-all"
          asChild
        >
          <Link href="/reports" className="flex items-center justify-center">
            <ArrowUpRight className="mr-2 size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            Open Transaction Logs
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
