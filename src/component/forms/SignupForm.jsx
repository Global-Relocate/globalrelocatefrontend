import React, { useState, useEffect } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import Select from 'react-select';
import countries from 'country-list';

const SignupForm = ({ formData, setFormData, errors, setErrors, handleContinue }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

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

  // Handle input change and validate in real-time
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Real-time validation
    let error = "";
    if (name === "email") {
      if (!value) {
        error = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        error = "Invalid email format";
      }
    } else if (name === "fullName") {
      if (!value) {
        error = "Full name is required";
      } else if (value.trim().split(" ").length < 2) {
        error = "Please enter your full name";
      }
    } else if (name === "password") {
      if (!value) {
        error = "Password is required";
      } else if (value.length < 6) {
        error = "Password must be at least 6 characters";
      }
    } else if (name === "confirmPassword") {
      if (!value) {
        error = "Confirm Password is required";
      } else if (value !== formData.password) {
        error = "Passwords do not match";
      }
    }

    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  // Handle country selection change
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

  // Check if the form is valid
  useEffect(() => {
    const isValid = !Object.values(errors).some(error => error) &&
      formData.email &&
      formData.fullName &&
      formData.password &&
      formData.confirmPassword &&
      formData.country;
    setIsFormValid(isValid);
  }, [errors, formData]);

  return (
    <>
      <h1 className="text-[32px] font-medium mb-10 text-left pl-6 w-[100%]">
        Let's create your account
      </h1>

      <div className="px-6 space-y-4 w-full">
        {/* Email Address Field */}
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

        {/* Full Name Field */}
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

        {/* Password Field */}
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

        {/* Confirm Password Field */}
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
          {errors.confirmPassword && (
            <span className="text-red-500 text-xs mt-1">{errors.confirmPassword}</span>
          )}
        </div>

        {/* Country Selection Field */}
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

      {/* Continue Button */}
      <div className="px-6 mt-6">
        <button
          className={`w-full py-3 text-black rounded-lg ${
            isFormValid ? "bg-[#FCA311] hover:bg-[#e5940c]" : "bg-[#FCA31180] cursor-not-allowed"
          }`}
          onClick={handleContinue}
          disabled={!isFormValid}
        >
          Continue
        </button>
      </div>
    </>
  );
};

export default SignupForm;
