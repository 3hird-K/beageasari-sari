"use client";

import { Download, ArrowUpRight, ArrowDownRight, Users, CreditCard, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const recentTransactions = [
  { id: "TRX-1092", date: "Today, 10:45 AM", customer: "Walk-in", items: 4, total: 24.50, status: "Completed" },
  { id: "TRX-1091", date: "Today, 10:12 AM", customer: "Sarah J.", items: 12, total: 145.20, status: "Completed" },
  { id: "TRX-1090", date: "Today, 09:30 AM", customer: "Walk-in", items: 1, total: 4.49, status: "Completed" },
  { id: "TRX-1089", date: "Yesterday, 04:20 PM", customer: "Mike T.", items: 5, total: 65.00, status: "Refunded" },
  { id: "TRX-1088", date: "Yesterday, 03:15 PM", customer: "Walk-in", items: 3, total: 18.90, status: "Completed" },
  { id: "TRX-1087", date: "Yesterday, 01:10 PM", customer: "Elena G.", items: 8, total: 92.15, status: "Completed" },
  { id: "TRX-1086", date: "Yesterday, 11:30 AM", customer: "Walk-in", items: 2, total: 8.98, status: "Completed" },
];

export default function ReportsPage() {
  return (
    <div className="flex-1 space-y-6 p-6 bg-muted/10 h-full overflow-y-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Sales Reports</h2>
          <p className="text-muted-foreground">Monitor your revenue and transaction history.</p>
        </div>
        <Button variant="outline" className="shrink-0 gap-2">
          <Download className="size-4" />
          Export CSV
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,450.00</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <span className="text-emerald-500 flex items-center mr-1">
                <ArrowUpRight className="size-3 mr-0.5" />
                +14.5%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <CreditCard className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <span className="text-emerald-500 flex items-center mr-1">
                <ArrowUpRight className="size-3 mr-0.5" />
                +8.2%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$21.73</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <span className="text-rose-500 flex items-center mr-1">
                <ArrowDownRight className="size-3 mr-0.5" />
                -2.1%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>A list of the most recent sales.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="w-[120px]">Transaction ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="text-right">Items</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactions.map((trx) => (
                <TableRow key={trx.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-mono text-xs font-medium">
                    {trx.id}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{trx.date}</TableCell>
                  <TableCell>{trx.customer}</TableCell>
                  <TableCell className="text-right font-medium">{trx.items}</TableCell>
                  <TableCell className="text-right font-mono">${trx.total.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <Badge 
                      variant={trx.status === "Completed" ? "default" : "secondary"}
                      className={
                        trx.status === "Completed" 
                          ? "bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25 border-emerald-500/20" 
                          : "bg-muted text-muted-foreground hover:bg-muted"
                      }
                    >
                      {trx.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
