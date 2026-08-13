import "./App.css";
import { SidebarProvider, useSidebar } from "./context/SidebarContext";
import { AttendanceProvider } from "./context/AttendanceContext";
import { StudentProvider } from "./context/StudentContext";
import { TaskProvider } from "./context/TaskContext";
import { ProjectProvider } from "./context/ProjectContext";
import { ResourceProvider } from "./context/ResourceContext";
import { ReportProvider } from "./context/ReportContext";

// Import AnnouncementProvider to wrap announcement components with required context
import { AnnouncementProvider } from "./contextAPI/Anouncement";

import Sidebar from "./components/Layouts/Sidebar";
import Navbar from "./components/Layouts/Navbar";

import AppRoutes from "./pages/routes/AppRoutes";

import { Routes, Route, Navigate } from "react-router-dom";


import AuthLayout from "./components/AuthLayout";
import LoginPages from "./pages/Auth/Loginpages";
import ForgetPassword from './pages/Auth/ForgetPassword'

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
      {/* Root URL */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Authentication */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPages />} />
      </Route>

      {/* Forget Password */}
      <Route path="/forget-password" element={<ForgetPassword />} />

      {/* Dashboard / Application */}
      <Route path="/*" element={<DashboardLayout />} />
    </Routes>
  );
}

function App() {
  return (
    // Providers: wrap the app once with all needed contexts
    // Order: SidebarProvider -> Announcement -> Attendance -> Student -> Task -> Project -> Resource -> Report
    <SidebarProvider>
      <AnnouncementProvider>
        <AttendanceProvider>
          <StudentProvider>
            <TaskProvider>
              <ProjectProvider>
                <ResourceProvider>
                  <ReportProvider>
                    <AppLayout />
                  </ReportProvider>
                </ResourceProvider>
              </ProjectProvider>
            </TaskProvider>
          </StudentProvider>
        </AttendanceProvider>
      </AnnouncementProvider>
    </SidebarProvider>
  );
}

export default App;
