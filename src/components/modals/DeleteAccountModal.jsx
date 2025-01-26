import React from 'react';

function DeleteAccountModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 animate-fadeIn">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 animate-fadeIn" 
        onClick={onClose} 
      />
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 relative animate-modalIn">
        <h3 className="text-xl font-semibold mb-4">Confirm Account Deletion</h3>
        <p className="text-gray-700 mb-4">
          Before you delete your account, please take a moment to understand what will happen to your data:
        </p>
        <ul className="list-disc pl-5 mb-4 space-y-2">
          <li>Your profile details, preferences, and settings will be removed.</li>
          <li>All data will be permanently deleted 30 days after account deletion.</li>
        </ul>
        <p className="font-medium mb-6">Keep in mind that deleting your account can't be undone.</p>
        <div className="flex justify-center gap-3">
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
            Confirm
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm hover:bg-gray-50 rounded-lg"
          >
            Nevermind
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteAccountModal;
