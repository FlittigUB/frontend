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

interface MarkJobFinishedProps {
  applicationId: string;
  onRefresh: () => void;
}

const MarkJobFinished: React.FC<MarkJobFinishedProps> = ({
  applicationId,
  onRefresh,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { token } = useAuthContext();

  // Handler for å markere jobben som ferdig (brukes av arbeidstaker)
  const handleFinish = async () => {
    console.log(token);
    setSubmitting(true);
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/applications/${applicationId}/finish`,{},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success('Jobben er merket som ferdig.');
      onRefresh();
    } catch (err: any) {
      console.error(err);
      toast.error('Kunne ikke markere jobben som ferdig.',
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
          Merk som ferdig
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Merk jobben som ferdig</DialogTitle>
          <DialogDescription>
            Er du sikker på at du vil markere jobben som ferdig? Dette vil
            informere arbeidsgiver om at jobben er utført.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="default"
            onClick={handleFinish}
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

export default MarkJobFinished;
