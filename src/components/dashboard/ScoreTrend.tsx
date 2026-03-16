"use client";

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

interface ScoreTrendProps {
  data: {
    date: string;
    score: number;
  }[];
}

export default function ScoreTrend({ data }: ScoreTrendProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-3xl border border-slate-100 bg-white/50 text-slate-400 dark:border-slate-800 dark:bg-slate-900/50">
        <p className="text-sm font-medium">No trend data yet</p>
      </div>
    );
  }

  // Reverse data for trend if it's descending by date
  const chartData = [...data].reverse();

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ffffff" stopOpacity={0.05} />
              <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#2a2a2a"
          />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#666666", fontSize: 10, fontFamily: "Geist Mono", fontWeight: 500 }}
            dy={10}
          />
          <YAxis
            domain={[0, 10]}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#666666", fontSize: 10, fontFamily: "Geist Mono", fontWeight: 500 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#111111",
              borderRadius: "8px",
              border: "1px solid #2a2a2a",
              fontSize: "10px",
              fontFamily: "Geist Mono",
              color: "#ededed",
            }}
            itemStyle={{ color: "#ededed" }}
          />
          <Area
            type="monotone"
            dataKey="score"
            stroke="#ffffff"
            strokeWidth={1.5}
            fillOpacity={1}
            fill="url(#colorScore)"
            dot={{ r: 3, fill: "#0a0a0a", strokeWidth: 1.5, stroke: "#ffffff" }}
            activeDot={{ r: 4, fill: "#ffffff", strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
