'use client';

import React, { useEffect, useState } from 'react';
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'sonner';
import useAuth from '@/hooks/useAuth';

// 1) Load your Stripe publishable key
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    'pk_test_51QSzYSEP3xAKK1gO7vureLSLpN7uRZLIhjwQiWdRR9LUqPwX5x3n7MZjanNM8leXwNu4DJ71ViaJRJD3pa567N2O009wMlAaJ3',
);

interface Service {
  id: number;
  title: string;
  description: string;
  duration: string;
  price: number;
  maxAvailable?: number;
  currentAvailable?: number;
}

const services: Service[] = [
  {
    id: 3,
    title: 'Premium Banner',
    duration: '1 uke',
    description:
      'Vis et eksklusivt banner på forsiden i en måned. Begrenset til 3 tilgjengelige bannere!',
    price: 79,
    maxAvailable: 3,
    currentAvailable: 3,
  },
];

// ----------------------
// CheckoutForm Component
// ----------------------
const CheckoutForm: React.FC<{
  onPaymentSuccess: () => void;
}> = ({ onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError('Stripe has not loaded yet!');
      return;
    }
    setLoading(true);

    // Confirm the payment with PaymentElement
    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    setLoading(false);

    if (stripeError) {
      setError(stripeError.message || 'An error occurred');
      return;
    }

    // If you reach here, payment succeeded.
    onPaymentSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {error && <p className="text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full rounded bg-green-500 py-3 text-white transition-colors hover:bg-green-600 disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Betal'}
      </button>
    </form>
  );
};

// --------------------------
// ExtraServicesClient Component
// --------------------------
const ExtraServicesClient: React.FC = () => {
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const { token } = useAuth();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handlePurchase = (service: Service) => {
    if (service.id === 3 && service.currentAvailable === 0) {
      toast.error('Premium Banner er utsolgt!');
      return;
    }

    setSelectedServices((prev) => {
      // If already added, remove it
      if (prev.find((s) => s.id === service.id)) {
        // restore availability if relevant
        if (service.currentAvailable !== undefined) {
          service.currentAvailable += 1;
        }
        return prev.filter((s) => s.id !== service.id);
      }

      // otherwise add it
      if (service.currentAvailable !== undefined) {
        service.currentAvailable -= 1;
      }
      return [...prev, service];
    });
  };

  const totalPrice = selectedServices.reduce(
    (total, service) => total + service.price,
    0,
  );

  // 2) Whenever totalPrice changes (and is > 0), fetch a new PaymentIntent
  useEffect(() => {
    if (totalPrice === 0) {
      setClientSecret(null);
      return;
    }
    const createPaymentIntent = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/stripe/create-payment-intent`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ amount: totalPrice * 100 }),
          },
        );
        const data = await res.json();

        if (data?.clientSecret) {
          // 3) Store the new clientSecret so <Elements> re-renders
          setClientSecret(data.clientSecret);
        }
      } catch (err) {
        console.error('Failed to create PaymentIntent', err);
      }
    };

    createPaymentIntent();
  }, [token, totalPrice]);

  // Handler for successful payment
  const handlePaymentSuccess = () => {
    toast.success(`Betaling vellykket!`);
    // Perform any post-payment tasks, e.g., calling your API to finalize the order
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
                onClick={
                  () => toast.info('Vi jobber med å utvikle ekstratjenester')
                  //handlePurchase(service)
                }
                className={`rounded px-4 py-2 ${
                  selectedServices.find((s) => s.id === service.id)
                    ? 'bg-red-500 text-white'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                } transition-colors`}
              >
                {selectedServices.find((s) => s.id === service.id)
                  ? 'Fjern'
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

          {/* 4) Use a key on <Elements> to force a fresh mount when clientSecret changes */}
          {clientSecret && (
            <Elements
              key={clientSecret}
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: { theme: 'stripe' },
              }}
            >
              <CheckoutForm onPaymentSuccess={handlePaymentSuccess} />
            </Elements>
          )}
        </div>
      )}
    </div>
  );
};

export default ExtraServicesClient;
