import React, { useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { GoPersonFill } from "react-icons/go";
import { PiBuildingsFill } from "react-icons/pi";
import { BsCheck, BsArrowLeft, BsEye, BsEyeSlash } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import Select from 'react-select';
import countries from 'country-list';
import logo from "../../assets/svg/logo.svg";

export default function Signup() {
  const [selectedAccountType, setSelectedAccountType] = useState(null);
  const [showSignupMethods, setShowSignupMethods] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    password: "",
    confirmPassword: "",
    country: null
  });

  const [errors, setErrors] = useState({
    email: "",
    fullName: "",
    password: "",
    confirmPassword: "",
    country: ""
  });

  const countryOptions = countries.getData().map(country => ({
    value: country.code,
    label: country.name
  }));

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      padding: '4px',
      borderRadius: '8px',
      border: state.isFocused ? '1px solid #FCA311' : '1px solid #E5E5E5',
      boxShadow: 'none',
      '&:hover': {
        border: '1px solid #FCA311'
      }
    }),
    option: (base, { isFocused, isSelected }) => ({
      ...base,
      backgroundColor: isSelected ? '#FCA311' : isFocused ? '#FCA31120' : 'white',
      color: isSelected ? 'white' : 'black',
      '&:hover': {
        backgroundColor: '#FCA31120'
      }
    }),
    placeholder: (base) => ({
      ...base,
      color: '#A3A3A3'
    }),
    menu: (base) => ({
      ...base,
      borderRadius: '8px',
      marginTop: '4px'
    })
  };

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleCountryChange = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      country: selectedOption
    }));
    if (errors.country) {
      setErrors(prev => ({
        ...prev,
        country: ""
      }));
    }
  };

  const handleAccountTypeSelect = (type) => {
    setSelectedAccountType(type);
  };

  const handleContinue = () => {
    if (showEmailForm) {
      if (validateForm()) {
        navigate("/verifymail");
      }
    } else {
      setShowSignupMethods(true);
    }
  };

  const handleEmailSignup = () => {
    setShowEmailForm(true);
  };

  const handleClose = () => {
    navigate(-1);
  };

  const handleBack = () => {
    if (showEmailForm) {
      setShowEmailForm(false);
    } else if (showSignupMethods) {
      setShowSignupMethods(false);
    } else {
      navigate(-1);
    }
  };

  const AccountTypeSelection = () => (
    <>
      <h1 className="text-[32px] font-medium mb-10 text-left pl-6 w-[90%]">
        Let's create your account
      </h1>

      <p className="text-base text-gray-700 mb-6 text-left pl-6">
        Choose an account type
      </p>

      <div className="space-y-4 px-6">
        <button
          className={`w-[90%] flex items-center justify-between p-6 rounded-lg transition-all ${
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
            className={`h-4 w-4 rounded-full flex items-center justify-center ${
              selectedAccountType === "personal" ? "bg-green-600" : "bg-[#E5E5E5]"
            }`}
          >
            {selectedAccountType === "personal" && (
              <BsCheck className="h-5 w-5 text-white" />
            )}
          </div>
        </button>

        <button
          className={`w-[90%] flex items-center justify-between p-6 rounded-lg transition-all ${
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
            className={`h-4 w-4 rounded-full flex items-center justify-center ${
              selectedAccountType === "corporate" ? "bg-green-600" : "bg-[#E5E5E5]"
            }`}
          >
            {selectedAccountType === "corporate" && (
              <BsCheck className="h-5 w-5 text-white" />
            )}
          </div>
        </button>
      </div>

      <div className="px-6">
        <button
          className={`w-[90%] py-2 mt-8 text-black rounded-lg ${
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

  const SignupMethods = () => (
    <>
      <h1 className="text-[32px] font-medium mb-10 text-left pl-6 w-[90%]">
        Let's create your account
      </h1>

      <p className="text-base text-gray-700 mb-6 text-left pl-6">
        Choose method of sign up
      </p>

      <div className="space-y-4 px-6">
        <button className="w-[90%] flex items-center justify-between py-3 px-4 rounded-lg bg-[#F5F5F5] hover:bg-[#e5e5e5]">
          <div className="flex items-center">
            <FcGoogle className="h-5 w-5 mr-3" />
            <span className="text-gray-700">Continue with Google</span>
          </div>
          <BsArrowLeft className="rotate-180" />
        </button>

        <button className="w-[90%] flex items-center justify-between py-3 px-4 rounded-lg bg-[#F5F5F5] hover:bg-[#e5e5e5]">
          <div className="flex items-center">
            <FaApple className="h-5 w-5 mr-3" />
            <span className="text-gray-700">Continue with Apple</span>
          </div>
          <BsArrowLeft className="rotate-180" />
        </button>

        <button 
          className="w-[90%] flex items-center justify-between py-3 px-4 rounded-lg bg-[#F5F5F5] hover:bg-[#e5e5e5]"
          onClick={handleEmailSignup}
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

  const EmailSignupForm = () => (
    <>
      <h1 className="text-[32px] font-medium mb-10 text-left pl-6 w-[90%]">
        Let's create your account
      </h1>

      <div className="px-6 space-y-4 w-full">
        <div className="relative">
          <label className="text-sm text-gray-700 mb-1 block">
            Email Address <span className="text-red-500">*</span>
          </label>
          {errors.email && (
            <span className="absolute right-0 top-0 text-red-500 text-xs">{errors.email}</span>
          )}
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full p-3 rounded-lg border ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:border-[#FCA311] focus:ring-0 hover:border-[#FCA311] transition-colors duration-200`}
            placeholder="myaccount@gmail.com"
          />
        </div>

        <div>
          <label className="text-sm text-gray-700 mb-1 block">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className={`w-full p-3 rounded-lg border ${
              errors.fullName ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:border-[#FCA311] focus:ring-0 hover:border-[#FCA311] transition-colors duration-200`}
            placeholder="John Doe"
          />
          {errors.fullName && (
            <span className="text-red-500 text-xs mt-1">{errors.fullName}</span>
          )}
        </div>

        <div>
          <label className="text-sm text-gray-700 mb-1 block">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full p-3 rounded-lg border ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:border-[#FCA311] focus:ring-0 hover:border-[#FCA311] transition-colors duration-200`}
              placeholder="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              {showPassword ? (
                <BsEyeSlash className="text-gray-500" />
              ) : (
                <BsEye className="text-gray-500" />
              )}
            </button>
          </div>
          {errors.password ? (
            <span className="text-red-500 text-xs mt-1">{errors.password}</span>
          ) : (
            <span className="text-gray-500 text-xs mt-1">
              Use a password with more than 6 characters
            </span>
          )}
        </div>

        <div>
          <label className="text-sm text-gray-700 mb-1 block">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`w-full p-3 rounded-lg border ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:border-[#FCA311] focus:ring-0 hover:border-[#FCA311] transition-colors duration-200`}
              placeholder="Password"
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
          {errors.confirmPassword ? (
            <span className="text-red-500 text-xs mt-1">{errors.confirmPassword}</span>
          ) : (
            <span className="text-gray-500 text-xs mt-1">
              Use a password with more than 6 characters
            </span>
          )}
        </div>

        <div>
          <label className="text-sm text-gray-700 mb-1 block">
            Country <span className="text-red-500">*</span>
          </label>
          <Select
            options={countryOptions}
            value={formData.country}
            onChange={handleCountryChange}
            styles={customSelectStyles}
            placeholder="Select a country"
            className={errors.country ? 'border-red-500' : ''}
          />
          {errors.country && (
            <span className="text-red-500 text-xs mt-1">{errors.country}</span>
          )}
        </div>
      </div>

      <div className="px-6 mt-6">
        <button
          className="w-full py-3 text-black rounded-lg bg-[#FCA311] hover:bg-[#e5940c]"
          onClick={handleContinue}
        >
          Continue
        </button>
      </div>
    </>
  );

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

      <div className="mt-14 w-full max-w-md">
        {(showSignupMethods || showEmailForm) && (
          <button
            className="h-8 w-8 flex items-center justify-center bg-gray-100 rounded-full mb-6"
            onClick={handleBack}
          >
            <BsArrowLeft className="text-lg" />
          </button>
        )}

        {!showSignupMethods && !showEmailForm && <AccountTypeSelection />}
        {showSignupMethods && !showEmailForm && <SignupMethods />}
        {showEmailForm && <EmailSignupForm />}

        {!showEmailForm && (
          <div className="px-6">
            <p className="mt-4 text-sm text-gray-600 text-left w-[90%]">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 font-medium">
                Log In
              </Link>
            </p>
          </div>
        )}

        <p className="text-left mt-8 text-xs text-gray-500 px-6 w-[90%]">
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
