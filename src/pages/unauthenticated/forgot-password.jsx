import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoCloseCircleOutline } from "react-icons/io5";
import logo from "../../assets/svg/logo.svg";
import { forgotPassword } from "../../services/api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

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
      setSuccessMessage("");

      try {
        await forgotPassword(email);
        setEmailSent(true);
      } catch (error) {
        setApiError(error.message || "Failed to send OTP. Please try again.");
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
    setSuccessMessage("");

    try {
      await forgotPassword(email);
      setSuccessMessage("OTP has been resent successfully!");
    } catch (error) {
      setApiError(error.message || "Failed to resend OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    navigate("/resetpassword", { state: { email } });
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
      <div className="hidden md:flex items-center justify-between pl-[34px] pr-4 py-4">
        <Link to="/">
          <img src={logo} alt="Global Relocate Logo" className="h-12" />
        </Link>
        <Link to="/login" className="text-sm font-medium hover:text-gray-600">
          <i className="far fa-sign-in text-md mr-1.5"></i>
          {t("landingPage.navbar.logIn")}
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 pt-8 md:pt-16">
        <div className="flex flex-col items-center max-w-md mx-auto w-full">
          {!emailSent ? (
            <>
              <h1 className="text-3xl font-medium mb-4">
                {t("landingPage.forgotPassword.title")}
              </h1>
              <p className="text-base text-gray-700 mb-12 text-center">
                {t("landingPage.forgotPassword.para")}
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

                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <label className="block text-sm mb-2">
                      {t("landingPage.forgotPassword.emailLabel")}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        emailError ? "border-red-500" : "border-gray-300"
                      } focus:outline-none focus:border-[#FCA311] hover:border-[#FCA311]`}
                      placeholder="myaccount@gmail.com"
                    />
                    {emailError && (
                      <p className="mt-1 text-red-500 text-xs">{emailError}</p>
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
                    {isLoading
                      ? t("landingPage.forgotPassword.sending")
                      : t("landingPage.forgotPassword.sendOTP")}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-medium mb-4">
                {t("landingPage.forgotPassword.verifyOTP")}
              </h1>
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

                <p className="text-base text-gray-700 mb-4 text-center">
                  {t("landingPage.forgotPassword.otpSent")}{" "}
                  <span className="font-bold">{email}</span>
                </p>
                <p className="text-base text-gray-700 mb-12 text-center">
                  {t("landingPage.forgotPassword.continuePrompt")}
                </p>

                <div className="space-y-4">
                  <button
                    onClick={handleContinue}
                    className="w-full py-3 rounded-lg bg-[#FCA311] hover:bg-[#e5940c] text-black text-center transition-colors"
                  >
                    {t("landingPage.forgotPassword.continue")}
                  </button>
                  <button
                    onClick={handleResendEmail}
                    className="w-full py-3 rounded-lg text-blue-600 text-center hover:underline"
                    disabled={isLoading}
                  >
                    {isLoading
                      ? t("landingPage.forgotPassword.sending")
                      : t("landingPage.forgotPassword.resendOTP")}
                  </button>
                </div>
              </div>
            </>
          )}

          <div className="mt-6">
            <span className="text-sm text-gray-600">
              {t("landingPage.forgotPassword.rememberPassword")}
            </span>
            <span className="px-2">
              <i className="far fa-arrow-right text-sm"></i>
            </span>
            <Link
              to="/login"
              className="text-sm underline underline-offset-4 hover:underline"
            >
              {t("landingPage.forgotPassword.logIn")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
