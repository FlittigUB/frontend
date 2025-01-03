import React from 'react';
import { Application, ApplicationStatus } from '@/common/types';
import { FaCheck, FaTimes } from 'react-icons/fa';
import ApplicantDetails from './ApplicantDetails';
import Link from 'next/link';

interface ApplicationsListProps {
  applications: Application[];
  statusTranslation: {
    [key in ApplicationStatus]: { text: string; color: string };
  };
  token: string;
  onApprove: (id: string) => void;
  onDecline: (id: string) => void;
}

const ApplicationsList: React.FC<ApplicationsListProps> = ({
  applications,
  statusTranslation,
  token,
  onApprove,
  onDecline,
}) => {
  return (
    <div className="mt-12 w-full max-w-2xl rounded-3xl bg-white p-6 shadow-md">
      <h2 className="mb-4 text-2xl font-bold">Mottatte Søknader</h2>
      {applications.length > 0 ? (
        <ul>
          {applications.map((application) => (
            <li
              key={application.id}
              className="mb-4 rounded-lg border p-4 shadow-sm"
            >
              <ApplicantDetails application={application} token={token} />
              <p>
                <strong>Status:</strong>{' '}
                <span
                  className={
                    statusTranslation[application.status]?.color ||
                    'text-gray-700'
                  }
                >
                  {statusTranslation[application.status]?.text ||
                    application.status}
                </span>
              </p>
              {application.status === 'approved' && (
                <div className="mt-4 flex space-x-4">
                  <Link
                    className="flex items-center rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    href={`/portal/meldinger/${application.user.id}`}
                  >
                    Chat med {application.user.name}
                  </Link>
                </div>
              )}
              {application.status === 'waiting' && (
                <div className="mt-4 flex space-x-4">
                  <button
                    onClick={() => onApprove(application.id)}
                    className="flex items-center rounded-lg bg-green-500 px-4 py-2 font-semibold text-white shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                  >
                    <FaCheck className="mr-2" />
                    Godkjenn
                  </button>
                  <button
                    onClick={() => onDecline(application.id)}
                    className="flex items-center rounded-lg bg-red-500 px-4 py-2 font-semibold text-white shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                  >
                    <FaTimes className="mr-2" />
                    Avslå
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-700">Ingen søknader mottatt ennå.</p>
      )}
    </div>
  );
};

export default ApplicationsList;
