import { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { showToast } from '@/components/ui/toast';
import { deleteAccount } from '@/services/api';
import { AuthContext } from '@/context/AuthContext';

const DeleteAccountModal = ({ isOpen, onClose }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteAccount();
      showToast({
        message: 'Your account has been deleted successfully',
        type: 'success'
      });
      logout();
      navigate('/');
    } catch (error) {
      showToast({
        message: error.message || 'Failed to delete account',
        type: 'error'
      });
    } finally {
      setIsDeleting(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Account Deletion</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-600 mb-4">
            Before you delete your account, please take a moment to understand what will happen to your data:
          </p>
          <ul className="list-disc text-sm text-gray-600 pl-5 space-y-1">
            <li>Your profile details, preferences, and settings will be removed.</li>
            <li>All data will be permanently deleted 30 days after account deletion.</li>
          </ul>
          <p className="text-sm text-gray-600 mt-4 font-medium">
            Keep in mind that deleting your account can't be undone.
          </p>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
          >
            Never mind
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Deleting...
              </div>
            ) : (
              'Confirm'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

DeleteAccountModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default DeleteAccountModal;
