// app/portal/arbeidsgiver/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import JobList from '@/components/portal/v2/JobList';
import { Job } from '@/common/types';
import PortalLayout from "@/components/portal/v2/PortalLayout";

const ArbeidsgiverHomePage: React.FC = () => {
  const [publishedJobs, setPublishedJobs] = useState<Job[]>([]);

  useEffect(() => {
    // Fetch published jobs from your API or data source
    // Replace the placeholder data with actual API calls
    const fetchPublishedJobs = async () => {
      const fetchedPublishedJobs: Job[] = [
        {
          id: '101',
          title: 'IT-konsulent',
          description: 'Vi søker en erfaren IT-konsulent til vårt team.',
          place: 'Trondheim',
          dateAccessible: '2024-11-20',
        },
        {
          id: '102',
          title: 'Prosjektleder',
          description: 'Led prosjekt innen bygg og anlegg.',
          place: 'Stavanger',
          dateAccessible: '2024-12-05',
        },
        // Add more published jobs as needed
      ];
      setPublishedJobs(fetchedPublishedJobs);
    };

    fetchPublishedJobs();
  }, []);

  return (
    <PortalLayout>
      <h1 className="mb-4 text-3xl font-bold">Dine Publiserte Jobber</h1>
      <p className="mb-6">
        Her ser du en oversikt over alle jobbene du har publisert.
      </p>

      {/* Søkelinje */}
      <input
        type="text"
        placeholder="Søk gjennom dine jobber..."
        className="shadow-neumorphic dark:bg-background-dark dark:text-foreground-dark dark:shadow-neumorphic-dark mb-6 w-full rounded-lg bg-background p-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
      />

      {/* Publiserte Jobbliste */}
      <JobList jobs={publishedJobs} isEmployerView />
    </PortalLayout>
  );
};

export default ArbeidsgiverHomePage;
