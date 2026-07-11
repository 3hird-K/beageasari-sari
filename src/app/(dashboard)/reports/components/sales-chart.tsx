"use client";

import { useMemo, useState, useEffect } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format, subDays } from "date-fns";

export function SalesChart({ orders }: { orders: any[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const chartData = useMemo(() => {
    // Generate last 7 days including today
    const days = Array.from({ length: 7 }).map((_, i) => {
      const d = subDays(new Date(), 6 - i);
      return format(d, "MMM dd");
    });

    const dataMap = days.reduce((acc, day) => {
      acc[day] = { name: day, total: 0 };
      return acc;
    }, {} as Record<string, { name: string; total: number }>);

    orders.forEach(order => {
      const orderDate = format(new Date(order.created_at), "MMM dd");
      if (dataMap[orderDate]) {
        dataMap[orderDate].total += Number(order.total_amount) || 0;
      }
    });

    return Object.values(dataMap);
  }, [orders, mounted]);

  if (!mounted) {
    return (
      <Card className="border-border/50 shadow-sm col-span-full">
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
          <CardDescription>Daily revenue for the last 7 days.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
          Loading chart...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 shadow-sm col-span-full">
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <CardDescription>Daily revenue for the last 7 days.</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] pb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--muted)" />
            <XAxis 
              dataKey="name" 
              tickLine={false} 
              axisLine={false} 
              fontSize={12}
              tickMargin={10}
              stroke="var(--muted-foreground)"
            />
            <YAxis 
              tickLine={false} 
              axisLine={false} 
              fontSize={12}
              tickFormatter={(value) => `₱${value}`}
              stroke="var(--muted-foreground)"
            />
            <Tooltip 
              cursor={{ fill: 'var(--muted)', opacity: 0.5 }}
              contentStyle={{ 
                backgroundColor: 'var(--background)', 
                borderColor: 'var(--border)',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
              }}
              formatter={(value: number) => [`₱${value.toFixed(2)}`, "Revenue"]}
            />
            <Bar 
              dataKey="total" 
              fill="var(--primary)" 
              radius={[4, 4, 0, 0]} 
              barSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
