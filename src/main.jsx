import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { FavoritesProvider } from "./context/favorites-context";
import { LanguageProvider } from "./context/LanguageContext";
import { Toaster } from "./components/ui/sonner";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <FavoritesProvider>
          <LanguageProvider>
            <Toaster />
            <App />
          </LanguageProvider>
        </FavoritesProvider>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
