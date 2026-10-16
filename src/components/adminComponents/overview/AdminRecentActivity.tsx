import React from 'react';

export const AdminRecentActivity: React.FC = () => {
  const recentActivities = [
    {
      id: 1,
      dot: 'bg-emerald-500',
      title: 'New family registered',
      detail: 'The Sullivan Family',
      time: '2 min ago'
    },
    {
      id: 2,
      dot: 'bg-purple-500',
      title: 'AI Story generated',
      detail: 'for Liam, age 4',
      time: '8 min ago'
    },
    {
      id: 3,
      dot: 'bg-sky-500',
      title: 'Nanny verified',
      detail: 'Siobhán Murphy',
      time: '14 min ago'
    },
    {
      id: 4,
      dot: 'bg-amber-500',
      title: 'Partner approved',
      detail: 'Sprout Organics',
      time: '27 min ago'
    },
    {
      id: 5,
      dot: 'bg-emerald-500',
      title: 'Subscription upgraded',
      detail: "O'Brien Family → Premium",
      time: '43 min ago'
    },
    {
      id: 6,
      dot: 'bg-rose-500',
      title: 'Support ticket opened',
      detail: 'Billing issue #TK-2841',
      time: '1 hr ago'
    },
    {
      id: 7,
      dot: 'bg-amber-400',
      title: 'Grocery item added',
      detail: 'Organic Snack Box by Sprout',
      time: '2 hrs ago'
    }
  ];

  return (
    <section className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
      <h3 className="text-base font-bold text-slate-900 leading-tight mb-6">
        Recent Activity
      </h3>

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
    </section>
  );
};
