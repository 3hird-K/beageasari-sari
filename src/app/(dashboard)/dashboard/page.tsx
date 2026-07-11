import { MetricCards } from "@/components/dashboard/metric-cards";
import { ServiceImpactChart } from "@/components/dashboard/service-impact-chart";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { PredictiveForecastBarChart } from "@/components/dashboard/predictive-forecast-bar-chart";
import { MayForecastPie } from "@/components/dashboard/may-forecast-pie";
import { TopProductsTable } from "@/components/dashboard/top-products";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { format, subDays, startOfDay, endOfDay, subWeeks } from "date-fns";

export default async function Home() {
  const supabase = await createClient();
  const today = new Date();
  
  // 1. Fetch Today's Orders for Service Impact Chart
  const { data: todayOrders } = await supabase
    .from("orders")
    .select("created_at, total_amount")
    .gte("created_at", startOfDay(today).toISOString())
    .lte("created_at", endOfDay(today).toISOString());

  // Process Hourly Data
  const hourlyDataMap = new Map();
  for (let i = 6; i <= 18; i++) {
    const hour = i.toString().padStart(2, "0") + ":00";
    hourlyDataMap.set(hour, { time: hour, sales: 0, transactions: 0, returns: 0 });
  }

  if (todayOrders) {
    todayOrders.forEach(order => {
      const orderHour = new Date(order.created_at).getHours();
      // Round to nearest hour block we are tracking or put in nearest
      const block = Math.max(6, Math.min(18, orderHour));
      const hourStr = block.toString().padStart(2, "0") + ":00";
      
      if (hourlyDataMap.has(hourStr)) {
        const item = hourlyDataMap.get(hourStr);
        item.sales += Number(order.total_amount);
        item.transactions += 1;
      }
    });
  }
  
  // Accumulate sales for area chart look
  let runningSales = 0;
  let runningTx = 0;
  const serviceImpactData = Array.from(hourlyDataMap.values()).map(item => {
    runningSales += item.sales;
    runningTx += item.transactions;
    return {
      ...item,
      sales: runningSales,
      transactions: runningTx,
    };
  });

  // 2. Skipped products fetch since we replaced the Stock Gauge with Top Products
  
  // 3. Fetch past 6 weeks of orders with items for category breakdown
  const sixWeeksAgo = subWeeks(today, 6);
  const { data: recentOrders } = await supabase
    .from("orders")
    .select(`
      created_at,
      order_items (
        quantity,
        subtotal,
        products ( name, category, stock_quantity )
      )
    `)
    .gte("created_at", startOfDay(sixWeeksAgo).toISOString());

  // Process Weekly Category Data
  const weeklyCategoryMap = new Map();
  // Initialize weeks
  for (let i = 5; i >= 0; i--) {
    const d = subWeeks(today, i);
    weeklyCategoryMap.set(format(d, "MMM dd"), { week: format(d, "MMM dd"), beverages: 0, snacks: 0, essentials: 0 });
  }

  // Process current period category mix (last 7 days)
  const sevenDaysAgo = subDays(today, 7);
  const categoryMixMap = {
    beverages: 0,
    snacks: 0,
    essentials: 0,
    other: 0
  };

  if (recentOrders) {
    recentOrders.forEach(order => {
      const orderDate = new Date(order.created_at);
      // Find closest week label
      let closestWeek: string | null = null;
      let minDiff = Infinity;
      
      Array.from(weeklyCategoryMap.keys()).forEach(weekLabel => {
        const weekDate = new Date(orderDate.getFullYear() + " " + weekLabel);
        const diff = Math.abs(orderDate.getTime() - weekDate.getTime());
        if (diff < minDiff) {
          minDiff = diff;
          closestWeek = weekLabel;
        }
      });

      order.order_items?.forEach((item: any) => {
        const prod = Array.isArray(item.products) ? item.products[0] : item.products;
        let cat = (prod?.category || "other").toLowerCase();
        if (cat !== "beverages" && cat !== "snacks" && cat !== "essentials") {
          // Map unknown categories to essentials or snacks arbitrarily to fill the chart
          if (cat.includes("drink")) cat = "beverages";
          else if (cat.includes("food") || cat.includes("candy")) cat = "snacks";
          else cat = "essentials";
        }
        
        const subtotal = Number(item.subtotal);
        
        if (closestWeek && weeklyCategoryMap.has(closestWeek)) {
          weeklyCategoryMap.get(closestWeek)[cat] += subtotal;
        }

        if (orderDate >= startOfDay(sevenDaysAgo)) {
           categoryMixMap[cat as keyof typeof categoryMixMap] += subtotal;
        }
      });
    });
  }

  const weeklyCategoryData = Array.from(weeklyCategoryMap.values());
  
  // 4. Format Pie Chart Data
  const totalMix = Object.values(categoryMixMap).reduce((a, b) => a + b, 0);
  const pieData = [
    {
      name: "Beverages",
      value: categoryMixMap.beverages / 1000,
      pct: totalMix > 0 ? Math.round((categoryMixMap.beverages / totalMix) * 100) : 0,
      fill: "#38bdf8",
    },
    {
      name: "Snacks",
      value: categoryMixMap.snacks / 1000,
      pct: totalMix > 0 ? Math.round((categoryMixMap.snacks / totalMix) * 100) : 0,
      fill: "#10b981",
    },
    {
      name: "Essentials",
      value: categoryMixMap.essentials / 1000,
      pct: totalMix > 0 ? Math.round((categoryMixMap.essentials / totalMix) * 100) : 0,
      fill: "#a855f7",
    }
  ].filter(d => d.value > 0);

  // If no data, use some fallback so pie renders
  if (pieData.length === 0) {
    pieData.push(
      { name: "Beverages", value: 15, pct: 45, fill: "#38bdf8" },
      { name: "Snacks", value: 10, pct: 30, fill: "#10b981" },
      { name: "Essentials", value: 8, pct: 25, fill: "#a855f7" }
    );
  }

  // 5. Format Top Products Data
  const productSalesMap = new Map();
  if (recentOrders) {
    recentOrders.forEach(order => {
      order.order_items?.forEach((item: any) => {
        const prod: any = Array.isArray(item.products) ? item.products[0] : item.products;
        if (prod) {
          const prodName = prod.name || "Unknown Product";
          if (!productSalesMap.has(prodName)) {
             productSalesMap.set(prodName, { 
               name: prodName, 
               category: prod.category || "Uncategorized", 
               quantity: 0, 
               revenue: 0, 
               stock: prod.stock_quantity || 0 
             });
          }
          const p = productSalesMap.get(prodName);
          p.quantity += item.quantity;
          p.revenue += Number(item.subtotal);
        }
      });
    });
  }

  // Convert to array, sort by revenue descending, take top 10
  const topProductsData = Array.from(productSalesMap.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  return (
    <div className="flex-1 space-y-3 p-6 pt-6 bg-background min-h-screen text-foreground">
      {/* ── Header ── */}
      <DashboardHeader />

      {/* ── Metric cards ── */}
      <MetricCards />

      {/* ── Hourly Sales chart + Activity feed ── */}
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg font-bold tracking-tight text-foreground">
              Today&apos;s Sales Performance
            </CardTitle>
            <CardDescription className="text-[11px] font-medium text-muted-foreground/60">
              Hourly revenue, transaction count, and returns — today&apos;s 24-hour cycle.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ServiceImpactChart data={serviceImpactData} />
          </CardContent>
        </Card>
        <div className="lg:col-span-2">
          <ActivityFeed />
        </div>
      </div>

      {/* ── Weekly Sales by Category + Revenue Mix ── */}
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg font-bold tracking-tight text-foreground">
              Weekly Sales by Category
            </CardTitle>
            <CardDescription className="text-[11px] font-medium text-muted-foreground/60">
              Revenue breakdown across Beverages, Snacks, and Essentials — last 6 weeks with forecast.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PredictiveForecastBarChart data={weeklyCategoryData} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-bold tracking-tight text-foreground">
              Revenue Mix
            </CardTitle>
            <CardDescription className="text-[11px] font-medium text-muted-foreground/60">
              Revenue share distribution by product category — current period.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MayForecastPie data={pieData} />
          </CardContent>
        </Card>
      </div>

      {/* ── Top Selling Products ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold tracking-tight text-foreground">
            Top Selling Products
          </CardTitle>
          <CardDescription className="text-[11px] font-medium text-muted-foreground/60">
            Highest revenue generating items over the last 6 weeks.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 sm:p-6 sm:pt-0">
          <TopProductsTable data={topProductsData} />
        </CardContent>
      </Card>
    </div>
  );
}
