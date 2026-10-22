import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';

export const ConsultationActivityChart: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'7D' | '30D' | '3M'>('7D');
  const [hoveredDayIndex, setHoveredDayIndex] = useState<number | null>(null);

  const chartDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const receivedData = [18, 24, 32, 28, 35, 22, 19];
  const resolvedData = [15, 21, 30, 26, 33, 20, 18];

  const maxVal = 40;
  const getY = (val: number) => {
    const clamped = Math.max(0, Math.min(maxVal, val));
    return 190 - (clamped / maxVal) * 150;
  };

  const getX = (index: number) => {
    return 45 + index * 95;
  };

  const makeSmoothPath = (data: number[]) => {
    const points = data.map((d, i) => ({ x: getX(i), y: getY(d) }));
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX = (p0.x + p1.x) / 2;
      d += ` C ${cpX} ${p0.y}, ${cpX} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  const receivedPath = makeSmoothPath(receivedData);
  const resolvedPath = makeSmoothPath(resolvedData);
  const resolvedAreaPath = `${resolvedPath} L ${getX(6)} 190 L ${getX(0)} 190 Z`;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Weekly Consultation & Diagnosis Velocity
            </h2>
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              <TrendingUp className="w-3 h-3" />
              94.2% Resolution Rate
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Compare incoming farmer inquiries against prescriptions and advisories provided.
          </p>
        </div>

        {/* Legend & Timeframe */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Resolved Prescriptions</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
              <span>Incoming Inquiries</span>
            </span>
          </div>

          <div className="flex items-center bg-[#F1F5F9] p-1 rounded-xl">
            {(['7D', '30D', '3M'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  timeframe === t
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative w-full overflow-x-auto select-none pt-2">
        <svg
          viewBox="0 0 680 230"
          className="w-full min-w-[580px] h-[210px] overflow-visible"
        >
          <defs>
            <linearGradient id="resolvedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 10, 20, 30, 40].map((v) => {
            const y = getY(v);
            return (
              <g key={v}>
                <line
                  x1="35"
                  y1={y}
                  x2="660"
                  y2={y}
                  stroke="#F1F5F9"
                  strokeWidth="1"
                />
                <text
                  x="20"
                  y={y + 4}
                  fontSize="11"
                  fill="#94A3B8"
                  textAnchor="end"
                  fontFamily="Inter"
                >
                  {v}
                </text>
              </g>
            );
          })}

          {/* Shaded Area for Resolved */}
          <path d={resolvedAreaPath} fill="url(#resolvedGradient)" />

          {/* Inquiries Incoming Line */}
          <path
            d={receivedPath}
            fill="none"
            stroke="#38BDF8"
            strokeWidth="2.5"
            strokeDasharray="4 4"
          />

          {/* Resolved Line */}
          <path
            d={resolvedPath}
            fill="none"
            stroke="#10B981"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Data Points & Hover interaction */}
          {chartDays.map((day, i) => {
            const x = getX(i);
            const yResolved = getY(resolvedData[i]);
            const yReceived = getY(receivedData[i]);
            const isHovered = hoveredDayIndex === i;

            return (
              <g
                key={day}
                onMouseEnter={() => setHoveredDayIndex(i)}
                onMouseLeave={() => setHoveredDayIndex(null)}
                className="cursor-pointer"
              >
                {/* Vertical hover guide */}
                {isHovered && (
                  <line
                    x1={x}
                    y1={30}
                    x2={x}
                    y2={190}
                    stroke="#CBD5E1"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                )}

                {/* Received Dot */}
                <circle
                  cx={x}
                  cy={yReceived}
                  r={isHovered ? 5 : 3.5}
                  fill="#38BDF8"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />

                {/* Resolved Dot */}
                <circle
                  cx={x}
                  cy={yResolved}
                  r={isHovered ? 6 : 4.5}
                  fill="#10B981"
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                />

                {/* Day label */}
                <text
                  x={x}
                  y="215"
                  fontSize="12"
                  fontWeight={isHovered ? '700' : '500'}
                  fill={isHovered ? '#0F172A' : '#64748B'}
                  textAnchor="middle"
                  fontFamily="Inter"
                >
                  {day}
                </text>

                {/* Tooltip on Hover */}
                {isHovered && (
                  <g>
                    <rect
                      x={x - 55}
                      y={yResolved - 48}
                      width="110"
                      height="38"
                      rx="8"
                      fill="#062E35"
                      filter="drop-shadow(0 4px 6px rgba(0,0,0,0.25))"
                    />
                    <text
                      x={x}
                      y={yResolved - 32}
                      fontSize="10"
                      fill="#CBFF54"
                      fontWeight="600"
                      textAnchor="middle"
                      fontFamily="Inter"
                    >
                      Resolved: {resolvedData[i]} cases
                    </text>
                    <text
                      x={x}
                      y={yResolved - 18}
                      fontSize="9.5"
                      fill="#E2E8F0"
                      textAnchor="middle"
                      fontFamily="Inter"
                    >
                      Inquiries: {receivedData[i]}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
