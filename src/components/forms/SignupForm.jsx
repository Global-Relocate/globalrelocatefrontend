import React, { useState, useEffect } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import Select from 'react-select';
import countries from 'country-list';
import { useNavigate } from "react-router-dom";
import { registerNewUser } from '../../services/api';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { IoCloseCircleOutline } from "react-icons/io5";

const SignupForm = ({ formData, setFormData, errors, setErrors }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: "",
    color: "gray"
  });
  const navigate = useNavigate();

  const countryOptions = countries.getData().map(country => ({
    value: country.code,
    label: country.name
  }));

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
      5: { message: "Very Strong", color: "#007E33" }
    };

    return {
      score,
      message: strengthMap[score].message,
      color: strengthMap[score].color,
      feedback: feedback.join(" • ")
    };
  };

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

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
      } else if (value.trim().length < 2) {
        error = "Please enter your full name";
      }
    } else if (name === "username") {
      if (!value) {
        error = "Username is required";
      } else if (value.length < 3) {
        error = "Username must be at least 3 characters";
      }
    } else if (name === "password") {
      if (!value) {
        error = "Password is required";
      } else {
        const strength = calculatePasswordStrength(value);
        setPasswordStrength(strength);
        if (value.length < 8) {
          error = "Password must be at least 8 characters";
        } else if (strength.score < 3) {
          error = "Password is too weak";
        }
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

  useEffect(() => {
    const isValid = !Object.values(errors).some(error => error) &&
      formData.email &&
      formData.fullName &&
      formData.username &&
      formData.password &&
      formData.confirmPassword &&
      formData.country &&
      passwordStrength.score >= 3;
    setIsFormValid(isValid);
  }, [errors, formData, passwordStrength]);

  const handleContinue = async () => {
    if (isFormValid) {
      setLoading(true);
      const requestBody = {
        fullName: formData.fullName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        country: formData.country.label,
        userType: "INDIVIDUAL"
      };

      try {
        const response = await registerNewUser(requestBody);
        console.log("Signup successful:", response);
        navigate("/verifymail", { state: { email: formData.email, username: formData.username } });
      } catch (error) {
        console.error("Error during signup:", error);
        setAlertMessage(error.message || "An error occurred during signup");
      } finally {
        setLoading(false);
      }
    } else {
      setAlertMessage("Please fill in all required fields correctly");
    }
  };

  return (
    <>
      <h1 className="text-[32px] font-medium mb-10 text-left pl-6 w-[100%]">
        Let's create your account
      </h1>

      <div className="px-6 space-y-4 w-full">
        <div className="relative">
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
            placeholder="Enter your full name"
          />
          {errors.fullName && (
            <span className="text-red-500 text-xs mt-1">{errors.fullName}</span>
          )}
        </div>

        <div className="relative">
          <label className="text-sm text-gray-700 mb-1 block">
            Username <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className={`w-full p-3 rounded-lg border ${
              errors.username ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:border-[#FCA311] focus:ring-0 hover:border-[#FCA311] transition-colors duration-200`}
            placeholder="Choose a username"
          />
          {errors.username && (
            <span className="text-red-500 text-xs mt-1">{errors.username}</span>
          )}
        </div>

        <div className="relative">
          <label className="text-sm text-gray-700 mb-1 block">
            Email Address <span className="text-red-500">*</span>
          </label>
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
          {errors.email && (
            <span className="text-red-500 text-xs mt-1">{errors.email}</span>
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
          {formData.password && (
            <div className="mt-2">
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-300"
                  style={{
                    width: `${(passwordStrength.score / 5) * 100}%`,
                    backgroundColor: passwordStrength.color
                  }}
                />
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs" style={{ color: passwordStrength.color }}>
                  {passwordStrength.message}
                </span>
                <span className="text-xs text-gray-500">
                  {passwordStrength.feedback}
                </span>
              </div>
            </div>
          )}
          {errors.password && (
            <span className="text-red-500 text-xs mt-1 block">{errors.password}</span>
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
              placeholder="Confirm password"
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
          className={`w-full py-3 rounded-lg transition-colors ${
            isFormValid && !loading
              ? "bg-[#FCA311] hover:bg-[#e5940c] text-black"
              : "bg-[#FCA31180] text-black cursor-not-allowed"
          }`}
          onClick={handleContinue}
          disabled={!isFormValid || loading}
        >
          {loading ? "Processing..." : "Continue"}
        </button>
      </div>

      {alertMessage && (
        <div className="px-6 mt-4">
          <Alert variant="destructive" className="relative">
            <AlertDescription>{alertMessage}</AlertDescription>
            <button 
              onClick={() => setAlertMessage("")}
              className="absolute right-4 top-4 hover:opacity-70 transition-opacity"
            >
              <IoCloseCircleOutline size={16} />
            </button>
          </Alert>
        </div>
      )}
    </>
  );
};

export default SignupForm;
