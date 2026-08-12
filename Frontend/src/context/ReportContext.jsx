import React, { createContext, useContext, useState, useEffect } from "react";

const ReportContext = createContext();

const STORAGE_KEY = "lms_reports";

const initialReportData = {
  attendanceReportData: [
    { day: "Mon", present: 82, absent: 8, late: 5 },
    { day: "Tue", present: 90, absent: 5, late: 7 },
    { day: "Wed", present: 87, absent: 7, late: 6 },
    { day: "Thu", present: 94, absent: 4, late: 5 },
    { day: "Fri", present: 88, absent: 6, late: 8 },
  ],
  taskDistributionData: [
    { label: "UI/UX", value: 84 },
    { label: "Web Dev", value: 72 },
    { label: "Pending", value: 48 },
  ],
  batchPerformanceData: [
    { month: "Jan", value: 82 },
    { month: "Feb", value: 96 },
    { month: "Mar", value: 112 },
    { month: "Apr", value: 135 },
    { month: "May", value: 165 },
    { month: "Jun", value: 198 },
    { month: "Jul", value: 235 },
  ],
  reportSummary: {
    taskCompleted: 84,
    lastUpdated: "Today",
  },
};

export const ReportProvider = ({ children }) => {
  const [reports, setReports] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialReportData;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  }, [reports]);

  return (
    <ReportContext.Provider
      value={{
        reports,
        setReports,
        attendanceReportData: reports.attendanceReportData || initialReportData.attendanceReportData,
        taskDistributionData: reports.taskDistributionData || initialReportData.taskDistributionData,
        batchPerformanceData: reports.batchPerformanceData || initialReportData.batchPerformanceData,
        reportSummary: reports.reportSummary || initialReportData.reportSummary,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};

export const useReports = () => {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error("useReports must be used inside ReportProvider");
  }
  return context;
};

export const useReport = useReports;
