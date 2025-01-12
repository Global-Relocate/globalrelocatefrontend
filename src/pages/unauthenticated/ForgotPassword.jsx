import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoCloseCircleOutline } from "react-icons/io5";
import logo from "../../assets/svg/logo.svg";
import { forgotPassword } from "../../services/api";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    setEmail(value);

    if (value && !validateEmail(value)) {
      setEmailError("Email Address not valid");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFormValid) {
      setIsLoading(true);
      setApiError("");
      
      try {
        await forgotPassword(email);
        setEmailSent(true);
      } catch (error) {
        setApiError(error.message || "Failed to send password reset email. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClose = () => {
    navigate(-1);
  };

  const handleResendEmail = async () => {
    setIsLoading(true);
    setApiError("");
    
    try {
      await forgotPassword(email);
    } catch (error) {
      setApiError(error.message || "Failed to resend password reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDone = () => {
    navigate("/login");
  };

  const isFormValid = email && !emailError;

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4">
        <Link to="/">
          <img src={logo} alt="Global Relocate Logo" className="h-10" />
        </Link>
        <button onClick={handleClose} className="flex items-center">
          <IoCloseCircleOutline className="text-2xl mr-2" />
          <span>Close</span>
        </button>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex items-center justify-between p-6">
        <Link to="/">
          <img src={logo} alt="Global Relocate Logo" className="h-10" />
        </Link>
        <Link
          to="/login"
          className="text-sm font-medium hover:text-gray-600"
        >
          Log in
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 pt-8 md:pt-16">
        {!emailSent ? (
          <>
            <h1 className="text-3xl font-medium mb-4 text-center">
              Forgot Password?
            </h1>
            <div className="flex justify-center">
              <p className="text-base text-gray-700 mb-12 text-center w-full md:w-1/3">
                Enter your account's email and we'll send you an email to reset the password.
              </p>
            </div>

            <div className="flex justify-center">
              {/* Form Section */}
              <div className="w-full md:w-1/3">
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="relative">
                    <label className="block text-sm mb-2">
                      Email Address
                    </label>
                    {(emailError || apiError) && (
                      <p className="absolute right-0 top-0 text-red-500 text-xs">
                        {emailError || apiError}
                      </p>
                    )}
                    <input
                      type="email"
                      name="email"
                      value={email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        emailError || apiError ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:border-[#FCA311] hover:border-[#FCA311]`}
                      placeholder="myaccount@gmail.com"
                    />
                  </div>

                  <button
                    type="submit"
                    className={`w-full py-3 rounded-lg text-center transition-colors ${
                      isFormValid
                        ? "bg-[#FCA311] hover:bg-[#e5940c] text-black"
                        : "bg-[#FCA31180] text-black cursor-not-allowed"
                    }`}
                    disabled={!isFormValid || isLoading}
                  >
                    {isLoading ? "Sending..." : "Send email"}
                  </button>
                </form>
              </div>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-medium mb-4 text-center">
              Reset Password
            </h1>
            <div className="flex justify-center">
              <p className="text-base text-gray-700 mb-4 text-center w-full md:w-1/3">
                If an account matching <span className="font-bold">{email}</span> exists, you will receive an email.
              </p>
            </div>
            <div className="flex justify-center">
              <p className="text-base text-gray-700 mb-12 text-center w-full md:w-1/3">
                Click the link in the email to reset your password.
              </p>
            </div>

            <div className="flex justify-center">
              <div className="w-full md:w-1/3 space-y-4">
                <button
                  onClick={handleDone}
                  className="w-full py-3 rounded-lg bg-[#FCA311] hover:bg-[#e5940c] text-black text-center transition-colors"
                >
                  Done
                </button>
                <button
                  onClick={handleResendEmail}
                  className="w-full py-3 rounded-lg text-blue-600 text-center hover:underline"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Resend Email"}
                </button>
                {apiError && (
                  <p className="text-red-500 text-sm text-center">{apiError}</p>
                )}
              </div>
            </div>
          </>
        )}

        <div className="mt-6 text-center">
          <span className="text-sm text-gray-600">
            Remembered your password?{" "}
          </span>
          <Link to="/login" className="text-sm text-blue-600 hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
