import { useState, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { IoClose } from "react-icons/io5";
import { IoSendSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import DashboardLayout from "@/components/layouts/DashboardLayout";

const Feedback = () => {
  const { user } = useContext(AuthContext);
  const [feedback, setFeedback] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle feedback submission here
    console.log('Feedback submitted:', feedback);
    setFeedback('');
    navigate(-1); // Go back after submission
  };

  return (
    <DashboardLayout>
      <div className="fixed inset-0 z-[100] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => navigate(-1)} />
        <div className="relative bg-white rounded-[32px] w-full max-w-[800px] mx-4">
          <div className="absolute right-6 top-6">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <IoClose size={24} />
            </button>
          </div>

          <div className="p-12">
            <h1 className="text-2xl font-medium text-black mb-8">
              Hey, {user?.name || 'there'}. What has worked well? Tell us what you like about Global Relocate
            </h1>
            
            <form onSubmit={handleSubmit} className="relative">
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Type here"
                className="w-full min-h-[200px] bg-transparent text-black placeholder-gray-400 text-lg focus:outline-none resize-none"
                autoFocus
              />
              
              <button
                type="submit"
                disabled={!feedback.trim()}
                className={`absolute bottom-4 right-4 p-3 rounded-lg transition-colors ${
                  feedback.trim() ? 'bg-black text-white hover:bg-black/90' : 'bg-[#F2F4F7] text-[#98A2B3]'
                }`}
              >
                <IoSendSharp size={18} className="-rotate-45" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Feedback; 
