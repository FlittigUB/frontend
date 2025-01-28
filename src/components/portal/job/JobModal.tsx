// src/components/portal/job/JobModal.tsx
"use client";

import React, { useCallback, useState, useEffect } from "react";
import { Category, JobFormData } from "@/common/types";
import AddressSearch from "./AddressSearch";
import {
  FaArrowRight,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaList,
  FaDollarSign,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

// Import format from date-fns
import { format } from "date-fns";
// Import Norwegian locale from date-fns
import { nb } from "date-fns/locale";

interface JobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  formData: JobFormData;
  categories: Category[];
  handleInputChange: (
    e: React.ChangeEvent<
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement
    >
  ) => void;
  error: string;
  isEdit?: boolean;
  isSubmitting: boolean;
}

interface NominatimAddress {
  house_number?: string;
  road?: string;
  city?: string;
  county?: string;
  state?: string;
  postcode?: string;
  country?: string;
}

const MAX_DESCRIPTION_LENGTH = 200;

const JobModal: React.FC<JobModalProps> = ({
                                             isOpen,
                                             onClose,
                                             onSubmit,
                                             formData,
                                             categories,
                                             handleInputChange,
                                             error,
                                             isEdit = false,
                                             isSubmitting,
                                           }) => {
  // Steps: 0 => Title & Description, 1 => Address / Position, 2 => Date/Category, 3 => Payment Info
  const [step, setStep] = useState<number>(0);

  // Display lines for the chosen address
  const [selectedAddressLines, setSelectedAddressLines] = useState<
    string[] | null
  >(null);

  // Step-specific error
  const [stepError, setStepError] = useState<string>("");

  // Track description length
  const [descriptionCount, setDescriptionCount] = useState<number>(
    formData.description?.length || 0
  );
  useEffect(() => {
    setDescriptionCount(formData.description?.length || 0);
  }, [formData.description]);

  // Handler from AddressSearch
  const handleSelectLocation = useCallback(
    (
      lat: number,
      lon: number,
      displayName: string,
      addressDetails?: NominatimAddress
    ) => {
      // Update lat/lon in formData
      const latitudeInputEvent = {
        target: { name: "latitude", value: lat },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleInputChange(latitudeInputEvent);

      const longitudeInputEvent = {
        target: { name: "longitude", value: lon },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleInputChange(longitudeInputEvent);

      if (addressDetails) {
        const lines: string[] = [
          addressDetails.road,
          addressDetails.city,
          addressDetails.county,
          addressDetails.state,
          addressDetails.postcode,
          addressDetails.country,
        ].filter(Boolean) as string[];
        setSelectedAddressLines(lines.length ? lines : [displayName]);
      } else {
        const splitted = displayName.split(",").map((s) => s.trim());
        setSelectedAddressLines(splitted);
      }
    },
    [handleInputChange]
  );

  // “Bruk min nåværende posisjon”
  const handleUseMyLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert("Geolokasjon er ikke støttet i denne nettleseren.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const latitudeInputEvent = {
          target: { name: "latitude", value: pos.coords.latitude },
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        handleInputChange(latitudeInputEvent);

        const longitudeInputEvent = {
          target: { name: "longitude", value: pos.coords.longitude },
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        handleInputChange(longitudeInputEvent);

        setSelectedAddressLines(["Nåværende posisjon"]);
      },
      (err) => {
        console.error("Error fetching geolocation:", err);
        alert("Kunne ikke hente posisjon. Sjekk at du har gitt tillatelse.");
      }
    );
  }, [handleInputChange]);

  // If modal is not open, return null
  if (!isOpen) return null;

  const stepLabels = [
    "Grunnleggende Info",
    "Posisjon",
    "Detaljer",
    "Betalingsinformasjon",
  ];
  const progressPercent = ((step + 1) / stepLabels.length) * 100;

  // Define icons for each step
  const stepIcons = [
    <FaInfoCircle key="icon-0" />, // Grunnleggende Info
    <FaMapMarkerAlt key="icon-1" />, // Posisjon
    <FaList key="icon-2" />, // Detaljer
    <FaDollarSign key="icon-3" />, // Betalingsinformasjon
  ];

  // Validate fields per step
  const validateStep = (currentStep: number): boolean => {
    if (currentStep === 0) {
      if (!formData.title?.trim()) {
        setStepError("Tittel er påkrevd.");
        return false;
      }
      if (!formData.description?.trim()) {
        setStepError("Beskrivelse er påkrevd.");
        return false;
      }
      if (formData.description.length > MAX_DESCRIPTION_LENGTH) {
        setStepError(
          `Beskrivelse kan ikke overstige ${MAX_DESCRIPTION_LENGTH} tegn.`
        );
        return false;
      }
    } else if (currentStep === 1) {
      if (!formData.latitude || !formData.longitude) {
        setStepError("Posisjon er påkrevd.");
        return false;
      }
    } else if (currentStep === 2) {
      if (!formData.scheduled_at) {
        setStepError("Tilgjengelig dato er påkrevd.");
        return false;
      }
      if (!formData.category) {
        setStepError("Kategori er påkrevd.");
        return false;
      }
    } else if (currentStep === 3) {
      if (
        formData.rate === undefined ||
        formData.rate === null ||
        formData.rate === 0
      ) {
        setStepError("Honorar er påkrevd.");
        return false;
      }
      if (!formData.payment_type) {
        setStepError("Betalingstype er påkrevd.");
        return false;
      }
      // Remove condition for hours_estimated based on payment_type
      // Now, it's always optional
    }
    setStepError("");
    return true;
  };

  // Step navigation
  const nextStep = () => {
    if (!validateStep(step)) return;
    setStep((prev) => Math.min(prev + 1, stepLabels.length - 1));
  };
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  // Submit
  const handleFormSubmit = async (e: React.FormEvent) => {
    if (step < stepLabels.length - 1) {
      e.preventDefault();
      nextStep();
    } else {
      // validate final step if needed
      if (!validateStep(step)) {
        e.preventDefault();
        return;
      }
      await onSubmit(e);
    }
  };

  // Define selectedDate and handleDateChange
  const selectedDate = formData.scheduled_at
    ? new Date(formData.scheduled_at)
    : undefined;

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      const event = {
        target: { name: "scheduled_at", value: date.toISOString() },
      } as React.ChangeEvent<HTMLInputElement>;
      handleInputChange(event);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>{isEdit ? "Rediger Jobb" : "Opprett Ny Jobb"}</CardTitle>
          {error && (
            <CardDescription className="text-red-500">{error}</CardDescription>
          )}
        </CardHeader>

        {/* Progress Bar */}
        <CardContent>
          <Progress value={progressPercent} className="mb-4" />
          {/* Step Labels */}
          <div className="mb-6 flex items-center justify-between text-sm">
            {stepLabels.map((label, index) => {
              const isActive = index === step;
              const isCompleted = index < step;
              return (
                <div
                  key={index}
                  className={`flex flex-col items-center text-center ${
                    isActive ? "font-semibold text-primary" : "text-gray-400"
                  } ${isCompleted ? "opacity-70" : ""}`}
                >
                  {isActive ? (
                    <span>{label}</span>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                        {stepIcons[index]}
                      </div>
                      <span className="mt-1">{index + 1}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {stepError && (
            <Alert variant="destructive" className="mb-4">
              {stepError}
            </Alert>
          )}

          <form onSubmit={handleFormSubmit} noValidate>
            {/* STEP 0 */}
            {step === 0 && (
              <>
                <div className="mb-4">
                  <Label htmlFor="title">
                    Tittel <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    name="title"
                    placeholder="Skriv inn tittel"
                    value={formData.title || ""}
                    onChange={handleInputChange}
                    required
                    aria-required="true"
                  />
                </div>

                <div className="mb-4">
                  <Label htmlFor="description">
                    Beskrivelse <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="description"
                    name="description"
                    placeholder="Skriv en kort beskrivelse"
                    value={formData.description || ""}
                    onChange={handleInputChange}
                    required
                    maxLength={MAX_DESCRIPTION_LENGTH}
                    className="resize-none"
                    aria-required="true"
                  />
                  <div className="mt-1 text-right text-sm text-gray-500 dark:text-gray-400">
                    {descriptionCount}/{MAX_DESCRIPTION_LENGTH}
                  </div>
                </div>
              </>
            )}

            {/* STEP 1 */}
            {step === 1 && (
              <>
                <div className="mb-4">
                  <Label>Søk etter adresse</Label>
                  <AddressSearch onSelectLocation={handleSelectLocation} />

                  {selectedAddressLines && (
                    <div className="mt-4 rounded-md border border-primary bg-primary bg-opacity-10 p-3">
                      <h4 className="mb-1 font-semibold text-primary">
                        Valgt posisjon/område
                      </h4>
                      {selectedAddressLines.map((line, idx) => (
                        <p
                          key={idx}
                          className="text-gray-700 dark:text-gray-200"
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  )}

                  <div className="mt-3">
                    <Button
                      type="button"
                      onClick={handleUseMyLocation}
                      variant="default"
                      className="inline-flex items-center"
                      disabled={isSubmitting}
                    >
                      <FaMapMarkerAlt className="mr-2" aria-hidden="true" />
                      Bruk min nåværende posisjon
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <>
                <div className="mb-4">
                  <Label htmlFor="scheduled_at">
                    Planlagt dato <span className="text-red-500">*</span>
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="scheduled_at"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                        aria-required="true"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? (
                          format(selectedDate, "PPP", { locale: nb })
                        ) : (
                          <span>Velg en dato</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="mb-4">
                  <Label htmlFor="category">
                    Kategori <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    onValueChange={(value) => {
                      const event = {
                        target: { name: "category", value },
                      } as unknown as React.ChangeEvent<HTMLSelectElement>;
                      handleInputChange(event);
                    }}
                    value={formData.category || undefined}
                    aria-label="Kategori"
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Velg en kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="mb-4 flex items-center">
                  <Checkbox
                    id="email_notifications"
                    name="email_notifications"
                    checked={formData.email_notifications || false}
                    onCheckedChange={(checked) => {
                      const event = {
                        target: { name: "email_notifications", value: checked },
                      } as unknown as React.ChangeEvent<HTMLInputElement>;
                      handleInputChange(event);
                    }}
                  />
                  <Label htmlFor="email_notifications" className="ml-2">
                    Få e-postvarsel ved nye søknader?
                  </Label>
                </div>
              </>
            )}

            {/* STEP 3 - Payment Information */}
            {step === 3 && (
              <>
                <div className="mb-4">
                  <Label htmlFor="rate">
                    Sats (NOK) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="rate"
                    type="number"
                    name="rate"
                    placeholder="Skriv inn sats"
                    value={
                      formData.rate !== undefined && formData.rate !== null
                        ? formData.rate
                        : ""
                    }
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    aria-required="true"
                  />
                </div>

                <div className="mb-4">
                  <Label htmlFor="payment_type">
                    Betalingstype <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    onValueChange={(value) => {
                      const event = {
                        target: { name: "payment_type", value },
                      } as unknown as React.ChangeEvent<HTMLSelectElement>;
                      handleInputChange(event);
                    }}
                    value={formData.payment_type || undefined}
                    aria-label="Betalingstype"
                  >
                    <SelectTrigger id="payment_type">
                      <SelectValue placeholder="Velg en betalingstype" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fast</SelectItem>
                      <SelectItem value="hourly">Timebasert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="mb-4">
                  <Label htmlFor="hours_estimated">Estimerte Timer</Label>
                  <Input
                    id="hours_estimated"
                    type="number"
                    name="hours_estimated"
                    placeholder="Skriv inn estimerte timer"
                    value={
                      formData.hours_estimated !== undefined &&
                      formData.hours_estimated !== null
                        ? formData.hours_estimated
                        : ""
                    }
                    onChange={handleInputChange}
                    min="1"
                  />
                </div>
              </>
            )}

            {/* Step Navigation */}
            <div className="mt-6 flex justify-between space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (step === 0) {
                    onClose();
                  } else {
                    prevStep();
                  }
                }}
                disabled={isSubmitting}
                aria-label={
                  step === 0 ? "Avbryt" : "Gå tilbake til forrige steg"
                }
              >
                {step === 0 ? "Avbryt" : "Tilbake"}
              </Button>

              <Button
                type="submit"
                variant="default"
                disabled={isSubmitting}
                aria-label={
                  step < stepLabels.length - 1 ? "Neste steg" : "Send inn"
                }
              >
                {step < stepLabels.length - 1 ? (
                  <>
                    Neste
                    <FaArrowRight className="ml-2" aria-hidden="true" />
                  </>
                ) : isSubmitting ? (
                  "Lagrer..."
                ) : isEdit ? (
                  "Oppdater"
                ) : (
                  "Opprett"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter />
      </Card>
    </div>
  );
};

export default JobModal;
