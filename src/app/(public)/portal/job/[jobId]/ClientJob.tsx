// app/(public)/portal/job/[jobId]/ClientJob.tsx
'use client';

import React, { FormEvent, useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';

import EmployerProfile from '@/components/portal/job/EmployerProfile';
import JobDetailsComponent from '@/components/portal/job/JobDetailsComponent';
import ApplicationForm from '@/components/portal/job/applications/ApplicationForm';
import UserApplicationStatus from '@/components/portal/job/applications/UserApplicationStatus';

// If you have an optional auth context:
import { useOptionalAuthContext } from '@/context/AuthContext';

import axios from 'axios';

import { Application, ApplicationStatus, User } from '@/common/types';

// We re-declare the shape for clarity
interface Category {
  id: string;
  name: string;
}

interface JobDetails {
  id: string;
  status: string;
  user_created: string;
  date_created: string;
  user_updated: string | null;
  date_updated: string | null;
  title: string;
  description: string;
  place: string;
  date_accessible: string;
  categories: Category[];
  user: User;
}

// Props from the server
interface ClientJobDetailsProps {
  job: JobDetails;
}

export default function ClientJobDetails({ job }: ClientJobDetailsProps) {
  const { loggedIn, user, token, userRole } = useOptionalAuthContext();

  const [previewImage, setPreviewImage] = useState<string>('');
  const [userApplication, setUserApplication] = useState<Application | null>(
    null,
  );
  const [isLoadingApps, setIsLoadingApps] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // For local error/success, or you can rely on toasts only
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const statusTranslation: {
    [key in ApplicationStatus]: { text: string; color: string };
  } = {
    waiting: {
      text: 'Venter godkjenning',
      color: 'bg-yellow-100 text-yellow-800',
    },
    approved: { text: 'Akseptert', color: 'bg-green-100 text-green-800' },
    rejected: { text: 'Avslått', color: 'bg-red-100 text-red-800' },
  };

  // 1) useEffect for local images
  useEffect(() => {
    if (job?.user?.image) {
      setPreviewImage(`${process.env.NEXT_PUBLIC_ASSETS_URL}${job.user.image}`);
    } else {
      setPreviewImage(
        `${process.env.NEXT_PUBLIC_ASSETS_URL}default-profile-image.png`,
      );
    }
  }, [job]);

  // 2) If user is logged in and is arbeidstaker, fetch existing application
  useEffect(() => {
    async function fetchUserApplication() {
      if (loggedIn && user && userRole === 'arbeidstaker' && token) {
        setIsLoadingApps(true);
        try {
          const resp = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/applications/job/${job.id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          const allApps: Application[] = resp.data;
          const existing = allApps.find((app) => app.user.id === user.id);
          if (existing) setUserApplication(existing);
        } catch (err: any) {
          console.error(err);
          setErrorMessage('Kunne ikke hente eksisterende søknader.');
        } finally {
          setIsLoadingApps(false);
        }
      }
    }

    fetchUserApplication();
  }, [loggedIn, user, userRole, token, job]);

  // 3) Watch local error/success states to show toasts
  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
    }
  }, [successMessage]);

  // 4) Handle the apply action (client side)
  async function handleApply(e: FormEvent) {
    e.preventDefault();

    if (!loggedIn || !user || !token || userRole !== 'arbeidstaker') {
      toast.error('Du må være logget inn som arbeidstaker for å søke.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const payload = { job: job.id, user: user.id };
      const resp = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/applications`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setUserApplication(resp.data);
      setSuccessMessage('Søknaden din ble sendt!');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(
        err.response?.data?.message ||
          'Noe gikk galt ved innsending av søknad.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  // Render
  return (
    <div className="w-full max-w-4xl space-y-6">
      <Toaster position="top-center" richColors />

      {/* Header / Logo is optional. If you want, you can place it here
          or let the parent server component handle it */}
      {/*
      <div className="flex flex-col items-center">
        <Logo />
      </div>
      */}

      {/* Employer + Job Details */}
      <div className="rounded bg-white p-6 shadow">
        {job?.user && (
          <EmployerProfile user={job.user} previewImage={previewImage} />
        )}
        <div className="mt-6">
          <JobDetailsComponent
            title={job.title}
            description={job.description}
            place={job.place}
            date_accessible={job.date_accessible}
            date_created={job.date_created}
            date_updated={job.date_updated}
            status={job.status}
            categories={job.categories}
          />
        </div>
      </div>

      {/* Conditionally show "Apply" or user application status */}
      {loggedIn && userRole === 'arbeidstaker' ? (
        <div className="rounded bg-white p-6 shadow">
          {isLoadingApps ? (
            <p className="text-gray-600">Laster søknader ...</p>
          ) : userApplication ? (
            <UserApplicationStatus
              userApplication={userApplication}
              statusTranslation={statusTranslation}
              employerId={job?.user.id || ''}
            />
          ) : (
            <ApplicationForm
              onSubmit={handleApply}
              submitting={submitting}
              successMessage={successMessage}
              errorMessage={errorMessage}
            />
          )}
        </div>
      ) : (
        // If user not logged in or not arbeidstaker
        <div className="rounded bg-white p-4 text-center text-gray-600 shadow">
          Du må være logget inn som arbeidstaker for å søke på denne stillingen.
        </div>
      )}
    </div>
  );
}
