import { Download, ArrowUpRight, ArrowDownRight, Users, CreditCard, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import { SalesChart } from "./components/sales-chart";
import { TransactionsTable } from "./components/transactions-table";
import { ExportCsvButton } from "./components/export-csv-button";

export default async function ReportsPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  let isAdmin = false;
  if (user) {
    const { data: userData } = await supabase.from("users").select("role").eq("id", user.id).single();
    isAdmin = userData?.role === "admin";
  }
  
  const { data: orders, error } = await supabase
    .from("orders")
    .select(`
      id,
      created_at,
      total_amount,
      status,
      cashier_id,
      order_items ( quantity )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
  }

  let totalRevenue = 0;
  let totalTransactions = 0;
  let avgOrderValue = 0;
  let recentTransactions: any[] = [];

  if (orders && !error) {
    const cashierIds = Array.from(new Set(orders.map(o => o.cashier_id).filter(Boolean)));
    let usersData: any[] = [];
    
    if (cashierIds.length > 0) {
      const { data: users } = await supabase
        .from("users")
        .select("id, full_name")
        .in("id", cashierIds);
      usersData = users || [];
    }
    
    const userMap = new Map(usersData.map(u => [u.id, u.full_name]));

    totalRevenue = orders.reduce((sum, o) => sum + Number(o.total_amount), 0);
    totalTransactions = orders.length;
    avgOrderValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
    
    recentTransactions = orders.map(order => {
      // @ts-ignore
      const itemsCount = order.order_items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;
      return {
        id: "TRX-" + order.id.substring(0, 8).toUpperCase(),
        rawId: order.id,
        date: format(new Date(order.created_at), "MMM dd, yyyy h:mm a"),
        customer: "Walk-in", 
        cashier: userMap.get(order.cashier_id) || "Unknown",
        items: itemsCount,
        total: Number(order.total_amount),
        status: (order.status || "Completed").charAt(0).toUpperCase() + (order.status || "completed").slice(1)
      };
    });
  }

  return (
    <div className="flex-1 space-y-6 p-6 bg-muted/10 h-full overflow-y-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Sales Reports</h2>
          <p className="text-muted-foreground">Monitor your revenue and transaction history.</p>
        </div>
        <ExportCsvButton transactions={recentTransactions} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₱{totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <span className="text-emerald-500 flex items-center mr-1">
                <ArrowUpRight className="size-3 mr-0.5" />
                Live Data
              </span>
              Calculated from all sales
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <CreditCard className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <span className="text-emerald-500 flex items-center mr-1">
                <ArrowUpRight className="size-3 mr-0.5" />
                Live Data
              </span>
              Total recorded sales
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm md:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₱{avgOrderValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <span className="text-emerald-500 flex items-center mr-1">
                <ArrowUpRight className="size-3 mr-0.5" />
                Live Data
              </span>
              Average spend per order
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1">
        <SalesChart orders={orders || []} />
      </div>

      <Card className="border-border/50 shadow-sm">
        <TransactionsTable transactions={recentTransactions} isAdmin={isAdmin} />
      </Card>
    </div>
  );
}
