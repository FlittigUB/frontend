// app/portal/stillinger/[slug]/MarkJobFinished.tsx
'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  DialogChat,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialogChat';
import PaymentForm from './PaymentForm';

interface MarkJobFinishedProps {
  applicationId: string;
  paymentIntentId?: string; // if in‑platform settlement is available
  clientSecret: string;
  onRefresh: () => void;
}

const MarkJobFinished: React.FC<MarkJobFinishedProps> = ({
  applicationId,
  paymentIntentId,
  clientSecret,
  onRefresh,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // This handler calls the backend to mark the job as finished.
  const handleFinish = async (settlement: 'private' | 'in-platform') => {
    setSubmitting(true);
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/applications/${applicationId}/finish`,
      );
      toast.success('Job marked as finished');
      onRefresh();
      if (settlement === 'in-platform') {
        if (!paymentIntentId) {
          toast.error(
            'Payment Intent not available for in‑platform settlement',
          );
        } else {
          setPaymentModalOpen(true);
        }
      }
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          'Failed to mark as finished',
      );
    } finally {
      setSubmitting(false);
      setDialogOpen(false);
    }
  };

  return (
    <>
      <DialogChat open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" onClick={() => setDialogOpen(true)}>
            Mark as Finished
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark Job as Finished</DialogTitle>
            <DialogDescription>
              Choose your settlement method:
            </DialogDescription>
          </DialogHeader>
          <div className="my-4 flex justify-around">
            <Button
              variant="outline"
              onClick={() => handleFinish('private')}
              disabled={submitting}
            >
              Private Settlement
            </Button>
            <Button
              variant="outline"
              onClick={() => handleFinish('in-platform')}
              disabled={submitting}
            >
              In‑Platform Settlement
            </Button>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogChat>

      {paymentIntentId && (
        <PaymentForm
          isOpen={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          paymentIntentId={paymentIntentId}
          onPaymentSuccess={onRefresh}
          clientSecret={clientSecret}
        />
      )}
    </>
  );
};

export default MarkJobFinished;
