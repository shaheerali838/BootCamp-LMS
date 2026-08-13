import "./App.css";

import { SidebarProvider, useSidebar } from "./context/SidebarContext";

import { AttendanceProvider } from "./context/AttendanceContext";

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
    // Wrap the entire app with providers to make contexts available to all components
    <SidebarProvider>
      <AttendanceProvider>
        <AnnouncementProvider>
          <AppLayout />
        </AnnouncementProvider>
      </AttendanceProvider>
    </SidebarProvider>
  );
}

export default App;
