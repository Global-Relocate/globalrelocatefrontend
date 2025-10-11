import { useState, useEffect } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { resetPassword } from "../../services/api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { forgotPassword } from "../../services/api";

export default function ResetPasswordTab({
  email,
  onStartLoading,
  onFinishLoading,
  onClose,
}) {
  const [formData, setFormData] = useState({
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: "",
    color: "gray",
  });
  const { t } = useTranslation();

  const sendEmail = async () => {
    if (email) {
      onStartLoading(true);
      setApiError("");
      setSuccessMessage("");

      try {
        await forgotPassword(email);
        setEmailSent(true);
        setSuccessMessage(t("userDashboard.settings.otpSent"));
      } catch (error) {
        setApiError(error.message || "Failed to send OTP. Please try again.");
      } finally {
        onFinishLoading();
      }
    }
  };

  useEffect(() => {
    sendEmail();
  }, [email]);

  const validateOtp = (otp) => otp.length === 6;
  const validatePassword = (password) => {
    const strength = calculatePasswordStrength(password);
    setPasswordStrength(strength);
    return strength.score >= 3;
  };

  const calculatePasswordStrength = (password) => {
    let score = 0;
    let feedback = [];

    if (password.length >= 8) {
      score += 1;
      feedback.push("Length");
    }
    if (/[A-Z]/.test(password)) {
      score += 1;
      feedback.push("Uppercase");
    }
    if (/[a-z]/.test(password)) {
      score += 1;
      feedback.push("Lowercase");
    }
    if (/[0-9]/.test(password)) {
      score += 1;
      feedback.push("Number");
    }
    if (/[^A-Za-z0-9]/.test(password)) {
      score += 1;
      feedback.push("Symbol");
    }

    const strengthMap = {
      0: { message: "Very Weak", color: "#ff4444" },
      1: { message: "Weak", color: "#ffbb33" },
      2: { message: "Fair", color: "#ffbb33" },
      3: { message: "Good", color: "#00C851" },
      4: { message: "Strong", color: "#007E33" },
      5: { message: "Very Strong", color: "#007E33" },
    };

    return {
      score,
      message: strengthMap[score].message,
      color: strengthMap[score].color,
      feedback: feedback.join(" • "),
    };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    let error = "";
    if (name === "otp") {
      if (value && !validateOtp(value)) {
        error = "OTP must be 6 digits";
      } else {
        error = "";
      }
      setOtpError(error);
    }

    if (name === "newPassword") {
      if (value && !validatePassword(value)) {
        error = t("landingPage.resetPassword.passwordStrengthError");
      } else {
        error = "";
      }
      setNewPasswordError(error);
    }

    if (name === "confirmPassword") {
      if (value && value !== formData.newPassword) {
        error = t("landingPage.resetPassword.passwordsDoNotMatch");
      } else {
        error = "";
      }
      setConfirmPasswordError(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFormValid) {
      setIsFormLoading(true);
      setApiError("");
      setSuccessMessage("");

      try {
        await resetPassword(email, formData.newPassword, formData.otp);
        setPasswordChanged(true);
      } catch (error) {
        setApiError(
          error.message || "Failed to reset password. Please try again."
        );
      } finally {
        setIsFormLoading(false);
      }
    }
  };

  const handleContinue = () => {
    onClose();
  };

  const isFormValid =
    formData.otp &&
    formData.newPassword &&
    formData.confirmPassword &&
    !otpError &&
    !newPasswordError &&
    !confirmPasswordError;

  return (
    <div className="flex flex-col items-start w-full">
      {emailSent && !passwordChanged && (
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
                {t("landingPage.resetPassword.otpLabel")}
              </label>
              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  otpError ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:border-[#FCA311] hover:border-[#FCA311]`}
                placeholder={t("landingPage.resetPassword.enterOTP")}
              />
              {otpError && (
                <p className="mt-1 text-red-500 text-xs">{otpError}</p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-2">
                {t("landingPage.resetPassword.newPasswordLabel")}
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 pr-10 rounded-lg border ${
                    newPasswordError ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:border-[#FCA311] hover:border-[#FCA311]`}
                  placeholder={t("landingPage.resetPassword.enterNewPassword")}
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
              {formData.newPassword && (
                <div className="mt-2">
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${(passwordStrength.score / 5) * 100}%`,
                        backgroundColor: passwordStrength.color,
                      }}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span
                      className="text-xs"
                      style={{ color: passwordStrength.color }}
                    >
                      {passwordStrength.message}
                    </span>
                    <span className="text-xs text-gray-500">
                      {passwordStrength.feedback}
                    </span>
                  </div>
                </div>
              )}
              {newPasswordError && (
                <p className="mt-1 text-red-500 text-xs">{newPasswordError}</p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-2">
                {t("landingPage.resetPassword.confirmPasswordLabel")}
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 pr-10 rounded-lg border ${
                    confirmPasswordError ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:border-[#FCA311] hover:border-[#FCA311]`}
                  placeholder={t(
                    "landingPage.resetPassword.confirmNewPassword"
                  )}
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
                isFormValid && !isFormLoading
                  ? "bg-[#FCA311] hover:bg-[#e5940c] text-black"
                  : "bg-[#FCA31180] text-black cursor-not-allowed"
              }`}
              disabled={!isFormValid || isFormLoading}
            >
              {isFormLoading
                ? t("landingPage.resetPassword.processing")
                : t("landingPage.resetPassword.resetPassword")}
            </button>
          </form>
        </div>
      )}

      {passwordChanged && (
        <Alert className="mb-4 bg-green-50 border-green-200 text-green-800 w-full">
          <div className="flex justify-between items-start w-full">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                {t("landingPage.resetPassword.passwordChangedSuccess")}
              </AlertDescription>
            </div>
            <button
              onClick={() => handleContinue()}
              className="ml-2 hover:opacity-70 transition-opacity flex-shrink-0"
            >
              <IoCloseCircleOutline size={16} />
            </button>
          </div>
        </Alert>
      )}
    </div>
  );
}
