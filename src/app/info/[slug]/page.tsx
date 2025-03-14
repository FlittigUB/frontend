// src/app/portal/info/[slug]/page.tsx

import axios from 'axios';
import { Info } from '@/common/types';
import Logo from '@/components/common/Logo';
import { Metadata } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import NavbarLayout from '@/components/NavbarLayout';

export const revalidate = 300; // Revalidate every 5 minutes

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Fetch the info data
async function fetchInfo(slug: string): Promise<Info | null> {
  try {
    const response = await axios.get<Info>(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/info/${slug}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
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
      title: 'Informasjon ikke funnet | Flittig UB',
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
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6">
        <Logo />
        <div className="mt-8 rounded bg-white p-8 text-center shadow-md">
          <p className="mb-4 text-xl text-red-600">
            Informasjonen ble ikke funnet.
          </p>
          <Link href="/" className="text-blue-600 hover:underline">
            Gå tilbake til hjem
          </Link>
        </div>
      </div>
    );
  }

  return (
    <NavbarLayout>
      <Head>
        <title>{info.title} | Flittig UB</title>
        <meta name="description" content={`Les mer om ${info.title}`} />
      </Head>
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl rounded-lg bg-white p-10 shadow-lg">
          <div className="mb-8 text-center">
            <h1 className="text-5xl font-extrabold text-gray-800">
              {info.title}
            </h1>
          </div>
          <article className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: info.content }} />
          </article>
          <div className="mt-12 text-center">
            <Link
              href="/"
              className="inline-block rounded border border-blue-600 px-6 py-3 text-blue-600 transition hover:bg-blue-600 hover:text-white"
            >
              Tilbake til hjemmeside
            </Link>
          </div>
        </div>
      </section>
    </NavbarLayout>
  );
};

export default InfoPage;
