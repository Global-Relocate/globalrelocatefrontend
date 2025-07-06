import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoCloseCircleOutline } from "react-icons/io5";
import { BsArrowLeft, BsEye, BsEyeSlash } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthContext } from "../../context/AuthContextExport";
import logo from "../../assets/svg/logo.svg";
// import microsoftIcon from "../../assets/svg/microsoft.svg";
import { loginUser, initiateGoogleAuth } from "../../services/api";
import { useTranslation } from "react-i18next";
import Footer from "@/components/navigation/Footer";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear any previous error messages
    setErrorMessage("");

    if (name === "email") {
      if (value && !validateEmail(value)) {
        setEmailError("Email Address not valid");
      } else {
        setEmailError("");
      }
    }

    if (name === "password") {
      if (value && !validatePassword(value)) {
        setPasswordError("Password must be at least 8 characters");
      } else {
        setPasswordError("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await loginUser(formData.email, formData.password);

      // Store the exact user data structure from the API response
      login(response.accessToken, response.data.user);

      // Navigate to welcome page
      navigate("/user/countries");
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage(error.message || "Failed to log in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      const response = await initiateGoogleAuth();

      if (response?.token) {
        login(response.token, response.user);
        navigate("/welcome", { state: { username: response.user.name } });
      }
    } catch (error) {
      console.error("Google login error:", error);
      setErrorMessage(
        error.message || "Failed to initiate Google login. Please try again."
      );
      setLoading(false);
    }
  };

  // const handleMicrosoftLogin = async () => {
  //   try {
  //     setLoading(true);
  //     setErrorMessage("");
  //     const response = await initiateMicrosoftAuth();

  //     if (response?.token) {
  //       login(response.token, response.user);
  //       navigate("/welcome", { state: { username: response.user.name } });
  //     }
  //   } catch (error) {
  //     console.error("Microsoft login error:", error);
  //     setErrorMessage(
  //       error.message || "Failed to initiate Microsoft login. Please try again."
  //     );
  //     setLoading(false);
  //   }
  // };

  const isFormValid =
    formData.email && formData.password && !emailError && !passwordError;

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4">
          <Link to="/">
            <img src={logo} alt="Global Relocate Logo" className="h-12 ml-5" />
          </Link>
          <button
            onClick={navigate.bind(null, "/signup")}
            className="flex items-center"
            aria-label="Create Account"
          >
            <i className="far fa-user-plus text-lg mr-3" />
            <span>{t("loginPage.createAccount")}</span>
          </button>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between px-6 lg:px-10 py-4">
          <Link to="/">
            <img src={logo} alt="Global Relocate Logo" className="h-12" />
          </Link>
          <Link
            to="/signup"
            className="text-sm font-medium hover:text-gray-600"
          >
            <i className="far fa-user-plus text-lg mr-3" />
            <span>{t("loginPage.createAccount")}</span>
          </Link>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-6 pt-8 md:pt-16">
          <h1 className="text-3xl font-medium mb-12 text-center">
            <span>{t("loginPage.logIntoGR")}</span>
          </h1>

          <div className="flex flex-col md:flex-row md:space-x-12 justify-center">
            {/* Form Section */}
            <div className="w-full md:w-[320px]">
              <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                <div className="relative">
                  <label htmlFor="email" className="block text-sm mb-2">
                    {t("userDashboard.settings.emailAddress")}
                  </label>
                  {emailError && (
                    <p
                      className="absolute right-0 top-0 text-red-500 text-xs"
                      role="alert"
                    >
                      {emailError}
                    </p>
                  )}
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      emailError ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:border-[#FCA311] hover:border-[#FCA311]`}
                    placeholder="myaccount@gmail.com"
                    aria-invalid={emailError ? "true" : "false"}
                    aria-describedby={emailError ? "email-error" : undefined}
                  />
                </div>

                <div className="relative">
                  <label htmlFor="password" className="block text-sm mb-2">
                    {t("loginPage.password")}
                  </label>
                  {passwordError && (
                    <p
                      className="absolute right-0 top-0 text-red-500 text-xs"
                      role="alert"
                    >
                      {passwordError}
                    </p>
                  )}
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 pr-10 rounded-lg border ${
                        passwordError ? "border-red-500" : "border-gray-300"
                      } focus:outline-none focus:border-[#FCA311] hover:border-[#FCA311]`}
                      placeholder={t("loginPage.enterPassword")}
                      aria-invalid={passwordError ? "true" : "false"}
                      aria-describedby={
                        passwordError ? "password-error" : undefined
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      aria-label={
                        showPassword
                          ? t("loginPage.hidePassword")
                          : t("loginPage.showPassword")
                      }
                    >
                      {showPassword ? (
                        <BsEyeSlash className="h-5 w-5 text-gray-500" />
                      ) : (
                        <BsEye className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>

                {errorMessage && (
                  <Alert variant="destructive" className="mt-4">
                    <div className="flex items-start justify-between">
                      <AlertDescription>{errorMessage}</AlertDescription>
                      <button
                        onClick={() => setErrorMessage("")}
                        className="ml-4 text-sm hover:text-gray-900"
                        aria-label="Close error message"
                      >
                        <IoCloseCircleOutline className="h-5 w-5" />
                      </button>
                    </div>
                  </Alert>
                )}

                <button
                  type="submit"
                  className={`w-full py-3 rounded-lg text-center transition-colors ${
                    isFormValid && !loading
                      ? "bg-[#FCA311] hover:bg-[#e5940c] text-black"
                      : "bg-[#FCA31180] text-black cursor-not-allowed"
                  }`}
                  disabled={!isFormValid || loading}
                >
                  {loading
                    ? t("loginPage.processing")
                    : t("loginPage.continue")}
                </button>
              </form>
            </div>

            {/* Divider */}
            <div className="my-8 md:my-0 flex md:flex-col items-center justify-center md:mt-15">
              <div className="flex-1 md:h-full md:w-px border-t md:border-l border-gray-300"></div>
              <span className="px-4 text-gray-500">{t("loginPage.or")}</span>
              <div className="flex-1 md:h-full md:w-px border-t md:border-l border-gray-300"></div>
            </div>

            {/* Social Login Section */}
            <div className="w-full md:w-[320px] md:mt-5 flex flex-col justify-center flex-grow-1">
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center">
                  <FcGoogle className="h-5 w-5 mr-3" />
                  <span>{t("loginPage.continueWithGoogle")}</span>
                </div>
                <BsArrowLeft className="rotate-180" />
              </button>

              {/* Commented out Microsoft login button */}
              {/* <button
              onClick={handleMicrosoftLogin}
              disabled={loading}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center">
                <img src={microsoftIcon} alt="Microsoft" className="h-5 w-5 mr-3" />
                <span>Continue with Microsoft</span>
              </div>
              <BsArrowLeft className="rotate-180" />
            </button> */}
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/forgotpassword"
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              {t("loginPage.cantLogin")}
            </Link>
          </div>

          {/* Mobile Create Account Button */}
          <div className="md:hidden mt-4 text-center">
            <Link to="/signup" className="text-sm font-medium text-[#0000FF]">
              {t("loginPage.createAccount")}
            </Link>
          </div>

          <p className="mt-8 text-sm text-gray-600 text-center">
            {t("loginPage.tosDesc")}
            <Link to="/terms" className="underline hover:text-gray-800">
              {t("loginPage.tos")}
            </Link>{" "}
            {t("loginPage.and")}{" "}
            <Link to="/privacy" className="underline hover:text-gray-800">
              {t("loginPage.privacyPolicy")}
            </Link>
          </p>
          <div className="mb-20"></div>
        </div>
      </div>
      <Footer />
    </>
  );
}
