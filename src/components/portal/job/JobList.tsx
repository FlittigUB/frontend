// components/portal/v2/JobList.tsx

import React from 'react';
import { Job } from '@/common/types';
import JobItem from './JobItem';

interface JobListProps {
  jobs: Job[];
  isEmployerView?: boolean;
}

const JobList: React.FC<JobListProps> = ({ jobs, isEmployerView = false }) => {
  if (jobs.length === 0) {
    return (
      <p className="text-center text-gray-500">
        {isEmployerView ? 'Ingen publiserte jobber.' : 'Ingen jobber funnet.'}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <JobItem key={job.id} job={job} isEmployerView={isEmployerView} />
      ))}
    </div>
  );
};

export default JobList;
