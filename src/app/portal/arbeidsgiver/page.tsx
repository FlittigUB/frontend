// src/pages/arbeidsgiver/home.tsx

'use client';

import React, { FormEvent, useEffect, useState } from 'react';
import JobList from '@/components/portal/job/JobList';
import { Category, Job, JobFormData } from '@/common/types';
import axios from 'axios';
import { useAuthContext } from '@/context/AuthContext';
import JobModal from '@/components/portal/job/JobModal';
import LoadingLogo from '@/components/NSRVLoader';
import { toast } from 'sonner'; // Sonner for notifications

const ArbeidsgiverHomePage: React.FC = () => {
  // State variables
  const [publishedJobs, setPublishedJobs] = useState<Job[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [currentJob, setCurrentJob] = useState<Job | null>(null);
  const [newJob, setNewJob] = useState<JobFormData>({
    title: '',
    description: '',
    place: '',
    date_accessible: '',
    categories: [],
    email_notifications: false, // Default value for new jobs
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string>('');

  const { token, userRole, isAuthLoading } = useAuthContext();
  const [isFetching, setIsFetching] = useState<boolean>(false); // Local loading state for data fetching
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // Local loading state for form submissions

  // Fetch published jobs and categories on component mount or when token changes
  useEffect(() => {
    const fetchPublishedJobs = async () => {
      try {
        setIsFetching(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/job`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const jobsData = Array.isArray(response.data) ? response.data : [];
        setPublishedJobs(jobsData);
      } catch (err: any) {
        console.error('Error fetching jobs:', err);
        setError(err.response?.data?.message || 'Failed to fetch jobs.');
        toast.error(err.response?.data?.message || 'Failed to fetch jobs.');
      } finally {
        setIsFetching(false);
      }
    };

    const fetchCategories = async () => {
      try {
        setIsFetching(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/categories`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const catData = Array.isArray(response.data) ? response.data : [];
        setCategories(catData);
      } catch (err: any) {
        console.error('Error fetching categories:', err);
        setError(err.response?.data?.message || 'Failed to fetch categories.');
        toast.error(
          err.response?.data?.message || 'Failed to fetch categories.',
        );
      } finally {
        setIsFetching(false);
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
      email_notifications: false,
    });
    setError('');
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
      categories: (job.categories || []).map((cat) => cat.id),
      email_notifications: job.email_notifications, // Use the current job's setting
    });
    setIsEditModalOpen(true);
    setError('');
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentJob(null);
  };

  // Handle input changes in the form
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const target = e.target;
    const { name, value, type } = target;

    if (name === 'email_notifications' && target instanceof HTMLInputElement) {
      // Checkbox for email notifications
      const checked = target.checked;
      setNewJob((prev) => ({ ...prev, email_notifications: checked }));
    } else if (
      type === 'checkbox' &&
      target instanceof HTMLInputElement &&
      name === 'categories'
    ) {
      // Handling categories as checkboxes
      const { checked } = target;
      setNewJob((prev) => {
        if (checked) {
          return { ...prev, categories: [...prev.categories, value] };
        } else {
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
      // Handling multiple select
      const values = Array.from(
        target.selectedOptions,
        (option: HTMLOptionElement) => option.value,
      );
      setNewJob((prev) => ({
        ...prev,
        [name]: values,
      }));
    } else {
      // Handling other input types
      setNewJob((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle Create Job Submission
  const handleCreateSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (newJob.categories.length === 0) {
      setError('Vennligst velg minst én kategori.');
      toast.error('Vennligst velg minst én kategori.');
      return;
    }

    try {
      if (!token) {
        throw new Error('Unauthorized');
      }

      setIsSubmitting(true);

      const payload = {
        ...newJob,
        categories: newJob.categories,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/job`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Update the jobs list with the newly created job
      setPublishedJobs((prev) => [...prev, response.data]);

      // Close the create modal
      closeCreateModal();

      // Show success notification
      toast.success('Job opprettet!', {
        description: 'Du kan nå administrere jobben fra listen.',
      });
    } catch (err: any) {
      console.error('Error creating job:', err);
      setError(err.response?.data?.message || 'Kunne ikke opprette jobben.');
      toast.error(err.response?.data?.message || 'Kunne ikke opprette jobben.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Edit Job Submission
  const handleEditSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (newJob.categories.length === 0) {
      setError('Vennligst velg minst én kategori.');
      toast.error('Vennligst velg minst én kategori.');
      return;
    }

    try {
      if (!token || !currentJob?.id) {
        throw new Error('Unauthorized or invalid job ID');
      }

      setIsSubmitting(true);

      const payload = {
        ...newJob,
        categories: newJob.categories,
      };

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/job/${currentJob.id}`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Update the jobs list with the edited job
      setPublishedJobs((prev) =>
        prev.map((j) => (j.id === currentJob.id ? response.data : j)),
      );

      // Close the edit modal
      closeEditModal();

      // Show success notification
      toast.success('Job oppdatert!', {
        description: 'Endringene er lagret.',
      });
    } catch (err: any) {
      console.error('Error updating job:', err);
      setError(err.response?.data?.message || 'Kunne ikke oppdatere jobben.');
      toast.error(
        err.response?.data?.message || 'Kunne ikke oppdatere jobben.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Job
  const handleDeleteJob = async (job: Job) => {
    const confirmDelete = confirm(
      `Er du sikker på at du vil slette jobben "${job.title}"?`,
    );
    if (!confirmDelete) return;

    setError('');

    try {
      if (!token || !job.id) {
        throw new Error('Unauthorized or invalid job ID');
      }

      setIsSubmitting(true);

      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/job/${job.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove the deleted job from the list
      setPublishedJobs((prev) => prev.filter((j) => j.id !== job.id));

      // Show success notification
      toast.success('Job slettet!', {
        description: 'Jobben er fjernet fra listen.',
      });
    } catch (err: any) {
      console.error('Error deleting job:', err);
      setError(err.response?.data?.message || 'Kunne ikke slette jobben.');
      toast.error(err.response?.data?.message || 'Kunne ikke slette jobben.');
    } finally {
      setIsSubmitting(false);
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

      <button
        onClick={openCreateModal}
        className="hover:bg-primary-dark mb-6 rounded bg-primary px-4 py-2 text-white"
      >
        Opprett Ny Jobb
      </button>

      <input
        type="text"
        placeholder="Søk gjennom dine jobber..."
        className="dark:bg-background-dark dark:text-foreground-dark mb-6 w-full rounded-lg bg-background p-3 text-foreground shadow-neumorphic focus:outline-none focus:ring-2 focus:ring-primary dark:shadow-neumorphic-dark"
      />

      {isAuthLoading || isFetching ? (
        <LoadingLogo />
      ) : (
        <JobList
          jobs={publishedJobs}
          isEmployerView={true}
          onEdit={openEditModal}
          onDelete={handleDeleteJob}
        />
      )}

      {/* Job Creation Modal */}
      <JobModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onSubmit={handleCreateSubmit}
        formData={newJob}
        categories={categories}
        handleInputChange={handleInputChange}
        error={error}
        isSubmitting={isSubmitting} // Pass loading state to disable form if needed
        isEdit={false}
      />

      {/* Job Editing Modal */}
      <JobModal
        isOpen={isEditModalOpen && !!currentJob}
        onClose={closeEditModal}
        onSubmit={handleEditSubmit}
        formData={newJob}
        categories={categories}
        handleInputChange={handleInputChange}
        error={error}
        isSubmitting={isSubmitting} // Pass loading state to disable form if needed
        isEdit={true}
      />
    </div>
  );
};

export default ArbeidsgiverHomePage;
