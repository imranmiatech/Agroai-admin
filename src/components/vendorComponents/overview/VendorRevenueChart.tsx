import React, { useState } from 'react';

export interface RevenueDataPoint {
  month: string;
  amount: number;
}

interface VendorRevenueChartProps {
  data?: RevenueDataPoint[];
  currencySymbol?: string;
  isLoading?: boolean;
}

const DEFAULT_REVENUE_DATA: RevenueDataPoint[] = [
  { month: 'Apr', amount: 0 },
  { month: 'May', amount: 0 },
  { month: 'Jun', amount: 0 },
  { month: 'Jul', amount: 0 },
  { month: 'Aug', amount: 0 },
  { month: 'Sep', amount: 0 },
  { month: 'Oct', amount: 0 }
];

function createNaturalSpline(points: { x: number; y: number }[]): string {
  if (!points || points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x.toFixed(2)},${points[0].y.toFixed(2)}`;

  const n = points.length;
  const slopes = new Array(n);
  slopes[0] = (points[1].y - points[0].y) / (points[1].x - points[0].x);
  slopes[n - 1] = (points[n - 1].y - points[n - 2].y) / (points[n - 1].x - points[n - 2].x);

  for (let i = 1; i < n - 1; i++) {
    slopes[i] = (points[i + 1].y - points[i - 1].y) / (points[i + 1].x - points[i - 1].x);
  }

  let d = `M ${points[0].x.toFixed(2)},${points[0].y.toFixed(2)}`;
  for (let i = 0; i < n - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const dx = p1.x - p0.x;
    const cp1x = p0.x + dx / 3;
    const cp1y = p0.y + (slopes[i] * dx) / 3;
    const cp2x = p1.x - dx / 3;
    const cp2y = p1.y - (slopes[i + 1] * dx) / 3;
    d += ` C ${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${p1.x.toFixed(2)},${p1.y.toFixed(2)}`;
  }
  return d;
}

export const VendorRevenueChart: React.FC<VendorRevenueChartProps> = ({
  data = DEFAULT_REVENUE_DATA,
  currencySymbol = 'BDT',
  isLoading = false
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const chartData = data && data.length > 0 ? data : DEFAULT_REVENUE_DATA;

  // Maximum value: scaled dynamically to data or at least 100
  const maxVal = Math.max(100, ...chartData.map((d) => d.amount));
  
  // Y-axis labels from top to bottom
  const yLabels = [
    `${currencySymbol}${Math.round(maxVal).toLocaleString()}`,
    `${currencySymbol}${Math.round(maxVal * 0.75).toLocaleString()}`,
    `${currencySymbol}${Math.round(maxVal * 0.5).toLocaleString()}`,
    `${currencySymbol}${Math.round(maxVal * 0.25).toLocaleString()}`,
    `${currencySymbol}0`
  ];

  // Map data to SVG coordinates (0..100)
  const points = chartData.map((d, idx) => {
    const x = chartData.length > 1 ? (idx / (chartData.length - 1)) * 100 : 50;
    // Map amount: 0 -> y=100 (bottom), maxVal -> y=0 (top)
    const y = maxVal > 0 ? 100 - (d.amount / maxVal) * 100 : 100;
    return { x, y, amount: d.amount, month: d.month };
  });

  const splinePath = createNaturalSpline(points);
  const areaPath = `${splinePath} L 100,100 L 0,100 Z`;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between font-['Inter']">
      {/* Title */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
          Revenue
        </h2>
        {isLoading && (
          <span className="text-xs text-slate-400 animate-pulse">Updating...</span>
        )}
      </div>

      {/* Chart Canvas Area */}
      <div className="relative w-full">
        <div className="flex items-stretch gap-4">
          {/* Y-Axis Labels Column */}
          <div className="w-14 sm:w-16 h-52 flex flex-col justify-between text-right text-[11px] sm:text-xs text-slate-400 font-normal select-none pr-1">
            {yLabels.map((lbl, idx) => (
              <span key={idx} className="leading-none whitespace-nowrap">
                {lbl}
              </span>
            ))}
          </div>

          {/* SVG Spline & Gridlines Container */}
          <div className="relative flex-1 h-52 select-none">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="vendorRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0E4F5A" stopOpacity={0.22} />
                  <stop offset="100%" stopColor="#0E4F5A" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              {/* 5 Horizontal Gridlines aligned with Y ticks */}
              <line x1="0" y1="0" x2="100" y2="0" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="0" y1="25" x2="100" y2="25" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="0" y1="50" x2="100" y2="50" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="0" y1="75" x2="100" y2="75" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="0" y1="100" x2="100" y2="100" stroke="#F1F5F9" strokeWidth="1" />

              {/* Gradient Area Fill under the curve */}
              <path
                d={areaPath}
                fill="url(#vendorRevenueGradient)"
                className="transition-all duration-300"
              />

              {/* Smooth Spline Stroke Line */}
              <path
                d={splinePath}
                fill="none"
                stroke="#0E4F5A"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-300"
              />

              {/* Interactive Hover Guides & Indicator */}
              {hoveredIdx !== null && points[hoveredIdx] && (
                <g>
                  {/* Subtle vertical indicator line */}
                  <line
                    x1={points[hoveredIdx].x}
                    y1={0}
                    x2={points[hoveredIdx].x}
                    y2={100}
                    stroke="#CBD5E1"
                    strokeWidth="0.8"
                    strokeDasharray="1 1"
                  />
                  {/* Glowing Point Marker on Spline */}
                  <circle
                    cx={points[hoveredIdx].x}
                    cy={points[hoveredIdx].y}
                    r="1.5"
                    fill="#0E4F5A"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                  />
                </g>
              )}
            </svg>

            {/* Interactive invisible hover columns */}
            <div className="absolute inset-0 flex justify-between">
              {points.map((p, idx) => (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className="flex-1 h-full cursor-pointer relative"
                >
                  {hoveredIdx === idx && (
                    <div
                      className="absolute -top-10 left-1/2 -translate-x-1/2 z-20 bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-lg whitespace-nowrap pointer-events-none"
                    >
                      {p.month}: {currencySymbol}{p.amount.toLocaleString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* X-Axis Months Row */}
        <div className="flex justify-between text-[11px] sm:text-xs text-slate-400 font-normal pt-3 ml-14 sm:ml-16 select-none">
          {chartData.map((d, idx) => (
            <span
              key={idx}
              className={`transition-colors duration-150 ${
                hoveredIdx === idx ? 'text-slate-900 font-semibold' : ''
              }`}
            >
              {d.month}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
