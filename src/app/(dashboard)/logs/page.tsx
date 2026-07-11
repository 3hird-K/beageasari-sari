import { createClient } from "@/lib/supabase/server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default async function AuditLogsPage() {
  const supabase = await createClient();

  const { data: rawLogs, error } = await supabase
    .from("audit_logs")
    .select(`
      id,
      action,
      entity_type,
      entity_id,
      details,
      created_at,
      user_id
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching audit logs:", error);
  }

  const logsData = rawLogs || [];
  
  // Fetch users for the logs
  const userIds = Array.from(new Set(logsData.map(log => log.user_id).filter(Boolean))) as string[];
  let usersMap: Record<string, { full_name: string | null; email: string }> = {};
  
  if (userIds.length > 0) {
    const { data: usersData, error: usersError } = await supabase
      .from("users")
      .select("id, full_name, email")
      .in("id", userIds);
      
    if (!usersError && usersData) {
      usersMap = usersData.reduce((acc, user) => {
        acc[user.id] = user;
        return acc;
      }, {} as Record<string, { full_name: string | null; email: string }>);
    }
  }

  const logs = logsData.map(log => ({
    ...log,
    users: log.user_id ? usersMap[log.user_id] : null
  }));

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case "CREATE": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "UPDATE": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "DELETE": return "bg-destructive/10 text-destructive border-destructive/20";
      case "SALE": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      default: return "bg-primary/10 text-primary border-primary/20";
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Audit Logs</h2>
          <p className="text-muted-foreground text-sm mt-1">
            System-wide activity and event tracking.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <FileText className="size-5 text-muted-foreground" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            A chronological list of all recorded system events.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!logs || logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      No logs found.
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => {
                    const userName = (log.users as any)?.full_name || "System";
                    const userEmail = (log.users as any)?.email || "";
                    return (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium whitespace-nowrap">
                          {format(new Date(log.created_at), "MMM d, yyyy HH:mm:ss")}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{userName}</span>
                            {userEmail && <span className="text-xs text-muted-foreground">{userEmail}</span>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getActionBadgeColor(log.action)}>
                            {log.action}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-semibold uppercase text-[10px] tracking-wider text-muted-foreground">{log.entity_type}</span>
                            <span className="text-xs text-muted-foreground truncate max-w-[120px]" title={log.entity_id || ""}>
                              {log.entity_id || "-"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {log.details}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
