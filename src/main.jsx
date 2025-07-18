import { createRoot } from "react-dom/client";
import "./index.css";
import "../public/css/all.min.css";
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
import "@/i18n/i18n";
import { AiChatProvider } from "./context/AiChatContext";
import { toast } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

// Override the default toast error method to suppress certain errors
const originalErrorToast = toast.error;
toast.error = (message, options) => {
  const publicRoutes = [
    "/",
    "/login",
    "/signup",
    "/forgotpassword",
    "/resetpassword",
    "/verifymail",
    "/welcome",
    "/help",
    "/privacy",
    "/term",
    "/shared-chat",
  ];
  const currentPath = window.location.pathname;

  const isPublicRoute = () => {
    if (publicRoutes.includes(currentPath)) return true;
    return publicRoutes.some(
      (route) => route !== "/" && currentPath.startsWith(route)
    );
  };

  if (
    isPublicRoute() &&
    (message.includes("401") ||
      message.includes("unauthorized") ||
      message.includes("Unauthorized") ||
      message.includes("token"))
  ) {
    return null;
  }

  return originalErrorToast(message, options);
};

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <FavoritesProvider>
        <BookmarkProvider>
          <LanguageProvider>
            <NotificationsProvider>
              <UndoProvider>
                <CountryDataProvider>
                  <AiChatProvider>
                    <TooltipProvider>
                      <Toaster />
                      <App />
                    </TooltipProvider>
                  </AiChatProvider>
                </CountryDataProvider>
              </UndoProvider>
            </NotificationsProvider>
          </LanguageProvider>
        </BookmarkProvider>
      </FavoritesProvider>
    </AuthProvider>
  </BrowserRouter>
);
