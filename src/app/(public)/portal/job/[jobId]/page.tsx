// app/(public)/portal/job/[jobId]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation'; // if job not found
import axios from 'axios';
import ClientJobDetails from './ClientJob'; // The client component

// 1) DYNAMIC METADATA FOR SEO
export async function generateMetadata({
  params,
}: {
  params: { jobId: string };
}): Promise<Metadata> {
  const { jobId } = params;

  try {
    // Server-side fetch (no auth needed) for job details
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/job/${jobId}`, {
      // 'no-cache' or 'no-store' to ensure fresh data if you want
      cache: 'no-cache',
    });
    if (!res.ok) {
      return {
        title: 'Job not found',
        description: 'Could not find this job listing.',
      };
    }

    const job = await res.json();
    return {
      title: `Stillingsannonse: ${job.title} | MyApp`,
      description:
        job.description?.slice(0, 150) || 'Se mer om denne stillingen.',
      openGraph: {
        title: job.title,
        description: job.description?.slice(0, 150),
      },
      // Add additional SEO fields if needed
    };
  } catch {
    // fallback
    return {
      title: 'Ukjent stilling',
      description: 'En feil oppsto under henting av stilling.',
    };
  }
}

// 2) SERVER COMPONENT
export default async function PublicJobPage({
  params,
}: {
  params: { jobId: string };
}) {
  const { jobId } = params;

  // SERVER fetch job details
  let job = null;
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/job/${jobId}`,
    );
    job = res.data;
  } catch {
    // job not found or API error
    notFound(); // or handle gracefully
  }

  // If no job, show 404 or fallback
  if (!job) {
    notFound();
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-gray-50 px-4 py-10">
      {/*
        We pass the job details into our client component.
        The client component can handle "Apply" logic, toasts,
        and optional user state from AuthContext.
      */}
      <ClientJobDetails job={job} />
    </main>
  );
}
