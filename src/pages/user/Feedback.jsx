import { useState, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { submitFeedback } from '@/services/api';
import { showToast } from '@/components/ui/toast';
import logo from "../../assets/svg/logo.svg";

const Feedback = () => {
  const { user } = useContext(AuthContext);
  const [step, setStep] = useState(1);
  const [feedback1, setFeedback1] = useState('');
  const [feedback2, setFeedback2] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (feedback1.trim()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Submit positive feedback
      if (feedback1.trim()) {
        await submitFeedback(feedback1.trim(), 'GOOD');
      }

      // Submit negative feedback if provided
      if (feedback2.trim()) {
        await submitFeedback(feedback2.trim(), 'BAD');
      }

      showToast({
        message: 'Feedback submitted successfully!',
        type: 'success'
      });

      // Short delay before navigation to ensure toast is visible
      setTimeout(() => {
        navigate(-1);
      }, 1000);

    } catch (error) {
      console.error('Error submitting feedback:', error);
      showToast({
        message: error.message || 'Failed to submit feedback. Please try again.',
        type: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="w-full px-12 pt-12">
        {/* Logo */}
        <img src={logo} alt="Global Relocate" className="h-8" />
      </div>

      {/* Content */}
      <div className="max-w-[800px] mx-auto px-4 mt-16">
        <div className="relative">
          {/* Navigation Buttons */}
          <div className="absolute right-0 -top-[72px] flex items-center gap-2">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className={`p-2 rounded-full ${step === 1 ? 'bg-[#F2F4F7] text-[#98A2B3]' : 'bg-[#F2F4F7] text-gray-600 hover:bg-gray-200'}`}
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={handleContinue}
              disabled={step === 2 || !feedback1.trim()}
              className={`p-2 rounded-full ${step === 2 || !feedback1.trim() ? 'bg-[#F2F4F7] text-[#98A2B3]' : 'bg-[#F2F4F7] text-gray-600 hover:bg-gray-200'}`}
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {step === 1 ? (
            <>
              <h1 className="text-2xl font-medium text-black mb-2">
                Hey, {user?.name || 'there'}. What has worked well?
              </h1>
              <p className="text-gray-600 mb-8">
                Tell us what you like about Global Relocate
              </p>
              
              <form onSubmit={(e) => { e.preventDefault(); handleContinue(); }} className="relative">
                <textarea
                  value={feedback1}
                  onChange={(e) => setFeedback1(e.target.value)}
                  placeholder="Type your answer here"
                  className="w-full min-h-[200px] p-4 bg-white text-black placeholder-gray-400 text-lg focus:outline-none resize-none border border-[#D4D4D4] rounded-2xl"
                  autoFocus
                />
                
                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    disabled={!feedback1.trim()}
                    className={`px-6 py-2 rounded-lg transition-colors ${
                      feedback1.trim() ? 'bg-black text-white hover:bg-black/90' : 'bg-[#D4D4D4] text-white'
                    }`}
                  >
                    Continue
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-medium text-black mb-2">
                Hey, {user?.name || 'there'}. what didn&apos;t work well for you?
            </h1>
              <p className="text-gray-600 mb-8">
                Tell us what didn&apos;t work or what&apos;s missing in your experience using the app.
              </p>
            
            <form onSubmit={handleSubmit} className="relative">
              <textarea
                  value={feedback2}
                  onChange={(e) => setFeedback2(e.target.value)}
                  placeholder="Type your answer here"
                  className="w-full min-h-[200px] p-4 bg-white text-black placeholder-gray-400 text-lg focus:outline-none resize-none border border-[#D4D4D4] rounded-2xl"
                autoFocus
              />
              
                <div className="flex justify-end items-center gap-3 mt-6">
              <button
                type="submit"
                    disabled={!feedback2.trim() || submitting}
                    className={`px-6 py-2 rounded-lg transition-colors ${
                      feedback2.trim() && !submitting ? 'bg-black text-white hover:bg-black/90' : 'bg-[#D4D4D4] text-white'
                    }`}
                  >
                    {submitting ? 'Submitting...' : 'Submit'}
              </button>
                </div>
            </form>
            </>
          )}

          {/* Step indicator */}
          <div className="mt-12 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${step === 1 ? 'bg-black' : 'bg-gray-300'}`} />
            <div className={`w-2 h-2 rounded-full ${step === 2 ? 'bg-black' : 'bg-gray-300'}`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback; 
