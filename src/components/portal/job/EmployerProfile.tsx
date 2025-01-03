import Image from 'next/image';
import React from 'react';
import { User } from '@/common/types';
import Link from 'next/link';

interface EmployerProfileProps {
  user: User;
  previewImage: string;
}

const EmployerProfile: React.FC<EmployerProfileProps> = ({
  user,
  previewImage,
}) => {
  return (
    <div className="mb-8 mt-4 flex w-full max-w-md flex-row items-center justify-around rounded-3xl bg-white p-6 shadow-md">
      <div className="flex w-1/2 flex-col">
        <h1 className="mb-4 text-2xl font-bold">Arbeidsgiver</h1>
        <p>
          <Link href={`/portal/profil/${user.id}`}>{user.name}</Link>
        </p>
        <p>{user.bio}</p>
        <p>
          <strong>Flittig siden:</strong>{' '}
          {new Date(user.date_created).toLocaleDateString()}
        </p>
      </div>
      <div className="group relative h-40 w-40 overflow-hidden rounded-full bg-gray-200 shadow-inner">
        {previewImage ? (
          <Image
            src={previewImage}
            alt="Profilbilde"
            fill
            className="rounded-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-300">
            <p>Ingen bilde</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerProfile;
