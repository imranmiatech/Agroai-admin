import React, { useState } from 'react';

export const OfferPerformanceChart: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'7D' | '30D' | '3M'>('7D');
  const [hoveredDayIndex, setHoveredDayIndex] = useState<number | null>(null);

  const chartDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const viewsData = [310, 335, 430, 415, 460, 350, 340];
  const savesData = [30, 38, 42, 36, 48, 32, 28];
  const redemptionsData = [15, 18, 22, 20, 28, 19, 16];

  const getY = (val: number) => {
    const clamped = Math.max(0, Math.min(600, val));
    return 230 - (clamped / 600) * 200;
  };

  const getX = (index: number) => {
    return 50 + index * 100;
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

  const viewsPath = makeSmoothPath(viewsData);
  const savesPath = makeSmoothPath(savesData);
  const redemptionsPath = makeSmoothPath(redemptionsData);
  const viewsAreaPath = `${viewsPath} L ${getX(6)} 230 L ${getX(0)} 230 Z`;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col gap-4">
      {/* Card Header & Timeframe Pills */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-900">
          Offer Performance
        </h2>
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

      {/* Interactive SVG Chart */}
      <div className="relative w-full h-64 select-none">
        <svg 
          viewBox="0 0 700 260" 
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Gridlines & Y-Axis labels */}
          {[
            { val: 600, y: 30 },
            { val: 450, y: 80 },
            { val: 300, y: 130 },
            { val: 150, y: 180 },
            { val: 0, y: 230 }
          ].map((tick) => (
            <g key={tick.val}>
              <text
                x="30"
                y={tick.y + 4}
                textAnchor="end"
                className="fill-slate-400 text-[11px] font-medium select-none"
              >
                {tick.val}
              </text>
              <line
                x1="45"
                y1={tick.y}
                x2="680"
                y2={tick.y}
                stroke="#F1F5F9"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            </g>
          ))}

          {/* Views Area Fill */}
          <path
            d={viewsAreaPath}
            fill="url(#viewsGradient)"
          />

          {/* Views Curve (Blue) */}
          <path
            d={viewsPath}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Saves Curve (Purple) */}
          <path
            d={savesPath}
            fill="none"
            stroke="#8B5CF6"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Redemptions Curve (Emerald/Green) */}
          <path
            d={redemptionsPath}
            fill="none"
            stroke="#10B981"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Data Points and Hover triggers */}
          {chartDays.map((day, idx) => {
            const x = getX(idx);
            const yViews = getY(viewsData[idx]);
            const isHovered = hoveredDayIndex === idx;

            return (
              <g 
                key={day}
                onMouseEnter={() => setHoveredDayIndex(idx)}
                onMouseLeave={() => setHoveredDayIndex(null)}
                className="cursor-pointer"
              >
                {/* Vertical hover guide bar */}
                {isHovered && (
                  <line
                    x1={x}
                    y1="30"
                    x2={x}
                    y2="230"
                    stroke="#CBD5E1"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                )}

                {/* Views node dot */}
                <circle
                  cx={x}
                  cy={yViews}
                  r={isHovered ? 5 : 3.5}
                  fill="#3B82F6"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  className="transition-all"
                />

                {/* X-axis Day label */}
                <text
                  x={x}
                  y="252"
                  textAnchor="middle"
                  className={`text-[12px] font-medium transition-colors ${
                    isHovered ? 'fill-slate-900 font-bold' : 'fill-slate-400'
                  }`}
                >
                  {day}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip when hovering a point */}
        {hoveredDayIndex !== null && (
          <div 
            className="absolute z-20 pointer-events-none -top-2 bg-slate-900 text-white rounded-xl px-3 py-2 text-xs shadow-xl flex flex-col gap-1 -translate-x-1/2"
            style={{ left: `${(getX(hoveredDayIndex) / 700) * 100}%` }}
          >
            <span className="font-bold text-slate-300 border-b border-slate-700 pb-0.5">
              {chartDays[hoveredDayIndex]}
            </span>
            <div className="flex items-center justify-between gap-3 text-[11px]">
              <span className="text-blue-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span> Views:
              </span>
              <span className="font-semibold">{viewsData[hoveredDayIndex]}</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-[11px]">
              <span className="text-purple-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span> Saves:
              </span>
              <span className="font-semibold">{savesData[hoveredDayIndex]}</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-[11px]">
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Redemptions:
              </span>
              <span className="font-semibold">{redemptionsData[hoveredDayIndex]}</span>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 pt-2 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-2 text-slate-600">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
          <span>Redemptions</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]"></span>
          <span>Saves</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]"></span>
          <span>Views</span>
        </div>
      </div>
    </div>
  );
};
