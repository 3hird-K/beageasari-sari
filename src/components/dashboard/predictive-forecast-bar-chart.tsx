"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SENSOR_WEEKLY_CHART_ROWS } from "@/data/resource-forecast";
import { cn } from "@/lib/utils";

const BAR_BEVERAGES = "#38bdf8";
const BAR_SNACKS = "#10b981";
const BAR_ESSENTIALS = "#a855f7";

function BarTooltip({
  active,
  label,
  payload,
}: {
  active?: boolean;
  label?: string;
  payload?: ReadonlyArray<{ name?: string; value?: number; color?: string }>;
}) {
  if (!active || !payload?.length) return null;
  const projected = String(label).includes("pred");
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-xl",
        "text-popover-foreground",
      )}
    >
      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
        {projected ? (
          <span className="ml-2 text-orange-500 dark:text-orange-400">· Forecast</span>
        ) : null}
      </p>
      <ul className="space-y-1">
        {payload.map((p) => (
          <li key={String(p.name)} className="flex justify-between gap-6 text-muted-foreground">
            <span>{p.name}</span>
            <span className="font-semibold tabular-nums text-foreground">
              ₱{Number(p.value).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PredictiveForecastBarChart() {
  return (
    <div className="h-[300px] w-full md:h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={SENSOR_WEEKLY_CHART_ROWS}
          margin={{ top: 8, right: 8, left: -8, bottom: 0 }}
          barGap={2}
          barCategoryGap="18%"
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-border/80" vertical={false} />
          <XAxis
            dataKey="week"
            tick={{ fontSize: 11, fill: "currentColor" }}
            className="text-muted-foreground"
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "currentColor" }}
            className="text-muted-foreground"
            axisLine={false}
            tickLine={false}
            width={36}
          />
          <Tooltip content={<BarTooltip />} cursor={false} />
          <Legend
            wrapperStyle={{ fontSize: 11, paddingTop: 12 }}
            formatter={(value) => (
              <span className="text-muted-foreground capitalize">{String(value)}</span>
            )}
          />
          <Bar
            dataKey="beverages"
            name="Beverages (₱)"
            fill={BAR_BEVERAGES}
            radius={[4, 4, 0, 0]}
            maxBarSize={28}
          />
          <Bar
            dataKey="snacks"
            name="Snacks (₱)"
            fill={BAR_SNACKS}
            radius={[4, 4, 0, 0]}
            maxBarSize={28}
          />
          <Bar
            dataKey="essentials"
            name="Essentials (₱)"
            fill={BAR_ESSENTIALS}
            radius={[4, 4, 0, 0]}
            maxBarSize={28}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
