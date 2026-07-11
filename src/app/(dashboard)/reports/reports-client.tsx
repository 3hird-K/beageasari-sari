"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { Download, ArrowUpRight, Users, CreditCard, DollarSign, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format } from "date-fns";
import { SalesChart } from "./components/sales-chart";
import { TransactionsTable } from "./components/transactions-table";
import { ExportCsvButton } from "./components/export-csv-button";
import { useEffect, useMemo } from "react";

export function ReportsClient({ isAdmin }: { isAdmin: boolean }) {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["reports_orders"],
    queryFn: async () => {
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

      if (error) throw error;

      const ordersData = orders || [];
      const cashierIds = Array.from(new Set(ordersData.map(o => o.cashier_id).filter(Boolean))) as string[];
      let usersData: any[] = [];
      
      if (cashierIds.length > 0) {
        const { data: users } = await supabase
          .from("users")
          .select("id, full_name")
          .in("id", cashierIds);
        usersData = users || [];
      }

      return {
        orders: ordersData,
        usersData
      };
    }
  });

  useEffect(() => {
    const channel = supabase
      .channel("public:reports_orders")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["reports_orders"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, supabase]);

  const { totalRevenue, totalTransactions, avgOrderValue, recentTransactions, orders } = useMemo(() => {
    if (!data) return { totalRevenue: 0, totalTransactions: 0, avgOrderValue: 0, recentTransactions: [], orders: [] };

    const userMap = new Map(data.usersData.map((u: any) => [u.id, u.full_name]));
    
    const ordersData = data.orders;
    const totalRev = ordersData.reduce((sum, o) => sum + Number(o.total_amount), 0);
    const totalTrans = ordersData.length;
    const avgVal = totalTrans > 0 ? totalRev / totalTrans : 0;
    
    const recentTrans = ordersData.map(order => {
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

    return {
      totalRevenue: totalRev,
      totalTransactions: totalTrans,
      avgOrderValue: avgVal,
      recentTransactions: recentTrans,
      orders: ordersData
    };
  }, [data]);

  if (error) {
    console.error("Error fetching orders:", error);
  }

  if (isLoading) {
    return (
      <div className="flex-1 space-y-6 p-6 bg-muted/10 h-full flex flex-col items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm">Loading sales reports...</p>
      </div>
    );
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
        <SalesChart orders={orders} />
      </div>

      <Card className="border-border/50 shadow-sm">
        <TransactionsTable transactions={recentTransactions} isAdmin={isAdmin} />
      </Card>
    </div>
  );
}
