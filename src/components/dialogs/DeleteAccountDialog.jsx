import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const DeleteAccountDialog = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Confirm Account Deletion
          </DialogTitle>
          <DialogDescription className="text-gray-700">
            Before you delete your account, please take a moment to understand what will happen to your data:
            <ul className="list-disc pl-5 mt-4 space-y-2">
              <li>Your profile details, preferences, and settings will be removed.</li>
              <li>All data will be permanently deleted 30 days after account deletion.</li>
            </ul>
            <p className="font-medium mt-4">
              Keep in mind that deleting your account can't be undone.
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-center gap-3 sm:justify-center">
          <Button 
            variant="destructive"
            className="px-4 py-2 text-sm"
            onClick={() => {
              // Handle delete account logic here
              onClose();
            }}
          >
            Confirm
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="px-4 py-2 text-sm border-black hover:bg-gray-100"
          >
            Nevermind
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAccountDialog; 