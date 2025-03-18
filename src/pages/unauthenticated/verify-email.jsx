import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { IoCloseCircleOutline } from "react-icons/io5";
import { CheckCircle2 } from "lucide-react";
import logo from "../../assets/svg/logo.svg";
import mail from "../../assets/svg/mail.svg";
import { verifyEmail, resendOTP } from "../../services/api";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function VerifyEmail() {
  const [loginCode, setLoginCode] = useState("");
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const location = useLocation();
  const email = location.state?.email || "myaccount@gmail.com";
  const username = location.state?.username || "User";
  console.log("Email received in VerifyEmail:", email);
  console.log("Username received in VerifyEmail:", username);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setLoginCode(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFormValid) {
      setIsLoading(true);
      setApiError("");
      setSuccessMessage("");
      
      try {
        await verifyEmail(email, loginCode);
        navigate("/welcome", { state: { username } });
      } catch (error) {
        setApiError(error.message || "Failed to verify email. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    setApiError("");
    setSuccessMessage("");

    try {
      await resendOTP(email);
      setSuccessMessage("OTP has been resent to your email");
    } catch (error) {
      setApiError(error.message || "Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const handleClose = () => {
    navigate("/");
  };

  const isFormValid = loginCode.length > 0;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 px-6">
      <div className="w-full flex justify-between items-center mt-6">
        <Link to="/">
          <img src={logo} alt="Global Relocate Logo" className="h-10" />
        </Link>
        <div className="flex items-center cursor-pointer" onClick={handleClose}>
          <IoCloseCircleOutline className="text-2xl mr-2" />
          <span className="text-gray-700">Close</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full md:w-1/3 mt-16">
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-medium mb-6 text-center">
            An email is on the way
          </h1>

          {/* Email Icon */}
          <div className="w-24 h-12 flex items-center justify-center mb-8">
            <img src={mail} alt="Email" className="w-16 h-16" />
          </div>

          <div className="mb-1 text-base text-gray-700 text-center">
            <p>We just sent you a temporary login code to <span className="font-bold">{email}</span>.</p>
            <p>Please check your inbox.</p>
          </div>

          {/* Form Section */}
          <div className="w-full mt-8">
            {apiError && (
              <Alert variant="destructive" className="mb-4">
                <div className="flex justify-between items-start w-full">
                  <AlertDescription>{apiError}</AlertDescription>
                  <button 
                    onClick={() => setApiError("")}
                    className="ml-2 hover:opacity-70 transition-opacity flex-shrink-0"
                  >
                    <IoCloseCircleOutline size={16} />
                  </button>
                </div>
              </Alert>
            )}

            {successMessage && (
              <Alert className="mb-4 bg-green-50 border-green-200 text-green-800">
                <div className="flex justify-between items-start w-full">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>{successMessage}</AlertDescription>
                  </div>
                  <button
                    onClick={() => setSuccessMessage("")}
                    className="ml-2 hover:opacity-70 transition-opacity flex-shrink-0"
                  >
                    <IoCloseCircleOutline size={16} />
                  </button>
                </div>
              </Alert>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm mb-2">
                  Login Code
                </label>
                <input
                  type="text"
                  value={loginCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#FCA311] hover:border-[#FCA311]"
                  placeholder="Enter login code"
                />
              </div>

              <button
                type="submit"
                className={`w-full py-3 rounded-lg text-center transition-colors ${
                  isFormValid && !isLoading
                    ? "bg-[#FCA311] hover:bg-[#e5940c] text-black"
                    : "bg-[#FCA31180] text-black cursor-not-allowed"
                }`}
                disabled={!isFormValid || isLoading}
              >
                {isLoading ? "Verifying..." : "Continue with login code"}
              </button>
            </form>

            <button
              onClick={handleResendOTP}
              className="w-full py-3 rounded-lg text-blue-600 text-center hover:underline mt-4"
              disabled={isResending}
            >
              {isResending ? "Sending..." : "Resend OTP"}
            </button>

            <div className="mt-4 text-sm text-gray-600 text-center">
              By clicking creating an account, you agree to our{" "}
              <Link to="/terms" className="underline">
                Term of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="underline">
                Privacy Policy.
              </Link>
            </div>
            <div className="mb-2"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
