'use client';

import React, { useEffect, useState } from 'react';
import { Application, ApplicationStatus } from '@/common/types';
import { toast } from 'sonner';
import axios from 'axios';
import { useAuthContext } from '@/context/AuthContext';
import Link from 'next/link';

const MyApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [filterStatus, setFilterStatus] = useState<ApplicationStatus | 'all'>(
    'all',
  );
  const [showArchived, setShowArchived] = useState<boolean>(false);
  const { token } = useAuthContext();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsFetching(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/applications`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const appsData = Array.isArray(response.data) ? response.data : [];
        setApplications(appsData);
      } catch (error) {
        console.error(error);
        toast.error('Kunne ikke hente søknader');
      } finally {
        setIsFetching(false);
      }
    };
    if (token) fetchApplications();
  }, [token]);

  const statusTranslations: Record<ApplicationStatus, string> = {
    waiting: 'Venter',
    approved: 'Godkjent',
    declined: 'Avslått',
    finished: 'Fullført',
    confirmed: 'Bekreftet',
  };

  const statusColors: Record<ApplicationStatus, string> = {
    waiting: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    declined: 'bg-red-100 text-red-800',
    finished: 'bg-blue-100 text-blue-800',
    confirmed: 'bg-purple-100 text-purple-800',
  };

  const filteredApplications = applications.filter((application) => {
    if (filterStatus === 'all') return application.job.status !== 'archived';
    return (
      application.status === filterStatus &&
      application.job.status !== 'archived'
    );
  });

  const archivedApplications = applications.filter(
    (application) => application.job.status === 'archived',
  );

  return (
    <>
      <h1 className="mt-4 text-2xl font-bold">Mine søknader</h1>
      <p className="text-gray-600">
        Her kan du se en oversikt over dine søknader
      </p>

      {/* Filters */}
      <div className="mt-6 flex space-x-4">
        <button
          className={`rounded px-4 py-2 ${
            filterStatus === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setFilterStatus('all')}
        >
          Alle
        </button>
        {Object.keys(statusColors).map((status) => (
          <button
            key={status}
            className={`rounded px-4 py-2 ${
              filterStatus === status ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setFilterStatus(status as ApplicationStatus)}
          >
            {statusTranslations[status as ApplicationStatus]}
          </button>
        ))}
        <button
          className="rounded bg-red-500 px-4 py-2 text-white"
          onClick={() => setFilterStatus('all')}
        >
          Nullstill
        </button>
      </div>

      <div className="mt-12">
        {isFetching ? (
          <p>Laster inn søknader...</p>
        ) : filteredApplications.length > 0 ? (
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredApplications.map((application) => (
              <li key={application.id}>
                <div className="transform rounded-lg bg-white p-6 shadow-lg transition hover:scale-105 hover:shadow-xl">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      <Link
                        href={`/portal/stillinger/${application.job.slug}`}
                        className="text-blue-600"
                      >
                        {application.job.title}
                      </Link>
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">
                      {application.job.description
                        ? application.job.description.substring(0, 100) + '...'
                        : 'Ingen beskrivelse tilgjengelig'}
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      Lønn: {application.job.rate} kr per{' '}
                      {application.job.payment_type === 'hourly'
                        ? 'time'
                        : 'fastpris'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Estimert tid: {application.job.hours_estimated} timer
                    </p>
                  </div>
                  <div className="mt-4">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${statusColors[application.status]}`}
                    >
                      {statusTranslations[application.status]}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Ingen søknader funnet!</p>
        )}
      </div>
      {/* Archived Applications */}
      {archivedApplications.length > 0 && (
        <div className="mt-12">
          <button
            onClick={() => setShowArchived(!showArchived)}
            className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
          >
            {showArchived
              ? 'Skjul arkiverte søknader'
              : 'Vis arkiverte søknader'}
          </button>
          {showArchived && (
            <ul className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {archivedApplications.map((application) => (
                <li key={application.id}>
                  <div className="rounded-lg bg-gray-100 p-6 shadow-lg">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {application.job.title}
                      </h3>
                      <p className="mt-2 text-sm text-gray-500">
                        {application.job.description || 'Ingen beskrivelse'}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </>
  );
};

export default MyApplicationsPage;
