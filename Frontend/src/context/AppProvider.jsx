import React from "react";
import { SidebarProvider } from "./SidebarContext";
import { AttendanceProvider } from "./AttendanceContext";
import { StudentProvider } from "./StudentContext";
import { TaskProvider } from "./TaskContext";
import { ProjectProvider } from "./ProjectContext";
import { TeamProjectProvider } from "./TeamProjectContext";
import { ResourceProvider } from "./ResourceContext";
import { ReportProvider } from "./ReportContext";
import { AdminProvider } from "./AdminContext";
import { BatchProvider } from "./BatchContext";
import { MilestoneProvider } from "./MilestoneContext";
import { SprintProvider } from "./SprintContext";
import { RegistrationLogProvider } from "./RegistrationLogContext";
import { ActivityLogProvider } from "./ActivityLogContext";
import { AnnouncementProvider } from "./AnnouncementContext";

const providers = [
  SidebarProvider,
  AnnouncementProvider,
  AttendanceProvider,
  StudentProvider,
  TaskProvider,
  ProjectProvider,
  TeamProjectProvider,
  ResourceProvider,
  ReportProvider,
  AdminProvider,
  BatchProvider,
  MilestoneProvider,
  SprintProvider,
  RegistrationLogProvider,
  ActivityLogProvider,
];

export const AppProvider = ({ children }) => {
  return providers.reduceRight((acc, Provider) => {
    return <Provider>{acc}</Provider>;
  }, children);
};
