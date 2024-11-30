// components/portal/v2/JobItem.tsx

import React from 'react';
import Link from 'next/link';
import { Job } from '@/common/types';

interface JobItemProps {
  job: Job;
  isEmployerView?: boolean;
}

const JobItem: React.FC<JobItemProps> = ({ job, isEmployerView = false }) => {
  return (
    <div className="rounded-xl bg-background p-6 text-foreground shadow-neumorphic dark:bg-background-dark dark:text-foreground-dark dark:shadow-neumorphic-dark">
      <h2 className="text-2xl font-semibold">{job.title}</h2>
      <p className="mt-2">{job.description}</p>
      <p className="mt-1 text-sm text-gray-600">
        Sted: {job.place} | Tilgjengelig fra: {new Date(job.dateAccessible || '').toLocaleDateString('nb-NO')}
      </p>

      {/* Action Buttons */}
      {isEmployerView ? (
        <div className="mt-4 flex space-x-2">
          <Link href={`/portal/arbeidsgiver/rediger-jobb/${job.id}`}>
            <button className="rounded-full bg-blue-500 px-4 py-2 text-white shadow-button hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Rediger
            </button>
          </Link>
          <button className="rounded-full bg-red-500 px-4 py-2 text-white shadow-button hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500">
            Slett
          </button>
        </div>
      ) : (
        <Link href={`/app/soknad/${job.id}`}>
          <button className="mt-4 rounded-full bg-primary px-6 py-2 text-white shadow-button hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary dark:shadow-button-dark">
            Søk på denne jobben
          </button>
        </Link>
      )}
    </div>
  );
};

export default JobItem;
