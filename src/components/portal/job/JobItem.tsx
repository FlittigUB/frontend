// src/components/portal/job/JobItem.tsx

import React from 'react';
import Link from 'next/link';
import { Job } from '@/common/types';
import {
  FiMapPin,
  FiCalendar,
  FiUser,
  FiMail,
  FiDollarSign,
  FiClock,
} from 'react-icons/fi';
import Image from 'next/image';

// Extended to handle job.distance if present
interface ExtendedJob extends Job {
  distance?: number;
}

interface JobItemProps {
  job: ExtendedJob; // accept a job that may have distance
  isEmployerView?: boolean;
  onEdit?: (job: Job) => void;
  onDelete?: (job: Job) => void;
}

const JobItem: React.FC<JobItemProps> = ({
  job,
  isEmployerView = false,
  onEdit,
  onDelete,
}) => {
  // Format date in Norwegian
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Ugyldig dato';
    }
    return date.toLocaleDateString('nb-NO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };
  // Display payment info
  const displayPayment = () => {
    if (job.payment_type === 'hourly') {
      return `${job.rate} NOK / time`;
    }
    return `${job.rate} NOK (fast pris)`;
  };

  console.log(job.position);
  // We'll display either position.formattedAddress or neighborhood/city
  const displayLocation =
    job.position?.neighbourhood ||
    job.position?.suburb ||
    job.position?.farm ||
    job.position?.city ||
    'Ukjent sted';

  return (
    <div className="dark:bg-background-dark dark:text-foreground-dark flex flex-col rounded-xl bg-amber-50 p-6 text-foreground shadow-neumorphic transition-shadow hover:shadow-lg dark:shadow-neumorphic-dark">
      {/* Title row & "Se søknader" (only for employers) */}
      <div className="relative flex items-center justify-between">
        <Link
          href={`/portal/stillinger/${job.slug}`}
          className="text-xl font-semibold transition-colors hover:text-primary focus:outline-none"
        >
          {job.title}
        </Link>
        {isEmployerView && (
          <div className="absolute right-2 flex justify-between gap-2">
            <Link
              href={`/portal/stillinger/${job.slug}`}
              className="hidden rounded-full border border-gray-200 bg-white px-4 py-1 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary sm:inline-block"
            >
              Se søknader
            </Link>
            <button className="rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 px-4 py-1 text-sm font-medium text-white shadow-sm transition-colors hover:from-yellow-500 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500">
              Legg til ekstra tjenester
            </button>
          </div>
        )}
      </div>

      {/* Gig Type Badge (Category) */}
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-0.5 text-sm font-medium text-yellow-800">
          {job.category.name}
        </span>
      </div>

      {/* Description */}
      {job.description && (
        <p className="mt-4 text-sm text-gray-800 dark:text-gray-200">
          {job.description}
        </p>
      )}
      {/* Payment Information */}
      <div className="mt-3 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <FiDollarSign className="h-4 w-4 flex-shrink-0" />
        <span>{displayPayment()}</span>
      </div>
      {job.hours_estimated && (
        <div className="mt-3 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <FiClock className="h-4 w-4 flex-shrink-0" />
          <span>{job.hours_estimated} timer</span>
        </div>
      )}

      {/* Location & Date */}
      <div className="mt-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <FiMapPin className="h-4 w-4 flex-shrink-0" />
          <span>{displayLocation}</span>
          {/* If there's a distance, show it */}
          {job.distance !== undefined && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({job.distance.toFixed(1)} km unna)
            </span>
          )}
        </div>

        {/* Date */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <FiCalendar className="h-4 w-4 flex-shrink-0" />
          <span>{`Planlagt tidspunkt: ${formatDate(job.scheduled_at)}`}</span>
        </div>
      </div>

      {/* Posted by (job.user) section */}
      <Link href={`/portal/profil/${job.user.id}`}>
        <div className="mt-4 flex items-center gap-3 border-t border-gray-200 pt-3 dark:border-gray-700">
          {/* If there's an image, display it; else, show an icon */}
          {job.user.image ? (
            <Image
              src={
                typeof job.user.image === 'string'
                  ? `${process.env.NEXT_PUBLIC_ASSETS_URL}${job.user.image}`
                  : job.user.image?.id
                    ? `${process.env.NEXT_PUBLIC_ASSETS_URL}${job.user.image.id}`
                    : '/fallback.jpg'
              }
              alt={job.user.name}
              width={36}
              height={36}
              className="h-9 w-9 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-gray-600 transition-colors hover:text-primary dark:bg-gray-700 dark:text-gray-300">
              <FiUser className="h-5 w-5" />
            </div>
          )}

          <div className="flex flex-col text-sm">
            <span className="font-medium text-gray-800 transition-colors hover:text-primary dark:text-gray-200">
              {job.user.name}
            </span>
            <span className="flex items-center gap-1 text-gray-600 transition-colors hover:text-primary dark:text-gray-400">
              <FiMail className="h-4 w-4" />
              {job.user.email}
            </span>
          </div>
        </div>
      </Link>

      {/* Action Buttons */}
      {isEmployerView && onEdit && onDelete ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => onEdit(job)}
            className="rounded-full bg-blue-500 px-5 py-2 text-sm font-semibold text-white shadow transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Rediger
          </button>
          <button
            onClick={() => onDelete(job)}
            className="rounded-full bg-red-500 px-5 py-2 text-sm font-semibold text-white shadow transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Slett
          </button>
        </div>
      ) : (
        !isEmployerView && (
          <div className="mt-6">
            <Link
              href={`/portal/stillinger/${job.slug}`}
              className="hover:bg-primary-dark inline-flex items-center rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white shadow transition-colors focus:outline-none focus:ring-2 focus:ring-primary dark:shadow-button-dark"
            >
              Søk på denne jobben
            </Link>
          </div>
        )
      )}
    </div>
  );
};

export default JobItem;
