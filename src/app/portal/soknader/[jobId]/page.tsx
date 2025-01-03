'use client';

import React, { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { useAuthContext } from '@/context/AuthContext';

import Logo from '@/components/common/Logo';
import { Application, ApplicationStatus, Category, User } from '@/common/types';
import EmployerProfile from '@/components/portal/job/EmployerProfile';
import JobDetailsComponent from '@/components/portal/job/JobDetailsComponent';
import UserApplicationStatus from '@/components/portal/job/applications/UserApplicationStatus';
import ApplicationForm from '@/components/portal/job/applications/ApplicationForm';
import ApplicationsList from '@/components/portal/job/applications/ApplicationsList';

import { Toaster, toast } from 'sonner';

// -- Types
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

const ApplicationPage: React.FC = () => {
  const { loggedIn, user, token, userRole } = useAuthContext();
  const params = useParams();
  const jobId = params?.jobId?.toString();

  // -- Local State
  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [userApplication, setUserApplication] = useState<Application | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [previewImage, setPreviewImage] = useState<string>('');

  // We'll store messages, but not show them directly. Toasts are triggered below in useEffects.
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Tailwind color-coded statuses
  const statusTranslation: {
    [key in ApplicationStatus]: { text: string; color: string };
  } = {
    waiting: {
      text: 'Venter godkjenning',
      color: 'bg-yellow-100 text-yellow-800',
    },
    approved: {
      text: 'Akseptert',
      color: 'bg-green-100 text-green-800',
    },
    rejected: {
      text: 'Avslått',
      color: 'bg-red-100 text-red-800',
    },
  };

  // For simple fade-in transition
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // -- Show toast whenever errorMessage or successMessage changes
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

  // -- Data fetching in one effect
  useEffect(() => {
    // Early returns to avoid multiple toast calls
    if (!jobId) {
      setLoading(false);
      setErrorMessage('Ugyldig jobb-ID.');
      return;
    }
    if (!loggedIn) {
      setLoading(false);
      setErrorMessage('Du må være logget inn.');
      return;
    }
    if (!token) {
      setLoading(false);
      setErrorMessage('Uautorisert. Vennligst logg inn igjen.');
      return;
    }

    const fetchAllData = async () => {
      try {
        setLoading(true);

        // 1) Fetch Job Details
        const jobResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/job/${jobId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const job = jobResponse.data as JobDetails;
        setJobDetails(job);

        if (job.user?.image) {
          setPreviewImage(`${process.env.NEXT_PUBLIC_ASSETS_URL}${job.user.image}`);
        } else {
          setPreviewImage(
            `${process.env.NEXT_PUBLIC_ASSETS_URL}default-profile-image.png`
          );
        }

        // 2) Fetch Applications
        const appsResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/applications/job/${jobId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const fetchedApplications: Application[] = appsResponse.data;
        setApplications(fetchedApplications);

        // If arbeidstaker, check if user has an existing application
        if (userRole === 'arbeidstaker' && user) {
          const existing = fetchedApplications.find((app) => app.user.id === user.id);
          if (existing) setUserApplication(existing);
        }
      } catch (err: any) {
        console.error(err);
        // Avoid double toasting; just set error state
        setErrorMessage(
          err.response?.data?.message ||
          err.message ||
          'Noe gikk galt ved henting av data.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [jobId, token, user, userRole, loggedIn]);

  // -- Form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (!token || !user) {
        throw new Error('Uautorisert bruker');
      }
      const payload = { job: jobId, user: user.id };
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/applications`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccessMessage('Søknaden har blitt sendt!');
      setUserApplication(response.data);
      setApplications((prev) => [...prev, response.data]);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(
        err.response?.data?.message ||
        err.message ||
        'Kunne ikke sende søknaden.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // -- Approve
  const handleApprove = async (applicationId: string) => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/applications/${applicationId}`,
        { status: 'approved' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, status: 'approved' } : app
        )
      );
      setSuccessMessage('Søknaden har blitt godkjent!');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(
        err.response?.data?.message ||
        err.message ||
        'Kunne ikke godkjenne søknaden.'
      );
    }
  };

  // -- Decline
  const handleDecline = async (applicationId: string) => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/applications/${applicationId}`,
        { status: 'declined' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, status: 'rejected' } : app
        )
      );
      setSuccessMessage('Søknaden har blitt avslått.');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(
        err.response?.data?.message ||
        err.message ||
        'Kunne ikke avslå søknaden.'
      );
    }
  };

  // -- Loading State
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center space-y-4 animate-pulse">
          <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xl text-gray-700">Laster...</p>
        </div>
      </div>
    );
  }

  // -- Must be logged in
  if (!loggedIn || !user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Logo />
        <p className="mt-4 text-xl text-red-500">
          Du må være logget inn for å søke på jobber.
        </p>
      </div>
    );
  }

  // -- If there's an error before job details load
  if (errorMessage && !jobDetails) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Logo />
        <p className="mt-4 text-xl text-red-500">Feil: {errorMessage}</p>
        <Toaster position="top-center" richColors />
      </div>
    );
  }

  // -- Main View
  return (
    <main
      className="min-h-screen w-full px-4 py-10 bg-gradient-to-b from-gray-50 to-gray-100
      flex flex-col items-center relative"
    >
      {/* Sonner Toaster */}
      <Toaster position="top-center" richColors />

      {/* Container */}
      <div className="w-full max-w-4xl space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center mb-4">
          <Logo />
        </div>

        {/* Employer Profile + Job Details (Glass-style card) */}
        <div
          className={`
            backdrop-blur-lg bg-white/80 rounded-xl shadow-lg p-6
            transform transition-all duration-700
            ${hasMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}
        >
          {jobDetails?.user && (
            <EmployerProfile user={jobDetails.user} previewImage={previewImage} />
          )}
          {jobDetails && (
            <div className="mt-6">
              <JobDetailsComponent
                title={jobDetails.title}
                description={jobDetails.description}
                place={jobDetails.place}
                date_accessible={jobDetails.date_accessible}
                date_created={jobDetails.date_created}
                date_updated={jobDetails.date_updated}
                status={jobDetails.status}
                categories={jobDetails.categories}
              />
            </div>
          )}
        </div>

        {/* If arbeidstaker => Show own application or form */}
        {userRole === 'arbeidstaker' && (
          <div
            className={`
              backdrop-blur-lg bg-white/80 rounded-xl shadow-lg p-6
              transform transition-all duration-700
              ${hasMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
            `}
          >
            {userApplication ? (
              <UserApplicationStatus
                userApplication={userApplication}
                statusTranslation={statusTranslation}
                employerId={jobDetails?.user.id || ''}
              />
            ) : (
              <ApplicationForm onSubmit={handleSubmit} submitting={submitting}  errorMessage={errorMessage} successMessage={successMessage}/>
            )}
          </div>
        )}

        {/* If arbeidsgiver => Show all applications */}
        {userRole === 'arbeidsgiver' && (
          <div
            className={`
              backdrop-blur-lg bg-white/80 rounded-xl shadow-lg p-6
              transform transition-all duration-700
              ${hasMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
            `}
          >
            <ApplicationsList
              applications={applications}
              statusTranslation={statusTranslation}
              token={token!}
              onApprove={handleApprove}
              onDecline={handleDecline}
            />
          </div>
        )}
      </div>
    </main>
  );
};

export default ApplicationPage;
