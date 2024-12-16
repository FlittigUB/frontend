import React, { FormEvent } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';

interface ApplicationFormProps {
  onSubmit: (e: FormEvent) => void;
  submitting: boolean;
  successMessage: string;
  errorMessage: string;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({
  onSubmit,
  submitting,
  successMessage,
  errorMessage,
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-md rounded-3xl bg-white p-6 shadow-md"
    >
      <button
        type="submit"
        disabled={submitting}
        className={`flex w-full items-center justify-center rounded-lg bg-yellow-500 px-4 py-2 font-semibold text-white shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
          submitting ? 'cursor-not-allowed opacity-50' : ''
        }`}
      >
        {submitting ? 'Sender inn...' : 'Søk på denne jobben'}
      </button>
      {successMessage && (
        <div className="mt-4 flex items-center text-green-600">
          <FaCheck className="mr-2" />
          <span>{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="mt-4 flex items-center text-red-600">
          <FaTimes className="mr-2" />
          <span>{errorMessage}</span>
        </div>
      )}
    </form>
  );
};

export default ApplicationForm;
