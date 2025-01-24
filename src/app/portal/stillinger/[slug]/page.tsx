// app/portal/stillinger/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import JobDetailsClient from './JobDetailsClient';
import { fetchJob } from './fetchJob';
import { Job } from '@/common/types';

// Optional: Control revalidation
export const revalidate = 0;

// Dynamic metadata (server-side)
export async function generateMetadata({
                                         params,
                                       }: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const job: Job | null = await fetchJob(slug);

    if (!job) {
      return {
        title: 'Stillingsannonse ikke funnet',
        description: 'Denne stillingen finnes ikke eller er slettet.',
      };
    }

    return {
      title: `Stillingsannonse: ${job.title} | Flittig UB`,
      description: job.description?.slice(0, 150) ?? 'Se mer om denne stillingen.',
      openGraph: {
        title: job.title,
        description: job.description?.slice(0, 150),
      },
    };
  } catch {
    // Fallback metadata
    return {
      title: 'Ukjent stilling',
      description: 'En feil oppsto under henting av stillingen.',
    };
  }
}

// The main server component
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  // Fetch job details server-side
  const job: Job | null = await fetchJob((await params).slug);
  if (!job) notFound();

  // **Do not pass `job` as a prop.**
  // JobDetailsClient will consume `job` via React Context.
  return <JobDetailsClient />;
}
