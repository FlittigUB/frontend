// app/portal/stillinger/[slug]/MarkJobConfirmed.tsx
"use client";

import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DialogChat,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialogChat";

interface MarkJobConfirmedProps {
  applicationId: string;
  onRefresh: () => void;
}

const MarkJobConfirmed: React.FC<MarkJobConfirmedProps> = ({ applicationId, onRefresh }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/applications/${applicationId}/confirm`);
      toast.success("Job confirmed and payment captured");
      onRefresh();
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || err.message || "Failed to confirm job"
      );
    } finally {
      setSubmitting(false);
      setDialogOpen(false);
    }
  };

  return (
    <DialogChat open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setDialogOpen(true)}>
          Mark as Confirmed
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Job Completion</DialogTitle>
          <DialogDescription>
            Are you sure you want to confirm the job completion and capture payment?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="default" onClick={handleConfirm} disabled={submitting}>
            {submitting ? "Confirming…" : "Confirm"}
          </Button>
          <Button variant="outline" onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogChat>
  );
};

export default MarkJobConfirmed;
