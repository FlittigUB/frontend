// Example snippet for JobDetails.tsx
import React from 'react';
import { Category } from '@/common/types';

interface JobDetailsProps {
  title: string;
  description: string;
  place: string;
  date_accessible: string;
  date_created: string;
  date_updated?: string | null;
  status: string;
  categories: Category[];
}

const JobDetailsComponent: React.FC<JobDetailsProps> = ({
  title,
  description,
  place,
  date_accessible,
  date_created,
  date_updated,
  status,
  categories,
}) => {
  return (
    <div className="mb-8 w-full max-w-md rounded-3xl bg-white p-6 shadow-md">
      <h1 className="mb-4 text-2xl font-bold">{title}</h1>
      <p className="text-gray-700">{description}</p>
      <div className="mt-4">
        <p>
          <strong>Lokasjon:</strong> {place}
        </p>
        <p>
          <strong>Tilgjengelig fra:</strong> {date_accessible}
        </p>
        <p>
          <strong>Opprettet den:</strong>{' '}
          {new Date(date_created).toLocaleDateString()}
        </p>
        {date_updated && (
          <p>
            <strong>Sist oppdatert:</strong>{' '}
            {new Date(date_updated).toLocaleDateString()}
          </p>
        )}
        <p>
          <strong>Status:</strong> {status}
        </p>
        <strong>Kategorier:</strong>
        {categories.map((category) => (
          <p key={category.id}>
            <strong>{category.name}</strong>
          </p>
        ))}
      </div>
    </div>
  );
};

export default JobDetailsComponent;
