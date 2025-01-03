// src/app/portal/soknader/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '@/context/AuthContext';
import Logo from '@/components/common/Logo';
import { Application, ApplicationStatus } from '@/common/types';
import ApplicationsList from '@/components/portal/job/applications/ApplicationsList';
import UserApplicationStatus from '@/components/portal/job/applications/UserApplicationStatus';

type StatusTranslation = {
  [key in ApplicationStatus]: { text: string; color: string };
};

const statusTranslation: StatusTranslation = {
  waiting: { text: 'Venter godkjenning', color: 'text-yellow-600' },
  approved: { text: 'Akseptert', color: 'text-green-600' },
  rejected: { text: 'Avslått', color: 'text-red-600' },
};

const SoknaderPage: React.FC = () => {
  const { loggedIn, user, token, userRole } = useAuthContext();

  // State variables
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Fetch applications based on user role
  useEffect(() => {
    const fetchApplications = async () => {
      if (!loggedIn || !token || !user) {
        setErrorMessage('Du må være logget inn for å se søknader.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setErrorMessage('');

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/applications`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const fetchedApplications: Application[] = response.data;
        setApplications(fetchedApplications);
      } catch (error: any) {
        console.error('Error fetching applications:', error);
        setErrorMessage(
          error.response?.data?.message ||
          error.message ||
          'Kunne ikke hente søknader.',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [loggedIn, token, user, userRole]);

  // Approve Application Handler (only for employers)
  const handleApprove = async (applicationId: string) => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/applications/${applicationId}`,
        { status: 'approved' }, // Ensure status matches ApplicationStatus
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

  // Decline Application Handler (only for employers)
  const handleDecline = async (applicationId: string) => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/applications/${applicationId}`,
        { status: 'rejected' }, // Changed to 'rejected'
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
  if (loading) {
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
          Du må være logget inn for å se søknader.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center px-4 py-10">
      <Logo />

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 rounded-lg bg-green-100 p-4 text-green-700">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-700">
          {errorMessage}
        </div>
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

      {userRole === 'arbeidstaker' && (
        <div className="mt-12 w-full max-w-4xl">
          <h2 className="mb-4 text-2xl font-bold">Mine Søknader</h2>
          {applications.length > 0 ? (
            <ul className="space-y-6">
              {applications.map((application) => (
                <li
                  key={application.id}
                  className="rounded-3xl border p-6 shadow-neumorphic bg-white flex md:flex-row flex-col justify-between"
                >
                  <div className="flex flex-col md:flex-row md:justify-between w-2/3">
                    {/* Job Details */}
                    <div className="mb-4 md:mb-0">
                      <h3 className="text-xl font-semibold">{application.job?.title || 'Ukjent Stilling'}</h3>
                      <p className="text-gray-600">{application.job?.description || 'Ingen beskrivelse tilgjengelig.'}</p>
                      <p className="mt-2 text-gray-700">
                        <strong>Sted:</strong> {application.job?.place || 'Ukjent'}
                      </p>
                      <p className="text-gray-700">
                        <strong>Dato tilgjengelig:</strong> {application.job?.date_accessible ? new Date(application.job.date_accessible).toLocaleDateString('no-NO') : 'Ukjent'}
                      </p>
                    </div>
                  </div>
                    {/* Application Status */}
                    <div className="md:text-right">
                      <UserApplicationStatus
                        userApplication={application}
                        statusTranslation={statusTranslation}
                        employerId={application.job?.user.id || ''}
                      />
                    </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-700">Du har ingen søknader ennå.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SoknaderPage;
