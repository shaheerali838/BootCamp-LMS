import React from "react";
import { SidebarProvider } from "./SidebarContext";
import { TeamProjectProvider } from "./TeamProjectContext";
import { AnnouncementProvider } from "./AnnouncementContext";
import { AcademicProvider } from "./AcademicContext";
import { WorkProvider } from "./WorkContext";
import { SystemProvider } from "./SystemContext";

const providers = [
  SidebarProvider,
  AnnouncementProvider,
  AcademicProvider,
  WorkProvider,
  TeamProjectProvider,
  SystemProvider,
];

export const AppProvider = ({ children }) => {
  return providers.reduceRight((acc, Provider) => {
    return <Provider>{acc}</Provider>;
  }, children);
};
