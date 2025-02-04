import { Route, Routes } from "react-router-dom";
import Landing from "./pages/unauthenticated/Landing";
import Login from "./pages/unauthenticated/Login";
import Signup from "./pages/unauthenticated/Signup";
import ForgotPassword from "./pages/unauthenticated/ForgotPassword";
import VerifyEmail from "./pages/unauthenticated/VerifyEmail";
import ResetPassword from "./pages/unauthenticated/ResetPassword";
import Welcome from "./pages/authenticated/Welcome";
import OAuthCallback from "./pages/unauthenticated/OAuthCallback";
import NotFound from "./pages/NotFound";
import { TrialProvider, useTrial } from "./context/TrialContext";
import TrialExpiredModal from "./components/modals/TrialExpiredModal";

// Dashboard route imports
import Countries from "./pages/user/Countries";
import AiAssistant from "./pages/user/AiAssistant";
import CompareCountries from "./pages/user/CompareCountries";
import TaxCalculator from "./pages/user/TaxCalculator";
import Favorites from "./pages/user/Favorites";
import Community from "./pages/user/Community";
import Notifications from "./pages/user/Notifications";
import CountryDetails from "./pages/user/CountryDetails";
// import Settings from "./pages/user/Settings";
import Profile from "./pages/user/Profile";
import Upgrade from "./pages/user/Upgrade";
import "./App.css";

const AppContent = () => {
  const { showTrialModal } = useTrial();

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

        {/* Dashboard routes */}
        <Route path="/user">
          <Route path="countries" element={<Countries />} />
          <Route path="countries/:countryName" element={<CountryDetails />} />
          <Route path="ai-assistant" element={<AiAssistant />} />
          <Route path="compare" element={<CompareCountries />} />
          <Route path="tax-calculator" element={<TaxCalculator />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="community" element={<Community />} />
          {/* <Route path="settings" element={<Settings />} /> */}
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <TrialExpiredModal isOpen={showTrialModal} />
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
