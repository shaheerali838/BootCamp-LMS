import "./App.css";
import Sidebar from "./components/Layouts/Sidebar";
import AppRoutes from "./pages/routes/AppRoutes";

function App() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-gray-50">
        <AppRoutes />
      </div>
    </div>
  );
}

export default App;
