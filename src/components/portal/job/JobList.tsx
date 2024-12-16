// components/portal/job/JobList.tsx

import React from 'react';
import { Job } from '@/common/types';
import JobItem from '@/components/portal/job/JobItem';

interface JobListProps {
  jobs: Job[];
  isEmployerView: boolean;
  onEdit?: (job: Job) => void; // Optional edit handler
  onDelete?: (job: Job) => void; // Optional delete handler
}

const JobList: React.FC<JobListProps> = ({
  jobs,
  isEmployerView,
  onEdit,
  onDelete,
}) => {
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
