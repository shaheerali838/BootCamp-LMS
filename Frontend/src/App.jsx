
import "./App.css";
import Sidebar from "./components/Layouts/Sidebar";
import Navbar from "./components/Layouts/Navbar";
import AppRoutes from "./pages/routes/AppRoutes";
import { SidebarProvider, useSidebar } from "./context/SidebarContext";

function AppLayout() {
  const { isOpen } = useSidebar();

  return (
    <>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div
          className={`flex-1 min-h-screen bg-gray-50 pt-16 transition-all duration-300
            ${isOpen ? "ml-[280px]" : "ml-[90px]"}`}
        >
          <AppRoutes />
        </div>
      </div>
    </>
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