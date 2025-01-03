// src/app/portal/info/[slug]/page.tsx

import axios from 'axios';
import { Info } from '@/common/types';
import Logo from '@/components/common/Logo';
import { Metadata } from 'next';
import Head from 'next/head';
import NavbarLayout from '@/components/NavbarLayout';

// Define the revalidation time in seconds (e.g., 60 seconds)
export const revalidate = 60; // Revalidate every 60 seconds

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Function to fetch the info data
async function fetchInfo(slug: string): Promise<Info | null> {
  try {
    const response = await axios.get<Info>(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/info/${slug}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Error fetching info:', error);
    return null;
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const info = await fetchInfo((await params).slug);

  if (!info) {
    return {
      title: 'Informasjon ikke funnet | DittFirma',
      description: 'Denne informasjonen ble ikke funnet.',
    };
  }

  return {
    title: `${info.title} | Flittig UB Informasjon`,
    description: info.content?.substring(0, 150) || 'Informasjonsside.',
    openGraph: {
      title: `${info.title} | Flittig UB Informasjon`,
      description: info.content?.substring(0, 150) || 'Informasjonsside.',
    },
  };
}

const InfoPage = async ({ params }: PageProps) => {
  const info = await fetchInfo((await params).slug);

  if (!info) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-10 bg-gray-100">
        <Logo />
        <p className="mt-4 text-xl text-red-500">Informasjonen ble ikke funnet.</p>
      </div>
    );
  }

  return (
    <NavbarLayout>
      <Head>
        <title className="mt-12">{info.title} | Flittig UB</title>
        <meta name="description" content={`Les mer om ${info.title}`} />
      </Head>
      <section className="container w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-background">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold text-primary font-serif">{info.title}</h1>
        </div>
        <div className="prose max-w-3xl mx-auto w-full">
          <div dangerouslySetInnerHTML={{ __html: info.content }} />
        </div>
      </section>
    </NavbarLayout>
  );
};

export default InfoPage;
