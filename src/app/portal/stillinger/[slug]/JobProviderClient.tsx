// app/portal/stillinger/[slug]/JobProviderClient.tsx
'use client';

import React from 'react';
import { JobProvider } from './JobContext';
import { Job } from '@/common/types';

interface JobProviderClientProps {
  job: Job;
  children: React.ReactNode;
}

/**
 * Client component that provides job context to its children.
 */
const JobProviderClient: React.FC<JobProviderClientProps> = ({ job, children }) => {
  return <JobProvider job={job}>{children}</JobProvider>;
};

export default JobProviderClient;
