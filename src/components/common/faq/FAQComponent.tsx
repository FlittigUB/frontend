// components/FAQComponent.tsx

import BeaverHero from '@/components/common/BeaverHero';
import NavbarLayout from '@/components/NavbarLayout';
import FAQItem from '@/components/common/faq/FAQItem'; // Client Component

interface FAQ {
  question: string;
  answer: string;
}

interface FAQComponentProps {
  faqs: FAQ[];
}

const FAQComponent = async ({ faqs }: FAQComponentProps) => {
  return (
    <NavbarLayout>
      <div className="bg-background">
        <BeaverHero
          title="Ofte stilte spørsmål"
          subtitle="For deg som ikke har alle svarene"
        />
        <div className="mx-auto max-w-3xl p-16">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <FAQItem key={index} faq={faq} />
              ))}
            </div>
        </div>
      </div>
    </NavbarLayout>
  );
};

export default FAQComponent;
