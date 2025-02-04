import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PropTypes from 'prop-types';

const TrialExpiredModal = ({ isOpen }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-md" />
      <div className="relative bg-white rounded-2xl w-full max-w-md mx-4 p-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-3">
            Your 3 days free trial has ended
          </h2>
          <p className="text-gray-600 mb-6">
            Upgrade now to keep using Global Relocate.
          </p>
          <Button
            onClick={() => navigate('/upgrade')}
            className="w-full bg-black hover:bg-black/90 text-white"
          >
            See plan options
          </Button>
        </div>
      </div>
    </div>
  );
};

TrialExpiredModal.propTypes = {
  isOpen: PropTypes.bool.isRequired
};

export default TrialExpiredModal; 