'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { toast } from 'sonner';

interface PaymentFormProps {
  isOpen: boolean;
  onClose: () => void;
  clientSecret: string;
  onPaymentSuccess: () => void;
  paymentIntentId?: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  isOpen,
  onClose,
  clientSecret,
  onPaymentSuccess,
                                                   // eslint-disable-next-line @typescript-eslint/no-unused-vars
  paymentIntentId,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) {
      toast.error('Stripe has not loaded yet.');
      return;
    }

    setSubmitting(true);

    try {
      // Confirm the PaymentIntent using the Payment Element:
      const { error } = await stripe.confirmPayment({
        redirect: 'if_required',
        elements,
        clientSecret,
        // Optionally redirect after success, but for now we won't:
        confirmParams: {
          // return_url: "https://example.com/payment-complete"
        },
      });

      if (error) {
        // If there's an immediate error (e.g., card declined, etc.)
        toast.error(error.message || 'Payment confirmation failed');
      } else {
        // Payment was confirmed with no immediate error
        toast.success('Payment confirmed successfully');
        onPaymentSuccess();
        onClose();
      }
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          'Payment confirmation failed',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Payment</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="my-4 space-y-4">
            {/* This displays payment method UI (card, etc.) based on your PaymentIntent settings */}
            <PaymentElement />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={submitting} variant="default">
              {submitting ? 'Confirming…' : 'Confirm Payment'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentForm;
