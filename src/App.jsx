import { Route, Routes } from "react-router-dom";
import Landing from "./pages/unauthenticated/Landing";
import Login from "./pages/unauthenticated/Login";
import Signup from "./pages/unauthenticated/Signup";
import ForgotPassword from "./pages/unauthenticated/forgot-password";
import VerifyEmail from "./pages/unauthenticated/verify-email";
import ResetPassword from "./pages/unauthenticated/reset-password";
import Welcome from "./pages/unauthenticated/welcome";
import OAuthCallback from "./pages/unauthenticated/oauth-callback";
import NotFound from "./pages/unauthenticated/not-found";
import { TrialProvider } from "./context/TrialContext";
import { AuthProvider } from "./context/AuthContext";
import { NotificationsProvider } from "./context/NotificationsContext";
// import TrialExpiredModal from "./components/modals/TrialExpiredModal";

import Countries from "./pages/user/Countries";
import AiAssistant from "./pages/user/ai-assistant";
import CompareCountries from "./pages/user/compare-countries";
import TaxCalculator from "./pages/user/tax-calculator";
import Favorites from "./pages/user/Favorites";
import Community from "./pages/user/Community";
import Notifications from "./pages/user/Notifications";
import CountryDetails from "./pages/user/country-details";
// import Settings from "./pages/user/Settings";
import Profile from "./pages/user/Profile";
import Upgrade from "./pages/user/Upgrade";
import TrialExpired from "./pages/user/trial-expired";
import Feedback from "./pages/user/Feedback";
import "./App.css";
import HelpCenter from "./pages/unauthenticated/help-center";
import PrivacyPolicy from "./pages/unauthenticated/privacy-policy";
import TermsAndConditions from "./pages/unauthenticated/terms-conditions";
import { useEffect, useState } from "react";
import PageLoader from "./components/loaders/PageLoader";
import "./App.css";
import ScrollToTop from "./utils/ScrollToTop";

const AppContent = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleStateChange = () => {
      if (document.readyState === "complete") {
        setIsLoading(false);
      }
    };

    if (document.readyState === "complete") {
      setIsLoading(false);
    } else {
      document.addEventListener("readystatechange", handleStateChange);
    }

    return () => {
      document.removeEventListener("readystatechange", handleStateChange);
    };
  }, []);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/verifymail" element={<VerifyEmail />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/upgrade" element={<Upgrade />} />
        <Route path="/trialexpired" element={<TrialExpired />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/term" element={<TermsAndConditions />} />

        {/* Dashboard routes */}
        <Route path="/user">
          <Route path="countries" element={<Countries />} />
          <Route path="countries/:id" element={<CountryDetails />} />
          <Route path="ai-assistant" element={<AiAssistant />} />
          <Route path="compare" element={<CompareCountries />} />
          <Route path="tax-calculator" element={<TaxCalculator />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="community" element={<Community />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* <TrialExpiredModal isOpen={showTrialModal} /> */}
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <NotificationsProvider>
        <TrialProvider>
          <AppContent />
        </TrialProvider>
      </NotificationsProvider>
    </AuthProvider>
  );
}

export default App;
