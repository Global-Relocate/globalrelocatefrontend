import React, { useState } from 'react';
import { EyeOff, Eye } from 'lucide-react';
import logo from '../../assets/logo.png';
import googleLogo from '../../assets/google.svg';
import appleLogo from '../../assets/apple.svg';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSignUp = () => {
    navigate('/signup');
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

      {/* Right side with login form */}
      <div className="w-[65%] bg-[#E5E5E5] flex items-center justify-center py-16">
        <div className="w-full max-w-[460px] px-8">
          <h1 className="text-4xl font-semibold mb-3 text-center">
            Access your dashboard
          </h1>
          <p className="text-xs font-light text-black mb-12 text-center">
            Please sign in to access your personalized dashboard
            <br />
            manage your relocation plans and connect with our resources
          </p>

          <form className="space-y-6">
            {/* Username input */}
            <div>
              <input
                type="text"
                placeholder="Username"
                className="w-full px-6 py-4 rounded-full bg-[#E5E5E5] border border-black text-black placeholder-black text-base focus:outline-none focus:border-[#FCA311]"
              />
            </div>

            {/* Password input */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full px-6 py-4 rounded-full bg-[#E5E5E5] border border-black text-black placeholder-black text-base focus:outline-none focus:border-[#FCA311]"
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-6 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? (
                  <Eye className="w-5 h-5 text-black" />
                ) : (
                  <EyeOff className="w-5 h-5 text-black" />
                )}
              </button>
            </div>

            {/* Forget Password link */}
            <div className="text-right">
              <a href="#" className="text-base font-semibold text-black hover:text-[#FCA311]">
                Forget Password?
              </a>
            </div>

            {/* Login button */}
            <button
              type="submit"
              className="w-full bg-[#FCA311] text-white py-4 rounded-full text-lg font-bold hover:bg-opacity-90 transition-colors mt-8"
            >
              Login
            </button>

            {/* Or continue with section */}
            <div className="flex items-center justify-center gap-4 my-12">
              <div className="h-px bg-black flex-1"></div>
              <span className="text-sm font-light text-black">or continue with</span>
              <div className="h-px bg-black flex-1"></div>
            </div>

            {/* Social login buttons */}
            <div className="flex justify-center gap-16">
              <button type="button">
                <img src={googleLogo} alt="Google login" className="w-8 h-8" />
              </button>
              <button type="button">
                <img src={appleLogo} alt="Apple login" className="w-8 h-8" />
              </button>
            </div>

            {/* Sign up link */}
            <div className="text-center mt-24">
              <span className="text-base font-light text-black">
                Don't have an account yet?{' '}
              </span>
              <button onClick={handleSignUp} className="text-base font-medium text-[#FCA311] hover:underline">
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
