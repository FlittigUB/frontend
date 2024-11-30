'use client';

import React, { useState, useEffect } from 'react';
import JobList from '@/components/portal/v1/JobList';
import { Job } from '@/common/types';
import PortalLayout from '@/components/portal/v1/PortalLayout';

const ArbeidsgiverHomePage: React.FC = () => {
  const [publishedJobs, setPublishedJobs] = useState<Job[]>([]);

  useEffect(() => {
    // Fetch published jobs from your API or data source
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
      <h1 className="mb-4 text-3xl font-bold text-[#000000]">Dine Publiserte Jobber</h1>
      <p className="mb-6 text-[#333333]">
        Her ser du en oversikt over alle jobbene du har publisert.
      </p>

      {/* Søkelinje */}
      <input
        type="text"
        placeholder="Søk gjennom dine jobber..."
        className="mb-6 w-full rounded-lg border-2 border-black bg-white p-3 text-[#333333] focus:outline-none"
      />

      {/* Publiserte Jobbliste */}
      <JobList jobs={publishedJobs} isEmployerView />
    </PortalLayout>
  );
};

export default ArbeidsgiverHomePage;
