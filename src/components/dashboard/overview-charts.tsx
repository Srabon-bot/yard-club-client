"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatBDT } from "@/lib/format";
import type { Analytics, CategoryId } from "@/lib/types";

const LIME = "#a9d800";
const INK = "#060605";

const TOOLTIP_STYLE = {
  background: "var(--surface)",
  border: "2px solid var(--ink)",
  borderRadius: 6,
  boxShadow: "3px 3px 0 var(--ink)",
  fontFamily: "var(--font-code)",
  fontSize: 11,
  color: "var(--foreground)",
  padding: "6px 10px",
};

export const CATEGORY_COLORS: Record<CategoryId, string> = {
  construction: "#a9d800",
  photography: "#2c65f5",
  vehicles: "#f3524a",
  agriculture: "#008f61",
  electronics: "#e7a200",
  event: "#8b5cf6",
};

export const CATEGORY_LABEL: Record<CategoryId, string> = {
  construction: "Construction",
  photography: "Photography",
  vehicles: "Vehicles",
  agriculture: "Agriculture",
  electronics: "Electronics",
  event: "Event",
};

function Axis() {
  return {
    tick: {
      fill: "var(--ink-soft)",
      fontSize: 10,
      fontFamily: "var(--font-code)",
    },
    axisLine: { stroke: "var(--ink)", strokeWidth: 1.5 },
    tickLine: false,
  } as const;
}

export function RevenueChart({ months }: { months: Analytics["months"] }) {
  return (
    <div className="h-[228px] w-full" aria-hidden="true">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={months} margin={{ top: 8, right: 2, bottom: 0, left: -14 }}>
          <CartesianGrid
            vertical={false}
            stroke="var(--ink)"
            strokeOpacity={0.12}
            strokeDasharray="3 4"
          />
          <XAxis dataKey="month" {...Axis()} />
          <YAxis
            {...Axis()}
            tickFormatter={(value: number) => `${Math.round(value / 1000)}k`}
          />
          <Tooltip
            cursor={{ fill: "var(--ink)", fillOpacity: 0.06 }}
            contentStyle={TOOLTIP_STYLE}
            labelStyle={{ color: "var(--ink-soft)", marginBottom: 2 }}
            formatter={(value) => [
              formatBDT(Number(value)),
              "Revenue",
            ]}
          />
          <Bar
            dataKey="revenue"
            fill={LIME}
            stroke={INK}
            strokeWidth={1.5}
            radius={[2, 2, 0, 0]}
            maxBarSize={26}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function BookingsChart({ months }: { months: Analytics["months"] }) {
  return (
    <div className="h-[228px] w-full" aria-hidden="true">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={months} margin={{ top: 10, right: 6, bottom: 0, left: -22 }}>
          <CartesianGrid
            vertical={false}
            stroke="var(--ink)"
            strokeOpacity={0.12}
            strokeDasharray="3 4"
          />
          <XAxis dataKey="month" {...Axis()} />
          <YAxis {...Axis()} />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            labelStyle={{ color: "var(--ink-soft)", marginBottom: 2 }}
            formatter={(value) => [Number(value), "Bookings"]}
          />
          <Line
            type="stepAfter"
            dataKey="bookings"
            stroke={INK}
            strokeWidth={2}
            dot={{ r: 2.5, fill: LIME, stroke: INK, strokeWidth: 1.5 }}
            activeDot={{ r: 4, fill: LIME, stroke: INK, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryDonut({
  data,
}: {
  data: Analytics["byCategory"];
}) {
  const total = data.reduce((sum, entry) => sum + entry.count, 0);

  return (
    <div className="grid gap-4 sm:grid-cols-[160px_1fr] sm:items-center">
      <div className="relative mx-auto h-[160px] w-[160px]" aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="category"
              innerRadius={52}
              outerRadius={76}
              paddingAngle={2}
              stroke={INK}
              strokeWidth={2}
            >
              {data.map((entry) => (
                <Cell
                  key={entry.category}
                  fill={CATEGORY_COLORS[entry.category]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              formatter={(value, name) => [
                `${Number(value)} listings`,
                CATEGORY_LABEL[name as CategoryId] ?? name,
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
          <span className="font-mono text-2xl font-medium tabular-nums">
            {total}
          </span>
          <span className="mt-0.5 block font-mono text-[8px] uppercase tracking-[0.12em] text-ink-soft">
            listings
          </span>
        </div>
      </div>

      <ul className="grid gap-1.5">
        {data.map((entry) => (
          <li
            key={entry.category}
            className="flex items-center justify-between gap-3 border-b border-dotted border-ink/20 pb-1.5 text-xs last:border-b-0 last:pb-0"
          >
            <span className="inline-flex items-center gap-2">
              <i
                className="size-2.5 rounded-[2px] border border-ink/30"
                style={{ background: CATEGORY_COLORS[entry.category] }}
                aria-hidden="true"
              />
              {CATEGORY_LABEL[entry.category]}
            </span>
            <span className="font-mono text-[11px] tabular-nums text-ink-soft">
              {entry.count}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function MiniSparkline({ values }: { values: number[] }) {
  const data = values.map((value, index) => ({ index, value }));
  return (
    <div className="h-10 w-full" aria-hidden="true">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={LIME}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
