import React, { useState, useCallback, useMemo } from 'react';
import { EyeOff, Eye } from 'lucide-react';
import logo from '../../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import countryList from 'react-select-country-list';

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [country, setCountry] = useState(null);
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [checkboxes, setCheckboxes] = useState({
    tips: false,
    terms: false,
  });
  const navigate = useNavigate();
  const options = useMemo(() => countryList().getData(), []);

  const togglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const toggleConfirmPassword = useCallback(() => {
    setShowConfirmPassword((prev) => !prev);
  }, []);

  const handleLogin = useCallback(() => {
    navigate('/login');
  }, [navigate]);

  const handleCountryChange = useCallback((selectedOption) => {
    setCountry(selectedOption);
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));

    if (name === 'password') {
      updatePasswordStrength(value);
    }
  }, []);

  const handleCheckboxChange = useCallback((e) => {
    const { name, checked } = e.target;
    setCheckboxes((prevCheckboxes) => ({ ...prevCheckboxes, [name]: checked }));
  }, []);

  const calculatePasswordStrength = useCallback((password) => {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[@$!%*?&]/.test(password)) score += 1;
    return score;
  }, []);

  const updatePasswordStrength = useCallback((password) => {
    const strength = calculatePasswordStrength(password);
    setPasswordStrength(strength);
  }, [calculatePasswordStrength]);

  const validatePasswordStrength = useCallback((password) => {
    return passwordStrength === 5;
  }, [passwordStrength]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!validatePasswordStrength(formValues.password)) {
      newErrors.password = 'Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and special characters.';
    }
    if (formValues.password !== formValues.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formValues, validatePasswordStrength]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (validateForm()) {
      // Proceed with form submission
      console.log('Form submitted successfully');
    }
  }, [validateForm]);

  const customStyles = useMemo(() => ({
    control: (provided) => ({
      ...provided,
      backgroundColor: '#E5E5E5',
      borderColor: 'black',
      borderRadius: '12px',
      padding: '0.2rem',
      minHeight: 'auto',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#FCA311',
      },
    }),
    input: (provided) => ({
      ...provided,
      color: 'black',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: 'black',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'black',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#E5E5E5',
      borderRadius: '12px',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#FCA311' : '#E5E5E5',
      color: 'black',
      '&:hover': {
        backgroundColor: '#FCA311',
        color: 'white',
      },
    }),
  }), []);

  const getPasswordStrengthColor = useCallback((strength) => {
    switch (strength) {
      case 1:
        return 'bg-red-500';
      case 2:
        return 'bg-orange-500';
      case 3:
        return 'bg-yellow-500';
      case 4:
        return 'bg-blue-500';
      case 5:
        return 'bg-green-500';
      default:
        return 'bg-gray-300';
    }
  }, []);

  return (
    <div className="min-h-screen h-full w-full flex flex-col md:flex-row">
      {/* Left side with logo - hidden on mobile, visible on md and up */}
      <div className="hidden md:flex md:w-1/4 lg:w-[25%] bg-[#14213D] p-6 md:p-12">
        <div className="flex items-start gap-3">
          <img src={logo} alt="Global Relocate Logo" className="w-10 h-10" />
          <div className="text-white font-semibold text-xl leading-tight">
            <div>Global</div>
            <div>Relocate</div>
          </div>
        </div>
      </div>

      {/* Right side with signup form - full width on mobile */}
      <div className="flex-1 md:w-3/4 lg:w-[75%] bg-[#E5E5E5] flex items-center justify-center px-4 py-8 md:py-16">
        <div className="w-full max-w-[460px] px-4 md:px-8 relative">
          <h1 className="text-3xl md:text-4xl font-medium mb-3 text-center">
            Sign up for an account
          </h1>

          <form className="space-y-4 mt-8" onSubmit={handleSubmit}>
            {/* Name inputs */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-black mb-2">First name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formValues.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-[12px] bg-[#E5E5E5] border border-black text-black text-base focus:outline-none focus:border-[#FCA311]"
                />
              </div>
              <div className="flex-1">
                <label className="block text-black mb-2">Last name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formValues.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-[12px] bg-[#E5E5E5] border border-black text-black text-base focus:outline-none focus:border-[#FCA311]"
                />
              </div>
            </div>

            {/* Username input */}
            <div>
              <label className="block text-black mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formValues.username}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-[12px] bg-[#E5E5E5] border border-black text-black text-base focus:outline-none focus:border-[#FCA311]"
              />
            </div>

            {/* Email input */}
            <div>
              <label className="block text-black mb-2">Email address</label>
              <input
                type="email"
                name="email"
                value={formValues.email}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-[12px] bg-[#E5E5E5] border border-black text-black text-base focus:outline-none focus:border-[#FCA311]"
              />
            </div>

            {/* Password input */}
            <div>
              <label className="block text-black mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formValues.password}
                  onChange={handleChange}
                  placeholder="Password (8 or more characters)"
                  className="w-full px-4 py-2 rounded-[12px] bg-[#E5E5E5] border border-black text-black placeholder-black/50 text-base focus:outline-none focus:border-[#FCA311]"
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? (
                    <Eye className="w-5 h-5 text-black" />
                  ) : (
                    <EyeOff className="w-5 h-5 text-black" />
                  )}
                </button>
              </div>
              <div className="flex mt-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`h-2 flex-1 mx-1 rounded-full ${level <= passwordStrength ? getPasswordStrengthColor(level) : 'bg-gray-300'}`}
                  ></div>
                ))}
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password input */}
            <div>
              <label className="block text-black mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formValues.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className="w-full px-4 py-2 rounded-[12px] bg-[#E5E5E5] border border-black text-black placeholder-black/50 text-base focus:outline-none focus:border-[#FCA311]"
                />
                <button
                  type="button"
                  onClick={toggleConfirmPassword}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2"
                >
                  {showConfirmPassword ? (
                    <Eye className="w-5 h-5 text-black" />
                  ) : (
                    <EyeOff className="w-5 h-5 text-black" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Country select */}
            <div>
              <label className="block text-black mb-2">Country</label>
              <Select
                options={options}
                value={country}
                onChange={handleCountryChange}
                styles={customStyles}
              />
            </div>

            {/* Checkboxes */}
            <div className="space-y-4">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  name="tips"
                  checked={checkboxes.tips}
                  onChange={handleCheckboxChange}
                  className="mt-1"
                />
                <span className="text-sm">
                  Send me emails with tips to identify and integrate with the needs of my Global Relocation initiatives
                </span>
              </label>

              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  name="terms"
                  checked={checkboxes.terms}
                  onChange={handleCheckboxChange}
                  className="mt-1"
                />
                <span className="text-sm">
                  Yes, I understand and agree to the{' '}
                  <a href="#" className="text-[#FCA311]">Global Relocate Terms of Service</a>,
                  including the{' '}
                  <a href="#" className="text-[#FCA311]">User Agreement</a> and{' '}
                  <a href="#" className="text-[#FCA311]">Privacy Policy</a>
                </span>
              </label>
            </div>

            {/* Next button */}
            <button
              type="submit"
              disabled={!checkboxes.tips || !checkboxes.terms}
              onClick={handleLogin}
              className={`absolute right-8 text-black text-sm font-medium hover:text-[#FCA311] transition-colors ${
                !checkboxes.tips || !checkboxes.terms ? 'cursor-not-allowed' : ''
              }`}
              style={{ bottom: '3rem' }}
            >
              Next
            </button>
          </form>

          {/* Login link */}
          <div className="text-center mt-16">
            <span className="text-base">Already have an account? </span>
            <button
              onClick={handleLogin}
              className="text-[#FCA311] hover:underline"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
