// src/app/portal/soknader/[jobId]/page.tsx

'use client';

import React, { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { useAuthContext } from '@/context/AuthContext';
import Logo from '@/components/common/Logo';
import { Application, Category, User, ApplicationStatus } from '@/common/types';

import EmployerProfile from '@/components/portal/job/EmployerProfile';
import JobDetailsComponent from '@/components/portal/job/JobDetailsComponent';
import UserApplicationStatus from '@/components/portal/job/applications/UserApplicationStatus';
import ApplicationForm from '@/components/portal/job/applications/ApplicationForm';
import ApplicationsList from '@/components/portal/job/applications/ApplicationsList';

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
  const {
    loggedIn,
    user,
    loading: authLoading,
    token,
    userRole,
  } = useAuthContext();

  // State variables
  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [userApplication, setUserApplication] = useState<Application | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [previewImage, setPreviewImage] = useState<string>('');

  // Mapping of status from English to Norwegian
  const statusTranslation: {
    [key in ApplicationStatus]: { text: string; color: string };
  } = {
    waiting: { text: 'Venter godkjenning', color: 'text-yellow-600' },
    approved: { text: 'Akseptert', color: 'text-green-600' },
    rejected: { text: 'Avslått', color: 'text-red-600' },
  };

  const params = useParams();
  const jobId = params?.jobId?.toString();

  // Fetch job details and applications
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        if (!token) {
          throw new Error('Unauthorized');
        }
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/job/${jobId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setJobDetails(response.data);

        const userImage = response.data.user.image;
        if (userImage) {
          const assetsUrl = process.env.NEXT_PUBLIC_ASSETS_URL;
          setPreviewImage(`${assetsUrl}${userImage}`);
        } else {
          setPreviewImage(
            `${process.env.NEXT_PUBLIC_ASSETS_URL}default-profile-image.png`,
          );
        }
      } catch (error: any) {
        console.error('Error fetching job details:', error);
        if (!authLoading) {
          setErrorMessage(
            error.response?.data?.message ||
              error.message ||
              'Kunne ikke hente jobbdetaljer.',
          );
        }
      }
    };

    const fetchApplications = async () => {
      try {
        if (!token) {
          throw new Error('Unauthorized');
        }
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/applications/job/${jobId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const fetchedApplications: Application[] = response.data;
        setApplications(fetchedApplications);

        if (userRole === 'arbeidstaker' && user) {
          const existingApplication = fetchedApplications.find(
            (app) => app.user.id === user.id, // Compare the 'id' properties
          );
          if (existingApplication) {
            setUserApplication(existingApplication);
          }
        }
      } catch (error: any) {
        console.error('Error fetching applications:', error);
        if (!authLoading) {
          setErrorMessage(
            error.response?.data?.message ||
              error.message ||
              'Kunne ikke hente søknader.',
          );
        }
      }
    };

    const fetchData = async () => {
      setLoading(true);
      if (jobId && !authLoading) {
        if (token) {
          await fetchJobDetails();
          await fetchApplications();
        } else {
          setErrorMessage('Uautorisert. Vennligst logg inn igjen.');
          setLoading(false);
          return;
        }
      } else {
        console.log('jobId er undefined eller auth er lastet.');
        setErrorMessage('Ugyldig jobb-ID.');
      }
      setLoading(false);
    };

    fetchData();
  }, [jobId, token, authLoading, userRole, user]);

  // Handle form submission (only for arbeidstaker)
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (!token || !user) {
        throw new Error('Unauthorized');
      }

      const payload: any = {
        job: jobId,
        user: user.id,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/applications`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setSuccessMessage('Søknaden har blitt sendt!');
      setUserApplication(response.data);
      setApplications((prev) => [...prev, response.data]);
    } catch (error: any) {
      console.error('Error submitting application:', error);
      setErrorMessage(
        error.response?.data?.message ||
          error.message ||
          'Kunne ikke sende søknaden.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Approve Application Handler
  const handleApprove = async (applicationId: string) => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/applications/${applicationId}`,
        { status: 'approved' },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setApplications((prevApplications) =>
        prevApplications.map((app) =>
          app.id === applicationId ? { ...app, status: 'approved' } : app,
        ),
      );

      setSuccessMessage('Søknaden har blitt godkjent!');
    } catch (error: any) {
      console.error('Error approving application:', error);
      setErrorMessage(
        error.response?.data?.message ||
          error.message ||
          'Kunne ikke godkjenne søknaden.',
      );
    }
  };

  // Decline Application Handler
  const handleDecline = async (applicationId: string) => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/applications/${applicationId}`,
        { status: 'declined' },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setApplications((prevApplications) =>
        prevApplications.map((app) =>
          app.id === applicationId ? { ...app, status: 'rejected' } : app,
        ),
      );

      setSuccessMessage('Søknaden har blitt avslått.');
    } catch (error: any) {
      console.error('Error declining application:', error);
      setErrorMessage(
        error.response?.data?.message ||
          error.message ||
          'Kunne ikke avslå søknaden.',
      );
    }
  };

  // Loading state
  if (loading || authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-xl">Laster...</p>
      </div>
    );
  }

  // Ensure the user is logged in
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

  // Error state
  if (errorMessage && !jobDetails) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Logo />
        <p className="mt-4 text-xl text-red-500">Feil: {errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-r from-yellow-200 to-yellow-300 px-4 py-10">
      <Logo />

      {jobDetails?.user && (
        <EmployerProfile user={jobDetails.user} previewImage={previewImage} />
      )}

      {jobDetails && (
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
      )}

      {userRole === 'arbeidstaker' && (
        <>
          {userApplication ? (
            <UserApplicationStatus
              userApplication={userApplication}
              statusTranslation={statusTranslation}
              employerId={jobDetails?.user.id || ''}
            />
          ) : (
            <ApplicationForm
              onSubmit={handleSubmit}
              submitting={submitting}
              successMessage={successMessage}
              errorMessage={errorMessage}
            />
          )}
        </>
      )}

      {userRole === 'arbeidsgiver' && (
        <ApplicationsList
          applications={applications}
          statusTranslation={statusTranslation}
          token={token!}
          onApprove={handleApprove}
          onDecline={handleDecline}
        />
      )}
    </div>
  );
};

export default ApplicationPage;
