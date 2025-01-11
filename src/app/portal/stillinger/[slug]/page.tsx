import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import JobDetailsClient from './JobDetailsClient';

// --- 1) Optionally control revalidation if you want
// This would cause the page to re-generate every X seconds
// For on-demand SSR, you can just omit this or set it to 0
export const revalidate = 0;

// --- 2) Dynamic metadata (server-side)
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    // Minimal fetch for metadata
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/job/slug/${slug}`, {
      cache: 'no-store', // always fetch fresh on each request
    });

    if (!res.ok) {
      return {
        title: 'Stillingsannonse ikke funnet',
        description: 'Denne stillingen finnes ikke eller er slettet.',
      };
    }

    const job = await res.json();

    return {
      title: `Stillingsannonse: ${job.title} | Flittig UB`,
      description:
        job.description?.slice(0, 150) ?? 'Se mer om denne stillingen.',
      openGraph: {
        title: job.title,
        description: job.description?.slice(0, 150),
      },
    };
  } catch {
    // fallback
    return {
      title: 'Ukjent stilling',
      description: 'En feil oppsto under henting av stillingen.',
    };
  }
}

// A helper for server fetching the full job
async function getJobDetails(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/job/slug/${slug}`, {
    // no-store or no-cache for SSR on demand
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return await res.json();
}

// --- 3) The main server component
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // SSR fetch job details
  const job = await getJobDetails(slug);
  if (!job) {
    notFound();
  }

  // Return a simple server-rendered layout that includes the client component
  return <JobDetailsClient job={job} />;
}
