import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import Landing from "./pages/unauthenticated/Landing";
import Login from "./pages/unauthenticated/Login";
import Signup from "./pages/unauthenticated/Signup";
import ForgotPassword from "./pages/unauthenticated/forgot-password";
import VerifyEmail from "./pages/unauthenticated/verify-email";
import ResetPassword from "./pages/unauthenticated/reset-password";
import Welcome from "./pages/unauthenticated/welcome";
import OAuthCallback from "./pages/unauthenticated/oauth-callback";
import NotFound from "./pages/unauthenticated/not-found";
import { TrialProvider, useTrial } from "./context/TrialContext";
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
import { PostProvider } from "@/context/PostContext";
import { CommentProvider } from "@/context/CommentContext";
import SinglePost from "@/pages/user/SinglePost";

const RouteGuard = ({ children }) => {
  const location = useLocation();
  
  if (location.pathname.includes('checkout')) {
    return <Navigate to="/upgrade" replace />;
  }
  
  return children;
};

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
      <ScrollToTop />
      <RouteGuard>
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
            <Route path="community" element={<PostProvider><Community /></PostProvider>} />
            <Route path="feedback" element={<Feedback />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          <Route path="/user/community/post/:postId" element={<SinglePost />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </RouteGuard>

      {/* <TrialExpiredModal isOpen={showTrialModal} /> */}
    </>
  );
};

function App() {
  return (
    <PostProvider>
      <CommentProvider>
        <TrialProvider>
          <AppContent />
        </TrialProvider>
      </CommentProvider>
    </PostProvider>
  );
}

export default App;
