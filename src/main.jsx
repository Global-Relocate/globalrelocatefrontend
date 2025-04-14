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
import { toast } from "sonner";

// Override the default toast error method to suppress certain errors
const originalErrorToast = toast.error;
toast.error = (message, options) => {
  // Don't show unauthorized errors for subscription endpoints when on public routes
  const publicRoutes = ['/', '/login', '/signup', '/forgotpassword', '/resetpassword', '/verifymail', '/welcome', '/help', '/privacy', '/term'];
  const currentPath = window.location.pathname;
  
  // Function to check if we're on a public route
  const isPublicRoute = () => {
    // Check for exact matches
    if (publicRoutes.includes(currentPath)) {
      return true;
    }
    
    // Check for partial matches (like /help/some-article)
    return publicRoutes.some(route => 
      route !== '/' && currentPath.startsWith(route)
    );
  };
  
  // Suppress these specific error messages on public routes
  if (isPublicRoute() && 
      (message.includes('401') || 
       message.includes('unauthorized') || 
       message.includes('Unauthorized') ||
       message.includes('token'))) {
    console.log('Suppressing error toast on public route:', message);
    return null; // Don't show the toast
  }
  
  // Otherwise, show the toast as normal
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
);
