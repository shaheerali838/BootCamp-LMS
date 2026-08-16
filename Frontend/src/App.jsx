import "./App.css";
import { SidebarProvider, useSidebar } from "./context/SidebarContext";
import { AttendanceProvider } from "./context/AttendanceContext";
import { StudentProvider } from "./context/StudentContext";
import { TaskProvider } from "./context/TaskContext";
import { TeamProjectProvider } from "./contextAPI/TeamProjectContext";
import { ResourceProvider } from "./context/ResourceContext";
import { ReportProvider } from "./context/ReportContext";
import { AdminProvider } from "./context/AdminContext";
import { BatchProvider } from "./context/BatchContext";
import { MilestoneProvider } from "./context/MilestoneContext";
import { SprintProvider } from "./context/SprintContext";
import { RegistrationLogProvider } from "./context/RegistrationLogContext";
import { ActivityLogProvider } from "./context/ActivityLogContext";
import { AnnouncementProvider } from "./contextAPI/Anouncement";

import Sidebar from "./components/Layouts/Sidebar";
import Navbar from "./components/Layouts/Navbar";

import AppRoutes from "./pages/routes/AppRoutes";

import { Routes, Route, Navigate } from "react-router-dom";

import AuthLayout from "./components/AuthLayout";
// Auth component imports
import LoginPages from "./pages/Auth/LoginPages";
import ForgetPassword from "./pages/Auth/ForgetPassword";

function DashboardLayout() {
  const { isOpen } = useSidebar();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <Navbar />

      <main
        className={`pt-16 transition-all duration-300 ${
          isOpen ? "ml-70" : "ml-22.5"
        }`}
      >
        <AppRoutes />
      </main>
    </div>
  );
}

function AppLayout() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      <Route element={<AuthLayout />}>
        <Route
          path="/login"
          element={<LoginPages />}
        />
      </Route>

      <Route
        path="/forget-password"
        element={<ForgetPassword />}
      />

      <Route
        path="/*"
        element={<DashboardLayout />}
      />
    </Routes>
  );
}

function App() {
  return (
    <SidebarProvider>
      <AnnouncementProvider>
        <AttendanceProvider>
          <StudentProvider>
            <TaskProvider>
                <TeamProjectProvider>
                  <ResourceProvider>
                    <ReportProvider>
                      <AdminProvider>
                        <BatchProvider>
                          <MilestoneProvider>
                            <SprintProvider>
                              <RegistrationLogProvider>
                                <ActivityLogProvider>
                                  <AppLayout />
                                </ActivityLogProvider>
                              </RegistrationLogProvider>
                            </SprintProvider>
                          </MilestoneProvider>
                        </BatchProvider>
                      </AdminProvider>
                    </ReportProvider>
                  </ResourceProvider>
                </TeamProjectProvider>
              
            </TaskProvider>
          </StudentProvider>
        </AttendanceProvider>
      </AnnouncementProvider>
    </SidebarProvider>
  );
}

export default App;