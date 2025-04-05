// Mark this file as a Server Component (default in Next.js App directory)
import axios from 'axios';
import { Article } from '@/common/types';
import Logo from '@/components/common/Logo';
import { Metadata } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import NavbarLayout from '@/components/NavbarLayout';
import Image from 'next/image';
import VisualEditorInitializer from '@/components/VisualEditorInitializer';


interface PageProps {
  params: Promise<{ slug: string }>;
}

// Fetch the article data from Directus
async function fetchArticle(slug: string): Promise<Article | null> {
  try {
    const response = await axios.get<Article>(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/article/${slug}`,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    return response.data;
  } catch (error: any) {
    console.error('Error fetching article:', error);
    return null;
  }
}

// Generate metadata for SEO and social sharing
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const article = await fetchArticle((await params).slug);
  if (!article) {
    return {
      title: 'Artikkel ikke funnet | Flittig UB',
      description: 'Denne artikkelen ble ikke funnet.',
    };
  }
  return {
    title: `${article.title} | Flittig UB Artikkel`,
    description:
      article.description ||
      article.content?.substring(0, 150) ||
      'Artikkelside.',
    openGraph: {
      title: `${article.title} | Flittig UB Artikkel`,
      description:
        article.description ||
        article.content?.substring(0, 150) ||
        'Artikkelside.',
      images: article.image
        ? [
            {
              url: article.image,
              width: 1200,
              height: 630,
              alt: article.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: article.image ? 'summary_large_image' : 'summary',
      title: `${article.title} | Flittig UB Artikkel`,
      description:
        article.description ||
        article.content?.substring(0, 150) ||
        'Artikkelside.',
      images: article.image ? [article.image] : undefined,
    },
  };
}

const VisualEditorArticlePage = async ({ params }: PageProps) => {
  const slug = (await params).slug;
  const article = await fetchArticle(slug);

  if (!article) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6">
        <Logo />
        <div className="mt-8 rounded bg-white p-8 text-center shadow-md">
          <p className="mb-4 text-xl text-red-600">Artikkel ble ikke funnet.</p>
          <Link href="/" className="text-blue-600 hover:underline">
            Gå tilbake til hjem
          </Link>
        </div>
      </div>
    );
  }

  // JSON-LD structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    image: article.image ? [article.image] : undefined,
    datePublished: article.date_created,
    dateModified: article.date_updated,
    author: {
      '@type': 'Person',
      name: article.author || 'Unknown',
    },
    description:
      article.description || article.content?.substring(0, 150) || '',
  };

  return (
    <NavbarLayout>
      <Head>
        <title>{article.title} | Flittig UB</title>
        <meta
          name="description"
          content={article.description || `Les mer om ${article.title}`}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {/* Load the Directus Visual Editor Frontend Library */}
        <script
          src="https://panel.flittigub.no/visual-editor.js"
          async
        ></script>
      </Head>

      {/* Include our client-side initializer to boot the Visual Editor */}
      <VisualEditorInitializer />

      {/* Main container marked as editable */}
      <div
        className="min-h-screen bg-gray-50 text-gray-800"
        data-directus-editable="true"
        data-directus-slug={slug}
      >
        {/* Featured image with an editable marker */}
        {article.image && (
          <div
            className="relative h-72 w-full overflow-hidden md:h-96"
            data-directus-field="image"
          >
            <Image
              src={process.env.NEXT_PUBLIC_ASSETS_URL + article.image}
              alt={article.title}
              fill
              priority
              className="object-cover object-center"
            />
          </div>
        )}

        {/* Main content container */}
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Title & meta info with editable marker */}
          <div className="mb-8 text-center" data-directus-field="title">
            <h1 className="mb-2 font-serif text-3xl font-bold text-gray-900 md:text-5xl">
              {article.title}
            </h1>
            <p className="text-sm text-gray-500 md:text-base">
              Skrevet av {article.author || 'Ukjent'} den{' '}
              {new Date(article.date_created).toLocaleDateString('no-NO', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          {/* Article content marked as editable */}
          <article
            className="prose prose-lg prose-gray mx-auto max-w-none leading-relaxed"
            data-directus-field="content"
          >
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </article>

          {/* Back link */}
          <div className="mt-12 text-center">
            <Link
              href="/"
              className="inline-block rounded border border-blue-600 px-6 py-3 text-blue-600 transition hover:bg-blue-600 hover:text-white"
            >
              Tilbake til hjemmeside
            </Link>
          </div>
        </div>
      </div>
    </NavbarLayout>
  );
};

export default VisualEditorArticlePage;
