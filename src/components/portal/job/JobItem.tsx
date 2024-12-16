import React from 'react';
import { Job } from '@/common/types';

interface JobItemProps {
  job: Job;
  isEmployerView?: boolean;
  onEdit?: (job: Job) => void; // Edit handler
  onDelete?: (job: Job) => void; // Delete handler
}

const JobItem: React.FC<JobItemProps> = ({
  job,
  isEmployerView = false,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="dark:bg-background-dark dark:text-foreground-dark rounded-xl bg-background p-6 text-foreground shadow-neumorphic dark:shadow-neumorphic-dark">
      <h2 className="text-2xl font-semibold">{job.title}</h2>
      <p className="mt-2">{job.description}</p>
      <p className="mt-1 text-sm text-gray-600">
        Sted: {job.place} | Tilgjengelig fra:{' '}
        {new Date(j"".date_accessible || '"nb-NO"caleDateString('nb-NO')}
      </p>

      {/* Action Buttons */}
      {isEmployerView && onEdit && onDelete ? (
        <div className="mt-4 flex space-x-2">
          <button
            onClick={() => onEdit(job)}
            className="rounded-full bg-blue-500 px-4 py-2 text-white shadow-button hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Rediger
          </button>
          <button
            onClick={() => onDelete(job)}
            className="rounded-full bg-red-500 px-4 py-2 text-white shadow-button hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Slett
          </button>
        </div>
      ) : (
        !isEmployerView && (
          <button className="hover:bg-primary-dark mt-4 rounded-full bg-primary px-6 py-2 text-white shadow-button focus:outline-none focus:ring-2 focus:ring-primary dark:shadow-button-dark">
            Søk på denne jobben
          </button>
        )
      )}
    </div>
  );
};

export default JobItem;
