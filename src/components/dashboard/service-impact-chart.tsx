"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const SALES_COLOR = "#10b981";
const TRANSACTIONS_COLOR = "#38bdf8";
const RETURNS_COLOR = "#f59e0b";

const chartData = [
  { time: "06:00", sales: 1200, transactions: 4, returns: 0 },
  { time: "08:00", sales: 4500, transactions: 14, returns: 1 },
  { time: "09:00", sales: 7800, transactions: 22, returns: 2 },
  { time: "10:00", sales: 11200, transactions: 31, returns: 1 },
  { time: "11:00", sales: 15600, transactions: 43, returns: 3 },
  { time: "12:00", sales: 22400, transactions: 62, returns: 4 },
  { time: "13:00", sales: 28900, transactions: 80, returns: 5 },
  { time: "14:00", sales: 34200, transactions: 95, returns: 6 },
  { time: "15:00", sales: 40100, transactions: 112, returns: 7 },
  { time: "16:00", sales: 44800, transactions: 125, returns: 7 },
  { time: "17:00", sales: 48250, transactions: 134, returns: 8 },
];

type ChartRow = (typeof chartData)[number];

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: ReadonlyArray<{ payload?: ChartRow }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const row = payload[0]?.payload;
  if (!row) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-lg">
      <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <div className="space-y-0.5">
        <p>
          <span className="font-semibold" style={{ color: SALES_COLOR }}>
            ₱{row.sales.toLocaleString()}
          </span>{" "}
          <span className="text-muted-foreground">revenue</span>
        </p>
        <p>
          <span className="font-semibold" style={{ color: TRANSACTIONS_COLOR }}>
            {row.transactions}
          </span>{" "}
          <span className="text-muted-foreground">transactions</span>
        </p>
        <p>
          <span className="font-semibold" style={{ color: RETURNS_COLOR }}>
            {row.returns}
          </span>{" "}
          <span className="text-muted-foreground">returns</span>
        </p>
      </div>
    </div>
  );
}

export function ServiceImpactChart() {
  return (
    <div className="space-y-4">
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 8, right: 12, left: -8, bottom: 4 }}
          >
            <defs>
              <linearGradient id="fillSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={SALES_COLOR} stopOpacity={0.3} />
                <stop offset="95%" stopColor={SALES_COLOR} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="fillTransactions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={TRANSACTIONS_COLOR} stopOpacity={0.25} />
                <stop offset="95%" stopColor={TRANSACTIONS_COLOR} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="fillReturns" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={RETURNS_COLOR} stopOpacity={0.25} />
                <stop offset="95%" stopColor={RETURNS_COLOR} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-border"
              vertical={false}
            />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10 }}
              className="fill-muted-foreground"
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10 }}
              className="fill-muted-foreground"
              axisLine={false}
              tickLine={false}
              width={28}
            />
            <Tooltip content={<ChartTooltip />} />
            <Area
              type="monotone"
              dataKey="sales"
              stroke={SALES_COLOR}
              strokeWidth={2}
              fill="url(#fillSales)"
            />
            <Area
              type="monotone"
              dataKey="transactions"
              stroke={TRANSACTIONS_COLOR}
              strokeWidth={2}
              fill="url(#fillTransactions)"
            />
            <Area
              type="monotone"
              dataKey="returns"
              stroke={RETURNS_COLOR}
              strokeWidth={2}
              fill="url(#fillReturns)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-2">
          <span
            className="size-2 rounded-full"
            style={{ background: SALES_COLOR }}
          />
          Revenue (₱)
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="size-2 rounded-full" style={{ background: TRANSACTIONS_COLOR }} />
          Transactions (#)
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="size-2 rounded-full" style={{ background: RETURNS_COLOR }} />
          Returns (#)
        </span>
      </div>
    </div>
  );
}
