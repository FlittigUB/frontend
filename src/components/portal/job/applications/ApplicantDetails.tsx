import React from 'react';
import Image from 'next/image';
import { Application } from '@/common/types';
import Link from 'next/link';

interface ApplicantDetailsProps {
  application: Application;
  token?: string;
}

const ApplicantDetails: React.FC<ApplicantDetailsProps> = ({
  application,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  token,
}) => {
  const user = application.user;
  console.log(application);

  if (!user) {
    return <p>Kunne ikke hente søkerens informasjon.</p>;
  }
  let imageUrl = `${process.env.NEXT_PUBLIC_ASSETS_URL}default-profile-image.png`;
  if (user.image && typeof user.image === 'object' && 'id' in user.image) {
    imageUrl = user.image.id
      ? `${process.env.NEXT_PUBLIC_ASSETS_URL}${user.image.id}`
      : `${process.env.NEXT_PUBLIC_ASSETS_URL}default-profile-image.png`;
  } else if (user.image && typeof user.image === 'string') {
    imageUrl = user.image
      ? `${process.env.NEXT_PUBLIC_ASSETS_URL}${user.image}`
      : `${process.env.NEXT_PUBLIC_ASSETS_URL}default-profile-image.png`;
  }

  console.log(imageUrl);

  return (
    <div className="flex items-center space-x-4">
      <div className="relative h-16 w-16 overflow-hidden rounded-full bg-gray-200 shadow-inner">
        <Image
          src={imageUrl}
          alt={`${user.name} profilbilde`}
          fill
          className="object-cover"
        />
      </div>
      <div>
        <Link href={`/portal/profil/${user.id}`} className="font-semibold">
          {user.name}
        </Link>
        <p className="text-sm text-gray-600">{user.email}</p>
        {user.bio && <p className="text-sm text-gray-600">Bio: {user.bio}</p>}
        {user.birthdate && (
          <p className="text-sm text-gray-600">
            Fødselsdato: {new Date(user.birthdate).toLocaleDateString('no-NO')}
          </p>
        )}
        {user.role && (
          <p className="text-sm text-gray-600">Rolle: {user.role}</p>
        )}
      </div>
    </div>
  );
};

export default ApplicantDetails;
