import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatScore } from "@/lib/utils";

const GRID = "#e4ddd2";
const INK = "#1c1917";
const PRIMARY = "#1e4d3a";
const MUTED = "#6b645c";

function Tip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-border">
      <div className="mb-1 font-medium">{label}</div>
      {payload.map((p) => (
        <div key={p.name} className="flex justify-between gap-4 tabular-nums">
          <span className="text-muted-foreground">{p.name}</span>
          <span>{formatScore(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

export function DailyLineChart({
  data,
}: {
  data: Array<{ label: string; میانگین: number | null; انضباط: number | null }>
}) {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
          <XAxis dataKey="label" tick={{ fill: MUTED, fontSize: 11 }} axisLine={{ stroke: GRID }} />
          <YAxis domain={[0, 100]} tick={{ fill: MUTED, fontSize: 11 }} axisLine={{ stroke: GRID }} width={32} />
          <Tooltip content={<Tip />} />
          <Line type="monotone" dataKey="میانگین" stroke={PRIMARY} strokeWidth={2} dot={{ r: 3 }} connectNulls />
          <Line type="monotone" dataKey="انضباط" stroke="#8a8278" strokeWidth={1.5} dot={{ r: 2 }} connectNulls />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryBars({
  data,
}: {
  data: Array<{ name: string; درصد: number | null }>
}) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 12, left: 8, bottom: 4 }}>
          <CartesianGrid stroke={GRID} strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" domain={[0, 100]} tick={{ fill: MUTED, fontSize: 11 }} />
          <YAxis type="category" dataKey="name" width={88} tick={{ fill: INK, fontSize: 11 }} />
          <Tooltip content={<Tip />} />
          <Bar dataKey="درصد" fill={PRIMARY} radius={[0, 6, 6, 0]} maxBarSize={16} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryRadar({
  data,
}: {
  data: Array<{ subject: string; درصد: number }>
}) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke={GRID} />
          <PolarAngleAxis dataKey="subject" tick={{ fill: MUTED, fontSize: 10 }} />
          <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
          <Radar dataKey="درصد" stroke={PRIMARY} fill={PRIMARY} fillOpacity={0.18} />
          <Tooltip content={<Tip />} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function WeekTrend({
  data,
}: {
  data: Array<{ label: string; نمره: number | null }>
}) {
  return (
    <div className="h-48 w-full">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
          <XAxis dataKey="label" tick={{ fill: MUTED, fontSize: 11 }} />
          <YAxis domain={[0, 100]} tick={{ fill: MUTED, fontSize: 11 }} width={32} />
          <Tooltip content={<Tip />} />
          <Line type="monotone" dataKey="نمره" stroke={PRIMARY} strokeWidth={2.2} dot={{ r: 4 }} connectNulls />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SkillSmallMultiples({
  series,
}: {
  series: Array<{ name: string; data: Array<{ label: string; درصد: number | null }> }>
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {series.map((s) => (
        <div key={s.name} className="rounded-xl bg-muted/40 px-3 py-2">
          <div className="text-xs font-medium">{s.name}</div>
          <div className="h-24 w-full">
            <ResponsiveContainer>
              <LineChart data={s.data} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
                <XAxis dataKey="label" hide />
                <YAxis domain={[0, 100]} hide />
                <Tooltip content={<Tip />} />
                <Line
                  type="monotone"
                  dataKey="درصد"
                  stroke={PRIMARY}
                  strokeWidth={1.8}
                  dot={{ r: 2 }}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ))}
    </div>
  );
}
