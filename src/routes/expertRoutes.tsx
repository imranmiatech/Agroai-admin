import { Route, Navigate } from 'react-router-dom';
import { ExpertOverview } from '../pages/expertPages/ExpertOverview';
import { ExpertConsultations } from '../pages/expertPages/ExpertConsultations';
import { ExpertSoilTestsPage } from '../pages/expertPages/ExpertSoilTestsPage';
import { ExpertSettings } from '../pages/expertPages/ExpertSettings';

export const expertRoutes = (
  <Route path="/expert">
    <Route index element={<Navigate to="/expert/overview" replace />} />
    <Route path="overview" element={<ExpertOverview />} />
    <Route path="consultations" element={<ExpertConsultations />} />
    <Route path="support" element={<Navigate to="/expert/consultations" replace />} />
    <Route path="soil-tests" element={<ExpertSoilTestsPage />} />
    <Route path="soil-reports" element={<Navigate to="/expert/soil-tests" replace />} />
    <Route path="settings" element={<ExpertSettings />} />
  </Route>
);
