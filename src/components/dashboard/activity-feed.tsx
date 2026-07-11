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

  // Fetch recent audit logs
  const { data: recentLogs } = await supabase
    .from("audit_logs")
    .select(`
      id,
      action,
      entity_type,
      details,
      created_at,
      user_id
    `)
    .order("created_at", { ascending: false })
    .limit(3);

  const activities: any[] = [];

  // Add recent logs
  if (recentLogs && recentLogs.length > 0) {
    // Fetch users for the logs
    const userIds = Array.from(new Set(recentLogs.map(log => log.user_id).filter(Boolean))) as string[];
    let usersMap: Record<string, { full_name: string | null }> = {};
    
    if (userIds.length > 0) {
      const { data: usersData } = await supabase
        .from("users")
        .select("id, full_name")
        .in("id", userIds);
        
      if (usersData) {
        usersMap = usersData.reduce((acc, user) => {
          acc[user.id] = user;
          return acc;
        }, {} as Record<string, { full_name: string | null }>);
      }
    }

    recentLogs.forEach((log) => {
      const user = log.user_id ? usersMap[log.user_id] : null;
      const userName = user?.full_name || "System";
      const initials = userName.substring(0, 2).toUpperCase();
      
      let avatarClass = "bg-primary";
      let actionText = log.details;
      let badge = log.action;
      
      if (log.action === "SALE") {
        avatarClass = "bg-emerald-600";
      } else if (log.action === "DELETE") {
        avatarClass = "bg-destructive";
      } else if (log.action === "CREATE") {
        avatarClass = "bg-blue-600";
      } else if (log.action === "UPDATE") {
        avatarClass = "bg-amber-600";
      }
      
      activities.push({
        id: log.id,
        name: userName,
        initials: initials,
        avatarClass: avatarClass,
        action: actionText,
        highlight: "",
        location: log.entity_type,
        time: formatDistanceToNow(new Date(log.created_at), { addSuffix: true }),
        badge: badge,
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
          <Link href="/logs">View All</Link>
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
          <Link href="/logs" className="flex items-center justify-center">
            <ArrowUpRight className="mr-2 size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            Open Audit Logs
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
