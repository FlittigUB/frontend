// app/portal/stillinger/[slug]/PaymentFormWrapper.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "./PaymentForm";
import axios from "axios";
import { toast } from "sonner";
import { useAuthContext } from "@/context/AuthContext";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface PaymentFormWrapperProps {
  applicationId: string;
  amount: number;
  onPaymentSuccess: () => void;
  onClose: () => void;
}

const PaymentFormWrapper: React.FC<PaymentFormWrapperProps> = ({
                                                                 applicationId,
                                                                 amount,
                                                                 onPaymentSuccess,
                                                                 onClose,
                                                               }) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const { token } = useAuthContext();

  useEffect(() => {
    // Create a new PaymentIntent tied to this application.
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/stripe/create-payment-intent-to-connect`,
        { applicationId, amount },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        const cs = res.data.client_secret;
        if (cs) {
          setClientSecret(cs);
        } else {
          toast.error("Failed to get client secret");
        }
      })
      .catch((err) => {
        toast.error(
          err.response?.data?.message ||
          err.message ||
          "Error creating PaymentIntent"
        );
      });
  }, [applicationId, amount, token]);

  if (!clientSecret) {
    return <div>Loading payment details...</div>;
  }

  const options = { clientSecret };

  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentForm
        isOpen={true}
        onClose={onClose}
        clientSecret={clientSecret}
        onPaymentSuccess={onPaymentSuccess}
      />
    </Elements>
  );
};

export default PaymentFormWrapper;
