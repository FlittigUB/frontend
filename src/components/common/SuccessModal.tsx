import React from 'react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 dark:bg-gray-800">
        <h2 className="mb-4 text-2xl font-semibold">{title}</h2>
        <p className="mb-6 text-gray-700 dark:text-gray-200">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="hover:bg-primary-dark rounded bg-primary px-4 py-2 text-white"
          >
            Lukk
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
