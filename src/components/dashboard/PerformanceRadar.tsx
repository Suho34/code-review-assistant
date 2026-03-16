"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

interface PerformanceRadarProps {
  data: {
    clarity: number;
    depth: number;
    communication: number;
    technicalAccuracy: number;
  } | null;
}

export default function PerformanceRadar({ data }: PerformanceRadarProps) {
  if (!data) {
    return (
      <div className="flex h-64 items-center justify-center rounded-3xl border border-slate-100 bg-white/50 text-slate-400 dark:border-slate-800 dark:bg-slate-900/50">
        <p className="text-sm font-medium">No performance data yet</p>
      </div>
    );
  }

  const chartData = [
    { subject: "Clarity", A: data.clarity, fullMark: 10 },
    { subject: "Depth", A: data.depth, fullMark: 10 },
    { subject: "Communication", A: data.communication, fullMark: 10 },
    { subject: "Accuracy", A: data.technicalAccuracy, fullMark: 10 },
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid stroke="#2a2a2a" strokeDasharray="3 3" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "#666666", fontSize: 10, fontFamily: "Geist Mono", fontWeight: 500 }}
          />
          <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
          <Radar
            name="Performance"
            dataKey="A"
            stroke="#ffffff"
            strokeWidth={1.5}
            fill="#ffffff"
            fillOpacity={0.1}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
