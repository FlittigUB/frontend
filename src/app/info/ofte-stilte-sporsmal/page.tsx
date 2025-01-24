// app/faqs/page.tsx

import FAQComponent from '@/components/common/faq/FAQComponent';
import { Metadata } from 'next';

// 1. Optionally set up page metadata for basic SEO (title, description, etc.)
export const metadata: Metadata = {
  title: 'Ofte stilte spørsmål | Company Name',
  description: 'Finn svar på de vanligste spørsmålene om våre tjenester.',
};

const FAQPage = async () => {
  // Fetch the FAQs on the server (this step remains as is)
  const faqs = await getFaqsFromAPI(); // you can reuse your existing logic or a helper function

  // 2. Build FAQPage JSON-LD object
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq: { question: string; answer: string }) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      {/* 3. Insert structured data as a script tag */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <FAQComponent faqs={faqs} />
    </>
  );
};

export default FAQPage;

// You can move the fetching logic into a helper if you want:
async function getFaqsFromAPI() {
  const API_URL = process.env.API_URL
    ? `${process.env.API_URL}/faqs`
    : 'http://flittig-backend:3003/faqs';

  const response = await fetch(API_URL, { next: { revalidate: 60 } });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}
