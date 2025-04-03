import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PropTypes from 'prop-types';
import { useTrial } from '@/context/TrialContext';

const TrialExpiredModal = ({ isOpen }) => {
  const navigate = useNavigate();
  const { setShowTrialModal } = useTrial();

  if (!isOpen) return null;

  const handleUpgrade = () => {
    setShowTrialModal(false); // Close the modal
    navigate('/upgrade');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-md" />
      <div className="relative bg-white rounded-2xl w-full max-w-[480px] mx-4 py-10 px-8">
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-medium">
            Your 3 days free trial has ended
          </h2>
          <p className="text-[#475467] text-sm font-normal">
            Upgrade now to keep using Global Relocate.
          </p>
          <div className="pt-4">
            <Button
              onClick={handleUpgrade}
              className="bg-black hover:bg-black/90 text-white px-8 py-2.5 h-auto text-base rounded-xl"
            >
              See plan options
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

TrialExpiredModal.propTypes = {
  isOpen: PropTypes.bool.isRequired
};

export default TrialExpiredModal; 