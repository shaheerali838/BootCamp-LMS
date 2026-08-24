import React from "react";
import { LoadingProvider } from "./LoadingContext";
import { SidebarProvider } from "./SidebarContext";
import { TeamProjectProvider } from "./TeamProjectContext";
import { AnnouncementProvider } from "./AnnouncementContext";
import { AcademicProvider } from "./AcademicContext";
import { WorkProvider } from "./WorkContext";
import { SystemProvider } from "./SystemContext";

const providers = [
  LoadingProvider,
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
