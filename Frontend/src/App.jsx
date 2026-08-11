import "./App.css";
import { SidebarProvider, useSidebar } from "./context/SidebarContext";
import Sidebar from "./components/Layouts/Sidebar";
import Navbar from "./components/Layouts/Navbar";
import AppRoutes from "./pages/routes/AppRoutes";
import { Routes, Route, Navigate } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
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
          isOpen ? "ml-[280px]" : "ml-[90px]"
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
      <Route element={<AuthLayout />}>
        {/* <Route path="/signup" element={<SignUpPage />} /> */}
        <Route path="/login" element={<LoginPage />} />
      </Route>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/*" element={<DashboardLayout />} />
     <Route path="/forget-password" element={<ForgetPassword/>}/>
      
      
    </Routes>
  );
}

function App() {
  return (
    <SidebarProvider>
      <AppLayout />
    </SidebarProvider>
  );
}

export default App;
