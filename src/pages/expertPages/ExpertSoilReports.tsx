import React, { useState } from 'react';
import { SoilReportList } from '../../components/expertComponents/soilReports/SoilReportList';
import { SoilReportDetailModal } from '../../components/expertComponents/soilReports/SoilReportDetailModal';
import { 
  INITIAL_SOIL_REPORTS, 
  type SoilTestSubmission 
} from '../../components/expertComponents/expertData';

export const ExpertSoilReports: React.FC = () => {
  const [reports, setReports] = useState<SoilTestSubmission[]>(INITIAL_SOIL_REPORTS);
  const [selectedReport, setSelectedReport] = useState<SoilTestSubmission | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectReport = (report: SoilTestSubmission) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const handleSaveAdvisory = (reportId: string, advisory: any) => {
    setReports((prev) =>
      prev.map((rep) =>
        rep.id === reportId
          ? {
              ...rep,
              expertStatus: 'ADVISED',
              expertAdvisory: advisory,
            }
          : rep
      )
    );
  };

  return (
    <div className="flex flex-col gap-6 font-['Inter'] animate-in fade-in duration-200">
      <SoilReportList
        reports={reports}
        onSelectReport={handleSelectReport}
      />

      <SoilReportDetailModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedReport(null);
        }}
        report={selectedReport}
        onSaveAdvisory={handleSaveAdvisory}
      />
    </div>
  );
};

export default ExpertSoilReports;
