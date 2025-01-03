import React, { useState } from 'react';
import googleLogo from '../../assets/google.svg';
import appleLogo from '../../assets/apple.svg';
import individualIcon from '../../assets/individual.svg';
import cooperateIcon from '../../assets/cooperate.svg';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isHovered, setIsHovered] = useState(null);
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignUp = () => {
    navigate('/signupform');
  };

  return (
    <div className="min-h-screen bg-[#E5E5E5] p-4 md:p-12 flex flex-col justify-between">
      {/* Header */}
      <div className="mb-8 md:mb-16">
        <div className="text-black font-semibold text-xl leading-tight">
          <div>Global</div>
          <div>Relocate</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[800px] mx-auto">
        <h1 className="text-2xl md:text-3xl font-normal mb-8 md:mb-12 text-center">
          Sign up as an Individual or Cooperate
        </h1>

        <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-12 mb-8 md:mb-12">
          {/* Individual Option */}
          <button
            className={`w-full md:w-[240px] h-[140px] md:h-[160px] rounded-[19px] flex flex-col items-center justify-center border border-black transition-colors
              ${selectedOption === 'individual' || isHovered === 'individual' ? 'bg-[#a1a6af]' : 'bg-[#E5E5E5]'}`}
            onClick={() => setSelectedOption('individual')}
            onMouseEnter={() => setIsHovered('individual')}
            onMouseLeave={() => setIsHovered(null)}
          >
            <img src={individualIcon} alt="Individual" className="w-8 h-8 mb-4" />
            <span className="text-xl text-black">Individual</span>
          </button>

          {/* Cooperate Option */}
          <button
            className={`w-full md:w-[240px] h-[140px] md:h-[160px] rounded-[19px] flex flex-col items-center justify-center border border-black transition-colors
              ${selectedOption === 'cooperate' || isHovered === 'cooperate' ? 'bg-[#a1a6af]' : 'bg-[#E5E5E5]'}`}
            onClick={() => setSelectedOption('cooperate')}
            onMouseEnter={() => setIsHovered('cooperate')}
            onMouseLeave={() => setIsHovered(null)}
          >
            <img src={cooperateIcon} alt="Cooperate" className="w-12 h-12 mb-4" />
            <span className="text-xl text-black">Cooperate</span>
          </button>
        </div>

        {selectedOption ? (
          <>
            <button 
              onClick={handleSignUp}
              className="w-full md:w-[160px] mx-auto block bg-[#FCA311] text-white py-1.5 rounded-[9px] text-sm font-medium border border-[#FCA311] hover:bg-opacity-90 transition-colors mb-8 md:mb-12"
            >
              Sign up
            </button>

            {/* Or continue with section */}
            <div className="flex items-center justify-center gap-4 mb-8 md:mb-12">
              <div className="h-px bg-black w-24 md:w-40"></div>
              <span className="text-sm font-light text-black">or continue with</span>
              <div className="h-px bg-black w-24 md:w-40"></div>
            </div>

            {/* Social login buttons */}
            <div className="flex justify-center gap-8 md:gap-16 mb-8 md:mb-12 relative">
              <button type="button">
                <img src={googleLogo} alt="Google login" className="w-8 h-8" />
              </button>
              <button type="button">
                <img src={appleLogo} alt="Apple login" className="w-8 h-8" />
              </button>
              <button onClick={handleLogin} className="absolute left-[-60px] md:left-[-80px] text-black text-sm font-medium hover:text-[#FCA311] ml-4 md:ml-0">
                Prev
              </button>
            </div>
          </>
        ) : (
          <div 
            className="w-full md:w-[160px] mx-auto flex items-center justify-center bg-white text-[#E5E5E5] py-1.5 rounded-[9px] text-sm font-medium mb-8 md:mb-12"
          >
            Create account
          </div>
        )}
        <div className="text-center mt-8 md:mt-12">
          <span className="text-base font-light text-black">Already have an account? </span>
          <button onClick={handleLogin} className="text-base font-medium text-[#FCA311] hover:underline">
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
