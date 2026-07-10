/**
 * POS Inventory Management — Stock level data per category.
 *
 * Shows current stock vs. reorder threshold for key product categories.
 */

import { WEEK7_FORECAST_ROW } from "./resource-forecast";

/* ────────────────────────────────────────────────────────
   STOCK LEVEL vs. REORDER THRESHOLD
   ──────────────────────────────────────────────────────── */

export type VaccineStockRow = {
  vaccine: string;
  forecastDoses: number;
  currentStock: number;
  color: string;
};

/**
 * Compares projected weekly demand against current stock levels.
 * Flags categories approaching reorder point.
 */
export const VACCINE_STOCK_DATA: VaccineStockRow[] = [
  {
    vaccine: "Beverages (units)",
    forecastDoses: Math.round((WEEK7_FORECAST_ROW.beverages / 45) * 1.1),
    currentStock: Math.round(WEEK7_FORECAST_ROW.beverages / 40),
    color: "#38bdf8",
  },
  {
    vaccine: "Snacks (units)",
    forecastDoses: Math.round((WEEK7_FORECAST_ROW.snacks / 30) * 1.2),
    currentStock: Math.round(WEEK7_FORECAST_ROW.snacks / 28),
    color: "#10b981",
  },
  {
    vaccine: "Essentials (units)",
    forecastDoses: Math.round((WEEK7_FORECAST_ROW.essentials / 60) * 0.95),
    currentStock: Math.round(WEEK7_FORECAST_ROW.essentials / 55),
    color: "#a855f7",
  },
  {
    vaccine: "Other Products (units)",
    forecastDoses: Math.round((WEEK7_FORECAST_ROW.beverages * 0.3) / 50),
    currentStock: Math.round((WEEK7_FORECAST_ROW.beverages * 0.3) / 45),
    color: "#f59e0b",
  },
];
