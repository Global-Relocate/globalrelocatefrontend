import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import DeleteAccountDialog from '@/components/dialogs/DeleteAccountDialog';

const AccountTab = ({ user }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <div className="px-8 py-6 h-full">
      <h2 className="text-xl font-medium mb-8 text-left">Account</h2>
      
      <div className="space-y-8 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 5rem)' }}>
        <div>
          <h3 className="text-sm text-gray-600 mb-2">Email Address</h3>
          <div className="flex items-center">
            <span className="text-sm">{user?.email}</span>
            <span className="ml-2 text-green-600 text-sm">(verified)</span>
          </div>
        </div>

        <div>
          <h3 className="text-sm text-gray-600 mb-2">Subscription</h3>
          <div className="flex justify-between items-start">
            <p className="text-sm text-gray-600 max-w-md p-2">
              You are currently in free plan valid for 3 days. Upgrade now to keep using Global Relocate.
            </p>
            <Button variant="default" className="bg-black">
              Learn more
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h3 className="text-sm text-red-600">Delete account</h3>
            <p className="text-sm text-gray-600 p-2">
              Permanently delete your account and data
            </p>
          </div>
          <Button 
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            Delete account
          </Button>
        </div>
      </div>

      <DeleteAccountDialog 
        isOpen={isDeleteDialogOpen} 
        onClose={() => setIsDeleteDialogOpen(false)}
      />
    </div>
  );
};

export default AccountTab;
