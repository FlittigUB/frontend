import React, { createContext, useContext, ReactNode } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// Replace with your actual publishable key
const stripePromise = loadStripe('pk_test_51QSzYSEP3xAKK1gO7vureLSLpN7uRZLIhjwQiWdRR9LUqPwX5x3n7MZjanNM8leXwNu4DJ71ViaJRJD3pa567N2O009wMlAaJ3');

// Define the shape of the context
interface StripeContextProps {
  stripe: Promise<Stripe | null>;
}

// Create the context
const StripeContext = createContext<StripeContextProps | undefined>(undefined);

interface StripeProviderProps {
  children: ReactNode;
}

// StripeProvider wraps the `Elements` provider and supplies the context
export const StripeProvider = ({ children }: StripeProviderProps) => (
  <Elements stripe={stripePromise}>
    <StripeContext.Provider value={{ stripe: stripePromise }}>
      {children}
    </StripeContext.Provider>
  </Elements>
);

// Custom hook to access the Stripe context
export const useStripe = (): StripeContextProps => {
  const context = useContext(StripeContext);
  if (!context) {
    throw new Error('useStripe must be used within a StripeProvider');
  }
  return context;
};
