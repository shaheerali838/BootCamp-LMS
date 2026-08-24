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
import { FiLoader } from "react-icons/fi";

import { ProtectedRoute, PublicOnlyRoute, getRoleDashboard } from "./routes/ProtectedRoute";

function RootRedirect() {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return null;

  const storedUser = (() => {
    try {
      const u = localStorage.getItem("user");
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  })();
  const storedToken = localStorage.getItem("accessToken");
  const currentUser = user || storedUser;
  const isAuth = isAuthenticated || (!!currentUser && !!storedToken);

  if (isAuth && currentUser) {
    return <Navigate to={getRoleDashboard(currentUser)} replace />;
  }
  return <Navigate to="/login" replace />;
}

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
      <Route path="/" element={<RootRedirect />} />

      {/* ================= PUBLIC AUTH ROUTES (IN AUTH LAYOUT) ================= */}
      <Route
        element={
          <PublicOnlyRoute>
            <AuthLayout />
          </PublicOnlyRoute>
        }
      >
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
