// app/portal/stillinger/page.tsx
import { Job } from "@/common/types";
import SearchClient from "@/components/portal/job/SearchClient";

// Force dynamic rendering if needed (e.g. reading cookies)
export const dynamic = "force-dynamic";

export default async function StillingerPage() {
  let jobs: Job[] = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/job/all`, {
      // Revalidate or force dynamic fetch
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch jobs");
    }
    jobs = await res.json();
  } catch (error) {
    console.error("Error fetching jobs:", error);
  }

  // Render a server component for layout + pass data to a client component
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="my-4 text-3xl font-bold">Tilgjengelige jobber</h1>
      <p className="mb-6">Her kan du se tilgjengelige jobber nær deg.</p>

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
