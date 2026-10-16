import React, { useState } from 'react';

export const RevenueAndGrowthSection: React.FC = () => {
  const [userGrowthTimeframe, setUserGrowthTimeframe] = useState<'7D' | '30D' | '6M' | '12M'>('30D');

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Revenue & Membership Area Chart */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 leading-tight mb-5">
            Revenue
          </h3>

          {/* Area Chart with Labels */}
          <div className="relative w-full h-44 my-2">
            <div className="absolute left-0 top-0 bottom-6 w-8 flex flex-col justify-between text-[11px] text-slate-400">
              <span>€22k</span>
              <span>€17k</span>
              <span>€11k</span>
              <span>€6k</span>
              <span>€0k</span>
            </div>

            <div className="ml-10 h-36 relative">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="revenue-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0E4F5A" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#0E4F5A" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                {/* Subtle Grid Lines */}
                <line x1="0" y1="0" x2="100" y2="0" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="0" y1="25" x2="100" y2="25" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="0" y1="50" x2="100" y2="50" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="0" y1="75" x2="100" y2="75" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="0" y1="100" x2="100" y2="100" stroke="#F1F5F9" strokeWidth="1" />

                {/* Gradient Fill */}
                <path 
                  d="M0,65 Q16,55 33,52 T66,35 T100,20 L100,100 L0,100 Z" 
                  fill="url(#revenue-area)" 
                />
                {/* Spline Line */}
                <path 
                  d="M0,65 Q16,55 33,52 T66,35 T100,20" 
                  fill="none" 
                  stroke="#0E4F5A" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                />
              </svg>

              {/* X-axis months */}
              <div className="flex justify-between text-[11px] text-slate-400 pt-2">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom KPI Summaries */}
        <div className="grid grid-cols-3 pt-5 border-t border-slate-100 text-center">
          <div>
            <div className="text-base font-bold text-slate-900">€21.2k</div>
            <div className="text-[11px] text-slate-400 mt-0.5">MRR</div>
          </div>
          <div>
            <div className="text-base font-bold text-slate-900">€254k</div>
            <div className="text-[11px] text-slate-400 mt-0.5">ARR Run Rate</div>
          </div>
          <div>
            <div className="text-base font-bold text-slate-900">€86.8</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Avg Plan</div>
          </div>
        </div>
      </div>

      {/* User Growth Line Chart */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-slate-900 leading-tight">
              User Growth
            </h3>

            {/* Timeframe Filter Pills */}
            <div className="flex bg-slate-100 p-0.5 rounded-lg text-[11px] font-semibold text-slate-600">
              {(['7D', '30D', '6M', '12M'] as const).map((period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() => setUserGrowthTimeframe(period)}
                  className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                    userGrowthTimeframe === period 
                      ? 'bg-white text-slate-900 shadow-xs' 
                      : 'hover:text-slate-900'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          {/* Line Chart */}
          <div className="relative w-full h-44 my-2">
            <div className="absolute left-0 top-0 bottom-6 w-8 flex flex-col justify-between text-[11px] text-slate-400">
              <span>1600</span>
              <span>1200</span>
              <span>800</span>
              <span>400</span>
              <span>0</span>
            </div>

            <div className="ml-10 h-36 relative">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                <line x1="0" y1="0" x2="100" y2="0" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="0" y1="25" x2="100" y2="25" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="0" y1="50" x2="100" y2="50" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="0" y1="75" x2="100" y2="75" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="0" y1="100" x2="100" y2="100" stroke="#F1F5F9" strokeWidth="1" />

                {/* Growth Line in Orange */}
                <path 
                  d="M0,58 Q25,56 50,53 T100,48" 
                  fill="none" 
                  stroke="#F97316" 
                  strokeWidth="2.2" 
                  strokeLinecap="round" 
                />
              </svg>

              {/* X-axis dates */}
              <div className="flex justify-between text-[10px] text-slate-400 pt-2">
                <span>Jun 22</span>
                <span>Jun 26</span>
                <span>Jun 30</span>
                <span>Jul 4</span>
                <span>Jul 8</span>
                <span>Jul 12</span>
                <span>Jul 16</span>
                <span>Jul 20</span>
                <span>Jul 22</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
