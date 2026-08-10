import "./App.css";
import { SidebarProvider, useSidebar } from "./context/SidebarContext";
import Sidebar from "./components/Layouts/Sidebar";
import Navbar from "./components/Layouts/Navbar";
import AppRoutes from "./pages/routes/AppRoutes";
import { Routes, Route, Navigate } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import AuthLayout from "./components/AuthLayout";

function AppLayout() {
  const { isOpen } = useSidebar();

  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>
      <Route path="/" element={<Navigate to ='/login' replace/>}/>
      {/* <Route path="/" element={<} /> */}
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
