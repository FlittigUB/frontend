'use client';

import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

const FAQ = () => {
  const [activeIndexes, setActiveIndexes] = useState<number[]>([]);

  const faqs = [
    {
      question: 'Hvorfor bruke Flittig?',
      answer:
        'Flittig er en unik og ryddig app, slik at du enkelt kan løse dine små/mellomstore jobber. Klippe plenen, male veggen eller gå tur med hunden, her er det uendelige muligheter. Ikke slit med å skaffe hjelp til småjobber, bare last ned Flittig.',
    },
    {
      question: 'Hvordan funker appen?',
      answer:
        'I Flittig legger du ut annonsene på jobbene du skal ha gjort. Hva, hvor og når. Slik kan potensielle arbeidstakere finne de jobbene som passer de best. ',
    },
    {
      question: 'Koster det penger?',
      answer: 'Ja, det er en liten avgift for bruk av plattformen.',
    },
    {
      question: 'Hvem kan bruke appen?',
      answer:
        'Alle over 12. år kan bruke Flittig. Ung eller eldre, her er det plass til alle! Men dersom du er under 18 trenger du foreldre-godkjennelse ved søknader',
    },
    {
      question: 'Må jeg betale skatt? Hvem har ansvaret?',
      answer: 'Skatteetaten-Småjobber og tjenester',
    },
    {
      question: 'Hva skjer om jeg glemmer å møte opp?',
      answer:
        'Avtaler må overholdes. Manglende oppmøte kan føre til dårligere anmeldelser.',
    },
  ];

  const toggleFAQ = (index: number) => {
    if (activeIndexes.includes(index)) {
      setActiveIndexes(activeIndexes.filter((i) => i !== index)); // Close if already active
    } else {
      setActiveIndexes([...activeIndexes, index]); // Open and allow multiple
    }
  };

  return (
    <div className="mx-auto max-w-3xl p-16">
      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isActive = activeIndexes.includes(index);
          return (
            <div
              key={index}
              className={`border p-3 ${
                isActive ? 'bg-gray-100' : 'border-gray-300'
              } rounded-md shadow-sm transition-all duration-300`}
            >
              <button
                onClick={() => toggleFAQ(index)}
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
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  isActive ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-4 py-2 text-gray-800">{faq.answer}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FAQ;
