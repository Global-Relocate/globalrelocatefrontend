import { useState, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { Button } from "@/components/ui/button";
import logo from "../../assets/svg/logo.svg";

const Feedback = () => {
  const { user } = useContext(AuthContext);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle feedback submission here
    console.log('Feedback submitted:', feedback);
    setFeedback('');
  };

  return (
    <div className="min-h-screen p-8">
      <img src={logo} alt="Global Relocate Logo" className="w-32 mb-16" />
      
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-medium mb-3">
          Hey, {user?.name || 'there'}. What has worked well? Tell us what you like about Global Relocate
        </h1>
        
        <form onSubmit={handleSubmit} className="mt-8">
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Type here"
            className="w-full h-48 p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 resize-none text-base"
          />
          
          <div className="mt-4 flex justify-end">
            <Button
              type="submit"
              disabled={!feedback.trim()}
              className={`px-8 py-2.5 rounded-xl text-white ${
                feedback.trim() ? 'bg-black hover:bg-black/90' : 'bg-gray-200 cursor-not-allowed'
              }`}
            >
              Send
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Feedback; 