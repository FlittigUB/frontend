"use client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Onboarding from "@/components/portal/ui/Onboarding";

function useToast() {
  toast.success("Hello World!");
}
export default function ComponentTestingPage() {
  return (
    <>
      <h1>Component Testing Page</h1>
      <Onboarding/>
    </>
  );
};
