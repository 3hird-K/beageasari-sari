import { MetricCards } from "@/components/dashboard/metric-cards";
import { ServiceImpactChart } from "@/components/dashboard/service-impact-chart";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { PredictiveForecastBarChart } from "@/components/dashboard/predictive-forecast-bar-chart";
import { MayForecastPie } from "@/components/dashboard/may-forecast-pie";
import { VaccineStockGauge } from "@/components/dashboard/capacity-gauge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
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
            <ServiceImpactChart />
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
            <PredictiveForecastBarChart />
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
            <MayForecastPie />
          </CardContent>
        </Card>
      </div>

      {/* ── Stock Level vs. Reorder Threshold ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold tracking-tight text-foreground">
            Stock Level vs. Reorder Threshold
          </CardTitle>
          <CardDescription className="text-[11px] font-medium text-muted-foreground/60">
            Projected weekly demand compared to current inventory — flags categories approaching reorder point.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VaccineStockGauge />
        </CardContent>
      </Card>
    </div>
  );
}
