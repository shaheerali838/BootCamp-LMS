import "./App.css";
import { useSidebar } from "./context/SidebarContext";
import { AppProvider } from "./context/AppProvider";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar";
import AppRoutes from "./routes/AppRoutes";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "./components/layout/AuthLayout";
import LoginPages from "./pages/Auth/LoginPages";
import ForgetPassword from "./pages/Auth/ForgetPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import { ProtectedRoute } from "./routes/ProtectedRoute";

function DashboardLayout() {
  const { isOpen } = useSidebar();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Navbar />
      <main
        className={`pt-16 transition-all duration-300 ${
          isOpen ? "md:ml-70 ml-0" : "md:ml-22.5 ml-0"
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
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* ================= PUBLIC AUTH ROUTES (IN AUTH LAYOUT) ================= */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPages />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>
      {/* ======================================================================= */}

      {/* ================= PROTECTED DASHBOARD ROUTES ================= */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AppProvider>
              <DashboardLayout />
            </AppProvider>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  );
}

export default App;
