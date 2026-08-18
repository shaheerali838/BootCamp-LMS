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
import { FiLoader } from "react-icons/fi";

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <FiLoader className="animate-spin text-amber-600" size={32} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function DashboardLayout() {
  const { isOpen } = useSidebar();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Navbar />
      <main
        className={`pt-10 transition-all duration-300 ${
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
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPages />} />
      </Route>

      <Route path="/forget-password" element={<ForgetPassword />} />

      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppLayout />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
