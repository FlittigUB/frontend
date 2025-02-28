// app/portal/stillinger/page.tsx
import { Job } from '@/common/types';
import SearchClient from '@/components/portal/job/SearchClient';
import Link from 'next/link';
import PaginationComponent from '@/components/portal/ui/Pagination'; // Adjust the import path as needed

// Force dynamic rendering if needed (e.g., reading cookies)
export const dynamic = 'force-dynamic';


type SearchParams = {
  page?: string;
  limit?: string;
  // Add other search parameters if needed
};

type StillingerPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function StillingerPage({ searchParams }: StillingerPageProps) {
  // Extract and parse query parameters with default values
  const params = await searchParams;
  let currentPage = parseInt(params.page || '1', 10);
  let limit = parseInt(params.limit || '10', 10);

  // Validate query parameters
  if (isNaN(currentPage) || currentPage < 1) currentPage = 1;
  if (isNaN(limit) || limit < 1) limit = 10;

  let jobs: Job[] = [];
  let totalCount = 0;
  let totalPages = 1;

  try {
    // Fetch the total count and jobs in parallel
    const [countRes, jobsRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/job/count`, { cache: 'no-store' }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/job/all?limit=${limit}&page=${currentPage}`, { cache: 'no-store' }),
    ]);

    if (!countRes.ok) {
      throw new Error('Failed to fetch job count');
    }

    if (!jobsRes.ok) {
      throw new Error('Failed to fetch jobs');
    }

    const countData = await countRes.json();
    totalCount = countData.count;

    const jobsData = (await jobsRes.json()).data;
    if (Array.isArray(jobsData)) {
      jobs = jobsData;
    } else if (jobsData.jobs && Array.isArray(jobsData.jobs)) {
      jobs = jobsData.jobs;
    } else {
      throw new Error('Unexpected jobs data format');
    }

    // Calculate total pages
    totalPages = Math.ceil(totalCount / limit);

    // Adjust currentPage if it exceeds totalPages
    if (currentPage > totalPages && totalPages > 0) {
      currentPage = totalPages;
      // Re-fetch jobs with the adjusted page
      const adjustedJobsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/job/all?limit=${limit}&page=${currentPage}`, { cache: 'no-store' });
      if (adjustedJobsRes.ok) {
        const adjustedJobsData = await adjustedJobsRes.json();
        if (Array.isArray(adjustedJobsData)) {
          jobs = adjustedJobsData;
        } else if (adjustedJobsData.jobs && Array.isArray(adjustedJobsData.jobs)) {
          jobs = adjustedJobsData.jobs;
        }
      }
    }
  } catch (error) {
    console.error('Error fetching jobs:', error);
    // Optionally, set jobs to an empty array or handle the error state in the UI
    jobs = [];
  }

  // Recalculate total pages after potential adjustment
  totalPages = Math.ceil(totalCount / limit);

  // If no jobs are available, display a message
  if (totalCount === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-6">
        <h1 className="my-4 text-3xl font-bold">Tilgjengelige jobber</h1>
        <p className="mb-6">Ingen jobber tilgjengelig for øyeblikket.</p>
        <Link
          className="bg-green-500 hover:bg-green-600 mb-4 inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold text-white shadow transition-colors focus:outline-none focus:ring-2"
          href={'/portal/stillinger/kart'}
        >
          Se på kart
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="my-4 text-3xl font-bold">Tilgjengelige jobber</h1>
      <p className="mb-6">Her kan du se tilgjengelige jobber nær deg.</p>
      {/* TODO Fix map
      <Link
        className="bg-green-500 hover:bg-green-600 mb-4 inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold text-white shadow transition-colors focus:outline-none focus:ring-2"
        href={'/portal/stillinger/kart'}
      >
        Se på kart
      </Link>
      */}

      {/*
        SearchClient is a small client component that:
        - Manages search state
        - Filters the 'jobs' array
        - Renders the JobList
      */}
      <SearchClient jobs={jobs} />

      {/* Pagination Component */}
      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        limit={limit}
      />
    </div>
  );
}
