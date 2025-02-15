import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { FavoritesProvider } from "./context/favorites-context";
import { BookmarkProvider } from "./context/BookmarkContext";
import { LanguageProvider } from "./context/LanguageContext";
import { NotificationsProvider } from "./context/NotificationsContext";
import { Toaster } from "./components/ui/sonner";
import { UndoProvider } from "./context/UndoContext";
import { CountryDataProvider } from "./context/CountryDataContext";
import "@/i18n/i18n"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <FavoritesProvider>
          <BookmarkProvider>
            <LanguageProvider>
              <NotificationsProvider>
                <UndoProvider>
                  <CountryDataProvider>
                    <Toaster />
                    <App />
                  </CountryDataProvider>
                </UndoProvider>
              </NotificationsProvider>
            </LanguageProvider>
          </BookmarkProvider>
        </FavoritesProvider>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
