import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import "./index.css";

import { AuthProvider } from "./context/AuthContext";
import { TeamProjectProvider } from "./context/TeamProjectContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <TeamProjectProvider>
          <App />
        </TeamProjectProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
