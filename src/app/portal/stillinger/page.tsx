// app/portal/stillinger/page.tsx
import { Job } from '@/common/types';
import SearchClient from '@/components/portal/job/SearchClient';
import Link from 'next/link';

// Force dynamic rendering if needed (e.g. reading cookies)
export const dynamic = 'force-dynamic';

export default async function StillingerPage() {
  let jobs: Job[] = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/job/all`, {
      // Revalidate or force dynamic fetch
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch jobs');
    }
    jobs = await res.json();
  } catch (error) {
    console.error('Error fetching jobs:', error);
  }

  // Render a server component for layout + pass data to a client component
  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="my-4 text-3xl font-bold">Tilgjengelige jobber</h1>
      <p className="mb-6">Her kan du se tilgjengelige jobber nær deg.</p>
      <Link
        className="bg-green-500 hover:bg-green-600 mb-4 inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold text-white shadow transition-colors focus:outline-none focus:ring-2"
        href={'/portal/stillinger/kart'}
      >
        Se på kart
      </Link>

      {/*
        SearchClient is a small client component that:
        - Manages search state
        - Filters the 'jobs' array
        - Renders the JobList
      */}
      <SearchClient jobs={jobs} />
    </div>
  );
}
