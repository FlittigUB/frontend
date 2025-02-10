"use client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

function useToast() {
  toast.success("Hello World!");
}
export default function ComponentTestingPage() {
  return (
    <>
      <h1>Component Testing Page</h1>
      <Button onClick={useToast}>Toast</Button>
    </>
  );
};
