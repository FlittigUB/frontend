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
import PaymentModal from "./PaymentModal";
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
  const [submitting, setSubmitting] = useState(false);
  const [paymentClientSecret, setPaymentClientSecret] = useState<string | null>(null);
  const { token } = useAuthContext();

  const handleApprove = async (settlement: "private" | "in-platform") => {
    setSubmitting(true);
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/applications/${applicationId}/approve`,
        { amount: jobRate, settlement },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (settlement === "private") {
        toast.success("Søknaden ble godkjent!");
        setDialogOpen(false);
        onRefresh();
      } else {
        // For in‑platform settlement: hent clientSecret fra backend
        const data = response.data;
        if (data.clientSecret) {
          toast.info("Søknaden ble godkjent. Vennligst fullfør betalingen.");
          setDialogOpen(false);
          setPaymentClientSecret(data.clientSecret);
        } else {
          toast.error("Klarte ikke å hente betalingsdetaljer.");
        }
      }
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
        err.message ||
        "Godkjenning mislyktes"
      );
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
            <DialogTitle>Godkjenn søknad</DialogTitle>
            <DialogDescription>
              Velg betalingsmåte. Ditt valg vil sikre at arbeidstakeren får sin betaling.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-around my-4">
            <Button
              variant="outline"
              onClick={() => handleApprove("private")}
              disabled={submitting}
            >
              Privat oppgjør
            </Button>
            <Button
              variant="outline"
              onClick={() => handleApprove("in-platform")}
              disabled={submitting}
            >
              Plattformoppgjør
            </Button>
          </div>
          <DialogFooter>
            <Button onClick={() => setDialogOpen(false)} variant="secondary">
              Avbryt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {paymentClientSecret && (
        <PaymentModal
          isOpen={true}
          clientSecret={paymentClientSecret}
          onPaymentSuccess={() => {
            toast.success("Betalingen ble fullført og søknaden er godkjent!");
            onRefresh();
            setPaymentClientSecret(null);
          }}
          onClose={() => setPaymentClientSecret(null)}
        />
      )}
    </>
  );
};

export default ApproveApplicationWithPayment;
