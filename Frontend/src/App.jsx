import "./App.css";

import {
  SidebarProvider,
  useSidebar,
} from "./context/SidebarContext";

import { AttendanceProvider } from "./context/AttendanceContext";
import { StudentProvider } from "./context/StudentContext";
import { TaskProvider } from "./context/TaskContext";
import { ProjectProvider } from "./context/ProjectContext";
import { ResourceProvider } from "./context/ResourceContext";
import { ReportProvider } from "./context/ReportContext";
import { AdminProvider } from "./context/AdminContext";
import { BatchProvider } from "./context/BatchContext";
import { MilestoneProvider } from "./context/MilestoneContext";
import { SprintProvider } from "./context/SprintContext";
import { RegistrationLogProvider } from "./context/RegistrationLogContext";
import { ActivityLogProvider } from "./context/ActivityLogContext";

import Sidebar from "./components/Layouts/Sidebar";
import Navbar from "./components/Layouts/Navbar";

import AppRoutes from "./pages/routes/AppRoutes";

import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import AuthLayout from "./components/AuthLayout";
import ForgetPassword from "./pages/Auth/ForgetPassword";


function DashboardLayout() {
  const { isOpen } = useSidebar();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <Navbar />

      <main
        className={`pt-16 transition-all duration-300 ${
          isOpen
            ? "ml-[280px]"
            : "ml-[90px]"
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
      <Route
        path="/"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

      {/* Authentication */}
      <Route element={<AuthLayout />}>
        <Route
          path="/login"
          element={<LoginPage />}
        />
      </Route>

      {/* Forget Password */}
      <Route
        path="/forget-password"
        element={<ForgetPassword />}
      />

      {/* Dashboard / Application */}
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
      <StudentProvider>
        <AttendanceProvider>
          <TaskProvider>
            <ProjectProvider>
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
            </ProjectProvider>
          </TaskProvider>
        </AttendanceProvider>
      </StudentProvider>
    </SidebarProvider>
  );
}


export default App;