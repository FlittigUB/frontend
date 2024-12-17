// src/components/portal/job/JobModal.tsx

import React from 'react';
import { Category, JobFormData } from '@/common/types';

interface JobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>; // Updated to return Promise<void>
  formData: JobFormData;
  categories: Category[];
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  error: string;
  // success: string; // Removed since we're using Sonner for notifications
  isEdit?: boolean;
  isSubmitting: boolean; // Added property
}

const JobModal: React.FC<JobModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  categories,
  handleInputChange,
  error,
  // success, // Removed
  isEdit = false,
  isSubmitting, // Received as a prop
}) => {
  if (!isOpen) return null;

  return (
    <div classame="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-800">
        <h2 className="mb-4 text-2xl font-semibold">
          {isEdit ? 'Rediger Jobb' : 'Opprett Ny Jobb'}
        </h2>
        {error && <p className="mb-4 text-red-500">{error}</p>}
        {/* Success messages are handled by Sonner, so no need to display them here */}
        <form onSubmit={onSubmit}>
          {/* Title */}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-200">
              Tittel
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="dark:bg-background-dark dark:text-foreground-dark mt-1 w-full rounded border p-2"
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-200">
              Beskrivelse
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              className="dark:bg-background-dark dark:text-foreground-dark mt-1 w-full rounded border p-2"
            ></textarea>
          </div>

          {/* Place */}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-200">
              Sted
            </label>
            <input
              type="text"
              name="place"
              value={formData.place}
              onChange={handleInputChange}
              required
              className="dark:bg-background-dark dark:text-foreground-dark mt-1 w-full rounded border p-2"
            />
          </div>

          {/* Date Accessible */}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-200">
              Tilgjengelig Fra
            </label>
            <input
              type="date"
              name="date_accessible"
              value={formData.date_accessible}
              onChange={handleInputChange}
              required
              className="dark:bg-background-dark dark:text-foreground-dark mt-1 w-full rounded border p-2"
            />
          </div>

          {/* Categories */}
          <div className="mb-4">
            <label className="mb-2 block text-gray-700 dark:text-gray-200">
              Kategorier <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap">
              {categories.map((category) => (
                <label
                  key={category.id}
                  className="mb-2 mr-4 flex items-center text-gray-700 dark:text-gray-200"
                >
                  <input
                    type="checkbox"
                    name="categories"
                    value={category.id}
                    checked={formData.categories.includes(category.id)}
                    onChange={handleInputChange}
                    className="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700"
                  />
                  {category.name}
                </label>
              ))}
            </div>
          </div>

          {/* Email Notifications Toggle */}
          <div className="mb-4 flex items-center">
            <label className="mr-4 text-gray-700 dark:text-gray-200">
              Få e-postvarsel ved nye søknader?
            </label>
            <input
              type="checkbox"
              name="email_notifications"
              checked={formData.email_notifications}
              onChange={handleInputChange}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
              disabled={isSubmitting} // Optionally disable when submitting
            >
              Avbryt
            </button>
            <button
              type="submit"
              className="hover:bg-primary-dark rounded bg-primary px-4 py-2 text-white"
              disabled={isSubmitting} // Disable button based on isSubmitting prop
            >
              {isSubmitting ? 'Lagrer...' : isEdit ? 'Oppdater' : 'Opprett'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobModal;
