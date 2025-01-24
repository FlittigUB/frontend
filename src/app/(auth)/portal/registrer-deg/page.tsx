"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import PersonalInfoForm from "@/components/auth/PersonalInfoForm";
import ProgressIndicator from "@/components/auth/ProgressIndicator";
import RoleSelection from "@/components/auth/RoleSelection";
import ProfileDetailsForm from "@/components/auth/ProfileDetailsForm";
import Logo from "@/components/common/Logo";
import BusinessInfoForm from "@/components/auth/BusinessInfoForm";

export default function Page() {
  const router = useRouter();

  // State variables
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("");
  const [profileType, setProfileType] = useState("");

  // Organization number (used in the updated BusinessInfoForm)
  const [orgNumber, setOrgNumber] = useState("");

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // If profileType or role = 'bedrift' (etc.), we skip birthdate.
    if (profileType === "business" || role === "bedrift" || role === "arbeidsgiver") {
      // Just set a default so there's no empty validation for business
      setBirthdate(new Date(1990, 1, 1).toISOString());
    }
  }, [profileType, role]);

  // Handle role selection
  const handleRoleSelection = (selectedRole: string) => {
    if (selectedRole === "bedrift") {
      // If user explicitly chooses 'bedrift' in your RoleSelection
      setProfileType("business");
      setRole("arbeidsgiver"); // or "bedrift" if that’s your convention
    } else {
      // For individuals or other roles
      setProfileType(selectedRole === "arbeidsgiver" ? "business" : "individual");
      setRole(selectedRole);
    }
    setStep(2);
  };

  // Handle image file selection with validation
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        setError("Kun JPG, PNG og GIF filer er tillatt.");
        return;
      }

      if (file.size > maxSize) {
        setError("Bilde må være mindre enn 5MB.");
        return;
      }

      setImage(file);
      setError("");
    }
  };

  // Email validation
  const isValidEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Handle form submission
  const handleRegister = async () => {
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    // Basic form validations
    if (password !== confirmPassword) {
      setError("Passordene samsvarer ikke!");
      setIsSubmitting(false);
      return;
    }

    if (
      !email ||
      !password ||
      !name ||
      (profileType === "individual" && !birthdate) || // Only required if individual
      !mobile
    ) {
      setError("Vennligst fyll ut alle påkrevde felt.");
      setIsSubmitting(false);
      return;
    }

    if (!isValidEmail(email)) {
      setError("Vennligst oppgi en gyldig epostadresse.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Determine endpoint based on whether it's a business user or not
      const endpoint = profileType === "business" ? "/users/business" : "/users";

      // Prepare form data
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("role", role);
      formData.append("type", profileType);
      formData.append("name", name);

      // If this is an individual user and birthdate is relevant
      if (profileType === "individual" && birthdate) {
        formData.append("birthDate", birthdate); // ISO format
      } else if (profileType === 'business') formData.append("birthDate", new Date(1990, 1, 1).toISOString())

      // Mobile number & optional fields
      formData.append("mobile", mobile);
      formData.append("bio", bio);

      // Only if business, append orgNumber
      if (profileType === "business") {
        formData.append("organization_number", orgNumber);
      }

      // If user uploaded an image
      if (image) {
        formData.append("image", image);
      }

      // Send registration to the correct endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setSuccess("Registrering vellykket! Logger inn...");

        // Log user in after successful registration
        const loginResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        if (loginResponse.ok) {
          const loginData = await loginResponse.json();
          // Store JWT token securely
          localStorage.setItem("token", loginData.access_token);
          // Redirect to /portal
          router.push("/portal");
        } else {
          const loginError = await loginResponse.json();
          setError(loginError.message || "Autentisering mislyktes.");
        }
      } else {
        const registerError = await response.json();
        setError(registerError.message || "En feil oppstod under registreringen.");
      }
    } catch (err) {
      console.error(err);
      setError("Kunne ikke koble til serveren.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Navigation handlers
  const handleNext = () => {
    setStep((prev) => prev + 1);
  };

  // Handle Back navigation
  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  // Handle step click from ProgressIndicator
  const handleStepClick = (clickedStep: number) => {
    // Optionally allow only going backward, or skip ahead if you want
    if (clickedStep <= step) {
      setStep(clickedStep);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 md:py-10 py-20">
      {/* Logo */}
      <div className="mb-8">
        <Logo />
      </div>

      {/* Progress Indicator */}
      <ProgressIndicator
        currentStep={step}
        onStepClick={handleStepClick}
        isDarkMode={false}
        totalSteps={3}
      />

      {/* Step Content */}
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-md">
        {/* Step 1: Choose role */}
        {step === 1 && <RoleSelection onSelectRole={handleRoleSelection} />}

        {/* Step 2: Business or Personal Info */}
        {step === 2 && (
          profileType === "business" ? (
            <BusinessInfoForm
              // <-- Pass orgNumber to the updated form
              orgNumber={orgNumber}
              setOrgNumber={setOrgNumber}
              email={email}
              setEmail={setEmail}
              name={name}
              setName={setName}
              mobile={mobile}
              setMobile={setMobile}
              password={password}
              setPassword={setPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              handleBack={handleBack}
              handleNext={handleNext}
              error={error}
            />
          ) : (
            <PersonalInfoForm
              email={email}
              setEmail={setEmail}
              name={name}
              setName={setName}
              birthdate={birthdate}
              setBirthdate={setBirthdate}
              mobile={mobile}
              setMobile={setMobile}
              password={password}
              setPassword={setPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              handleBack={handleBack}
              handleNext={handleNext}
              error={error}
            />
          )
        )}

        {/* Step 3: Profile details (bio, image, final register) */}
        {step === 3 && (
          <ProfileDetailsForm
            bio={bio}
            setBio={setBio}
            image={image}
            handleImageChange={handleImageChange}
            handleBack={handleBack}
            handleRegister={handleRegister}
            error={error}
            success={success}
            isSubmitting={isSubmitting}
          />
        )}
      </div>

      {/* Error Message */}
      {error && <div className="mt-4 text-red-600">{error}</div>}

      {/* Success Message */}
      {success && <div className="mt-4 text-green-600">{success}</div>}
    </div>
  );
}
