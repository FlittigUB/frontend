"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import Image from 'next/image'

export default function Onboarding() {
  const [step, setStep] = useState(1);

  const stepContent = [
    {
      title: "Velkommen til Flittig!",
      description:
        "Flittig er plattformen der du enkelt kan finne småjobber i ditt nærområde. Hjelp andre og tjen penger!",
    },
    {
      title: "Finn oppdrag nær deg",
      description:
        "Utforsk ledige oppdrag innen barnepass, husvask, hagearbeid og mer. Velg det som passer deg best!",
    },
    {
      title: "Bygg tillit og få gode tilbakemeldinger",
      description: "Fullfør oppdragene med godt humør og nøyaktighet – bygg opp et godt rykte og få flere muligheter!",
    },
    {
      title: "Klar til å sette i gang?",
      description:
        "Opprett en profil, søk på oppdrag og bli en del av Flittig-fellesskapet i dag!",
    },
  ];

  const totalSteps = stepContent.length;

  const handleContinue = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) setStep(1);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">Kom i gang</Button>
      </DialogTrigger>
      <DialogContent className="gap-0 p-0 [&>button:last-child]:text-white">
        <div className="p-2">
          <Image
            className="w-full rounded-lg"
            src={`${process.env.NEXT_PUBLIC_ASSETS_URL}77d7252d-b736-45d6-b344-421434c9208f.png`}
            width={500}
            height={300}
            alt="dialog"
          />
        </div>
        <div className="space-y-6 px-6 pb-6 pt-3">
          <DialogHeader>
            <DialogTitle>{stepContent[step - 1].title}</DialogTitle>
            <DialogDescription>{stepContent[step - 1].description}</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex justify-center space-x-1.5 max-sm:order-1">
              {[...Array(totalSteps)].map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "h-1.5 w-1.5 rounded-full bg-primary",
                    index + 1 === step ? "bg-primary" : "opacity-20",
                  )}
                />
              ))}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="ghost">
                  Hopp over
                </Button>
              </DialogClose>
              {step < totalSteps ? (
                <Button className="group" type="button" onClick={handleContinue}>
                  Neste
                  <ArrowRight
                    className="-me-1 ms-2 opacity-60 transition-transform group-hover:translate-x-0.5"
                    size={16}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </Button>
              ) : (
                <DialogClose asChild>
                  <Button type="button">Ferdig</Button>
                </DialogClose>
              )}
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
