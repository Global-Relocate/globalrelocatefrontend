import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { IoCloseCircleOutline } from "react-icons/io5";
import logo from "../../assets/svg/logo.svg";
import mail from "../../assets/svg/mail.svg";

export default function VerifyEmail() {
  const [loginCode, setLoginCode] = useState("");
  const location = useLocation();
  const email = location.state?.email || "myaccount@gmail.com";
  console.log("Email received in VerifyEmail:", email);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setLoginCode(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      console.log("Verifying code:", loginCode);
    }
  };

  const handleClose = () => {
    navigate("/");
  };

  const isFormValid = loginCode.length > 0;

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

      {/* Main Content */}
      <div className="w-full md:w-1/3 mt-16">
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-medium mb-6 text-center">
            An email is on the way
          </h1>

          {/* Email Icon */}
          <div className="w-24 h-12 flex items-center justify-center mb-8">
            <img src={mail} alt="Email" className="w-16 h-16" />
          </div>

          <div className="mb-1 text-base text-gray-700 text-center">
            <p>We just sent you a temporary login code to <span className="font-bold">{email}</span>.</p>
            <p>Please check your inbox.</p>
          </div>

          {/* Form Section */}
          <div className="w-full mt-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm mb-2">
                  Login Code
                </label>
                <input
                  type="text"
                  value={loginCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#FCA311] hover:border-[#FCA311]"
                  placeholder="Enter login code"
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
                Continue with login code
              </button>
            </form>

            <div className="mt-4 text-sm text-gray-600 text-center">
              By clicking creating an account, you agree to our{" "}
              <Link to="/terms" className="underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="underline">
                Privacy Policy.
              </Link>
            </div>
            <div className="mb-20"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
