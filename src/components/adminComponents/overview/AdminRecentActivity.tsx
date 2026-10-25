import React from 'react';
import { useGetPlatformMetricsQuery } from '../../../redux';

export const AdminRecentActivity: React.FC = () => {
  const { data: metrics } = useGetPlatformMetricsQuery();
  const recentActivities = metrics?.recentActivity || [];

  return (
    <section className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
      <h3 className="text-base font-bold text-slate-900 leading-tight mb-6">
        Recent Activity
      </h3>

      {recentActivities.length === 0 ? (
        <div className="py-6 text-center text-xs text-slate-400">
          No recent activity found
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-slate-100">
          {recentActivities.map((act) => (
            <div key={act.id} className="py-3.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
              <div className="flex items-center gap-3">
                <span className={`w-2.5 h-2.5 rounded-full ${act.dot} shrink-0`} />
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold text-slate-900">{act.title}</span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs text-slate-500">{act.detail}</span>
                </div>
              </div>
              <span className="text-xs text-slate-400 shrink-0">
                {act.time}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
