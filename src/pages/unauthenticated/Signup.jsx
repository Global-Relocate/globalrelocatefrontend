import React, { useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { GoPersonFill } from "react-icons/go";
import { PiBuildingsFill } from "react-icons/pi";
import { BsCheck, BsArrowLeft } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import { HiOutlineMail } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import SignupForm from "../../components/forms/SignupForm";
import logo from "../../assets/svg/logo.svg";
// import microsoftIcon from "../../assets/svg/microsoft.svg";
import { initiateGoogleAuth, initiateMicrosoftAuth } from "../../services/api";

export default function Signup() {
  const [selectedAccountType, setSelectedAccountType] = useState(null);
  const [showSignupMethods, setShowSignupMethods] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    password: "",
    confirmPassword: "",
    country: null,
    userType: null
  });

  const [errors, setErrors] = useState({
    email: "",
    fullName: "",
    password: "",
    confirmPassword: "",
    country: ""
  });

  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.fullName) {
      newErrors.fullName = "Full Name is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.country) {
      newErrors.country = "Please select a country";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle continue button click
  const handleContinue = () => {
    if (showEmailForm) {
      if (validateForm()) {
        navigate("/verifymail");
      }
    } else {
      setShowSignupMethods(true);
    }
  };

  // Handle email signup button click
  const handleEmailSignup = () => {
    setShowEmailForm(true);
  };

  // Handle close button click
  const handleClose = () => {
    navigate(-1);
  };

  // Handle back button click
  const handleBack = () => {
    if (showEmailForm) {
      setShowEmailForm(false);
    } else if (showSignupMethods) {
      setShowSignupMethods(false);
    } else {
      navigate(-1);
    }
  };

  // Handle account type selection
  const handleAccountTypeSelect = (type) => {
    setSelectedAccountType(type);
    setFormData(prev => ({
      ...prev,
      userType: type === "personal" ? "INDIVIDUAL" : "CORPORATE"
    }));
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      await initiateGoogleAuth();
      // No need to handle the response as we're redirecting
    } catch (error) {
      console.error("Google login error:", error);
      setErrorMessage(error.message || "Failed to initiate Google login. Please try again.");
      setLoading(false);
    }
  };

  // Handle Microsoft login
  const handleMicrosoftLogin = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      await initiateMicrosoftAuth();
      // No need to handle the response as we're redirecting
    } catch (error) {
      console.error("Microsoft login error:", error);
      setErrorMessage(error.message || "Failed to initiate Microsoft login. Please try again.");
      setLoading(false);
    }
  };

  // Account type selection component
  const AccountTypeSelection = () => (
    <>
      <h1 className="text-[32px] font-medium mb-10 text-left pl-6 w-[100%]">
        Let's create your account
      </h1>

      <p className="text-base text-gray-700 mb-6 text-left pl-6">
        Choose an account type
      </p>

      <div className="space-y-4 px-6">
        <button
          className={`w-[100%] flex items-center justify-between p-6 rounded-lg transition-all ${
            selectedAccountType === "personal"
              ? "border-[1px] border-black bg-[#F5F5F5]"
              : "bg-[#F5F5F5]"
          }`}
          onClick={() => handleAccountTypeSelect("personal")}
        >
          <div className="flex items-center">
            <GoPersonFill className="h-5 w-5 mr-3 text-gray-700" />
            <span className="text-left text-gray-700 text-sm">
              I am creating a personal account
            </span>
          </div>
          <div
            className={`h-3 w-3 flex items-center justify-center rounded-full ${
              selectedAccountType === "personal" ? "bg-green-600" : "bg-[#E5E5E5]"
            }`}
            style={{ minWidth: '1rem', minHeight: '1rem' }}
          >
            {selectedAccountType === "personal" && (
              <BsCheck className="h-5 w-5 text-white" />
            )}
          </div>
        </button>

        <button
          className={`w-[100%] flex items-center justify-between p-6 rounded-lg transition-all ${
            selectedAccountType === "corporate"
              ? "border-[1px] border-black bg-[#F5F5F5]"
              : "bg-[#F5F5F5]"
          }`}
          onClick={() => handleAccountTypeSelect("corporate")}
        >
          <div className="flex items-center">
            <PiBuildingsFill className="h-5 w-5 mr-3 text-gray-700" />
            <span className="text-left text-gray-700 text-sm">
              I am creating a corporate account
            </span>
          </div>
          <div
            className={`h-3 w-3 flex items-center justify-center rounded-full ${
              selectedAccountType === "corporate" ? "bg-green-600" : "bg-[#E5E5E5]"
            }`}
            style={{ minWidth: '1rem', minHeight: '1rem' }}
          >
            {selectedAccountType === "corporate" && (
              <BsCheck className="h-5 w-5 text-white" />
            )}
          </div>
        </button>
      </div>

      <div className="px-6">
        <button
          className={`w-[100%] py-2 mt-8 text-black rounded-lg ${
            selectedAccountType ? "bg-[#FCA311] hover:bg-[#e5940c]" : "bg-[#FCA31180] cursor-not-allowed"
          }`}
          disabled={!selectedAccountType}
          onClick={handleContinue}
        >
          Continue
        </button>
      </div>
    </>
  );

  // Signup methods component
  const SignupMethods = () => (
    <>
      <h1 className="text-[32px] font-medium mb-10 text-left pl-6 w-[100%]">
        Let's create your account
      </h1>

      <p className="text-base text-gray-700 mb-6 text-left pl-6">
        Choose method of sign up
      </p>

      <div className="space-y-4 px-6">
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-[100%] flex items-center justify-between py-3 px-4 rounded-lg bg-[#F5F5F5] hover:bg-[#e5e5e5] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center">
            <FcGoogle className="h-5 w-5 mr-3" />
            <span className="text-gray-700">Continue with Google</span>
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

        <button 
          onClick={handleEmailSignup}
          disabled={loading}
          className="w-[100%] flex items-center justify-between py-3 px-4 rounded-lg bg-[#F5F5F5] hover:bg-[#e5e5e5] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center">
            <HiOutlineMail className="h-5 w-5 mr-3" />
            <span className="text-gray-700">Continue with Email</span>
          </div>
          <BsArrowLeft className="rotate-180" />
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 px-6">
      {/* Header Section */}
      <div className="w-full flex justify-between items-center mt-6">
        <Link to="/">
          <img src={logo} alt="Global Relocate Logo" className="h-10" />
        </Link>
        <div className="flex items-center cursor-pointer" onClick={handleClose}>
          <IoCloseCircleOutline className="text-2xl mr-2" />
          <span className="text-gray-700">Close</span>
        </div>
      </div>

      <div className="mt-14 w-full max-w-md">
        {(showSignupMethods || showEmailForm) && (
          <button
            className="h-8 w-8 flex items-center justify-center bg-gray-100 rounded-full mb-6"
            onClick={handleBack}
          >
            <BsArrowLeft className="text-lg" />
          </button>
        )}

        {/* Account Type Selection Section */}
        {!showSignupMethods && !showEmailForm && <AccountTypeSelection />}
        
        {/* Signup Methods Section */}
        {showSignupMethods && !showEmailForm && <SignupMethods />}
        
        {/* Email Signup Form Section */}
        {showEmailForm && (
          <SignupForm
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
            handleContinue={handleContinue}
          />
        )}

        {/* Error Message Section */}
        {errorMessage && (
          <div className="px-6">
            <p className="mt-4 text-sm text-red-600 text-left w-[100%]">
              {errorMessage}
            </p>
          </div>
        )}

        {/* Login Link Section */}
        {!showEmailForm && (
          <div className="px-6">
            <p className="mt-4 text-sm text-gray-600 text-left w-[100%]">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 font-medium">
                Log In
              </Link>
            </p>
          </div>
        )}

        {/* Terms and Privacy Policy Section */}
        <p className="text-left mt-8 text-xs text-gray-500 px-6 w-[100%]">
          By clicking "Continue", you agree to our{" "}
          <Link to="/terms" className="text-black underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="text-black underline">
            Privacy Policy.
          </Link>
        </p>
        <div className="mb-20"></div>
      </div>
    </div>
  );
}
