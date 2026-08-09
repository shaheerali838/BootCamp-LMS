import { Routes, Route, Navigate } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import AuthLayout from "./components/AuthLayout";

function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>
      <Route path="/" element={<Navigate to="/signup" replace />} />
    </Routes>
  );
}

export default App;