"use client";

import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "./PaymentForm";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentModalProps {
  clientSecret: string;
  onPaymentSuccess: () => void;
  onClose: () => void;
  isOpen?: boolean;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
                                                     clientSecret,
                                                     onPaymentSuccess,
                                                     onClose,
                                                     isOpen = true
                                                   }) => {
  const options = { clientSecret };
  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentForm
        isOpen={isOpen}
        onClose={onClose}
        clientSecret={clientSecret}
        onPaymentSuccess={onPaymentSuccess}
      />
    </Elements>
  );
};

export default PaymentModal;
