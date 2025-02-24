import { Route, Routes } from "react-router-dom";
import Landing from "./pages/unauthenticated/landing";
import Login from "./pages/unauthenticated/login";
import Signup from "./pages/unauthenticated/signup";
import ForgotPassword from "./pages/unauthenticated/forgot-password";
import VerifyEmail from "./pages/unauthenticated/verify-email";
import ResetPassword from "./pages/unauthenticated/reset-password";
import Welcome from "./pages/unauthenticated/welcome";
import OAuthCallback from "./pages/unauthenticated/oauth-callback";
import NotFound from "./pages/unauthenticated/not-found";
import { TrialProvider, useTrial } from "./context/TrialContext";
// import TrialExpiredModal from "./components/modals/TrialExpiredModal";

import Countries from "./pages/user/countries";
import AiAssistant from "./pages/user/ai-assistant";
import CompareCountries from "./pages/user/compare-countries";
import TaxCalculator from "./pages/user/tax-calculator";
import Favorites from "./pages/user/favorites";
import Community from "./pages/user/community";
import Notifications from "./pages/user/notifications";
import CountryDetails from "./pages/user/country-details";
// import Settings from "./pages/user/Settings";
import Profile from "./pages/user/profile";
import Upgrade from "./pages/user/upgrade";
import TrialExpired from "./pages/user/trial-expired";
import Feedback from "./pages/user/feedback";
import "./App.css";
import HelpCenter from "./pages/unauthenticated/help-center";
import PrivacyPolicy from "./pages/unauthenticated/privacy-policy";
import TermsAndConditions from "./pages/unauthenticated/terms-conditions";
import { useEffect, useState } from "react";
import PageLoader from "./components/loaders/PageLoader";

const AppContent = () => {
  const { showTrialModal } = useTrial();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleStateChange = () => {
      if (document.readyState === "complete") {
        setIsLoading(false); // Hide the loader when the page is fully loaded
      }
    };

    // Check the initial state
    if (document.readyState === "complete") {
      setIsLoading(false); // If the page is already loaded, hide the loader immediately
    } else {
      // Listen for changes in the loading state
      document.addEventListener("readystatechange", handleStateChange);
    }

    // Cleanup
    return () => {
      document.removeEventListener("readystatechange", handleStateChange);
    };
  }, []);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <>
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
    <TrialProvider>
      <AppContent />
    </TrialProvider>
  );
}

export default App;
