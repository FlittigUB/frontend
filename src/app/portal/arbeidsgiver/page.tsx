// src/pages/arbeidsgiver/home.tsx

'use client';

import React, { FormEvent, useEffect, useState } from 'react';
import JobList from '@/components/portal/job/JobList';
import { Category, Job, JobFormData } from '@/common/types';
import axios from 'axios';
import { useAuthContext } from '@/context/AuthContext';
import JobModal from '@/components/portal/job/JobModal';
import LoadingLogo from '@/components/NSRVLoader';
import { toast } from 'sonner';

const ArbeidsgiverHomePage: React.FC = () => {
  // State variables
  const [publishedJobs, setPublishedJobs] = useState<Job[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [currentJob, setCurrentJob] = useState<Job | null>(null);

  // Updated: We store lat/long as strings in JobFormData,
  // but we won't spread them into the final payload.
  const [newJob, setNewJob] = useState<JobFormData>({
    latitude: '',
    longitude: '',
    title: '',
    description: '',
    scheduled_at: '',
    category: '',
    email_notifications: false,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string>('');

  const { token, userRole, isAuthLoading } = useAuthContext();
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Fetch published jobs and categories
  useEffect(() => {
    const fetchPublishedJobs = async () => {
      try {
        setIsFetching(true);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/job`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
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
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const catData = Array.isArray(response.data) ? response.data : [];
        setCategories(catData);
      } catch (err: any) {
        console.error('Error fetching categories:', err);
        setError(err.response?.data?.message || 'Failed to fetch categories.');
        toast.error(err.response?.data?.message || 'Failed to fetch categories.');
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
      latitude: '',
      longitude: '',
      scheduled_at: '',
      category: '',
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

    // If the job has position data (job.position), you could parse it here.
    // For now we default to empty strings if not present.
    setNewJob({
      title: job.title || '',
      description: job.description || '',
      latitude: '',
      longitude: '',
      scheduled_at: job.scheduled_at || '',
      category: job.category?.id || '',
      email_notifications: job.email_notifications,
    });
    setIsEditModalOpen(true);
    setError('');
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentJob(null);
  };

  // Fix TS error for 'checked' by narrowing the target to HTMLInputElement
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const target = e.target;

    // If this is the email_notifications checkbox:
    if (
      target.name === 'email_notifications' &&
      target instanceof HTMLInputElement &&
      target.type === 'checkbox'
    ) {
      setNewJob((prev) => ({ ...prev, email_notifications: target.checked }));
    } else {
      // Otherwise, use .value
      setNewJob((prev) => ({ ...prev, [target.name]: target.value }));
    }
  };

  // CREATE
  const handleCreateSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newJob.category) {
      setError('Vennligst velg en kategori.');
      toast.error('Vennligst velg en kategori.');
      return;
    }

    try {
      if (!token) {
        throw new Error('Unauthorized');
      }
      setIsSubmitting(true);

      // Extract lat/long from newJob so we don't pass them at top-level
      const { latitude, longitude, ...rest } = newJob;

      const payload = {
        ...rest,
        position: {
          type: 'Point',
          // Convert to float so the API gets numeric values
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
      };

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/job`, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      setPublishedJobs((prev) => [...prev, response.data]);
      closeCreateModal();

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

  // EDIT
  const handleEditSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newJob.category) {
      setError('Vennligst velg en kategori.');
      toast.error('Vennligst velg en kategori.');
      return;
    }

    if (!token || !currentJob?.id) {
      setError('Unauthorized or invalid job ID');
      return;
    }

    try {
      setIsSubmitting(true);

      const { latitude, longitude, ...rest } = newJob;
      const payload = {
        ...rest,
        position: {
          type: 'Point',
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
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

      setPublishedJobs((prev) =>
        prev.map((j) => (j.id === currentJob.id ? response.data : j)),
      );

      closeEditModal();

      toast.success('Job oppdatert!', {
        description: 'Endringene er lagret.',
      });
    } catch (err: any) {
      console.error('Error updating job:', err);
      setError(err.response?.data?.message || 'Kunne ikke oppdatere jobben.');
      toast.error(err.response?.data?.message || 'Kunne ikke oppdatere jobben.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // DELETE
  const handleDeleteJob = async (job: Job) => {
    const confirmDelete = confirm(`Er du sikker på at du vil slette jobben "${job.title}"?`);
    if (!confirmDelete) return;

    try {
      if (!token || !job.id) {
        throw new Error('Unauthorized or invalid job ID');
      }
      setIsSubmitting(true);

      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/job/${job.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPublishedJobs((prev) => prev.filter((j) => j.id !== job.id));

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
        <p className="text-xl text-red-500">Du har ikke tilgang til denne siden.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-4 text-3xl font-bold">Dine Publiserte Jobber</h1>
      <p className="mb-6">Her ser du en oversikt over alle jobbene du har publisert.</p>

      <button
        onClick={openCreateModal}
        className="hover:bg-primary-dark mb-6 rounded bg-primary px-4 py-2 text-white"
      >
        Opprett Ny Jobb
      </button>

      <input
        type="text"
        placeholder="Søk gjennom dine jobber..."
        className="dark:bg-background-dark dark:text-foreground-dark mb-6 w-full rounded-lg
                   bg-background p-3 text-foreground shadow-neumorphic
                   focus:outline-none focus:ring-2 focus:ring-primary dark:shadow-neumorphic-dark"
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
        isSubmitting={isSubmitting}
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
        isSubmitting={isSubmitting}
        isEdit={true}
      />
    </div>
  );
};

export default ArbeidsgiverHomePage;
