// app/portal/arbeidsgiver/page.tsx

'use client';

import React, { FormEvent, useEffect, useState } from 'react';
import JobList from '@/components/portal/job/JobList';
import { Category, Job, JobFormData } from '@/common/types';
import axios from 'axios';
import { useAuthContext } from '@/context/AuthContext';
import JobModal from '@/components/portal/job/JobModal';

const ArbeidsgiverHomePage: React.FC = () => {
  const [publishedJobs, setPublishedJobs] = useState<Job[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [currentJob, setCurrentJob] = useState<Job | null>(null);
  const [newJob, setNewJob] = useState<JobFormData>({
    title: '',
    description: '',
    place: '',
    date_accessible: '', // snake_case
    categories: [],
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const { token, userRole } = useAuthContext();

  useEffect(() => {
    const fetchPublishedJobs = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/job`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setPublishedJobs(response.data);
      } catch (err: any) {
        console.error('Error fetching jobs:', err);
        setError(err.response?.data?.message || 'Failed to fetch jobs.');
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/categories`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setCategories(response.data);
      } catch (err: any) {
        console.error('Error fetching categories:', err);
        // Optionally handle errors
      }
    };

    if (token) {
      fetchPublishedJobs();
      fetchCategories();
    }
  }, [token]);

  // Handlers for Create Job Modal
  const openCreateModal = () => {
    setIsCreateModalOpen(true);
    setNewJob({
      title: '',
      description: '',
      place: '',
      date_accessible: '',
      categories: [],
    });
    setError('');
    setSuccess('');
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  // Handlers for Edit Job Modal
  const openEditModal = (job: Job) => {
    setCurrentJob(job);
    setNewJob({
      title: job.title || '',
      description: job.description || '',
      place: job.place || '',
      date_accessible: job.date_accessible || '',
      categories: job.categories.map((cat) => cat.id), // Assuming job.categories is populated
    });
    setIsEditModalOpen(true);
    setError('');
    setSuccess('');
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentJob(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const target = e.target;
    const { name, value, type } = target;

    if (type === 'checkbox' && target instanceof HTMLInputElement) {
      const { checked } = target;
      setNewJob((prev) => {
        if (checked) {
          // Add category ID to the array
          return { ...prev, categories: [...prev.categories, value] };
        } else {
          // Remove category ID from the array
          return {
            ...prev,
            categories: prev.categories.filter((id) => id !== value),
          };
        }
      });
    } else if (
      type === 'select-multiple' &&
      target instanceof HTMLSelectElement
    ) {
      const values = Array.from(
        target.selectedOptions,
        (option: HTMLOptionElement) => option.value,
      );
      setNewJob((prev) => ({
        ...prev,
        [name]: values,
      }));
    } else {
      setNewJob((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle Create Job Submission
  const handleCreateSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate that at least one category is selected
    if (newJob.categories.length === 0) {
      setError('Vennligst velg minst én kategori.');
      setLoading(false);
      return;
    }

    try {
      if (!token) {
        throw new Error('Unauthorized');
      }

      const payload = {
        ...newJob,
        categories: newJob.categories, // Send as array of strings
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/job`,
        payload, // Send as JSON
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setSuccess('Job opprettet suksessfullt!');
      setPublishedJobs((prev) => [...prev, response.data.item]);
      closeCreateModal();
    } catch (err: any) {
      console.error('Error creating job:', err);
      setError(err.response?.data?.message || 'Kunne ikke opprette jobben.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Edit Job Submission
  const handleEditSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate that at least one category is selected
    if (newJob.categories.length === 0) {
      setError('Vennligst velg minst én kategori.');
      setLoading(false);
      return;
    }

    try {
      if (!token || !currentJob?.id) {
        throw new Error('Unauthorized or invalid job ID');
      }

      const payload = {
        ...newJob,
        categories: newJob.categories, // Send as array of strings
      };

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/job/${currentJob.id}`,
        payload, // Send as JSON
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setSuccess('Job oppdatert suksessfullt!');
      setPublishedJobs((prev) =>
        prev.map((job) =>
          job.id === currentJob.id ? response.data.updatedItem : job,
        ),
      );
      closeEditModal();
    } catch (err: any) {
      console.error('Error updating job:', err);
      setError(err.response?.data?.message || 'Kunne ikke oppdatere jobben.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Delete Job
  const handleDeleteJob = async (job: Job) => {
    const confirmDelete = confirm(
      `Er du sikker på at du vil slette jobben "${job.title}"?`,
    );
    if (!confirmDelete) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!token || !job.id) {
        throw new Error('Unauthorized or invalid job ID');
      }

      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/job/${job.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess('Job slettet suksessfullt!');
      setPublishedJobs((prev) => prev.filter((j) => j.id !== job.id));
    } catch (err: any) {
      console.error('Error deleting job:', err);
      setError(err.response?.data?.message || 'Kunne ikke slette jobben.');
    } finally {
      setLoading(false);
    }
  };

  // Ensure only employers can access this page
  if (userRole !== 'arbeidsgiver') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-xl text-red-500">
          Du har ikke tilgang til denne siden.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-4 text-3xl font-bold">Dine Publiserte Jobber</h1>
      <p className="mb-6">
        Her ser du en oversikt over alle jobbene du har publisert.
      </p>

      {/* Create Job Button */}
      <button
        onClick={openCreateModal}
        className="hover:bg-primary-dark mb-6 rounded bg-primary px-4 py-2 text-white"
      >
        Opprett Ny Jobb
      </button>

      {/* Søkelinje */}
      <input
        type="text"
        placeholder="Søk gjennom dine jobber..."
        className="dark:bg-background-dark dark:text-foreground-dark mb-6 w-full rounded-lg bg-background p-3 text-foreground shadow-neumorphic focus:outline-none focus:ring-2 focus:ring-primary dark:shadow-neumorphic-dark"
      />

      {/* Publiserte Jobbliste */}
      {loading ? (
        <p>Laster...</p>
      ) : (
        <JobList
          jobs={publishedJobs}
          isEmployerView
          onEdit={openEditModal}
          onDelete={handleDeleteJob}
        />
      )}

      {/* Create Job Modal */}
      <JobModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onSubmit={handleCreateSubmit}
        formData={newJob}
        categories={categories}
        handleInputChange={handleInputChange}
        error={error}
        success={success}
        loading={loading}
        isEdit={false}
      />

      {/* Edit Job Modal */}
      <JobModal
        isOpen={isEditModalOpen && !!currentJob}
        onClose={closeEditModal}
        onSubmit={handleEditSubmit}
        formData={newJob}
        categories={categories}
        handleInputChange={handleInputChange}
        error={error}
        success={success}
        loading={loading}
        isEdit={true}
      />
    </div>
  );
};

export default ArbeidsgiverHomePage;
