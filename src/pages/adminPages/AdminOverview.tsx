import React from 'react';
import { GoodMorningBanner } from '../../components/adminComponents/overview/GoodMorningBanner';
import { PlatformMetrics } from '../../components/adminComponents/overview/PlatformMetrics';


import { RevenueAndGrowthSection } from '../../components/adminComponents/overview/RevenueAndGrowthSection';
import { AdminRecentActivity } from '../../components/adminComponents/overview/AdminRecentActivity';

export const AdminOverview: React.FC = () => {
  return (
    <div className="flex flex-col gap-8 pb-12 font-['Inter']">
      {/* 1. Good Morning Banner */}
      <GoodMorningBanner />

      {/* 2. Platform Overview Metrics (8 Cards) */}
      <PlatformMetrics />

      {/* 6. Charts Section: Revenue & Membership & User Growth */}
      <RevenueAndGrowthSection />

      {/* 7. Recent Activity Timeline */}
      <AdminRecentActivity />
    </div>
  );
};
