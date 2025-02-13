'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useAuthContext } from "@/context/AuthContext";

interface MarkJobConfirmedProps {
  applicationId: string;
  onRefresh: () => void;
}

const MarkJobConfirmed: React.FC<MarkJobConfirmedProps> = ({
  applicationId,
  onRefresh,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { token } = useAuthContext();

  // Handler for å bekrefte jobben og fange betalingen (brukes av arbeidsgiver)
  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/applications/${applicationId}/confirm`,{},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success('Jobben er bekreftet og betalingen er gjennomført.');
      onRefresh();
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          'Kunne ikke bekrefte jobben.',
      );
    } finally {
      setSubmitting(false);
      setDialogOpen(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setDialogOpen(true)}>
          Bekreft utført jobb
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bekreft at jobben er utført</DialogTitle>
          <DialogDescription>
            Er du sikker på at du vil bekrefte at jobben er fullført? Dette vil
            gjennomføre betalingen.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="default"
            onClick={handleConfirm}
            disabled={submitting}
          >
            {submitting ? 'Sender…' : 'Bekreft'}
          </Button>
          <Button variant="outline" onClick={() => setDialogOpen(false)}>
            Avbryt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MarkJobConfirmed;
