import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoCloseCircleOutline } from "react-icons/io5";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import logo from "../../assets/svg/logo.svg";
import successMark from "../../assets/svg/successmark.svg";
import { resetPassword } from "../../services/api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";

export default function ResetPassword() {
  const [formData, setFormData] = useState({
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [otpError, setOtpError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [passwordChanged, setPasswordChanged] = useState(false);
  const navigate = useNavigate();

  const validateOtp = (otp) => otp.length === 6;
  const validatePassword = (password) => password.length >= 6;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "otp") {
      if (value && !validateOtp(value)) {
        setOtpError("OTP must be 6 digits");
      } else {
        setOtpError("");
      }
    }

    if (name === "newPassword") {
      if (value && !validatePassword(value)) {
        setNewPasswordError("Password must be at least 6 characters");
      } else {
        setNewPasswordError("");
      }
    }

    if (name === "confirmPassword") {
      if (value && value !== formData.newPassword) {
        setConfirmPasswordError("Passwords do not match");
      } else {
        setConfirmPasswordError("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFormValid) {
      setIsLoading(true);
      setApiError("");
      setSuccessMessage("");

      try {
        await resetPassword(formData.otp, formData.newPassword);
        setPasswordChanged(true);
      } catch (error) {
        setApiError(error.message || "Failed to reset password. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClose = () => {
    navigate(-1);
  };

  const handleContinue = () => {
    navigate("/login");
  };

  const isFormValid =
    formData.otp &&
    formData.newPassword &&
    formData.confirmPassword &&
    !otpError &&
    !newPasswordError &&
    !confirmPasswordError;

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
        <div className="flex flex-col items-center max-w-md mx-auto w-full">
          {!passwordChanged ? (
            <>
              <h1 className="text-3xl font-medium mb-4">
                Create a new password
              </h1>
              <p className="text-base text-gray-700 mb-12 text-center">
                Your new password must be unique from those previously used.
              </p>

              {/* Form Section */}
              <div className="w-full">
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
                      OTP
                    </label>
                    <input
                      type="text"
                      name="otp"
                      value={formData.otp}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        otpError ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:border-[#FCA311] hover:border-[#FCA311]`}
                      placeholder="Enter OTP"
                    />
                    {otpError && (
                      <p className="mt-1 text-red-500 text-xs">
                        {otpError}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          newPasswordError ? 'border-red-500' : 'border-gray-300'
                        } focus:outline-none focus:border-[#FCA311] hover:border-[#FCA311]`}
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showNewPassword ? (
                          <BsEyeSlash className="text-gray-500" />
                        ) : (
                          <BsEye className="text-gray-500" />
                        )}
                      </button>
                    </div>
                    {newPasswordError && (
                      <p className="mt-1 text-red-500 text-xs">
                        {newPasswordError}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          confirmPasswordError ? 'border-red-500' : 'border-gray-300'
                        } focus:outline-none focus:border-[#FCA311] hover:border-[#FCA311]`}
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showConfirmPassword ? (
                          <BsEyeSlash className="text-gray-500" />
                        ) : (
                          <BsEye className="text-gray-500" />
                        )}
                      </button>
                    </div>
                    {confirmPasswordError && (
                      <p className="mt-1 text-red-500 text-xs">
                        {confirmPasswordError}
                      </p>
                    )}
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
                    {isLoading ? "Processing..." : "Reset Password"}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="text-center">
              <h1 className="text-3xl font-medium mb-4">
                Password Changed!
              </h1>
              <p className="text-base text-gray-700 mb-8">
                Your password has been changed successfully.
              </p>
              <img src={successMark} alt="Success" className="h-24 w-24 mx-auto mb-8" />
              <button
                onClick={handleContinue}
                className="w-full py-3 rounded-lg bg-[#FCA311] hover:bg-[#e5940c] text-black text-center transition-colors"
              >
                Continue to sign in
              </button>
            </div>
          )}

          <div className="mt-6 mb-4">
            <span className="text-sm text-gray-600">
              Remembered your password?{" "}
            </span>
            <Link to="/login" className="text-sm text-blue-600 hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
