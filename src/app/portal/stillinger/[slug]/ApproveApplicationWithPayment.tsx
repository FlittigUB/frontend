// app/portal/stillinger/[slug]/ApproveApplicationWithPayment.tsx
"use client";

import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import PaymentFormWrapper from "./PaymentFormWrapper";
import { useAuthContext } from "@/context/AuthContext";

interface ApproveApplicationWithPaymentProps {
  applicationId: string;
  jobRate: number;
  onRefresh: () => void;
}

const ApproveApplicationWithPayment: React.FC<ApproveApplicationWithPaymentProps> = ({
                                                                                       applicationId,
                                                                                       jobRate,
                                                                                       onRefresh,
                                                                                     }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showPaymentFormWrapper, setShowPaymentFormWrapper] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { token } = useAuthContext();

  const handleApprove = async (settlement: "private" | "in-platform") => {
    setSubmitting(true);
    try {
      // Call the approval endpoint.
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/applications/${applicationId}/approve`,
        { amount: jobRate, settlement },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Application approved successfully");
      if (settlement === "private") {
        // For private settlement, close the dialog and refresh immediately.
        setDialogOpen(false);
        onRefresh();
      } else {
        // For in-platform settlement, close the approval dialog and open the PaymentFormWrapper.
        setDialogOpen(false);
        setShowPaymentFormWrapper(true);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Approval failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" onClick={() => setDialogOpen(true)}>
            Godkjenn
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Application</DialogTitle>
            <DialogDescription>
              Choose the settlement method. Your choice will secure the worker’s payment.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-around my-4">
            <Button
              variant="outline"
              onClick={() => handleApprove("private")}
              disabled={submitting}
            >
              Private Settlement
            </Button>
            <Button
              variant="outline"
              onClick={() => handleApprove("in-platform")}
              disabled={submitting}
            >
              In‑Platform Settlement
            </Button>
          </div>
          <DialogFooter>
            <Button onClick={() => setDialogOpen(false)} variant="secondary">
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showPaymentFormWrapper && (
        <PaymentFormWrapper
          applicationId={applicationId}
          amount={jobRate}
          onPaymentSuccess={() => {
            onRefresh();
            setShowPaymentFormWrapper(false);
          }}
          onClose={() => setShowPaymentFormWrapper(false)}
        />
      )}
    </>
  );
};

export default ApproveApplicationWithPayment;
