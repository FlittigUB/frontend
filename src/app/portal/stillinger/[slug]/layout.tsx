// app/portal/stillinger/[slug]/layout.tsx
import React from 'react';
import { notFound } from 'next/navigation';
import { fetchJob } from './fetchJob';
import JobProviderClient from './JobProviderClient';
import { Job } from '@/common/types';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

/**
 * Layout component that fetches job data and provides it to children via context.
 */
const Layout: React.FC<LayoutProps> = async ({ children, params }) => {
  const { slug } = await params;
  const job: Job | null = await fetchJob(slug);

  if (!job) {
    notFound();
  }

  return <JobProviderClient job={job}>{children}</JobProviderClient>;
};

export default Layout;
