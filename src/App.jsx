import { Route, Routes } from "react-router-dom";
import Landing from "./pages/unauthenticated/Landing";
import Login from "./pages/unauthenticated/Login";
import Signup from "./pages/unauthenticated/Signup";
import "./App.css";
import ForgotPassword from "./pages/unauthenticated/ForgotPassword";
import VerifyEmail from "./pages/unauthenticated/VerifyEmail";
import ResetPassword from "./pages/unauthenticated/ResetPassword";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/verifymail" element={<VerifyEmail />} />
      <Route path="/resetpassword" element={<ResetPassword />} />
    </Routes>
  );
}

export default App;
