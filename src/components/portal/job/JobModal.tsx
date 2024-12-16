// components/portal/job/JobModal.tsx

import React from 'react';
import { JobFormData, Category } from '@/common/types';

interface JobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: JobFormData;
  categories: Category[];
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  error: string;
  success: string;
  loading: boolean;
  isEdit?: boolean;
}

const JobModal: React.FC<JobModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  categories,
  handleInputChange,
  error,
  success,
  loading,
  isEdit = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-800">
        <h2 className="mb-4 text-2xl font-semibold">
          {isEdit ? 'Rediger Jobb' : 'Opprett Ny Jobb'}
        </h2>
        {error && <p className="mb-4 text-red-500">{error}</p>}
        {success && <p className="mb-4 text-green-500">{success}</p>}
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
          {/* Category Selection */}
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
          {/* Action Buttons */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
            >
              Avbryt
            </button>
            <button
              type="submit"
              className="hover:bg-primary-dark rounded bg-primary px-4 py-2 text-white"
              disabled={loading}
            >
              {loading ? 'Lagrer...' : isEdit ? 'Oppdater' : 'Opprett'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobModal;
