import React, { useState } from 'react';
import { EyeOff, Eye, ChevronDown } from 'lucide-react';
import logo from '../../assets/logo.png';
import { useNavigate } from 'react-router-dom';

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen h-full w-full flex">
      {/* Left side with logo */}
      <div className="w-[35%] bg-[#14213D] p-12">
        <div className="flex items-start gap-3">
          <img src={logo} alt="Global Relocate Logo" className="w-10 h-10" />
          <div className="text-white font-semibold text-xl leading-tight">
            <div>Global</div>
            <div>Relocate</div>
          </div>
        </div>
      </div>

      {/* Right side with signup form */}
      <div className="w-[65%] bg-[#E5E5E5] flex items-center justify-center py-16">
        <div className="w-full max-w-[460px] px-8 relative">
          <h1 className="text-4xl font-medium mb-3 text-center">
            Sign up for an account
          </h1>

          <form className="space-y-4 mt-8">
            {/* Name inputs */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-black mb-2">First name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-[12px] bg-[#E5E5E5] border border-black text-black text-base focus:outline-none focus:border-[#FCA311]"
                />
              </div>
              <div className="flex-1">
                <label className="block text-black mb-2">Last name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-[12px] bg-[#E5E5E5] border border-black text-black text-base focus:outline-none focus:border-[#FCA311]"
                />
              </div>
            </div>
            {/* Username input */}
            <div>
              <label className="block text-black mb-2">Username</label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-[12px] bg-[#E5E5E5] border border-black text-black text-base focus:outline-none focus:border-[#FCA311]"
              />
            </div>

            {/* Email input */}
            <div>
              <label className="block text-black mb-2">Email address</label>
              <input
                type="email"
                className="w-full px-4 py-2 rounded-[12px] bg-[#E5E5E5] border border-black text-black text-base focus:outline-none focus:border-[#FCA311]"
              />
            </div>

            {/* Password input */}
            <div>
              <label className="block text-black mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
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
            </div>
            {/* Country select */}
            <div>
              <label className="block text-black mb-2">Country</label>
              <div className="relative">
                <select
                  className="w-full px-4 py-2 rounded-[12px] bg-[#E5E5E5] border border-black text-black text-base focus:outline-none focus:border-[#FCA311] appearance-none"
                  defaultValue="France"
                >
                  <option value="France">France</option>
                  {/* Add more countries as needed */}
                </select>
                <ChevronDown className="w-5 h-5 text-black absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-4">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-1"
                />
                <span className="text-sm">
                  Send me emails with tips to identify and integrate with the needs of my Global Relocation initiatives
                </span>
              </label>

              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
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
          </form>

          {/* Next button */}
          <button
            onClick={handleLogin}
            className="absolute right-8 text-black text-sm font-medium hover:text-[#FCA311] transition-colors"
            style={{ bottom: '4rem' }}
          >
            Next
          </button>

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