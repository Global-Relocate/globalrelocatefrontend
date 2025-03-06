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
import { AiChatProvider } from "./context/AiChatContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <FavoritesProvider>
          <BookmarkProvider>
            <LanguageProvider>
              <NotificationsProvider>
                <UndoProvider>
                  <CountryDataProvider>
                    <AiChatProvider>

                      <Toaster />
                      <App />
                    </AiChatProvider>
                  </CountryDataProvider>
                </UndoProvider>
              </NotificationsProvider>
            </LanguageProvider>
          </BookmarkProvider>
        </FavoritesProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
