"use client";

import { VACCINE_STOCK_DATA } from "@/data/forecast-advanced";

export function VaccineStockGauge({ data }: { data?: any[] }) {
  const displayData = data && data.length > 0 ? data : VACCINE_STOCK_DATA;

  return (
    <div className="w-full space-y-5">
      {displayData.map((row) => {
        const pct = Math.min(
          100,
          Math.round((row.forecastDoses / row.currentStock) * 100),
        );
        const isHighUsage = pct >= 85;
        const isOverCapacity = pct >= 95;

        return (
          <div key={row.vaccine} className="space-y-1.5">
            {/* Labels row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 text-xs">
              <span className="font-bold text-foreground truncate">
                {row.vaccine}
              </span>
              <div className="flex items-center gap-1 tabular-nums text-muted-foreground/80 flex-wrap">
                <span
                  className="font-bold"
                  style={{
                    color: isOverCapacity
                      ? "#ef4444"
                      : isHighUsage
                      ? "#f59e0b"
                      : row.color,
                  }}
                >
                  {row.forecastDoses} needed
                </span>
                <span className="text-[10px] opacity-40">vs.</span>
                <span className="font-semibold">{row.currentStock} in stock</span>
                <span className="ml-auto sm:ml-1 text-[10px] font-bold text-muted-foreground/60">
                  ({pct}%)
                </span>
              </div>
            </div>

            {/* Bullet bar */}
            <div className="relative h-6 w-full overflow-hidden rounded-lg bg-muted/20 border border-border/5">
              {/* Usage zone backgrounds */}
              <div
                className="absolute inset-y-0 left-0 opacity-10"
                style={{ width: "70%", background: "#22c55e" }}
              />
              <div
                className="absolute inset-y-0 opacity-10"
                style={{ left: "70%", width: "15%", background: "#f59e0b" }}
              />
              <div
                className="absolute inset-y-0 opacity-10"
                style={{ left: "85%", width: "15%", background: "#ef4444" }}
              />

              {/* Stock demand bar */}
              <div
                className="absolute inset-y-0 left-0 rounded-lg transition-all duration-1000 ease-out"
                style={{
                  width: `${pct}%`,
                  background: `linear-gradient(90deg, ${row.color}bb, ${row.color})`,
                  boxShadow: `0 0 15px ${row.color}30`,
                }}
              />

              {/* Capacity limit marker */}
              <div
                className="absolute inset-y-0 w-1 bg-foreground/30"
                style={{ left: "100%" }}
              />

              {/* 85% warning threshold */}
              <div
                className="absolute inset-y-0 w-px bg-amber-500/40"
                style={{ left: "85%" }}
              />
            </div>

            {/* Status indicator */}
            <div className="flex items-start gap-2 text-[10px] leading-tight">
              <span
                className="mt-1 size-1.5 shrink-0 rounded-full animate-pulse"
                style={{
                  background: isOverCapacity
                    ? "#ef4444"
                    : isHighUsage
                    ? "#f59e0b"
                    : "#22c55e",
                }}
              />
              <span className="font-medium text-muted-foreground/80">
                {isOverCapacity
                  ? "Critical — stock may run out before next delivery"
                  : isHighUsage
                  ? "High demand — consider reordering soon"
                  : "Adequate stock — within safe inventory levels"}
              </span>
            </div>
          </div>
        );
      })}

      {/* Footer legend */}
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t border-border/40 pt-4">
        {[
          { label: "Safe", color: "#22c55e", sub: "<70%" },
          { label: "Reorder", color: "#f59e0b", sub: "70-85%" },
          { label: "Critical", color: "#ef4444", sub: ">85%" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span
              className="size-2.5 rounded-sm opacity-50"
              style={{ background: item.color }}
            />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 leading-none">
                {item.label}
              </span>
              <span className="text-[8px] font-medium text-muted-foreground/40 mt-0.5">
                {item.sub}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
