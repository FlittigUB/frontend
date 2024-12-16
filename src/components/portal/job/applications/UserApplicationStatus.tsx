import Link from 'next/link';
import React from 'react';
import { Application, ApplicationStatus } from '@/common/types';

interface UserApplicationStatusProps {
  userApplication: Application;
  statusTranslation: {
    [key in ApplicationStatus]: { text: string; color: string };
  };
  employerId: string;
}

const UserApplicationStatus: React.FC<UserApplicationStatusProps> = ({
  userApplication,
  statusTranslation,
  employerId,
}) => {
  return (
    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-md">
      <h2 className="mb-4 text-2xl font-bold">Din Søknad</h2>
      <p>
        <strong>Status:</strong>{' '}
        <span
          className={
            statusTranslation[userApplication.status]?.color || 'text-gray-700'
          }
        >
          {statusTranslation[userApplication.status]?.text ||
            userApplication.status}
        </span>
      </p>
      {userApplication.status === 'waiting' && (
        <p className="mt-2 text-yellow-600">Din søknad er under vurdering.</p>
      )}
      {userApplication.status === 'approved' && (
        <div className="mt-4">
          <p className="text-green-600">
            Gratulerer! Din søknad har blitt akseptert.
          </p>
          <Link
            className="mt-4 inline-block rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            href={`/portal/meldinger/${employerId}`}
          >
            Chat med arbeidsgiver
          </Link>
        </div>
      )}
      {userApplication.status === 'rejected' && (
        <p className="mt-2 text-red-600">
          Beklager, din søknad har blitt avslått.
        </p>
      )}
    </div>
  );
};

export default UserApplicationStatus;
