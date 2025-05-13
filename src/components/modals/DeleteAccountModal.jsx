import { useState, useContext } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { showToast } from "@/components/ui/toast";
import { deleteAccount } from "@/services/api";
import { AuthContext } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";

const DeleteAccountModal = ({ isOpen, onClose }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { logout } = useContext(AuthContext);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteAccount();
      showToast({
        message: "Your account has been deleted successfully",
        type: "success",
      });
      logout();
      navigate("/");
    } catch (error) {
      showToast({
        message: error.message || "Failed to delete account",
        type: "error",
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
          <DialogTitle>
            {t("userDashboard.settings.confirmAccountDelete")}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-600 mb-4">
            {t("userDashboard.settings.confirmAccountDeleteDesc")}
          </p>
          <ul className="list-disc text-sm text-gray-600 pl-5 space-y-1">
            <li>{t("userDashboard.settings.confirmDeleteList1")}</li>
            <li>{t("userDashboard.settings.confirmDeleteList2")}</li>
          </ul>
          <p className="text-sm text-gray-600 mt-4 font-medium">
            {t("userDashboard.settings.confirmDeleteWarning")}
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            {t("userDashboard.settings.neverMind")}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                {t("userDashboard.settings.deleting")}
              </div>
            ) : (
              t("userDashboard.settings.confirm")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

DeleteAccountModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DeleteAccountModal;
