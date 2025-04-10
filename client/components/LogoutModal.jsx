import React from "react";

const LogoutModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-2xl border border-gray-200 w-96 max-w-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Log Out</h3>
        <p className="text-gray-600 mb-6">Are you sure you want to log out?</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 px-5 py-2 rounded-md hover:bg-gray-400 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-5 py-2 rounded-md hover:bg-red-700 transition-all"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
