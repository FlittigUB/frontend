// components/FAQComponent.tsx

import BeaverHero from '@/components/common/BeaverHero';
import NavbarLayout from '@/components/NavbarLayout';
import FAQItem from '@/components/common/faq/FAQItem'; // Client Component

interface FAQ {
  question: string;
  answer: string;
}

const FAQComponent = async () => {
  // Determine the API URL based on environment variables
  const API_URL = process.env.API_URL
    ? `${process.env.API_URL}/faqs`
    : 'http://flittig-backend:3003/faqs'; // Internal Docker network URL

  let faqs: FAQ[] = [];
  let error: string | null = null;

  try {
    const response = await fetch(API_URL, {
      // Cache the response and revalidate every 60 seconds
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    faqs = await response.json();
  } catch (err) {
    console.error('Error fetching FAQs:', err);
    error = 'Failed to load FAQs. Please try again later.';
  }

  return (
    <NavbarLayout>
      <div className="bg-background">
        <BeaverHero
          title="Ofte stilte spørsmål"
          subtitle="For deg som ikke har alle svarene"
        />
        <div className="mx-auto max-w-3xl p-16">
          {error ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <FAQItem key={index} faq={faq} />
              ))}
            </div>
          )}
        </div>
      </div>
    </NavbarLayout>
  );
};

export default FAQComponent;
