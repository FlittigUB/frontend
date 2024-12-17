import React from 'react';
import { Job } from '@/common/types';
import JobItem from '@/components/portal/job/JobItem';

interface JobListProps {
  jobs: Job[];
  isEmployerView: boolean;
  onEdit?: (job: Job) => void;
  onDelete?: (job: Job) => void;
}

const JobList: React.FC<JobListProps> = ({
  jobs = [],
  isEmployerView,
  onEdit,
  onDelete,
}) => {
  if (!jobs || jobs.length === 0) {
    return <p>Ingen jobber tilgjengelig.</p>;
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <JobItem
          key={job.id}
          job={job}
          isEmployerView={isEmployerView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default JobList;
