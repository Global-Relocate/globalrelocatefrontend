import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoCloseCircleOutline } from "react-icons/io5";
import { BsArrowLeft, BsEye, BsEyeSlash } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { Alert, AlertDescription } from "@/components/ui/alert";
import logo from "../../assets/svg/logo.svg";
import { loginUser } from "../../services/api";

export default function Login() {
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

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "email") {
      if (value && !validateEmail(value)) {
        setEmailError("Email Address not valid");
      } else {
        setEmailError("");
      }
    }

    if (name === "password") {
      if (value && !validatePassword(value)) {
        setPasswordError("Password must be at least 6 characters");
      } else {
        setPasswordError("");
      }
    }
  };

  const handleClose = () => {
    navigate(-1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await loginUser(formData.email, formData.password);
      console.log("Login successful:", response);
      navigate("/welcome");
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage(error.message || "Failed to log in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.email && formData.password && !emailError && !passwordError;

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
          to="/signup"
          className="text-sm font-medium hover:text-gray-600"
        >
          Create account
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 pt-8 md:pt-16">
        <h1 className="text-3xl font-medium mb-12 text-center">
          Log into Global Relocate
        </h1>

        <div className="flex flex-col md:flex-row md:space-x-12 justify-center">
          {/* Form Section */}
          <div className="w-full md:w-[320px]">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="relative">
                <label className="block text-sm mb-2">
                  Email Address
                </label>
                {emailError && (
                  <p className="absolute right-0 top-0 text-red-500 text-xs">{emailError}</p>
                )}
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    emailError ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:border-[#FCA311] hover:border-[#FCA311]`}
                  placeholder="myaccount@gmail.com"
                />
              </div>

              <div className="relative">
                <label className="block text-sm mb-2">Password</label>
                {passwordError && (
                  <p className="absolute right-0 top-0 text-red-500 text-xs">{passwordError}</p>
                )}
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      passwordError ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:border-[#FCA311] hover:border-[#FCA311]`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
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
                {loading ? "Processing..." : "Continue"}
              </button>
            </form>
          </div>

          {/* Divider */}
          <div className="my-8 md:my-0 flex md:flex-col items-center justify-center md:mt-15">
            <div className="flex-1 md:h-full md:w-px border-t md:border-l border-gray-300"></div>
            <span className="px-4 text-gray-500">OR</span>
            <div className="flex-1 md:h-full md:w-px border-t md:border-l border-gray-300"></div>
          </div>

          {/* Social Login Section */}
          <div className="w-full md:w-[320px] space-y-4 md:mt-5">
            <button className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-gray-100 hover:bg-gray-200">
              <div className="flex items-center">
                <FcGoogle className="h-5 w-5 mr-3" />
                <span>Continue with Google</span>
              </div>
              <BsArrowLeft className="rotate-180" />
            </button>

            <button className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-gray-100 hover:bg-gray-200">
              <div className="flex items-center">
                <FaApple className="h-5 w-5 mr-3" />
                <span>Continue with Apple</span>
              </div>
              <BsArrowLeft className="rotate-180" />
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link to="/forgotpassword" className="text-sm text-gray-600">
            Can't log in?
          </Link>
        </div>

        {/* Mobile Create Account Button */}
        <div className="md:hidden mt-4 text-center">
          <Link to="/signup" className="text-sm font-medium text-[#0000FF]">
            Create account
          </Link>
        </div>

        <p className="mt-8 text-sm text-gray-600 text-center">
          By clicking creating an account, you agree to our{" "}
          <Link to="/terms" className="underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="underline">
            Privacy Policy.
          </Link>
        </p>
        <div className="mb-20"></div>
      </div>
    </div>
  );
}
