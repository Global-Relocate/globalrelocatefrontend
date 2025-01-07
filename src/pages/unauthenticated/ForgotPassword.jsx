import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoCloseCircleOutline } from "react-icons/io5";
import logo from "../../assets/svg/logo.svg";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    setEmail(value);

    if (value && !validateEmail(value)) {
      setEmailError("Email Address not valid");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      setEmailSent(true);
    }
  };

  const handleClose = () => {
    navigate(-1);
  };

  const handleResendEmail = () => {
    // Logic to resend email
    console.log("Resend email");
  };

  const handleDone = () => {
    navigate("/login");
  };

  const isFormValid = email && !emailError;

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
          to="/login"
          className="text-sm font-medium hover:text-gray-600"
        >
          Log in
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 pt-8 md:pt-16">
        {!emailSent ? (
          <>
            <h1 className="text-3xl font-medium mb-4 text-center">
              Forgot Password?
            </h1>
            <div className="flex justify-center">
              <p className="text-base text-gray-700 mb-12 text-center w-full md:w-1/3">
                Enter your account’s email and we’ll send you an email to reset the password.
              </p>
            </div>

            <div className="flex justify-center">
              {/* Form Section */}
              <div className="w-full md:w-1/3">
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
                      value={email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        emailError ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:border-[#FCA311] hover:border-[#FCA311]`}
                      placeholder="myaccount@gmail.com"
                    />
                  </div>

                  <button
                    type="submit"
                    className={`w-full py-3 rounded-lg text-center transition-colors ${
                      isFormValid
                        ? "bg-[#FCA311] hover:bg-[#e5940c] text-black"
                        : "bg-[#FCA31180] text-black cursor-not-allowed"
                    }`}
                    disabled={!isFormValid}
                  >
                    Send email
                  </button>
                </form>
              </div>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-medium mb-4 text-center">
              Reset Password
            </h1>
            <div className="flex justify-center">
              <p className="text-base text-gray-700 mb-4 text-center w-full md:w-1/3">
                If an account matching <span className="font-bold">{email}</span> exists, you will receive an email.
              </p>
            </div>
            <div className="flex justify-center">
              <p className="text-base text-gray-700 mb-12 text-center w-full md:w-1/3">
                Click the link in the email to reset your password.
              </p>
            </div>

            <div className="flex justify-center">
              <div className="w-full md:w-1/3 space-y-4">
                <button
                  onClick={handleDone}
                  className="w-full py-3 rounded-lg bg-[#FCA311] hover:bg-[#e5940c] text-black text-center transition-colors"
                >
                  Done
                </button>
                <button
                  onClick={handleResendEmail}
                  className="w-full py-3 rounded-lg text-blue-600 text-center hover:underline"
                >
                  Resend Email
                </button>
              </div>
            </div>
          </>
        )}

        <div className="mt-6 text-center">
          <span className="text-sm text-gray-600">
            Remembered your password?{" "}
          </span>
          <Link to="/login" className="text-sm text-blue-600 hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
