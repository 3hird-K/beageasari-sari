/**
 * POS Inventory Management — Weekly Sales & Category Data.
 *
 * Simulates weekly sales performance data per product category.
 */
export type SalesWeekRow = {
  week: string;
  beverages: number;    // ₱ revenue
  snacks: number;
  essentials: number;
  projected?: boolean;
};

const WEEKS_1_TO_6: SalesWeekRow[] = [
  { week: "Week 1", beverages: 32400, snacks: 18200, essentials: 41500 },
  { week: "Week 2", beverages: 35100, snacks: 19800, essentials: 43200 },
  { week: "Week 3", beverages: 29800, snacks: 21400, essentials: 39800 },
  { week: "Week 4", beverages: 41200, snacks: 23100, essentials: 48600 },
  { week: "Week 5", beverages: 38700, snacks: 20500, essentials: 45300 },
  { week: "Week 6", beverages: 43900, snacks: 25800, essentials: 51200 },
];

function projectNext(values: number[]): number {
  const n = values.length;
  if (n < 2) return Math.round((values[0] ?? 0) * 10) / 10;
  const last = values[n - 1]!;
  const prev = values[n - 2]!;
  const trend = last - prev;
  return Math.round((last + trend * 0.8) * 10) / 10;
}

const week7: SalesWeekRow = {
  week: "Week 7 (pred.)",
  beverages: projectNext(WEEKS_1_TO_6.map((r) => r.beverages)),
  snacks: projectNext(WEEKS_1_TO_6.map((r) => r.snacks)),
  essentials: projectNext(WEEKS_1_TO_6.map((r) => r.essentials)),
  projected: true,
};

export const SENSOR_WEEKLY_SUMMARY: SalesWeekRow[] = [...WEEKS_1_TO_6, week7];

export const SENSOR_WEEKLY_CHART_ROWS = SENSOR_WEEKLY_SUMMARY;

/** For pie / radial: Sales distribution by category */
export function getActuatorUsageMix() {
  const totalBev = WEEKS_1_TO_6.reduce((s, r) => s + r.beverages, 0);
  const totalSnacks = WEEKS_1_TO_6.reduce((s, r) => s + r.snacks, 0);
  const totalEssentials = WEEKS_1_TO_6.reduce((s, r) => s + r.essentials, 0);
  const totalOther = Math.round(totalBev * 0.3);
  const total = totalBev + totalSnacks + totalEssentials + totalOther;
  return [
    {
      name: "Beverages",
      value: Math.round(totalBev / 1000),
      fill: "#38bdf8",
      pct: total ? Math.round((totalBev / total) * 100) : 0,
    },
    {
      name: "Snacks",
      value: Math.round(totalSnacks / 1000),
      fill: "#10b981",
      pct: total ? Math.round((totalSnacks / total) * 100) : 0,
    },
    {
      name: "Essentials",
      value: Math.round(totalEssentials / 1000),
      fill: "#a855f7",
      pct: total ? Math.round((totalEssentials / total) * 100) : 0,
    },
    {
      name: "Other",
      value: Math.round(totalOther / 1000),
      fill: "#f59e0b",
      pct: total ? Math.round((totalOther / total) * 100) : 0,
    },
  ];
}

export { week7 as WEEK7_FORECAST_ROW };
