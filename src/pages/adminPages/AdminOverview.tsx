import { useState } from 'react';
import { 
  Users, 
  Heart,
  UserCheck, 
  CreditCard,
  Store, 
  DollarSign,
  Headphones, 
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2, 
  Zap, 
  AlertCircle,
  TrendingDown,
  Activity,
  Star,
  Gift,
  Clock,
  Package,
  RotateCcw,
  ShieldCheck,
  Eye,
  ExternalLink
} from 'lucide-react';

export const AdminOverview = () => {
  const [userGrowthTimeframe, setUserGrowthTimeframe] = useState<'7D' | '30D' | '6M' | '12M'>('30D');

  // 8 Platform Overview Metric Cards matching Figma node 28406:44195
  const platformMetrics = [
    {
      id: 'parents',
      value: '962',
      label: 'Parents',
      change: '+5.7%',
      isPositive: true,
      icon: <Users className="w-4 h-4 text-sky-600" />,
      iconBg: 'bg-sky-50',
      waveColor: '#14B8A6'
    },
    {
      id: 'children',
      value: '1,458',
      label: 'Children',
      change: '+5.7%',
      isPositive: true,
      icon: <Heart className="w-4 h-4 text-rose-500" />,
      iconBg: 'bg-rose-50',
      waveColor: '#14B8A6'
    },
    {
      id: 'nannies',
      value: '397',
      label: 'Verified Nannies',
      change: '+5.7%',
      isPositive: true,
      icon: <UserCheck className="w-4 h-4 text-purple-600" />,
      iconBg: 'bg-purple-50',
      waveColor: '#14B8A6'
    },
    {
      id: 'members',
      value: '244',
      label: 'Active Members',
      change: '+5.7%',
      isPositive: true,
      icon: <CreditCard className="w-4 h-4 text-cyan-600" />,
      iconBg: 'bg-cyan-50',
      waveColor: '#14B8A6'
    },
    {
      id: 'partner-stores',
      value: '37',
      label: 'Partner Stores',
      change: '+5.7%',
      isPositive: true,
      icon: <Store className="w-4 h-4 text-amber-500" />,
      iconBg: 'bg-amber-50',
      waveColor: '#14B8A6'
    },
    {
      id: 'revenue',
      value: '€21.2k',
      label: 'Monthly Revenue',
      change: '+9.4%',
      isPositive: true,
      icon: <DollarSign className="w-4 h-4 text-emerald-600" />,
      iconBg: 'bg-emerald-50',
      waveColor: '#14B8A6'
    },
    {
      id: 'tickets',
      value: '28',
      label: 'Support Tickets',
      change: '-31.7%',
      isPositive: false,
      icon: <Headphones className="w-4 h-4 text-orange-500" />,
      iconBg: 'bg-orange-50',
      waveColor: '#F97316'
    },
    {
      id: 'ai-requests',
      value: '2,678',
      label: 'AI Requests Today',
      change: '+5.7%',
      isPositive: true,
      icon: <Sparkles className="w-4 h-4 text-indigo-500" />,
      iconBg: 'bg-indigo-50',
      waveColor: '#14B8A6'
    }
  ];

  // Top Drop-off Screens
  const dropoffScreens = [
    { screen: 'Invite Nanny', level: 'high', rate: 61, badgeColor: 'bg-rose-50 text-rose-600' },
    { screen: 'Subscription Checkout', level: 'medium', rate: 32, badgeColor: 'bg-amber-50 text-amber-600' },
    { screen: 'Weekly Insights', level: 'low', rate: 21, badgeColor: 'bg-slate-100 text-slate-600' },
    { screen: 'Profile Setup', level: 'low', rate: 18, badgeColor: 'bg-slate-100 text-slate-600' },
    { screen: 'Data Sync', level: 'medium', rate: 35, badgeColor: 'bg-amber-50 text-amber-600' },
    { screen: 'Feature Tour', level: 'high', rate: 60, badgeColor: 'bg-rose-50 text-rose-600' }
  ];

  // Feature Adoption
  const featureAdoption = [
    { name: 'Daily Planner', rate: 78 },
    { name: 'AI Stories', rate: 71 },
    { name: 'Weekly Insights', rate: 62 },
    { name: 'Nanny Matching', rate: 54 },
    { name: 'Grocery Lists', rate: 29 },
    { name: 'Messaging', rate: 24 },
    { name: 'Rewards', rate: 18 }
  ];

  // Document Verification Counts
  const docVerification = [
    { label: 'Pending Review', count: 12, color: 'text-amber-500' },
    { label: 'Approved', count: 284, color: 'text-emerald-500' },
    { label: 'Rejected', count: 8, color: 'text-rose-500' },
    { label: 'Expired', count: 5, color: 'text-amber-600' },
    { label: 'Verified Rate', count: '93%', color: 'text-slate-900 font-semibold' }
  ];

  // Recent Activity Items
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
    <div className="flex flex-col gap-8 pb-12 font-['Inter']">
      {/* 1. Good Morning Banner (Exact Figma Gradient Banner) */}
      <div 
        className="rounded-2xl p-6 sm:p-7 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm"
        style={{
          background: 'linear-gradient(135deg, #062E35 0%, #0A434D 100%)'
        }}
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Good morning 👋
          </h1>
          <p className="text-[#9DB9BF] text-sm mt-1">
            Here's a snapshot of your platform today.
          </p>
        </div>

        {/* 3 Status Pills */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Platform Healthy */}
          <div className="flex items-center gap-3 bg-white/10 hover:bg-white/15 backdrop-blur-xs px-4 py-2.5 rounded-xl border border-white/10 transition-colors">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-white leading-tight">Platform Healthy</span>
              <span className="text-[11px] text-[#A2C2C8]">99.9% uptime</span>
            </div>
          </div>

          {/* AI Services Active */}
          <div className="flex items-center gap-3 bg-white/10 hover:bg-white/15 backdrop-blur-xs px-4 py-2.5 rounded-xl border border-white/10 transition-colors">
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0">
              <Zap className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-white leading-tight">AI Services Active</span>
              <span className="text-[11px] text-[#A2C2C8]">All systems go</span>
            </div>
          </div>

          {/* 3 Urgent Tasks */}
          <div className="flex items-center gap-3 bg-[#69291D]/80 hover:bg-[#69291D] backdrop-blur-xs px-4 py-2.5 rounded-xl border border-red-500/30 transition-colors">
            <div className="w-6 h-6 rounded-full bg-red-500/30 text-rose-300 flex items-center justify-center shrink-0">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-white leading-tight">3 Urgent Tasks</span>
              <span className="text-[11px] text-rose-200">Needs attention</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Platform Overview Section (8 Cards) */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
          Platform Overview
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {platformMetrics.map((item) => (
            <div 
              key={item.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden"
            >
              {/* Card Top: Icon & Trend */}
              <div className="flex items-center justify-between mb-4">
                <div className={`w-8 h-8 rounded-lg ${item.iconBg} flex items-center justify-center`}>
                  {item.icon}
                </div>
                <div className={`flex items-center gap-0.5 text-xs font-semibold ${item.isPositive ? 'text-emerald-600' : 'text-orange-600'}`}>
                  {item.isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  <span>{item.change}</span>
                </div>
              </div>

              {/* Metric Value & Label */}
              <div>
                <div className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">
                  {item.value}
                </div>
                <div className="text-xs font-medium text-slate-500 mt-0.5">
                  {item.label}
                </div>
              </div>

              {/* Sparkline Wave Chart */}
              <div className="w-full h-8 mt-3 relative">
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 28">
                  <defs>
                    <linearGradient id={`grad-${item.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={item.waveColor} stopOpacity={0.25} />
                      <stop offset="100%" stopColor={item.waveColor} stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  {item.isPositive ? (
                    <>
                      <path 
                        d="M0,22 Q25,20 50,14 T100,6 L100,28 L0,28 Z" 
                        fill={`url(#grad-${item.id})`} 
                      />
                      <path 
                        d="M0,22 Q25,20 50,14 T100,6" 
                        fill="none" 
                        stroke={item.waveColor} 
                        strokeWidth="1.8" 
                        strokeLinecap="round" 
                      />
                    </>
                  ) : (
                    <>
                      <path 
                        d="M0,8 Q30,12 60,18 T100,24 L100,28 L0,28 Z" 
                        fill={`url(#grad-${item.id})`} 
                      />
                      <path 
                        d="M0,8 Q30,12 60,18 T100,24" 
                        fill="none" 
                        stroke={item.waveColor} 
                        strokeWidth="1.8" 
                        strokeLinecap="round" 
                      />
                    </>
                  )}
                </svg>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Product Health Section */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
          Product Health
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Top Drop-off Screens */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                <TrendingDown className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 leading-tight">
                  Top Drop-off Screens
                </h3>
                <p className="text-xs text-slate-400">Onboarding abandonment</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {dropoffScreens.map((screen, idx) => (
                <div key={idx} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-700">{screen.screen}</span>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${screen.badgeColor}`}>
                        {screen.level}
                      </span>
                      <span className="text-slate-600 font-semibold w-8 text-right">
                        {screen.rate}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                      style={{ width: `${screen.rate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Feature Adoption */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 leading-tight">
                  Feature Adoption
                </h3>
                <p className="text-xs text-slate-400">Family usage rates</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {featureAdoption.map((item, idx) => (
                <div key={idx} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-700">{item.name}</span>
                    <span className="text-slate-600 font-semibold">{item.rate}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#0E4F5A] rounded-full transition-all duration-500" 
                      style={{ width: `${item.rate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Middle Section: Subscription & AI Usage */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subscription Plan Distribution */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 leading-tight">Subscription</h3>
                <p className="text-xs text-slate-400">Plan distribution</p>
              </div>
            </div>

            {/* Donut Chart Visual & Legend */}
            <div className="flex flex-col sm:flex-row items-center justify-around gap-6 my-4">
              {/* SVG Donut */}
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background track */}
                  <circle cx="50" cy="50" r="38" stroke="#F1F5F9" strokeWidth="12" fill="none" />
                  {/* Free Trial: 38% */}
                  <circle 
                    cx="50" cy="50" r="38" 
                    stroke="#14B8A6" strokeWidth="12" fill="none" 
                    strokeDasharray="90.7 238.7" strokeDashoffset="0" 
                  />
                  {/* Yearly: 28% */}
                  <circle 
                    cx="50" cy="50" r="38" 
                    stroke="#0E4F5A" strokeWidth="12" fill="none" 
                    strokeDasharray="66.8 238.7" strokeDashoffset="-90.7" 
                  />
                  {/* Monthly: 22% */}
                  <circle 
                    cx="50" cy="50" r="38" 
                    stroke="#5EEAD4" strokeWidth="12" fill="none" 
                    strokeDasharray="52.5 238.7" strokeDashoffset="-157.5" 
                  />
                  {/* Global: 12% */}
                  <circle 
                    cx="50" cy="50" r="38" 
                    stroke="#062E35" strokeWidth="12" fill="none" 
                    strokeDasharray="28.6 238.7" strokeDashoffset="-210" 
                  />
                </svg>
              </div>

              {/* Legend with percentages */}
              <div className="flex flex-col gap-2.5 text-xs">
                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#14B8A6]"></span>
                    <span className="text-slate-600">Free Trial</span>
                  </div>
                  <span className="font-semibold text-slate-900">38%</span>
                </div>
                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#5EEAD4]"></span>
                    <span className="text-slate-600">Monthly</span>
                  </div>
                  <span className="font-semibold text-slate-900">22%</span>
                </div>
                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0E4F5A]"></span>
                    <span className="text-slate-600">Yearly</span>
                  </div>
                  <span className="font-semibold text-slate-900">28%</span>
                </div>
                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#062E35]"></span>
                    <span className="text-slate-600">Global</span>
                  </div>
                  <span className="font-semibold text-slate-900">12%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom user count stats */}
          <div className="grid grid-cols-4 pt-5 mt-3 border-t border-slate-100 text-center">
            <div>
              <div className="text-sm font-bold text-slate-900">38</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Free Trials users</div>
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">380</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Monthly users</div>
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">540</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Yearly users</div>
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">720</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Global users</div>
            </div>
          </div>
        </div>

        {/* AI Usage Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 leading-tight">AI Usage</h3>
                <p className="text-xs text-slate-400">Costs & performance</p>
              </div>
            </div>

            <div className="flex flex-col gap-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-slate-600">Requests Today</span>
                <div className="text-right">
                  <div className="font-bold text-slate-900 text-sm">2,678</div>
                  <div className="text-[11px] text-emerald-600 font-semibold">+22.5%</div>
                </div>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-slate-600">Monthly Token Cost</span>
                <div className="text-right">
                  <div className="font-bold text-slate-900 text-sm">€348</div>
                  <div className="text-[11px] text-slate-400">↔ €51/day avg</div>
                </div>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-slate-600">Avg Cost per Family</span>
                <div className="text-right">
                  <div className="font-bold text-slate-900 text-sm">€0.36</div>
                  <div className="text-[11px] text-slate-400">target: &lt;€0.50</div>
                </div>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-slate-600">Most Used Feature</span>
                <div className="text-right">
                  <div className="font-bold text-slate-900 text-sm">AI Stories</div>
                  <div className="text-[11px] text-slate-400">71% families</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600">Avg Response Time</span>
                <div className="text-right">
                  <div className="font-bold text-slate-900 text-sm">1.4s</div>
                  <div className="text-[11px] text-slate-400">p95: 3.2s</div>
                </div>
              </div>
            </div>
          </div>

          {/* Purple/Violet bottom wave */}
          <div className="w-full h-8 mt-4">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 24">
              <defs>
                <linearGradient id="ai-wave" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <path d="M0,18 Q30,8 60,14 T100,6 L100,24 L0,24 Z" fill="url(#ai-wave)" />
              <path d="M0,18 Q30,8 60,14 T100,6" fill="none" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </section>

      {/* 5. Lower Section: Rewards Overview & Document Verification */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rewards Overview (this month) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-slate-900 leading-tight">
              Rewards Overview (this month)
            </h3>
            <button 
              type="button"
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Manage rewards</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          {/* 6 Tiles Grid (2 cols x 3 rows) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#F8FAFC] rounded-xl p-3.5 border border-slate-100">
              <Star className="w-4 h-4 text-amber-500 mb-1.5" />
              <div className="text-base font-bold text-slate-900 leading-tight">48,320</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Alureis Issued</div>
            </div>

            <div className="bg-[#F8FAFC] rounded-xl p-3.5 border border-slate-100">
              <Gift className="w-4 h-4 text-emerald-500 mb-1.5" />
              <div className="text-base font-bold text-slate-900 leading-tight">31,840</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Redeemed</div>
            </div>

            <div className="bg-[#F8FAFC] rounded-xl p-3.5 border border-slate-100">
              <Clock className="w-4 h-4 text-amber-500 mb-1.5" />
              <div className="text-base font-bold text-slate-900 leading-tight">2,410</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Pending Redemptions</div>
            </div>

            <div className="bg-[#F8FAFC] rounded-xl p-3.5 border border-slate-100">
              <Store className="w-4 h-4 text-sky-500 mb-1.5" />
              <div className="text-base font-bold text-slate-900 leading-tight">Sprout</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Top Partner</div>
            </div>

            <div className="bg-[#F8FAFC] rounded-xl p-3.5 border border-slate-100">
              <Package className="w-4 h-4 text-purple-500 mb-1.5" />
              <div className="text-base font-bold text-slate-900 leading-tight">Snack Box</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Most Popular Offer</div>
            </div>

            <div className="bg-[#F8FAFC] rounded-xl p-3.5 border border-slate-100">
              <RotateCcw className="w-4 h-4 text-teal-500 mb-1.5" />
              <div className="text-base font-bold text-slate-900 leading-tight">65.8%</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Redemption Rate</div>
            </div>
          </div>
        </div>

        {/* Document Verification */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                Document Verification
              </h3>
            </div>

            <div className="flex flex-col gap-3.5 text-xs">
              {docVerification.map((row, idx) => (
                <div key={idx} className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                  <span className="text-slate-600">{row.label}</span>
                  <span className={`text-sm font-semibold ${row.color}`}>{row.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Review Pill Button */}
          <button 
            type="button"
            className="w-full mt-5 py-3 px-4 rounded-xl bg-[#F3E8FF] hover:bg-[#E9D5FF] text-[#7E22CE] text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>Quick Review</span>
          </button>
        </div>
      </section>

      {/* 6. Charts Section: Revenue & Membership & User Growth */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue & Membership Area Chart */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 leading-tight mb-5">
              Revenue & Membership
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

      {/* 7. Recent Activity Timeline */}
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
    </div>
  );
};
