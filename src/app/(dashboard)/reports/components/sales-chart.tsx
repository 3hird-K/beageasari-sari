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
import { format, subDays, subWeeks, subMonths, subYears, startOfWeek, startOfMonth, startOfYear } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type TimeRange = "daily" | "weekly" | "monthly" | "yearly";

export function SalesChart({ orders }: { orders: any[] }) {
  const [mounted, setMounted] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>("daily");

  useEffect(() => {
    setMounted(true);
  }, []);

  const chartData = useMemo(() => {
    const today = new Date();
    const dataMap: Record<string, { name: string; total: number }> = {};

    if (timeRange === "daily") {
      const days = Array.from({ length: 14 }).map((_, i) => format(subDays(today, 13 - i), "MMM dd"));
      days.forEach(day => dataMap[day] = { name: day, total: 0 });

      orders.forEach(order => {
        const orderDate = format(new Date(order.created_at), "MMM dd");
        if (dataMap[orderDate]) {
          dataMap[orderDate].total += Number(order.total_amount) || 0;
        }
      });
    } else if (timeRange === "weekly") {
      const weeks = Array.from({ length: 12 }).map((_, i) => format(startOfWeek(subWeeks(today, 11 - i)), "MMM dd"));
      weeks.forEach(week => dataMap[week] = { name: week, total: 0 });

      orders.forEach(order => {
        const orderDate = format(startOfWeek(new Date(order.created_at)), "MMM dd");
        if (dataMap[orderDate]) {
          dataMap[orderDate].total += Number(order.total_amount) || 0;
        }
      });
    } else if (timeRange === "monthly") {
      const months = Array.from({ length: 12 }).map((_, i) => format(startOfMonth(subMonths(today, 11 - i)), "MMM yyyy"));
      months.forEach(month => dataMap[month] = { name: month, total: 0 });

      orders.forEach(order => {
        const orderDate = format(startOfMonth(new Date(order.created_at)), "MMM yyyy");
        if (dataMap[orderDate]) {
          dataMap[orderDate].total += Number(order.total_amount) || 0;
        }
      });
    } else if (timeRange === "yearly") {
      const years = Array.from({ length: 5 }).map((_, i) => format(startOfYear(subYears(today, 4 - i)), "yyyy"));
      years.forEach(year => dataMap[year] = { name: year, total: 0 });

      orders.forEach(order => {
        const orderDate = format(startOfYear(new Date(order.created_at)), "yyyy");
        if (dataMap[orderDate]) {
          dataMap[orderDate].total += Number(order.total_amount) || 0;
        }
      });
    }

    return Object.values(dataMap);
  }, [orders, timeRange]);

  const rangeDescription = {
    daily: "Daily revenue for the last 14 days.",
    weekly: "Weekly revenue for the last 12 weeks.",
    monthly: "Monthly revenue for the last 12 months.",
    yearly: "Yearly revenue for the last 5 years."
  };

  if (!mounted) {
    return (
      <Card className="border-border/50 shadow-sm col-span-full">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Revenue Analysis</CardTitle>
            <CardDescription>Loading...</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
          Loading chart...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 shadow-sm col-span-full">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4">
        <div>
          <CardTitle>Revenue Analysis</CardTitle>
          <CardDescription>{rangeDescription[timeRange]}</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
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
              barSize={timeRange === "yearly" ? 60 : 40}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
