// components/common/faq/FAQItem.tsx
'use client';

import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQItemProps {
  faq: FAQ;
}

const FAQItem = ({ faq }: FAQItemProps) => {
  const [isActive, setIsActive] = useState(false);

  const toggleFAQ = () => {
    setIsActive((prev) => !prev);
  };

  return (
    <div
      className={`border p-3 rounded-md shadow-sm transition-all duration-300 ${
        isActive ? 'bg-gray-100' : 'border-gray-300'
      }`}
    >
      <button
        data-testid="faq-item-button"
        onClick={toggleFAQ}
        className={`flex w-full items-center justify-between px-4 py-2 text-left ${
          isActive ? 'bg-gray-100' : ''
        }`}
      >
        <span
          className={`text-lg font-medium ${
            isActive ? 'text-black' : 'text-gray-700'
          }`}
        >
          {faq.question}
        </span>
        <span
          className={`transform transition-transform duration-300 ${
            isActive ? 'rotate-180' : 'rotate-0'
          }`}
        >
          <FiChevronDown className="h-5 w-5 text-foreground" />
        </span>
      </button>

      {/* Always render the answer container; use CSS to expand/collapse */}
      <div
        data-testid="faq-answer-container"
        className={`
          overflow-hidden transition-all duration-300
          ${isActive ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
        `}
        style={{
          // Alternatively, you could also use display: isActive ? 'block' : 'none'
          // But max-height + opacity transitions can look smoother
        }}
      >
        <div className="px-4 py-2 text-gray-800">
          {faq.answer}
        </div>
      </div>
    </div>
  );
};

export default FAQItem;
