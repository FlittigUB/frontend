// app/portal/stillinger/[slug]/tjenester/ExtraServicesClient.tsx
'use client';

import React, { useState } from 'react';

interface Service {
  id: number;
  title: string;
  description: string;
  price: number;
  maxAvailable?: number;
  currentAvailable?: number;
}

const services: Service[] = [
  {
    id: 1,
    title: 'Økt Synlighet',
    description: 'Få annonsen din vist til et større publikum over en uke.',
    price: 79,
  },
  {
    id: 2,
    title: 'E-postvarsel',
    description:
      'Varsle interesserte brukere direkte via e-post når annonsen din blir publisert.',
    price: 99,
  },
  {
    id: 3,
    title: 'Premium Banner',
    description:
      'Vis et eksklusivt banner på forsiden i en måned. Begrenset til 3 tilgjengelige bannere!',
    price: 299,
    maxAvailable: 3,
    currentAvailable: 3,
  },
];

const ExtraServicesClient: React.FC = () => {
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);

  const handlePurchase = (service: Service) => {
    if (service.id === 3 && service.currentAvailable === 0) {
      alert('Premium Banner er utsolgt!');
      return;
    }

    setSelectedServices((prev) => {
      if (prev.find((s) => s.id === service.id)) {
        // Hvis tjenesten fjernes, øk tilgjengeligheten
        if (service.currentAvailable) {
          service.currentAvailable += 1;
        }
        return prev.filter((s) => s.id !== service.id);
      }
      // Hvis tjenesten legges til, reduser tilgjengeligheten
      if (service.currentAvailable) {
        service.currentAvailable -= 1;
      }
      return [...prev, service];
    });
  };

  const totalPrice = selectedServices.reduce(
    (total, service) => total + service.price,
    0,
  );

  const handleCheckout = () => {
    // Implement your checkout logic here
    alert(`Total pris: ${totalPrice} NOK\nTakk for ditt kjøp!`);
  };

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="mb-4 text-3xl font-bold">Kjøp ekstra tjenester</h1>
      <p className="mb-6 text-gray-700">
        Her kan du kjøpe ekstra tjenester som fremmer annonsen din og øker
        synligheten.
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <div
            key={service.id}
            className={`rounded-lg border p-6 shadow transition-shadow hover:shadow-lg ${
              selectedServices.find((s) => s.id === service.id)
                ? 'border-blue-500'
                : 'border-gray-200'
            }`}
          >
            <h2 className="mb-2 text-xl font-semibold">{service.title}</h2>
            <p className="mb-4 text-gray-600">{service.description}</p>
            {service.id === 3 && (
              <p className="text-sm text-red-500">
                {service.currentAvailable} av {service.maxAvailable}{' '}
                tilgjengelige
              </p>
            )}
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold">{service.price} NOK</span>
              <button
                onClick={() => handlePurchase(service)}
                className={`rounded px-4 py-2 ${
                  selectedServices.find((s) => s.id === service.id)
                    ? 'bg-red-500 text-white'
                    : service.currentAvailable && service.currentAvailable <= 1
                      ? 'bg-yellow-500 text-black hover:bg-yellow-600'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                } transition-colors`}
              >
                {selectedServices.find((s) => s.id === service.id)
                  ? 'Fjern'
                  : service.currentAvailable && service.currentAvailable <= 1
                    ? 'Kjøp (Få igjen!)'
                    : 'Kjøp'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedServices.length > 0 && (
        <div className="mt-8 border-t p-6">
          <h2 className="mb-4 text-2xl font-semibold">Dine Valgte Tjenester</h2>
          <ul className="mb-4">
            {selectedServices.map((service) => (
              <li key={service.id} className="mb-2 flex justify-between">
                <span>{service.title}</span>
                <span>{service.price} NOK</span>
              </li>
            ))}
          </ul>
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xl font-bold">Total:</span>
            <span className="text-xl font-bold">{totalPrice} NOK</span>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full rounded-lg bg-green-500 py-3 text-white transition-colors hover:bg-green-600"
          >
            Gå til kassen
          </button>
        </div>
      )}
    </div>
  );
};

export default ExtraServicesClient;
