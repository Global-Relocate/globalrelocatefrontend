import { Route, Routes } from "react-router-dom";
import Landing from "./pages/unauthenticated/Landing";
import Login from "./pages/unauthenticated/Login";
import Signup from "./pages/unauthenticated/Signup";
import ForgotPassword from "./pages/unauthenticated/ForgotPassword";
import VerifyEmail from "./pages/unauthenticated/VerifyEmail";
import ResetPassword from "./pages/unauthenticated/ResetPassword";
import Welcome from "./pages/authenticated/Welcome";
import OAuthCallback from "./pages/unauthenticated/OAuthCallback";

// Dashboard route imports
import Countries from "./pages/user/Countries";
import AiAssistant from "./pages/user/AiAssistant";
import CompareCountries from "./pages/user/CompareCountries";
import TaxCalculator from "./pages/user/TaxCalculator";
import Favourites from "./pages/user/Favourites";
import Community from "./pages/user/Community";
import Notifications from "./pages/user/Notifications";
import CountryDetails from "./pages/user/CountryDetails";
// import Settings from "./pages/user/Settings";
import Profile from "./pages/user/Profile";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/verifymail" element={<VerifyEmail />} />
      <Route path="/resetpassword" element={<ResetPassword />} />
      <Route path="/oauth/callback" element={<OAuthCallback />} />
      <Route path="/welcome" element={<Welcome />} />

      {/* Dashboard routes  */}
      <Route path="/user">
        <Route path="countries" element={<Countries />} />
        <Route path="countries/:countryName" element={<CountryDetails />} />
        <Route path="ai-assistant" element={<AiAssistant />} />
        <Route path="compare" element={<CompareCountries />} />
        <Route path="tax-calculator" element={<TaxCalculator />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="favourites" element={<Favourites />} />
        <Route path="community" element={<Community />} />
        {/* <Route path="settings" element={<Settings />} /> */}
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default App;
