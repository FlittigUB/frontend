// app/portal/stillinger/[slug]/fetchJob.ts
import { Job } from '@/common/types';

/**
 * Fetches job details based on the slug.
 * @param slug - The unique identifier for the job.
 * @returns The job data or null if not found.
 */
export async function fetchJob(slug: string): Promise<Job | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/job/slug/${slug}`, {
      cache: 'no-store', // Adjust caching strategy as needed
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
