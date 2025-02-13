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
      toast.error('Stripe har ikke lastet inn ennå.');
      return;
    }

    setSubmitting(true);

    try {
      // Call elements.submit() before confirming payment (as required for deferred payments)
      const submitResult = await elements.submit();
      if (submitResult.error) {
        toast.error(
          submitResult.error.message ||
          'Det oppsto en feil ved innsending av betalingsdetaljer.'
        );
        setSubmitting(false);
        return;
      }

      // Confirm the PaymentIntent using the Payment Element
      const { error } = await stripe.confirmPayment({
        redirect: 'if_required',
        elements,
        clientSecret,
        confirmParams: {
          // Optionally set return_url if needed
        },
      });

      if (error) {
        toast.error(error.message || 'Bekreftelse av betaling mislyktes');
      } else {
        toast.success('Betalingen ble bekreftet!');
        onPaymentSuccess();
        onClose();
      }
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
        err.message ||
        'Bekreftelse av betaling mislyktes'
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
          <DialogTitle>Bekreft betaling</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="my-4 space-y-4">
            {/* Displays the payment method UI based on your PaymentIntent settings */}
            <PaymentElement />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={submitting} variant="default">
              {submitting ? 'Bekrefter…' : 'Bekreft betaling'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentForm;
