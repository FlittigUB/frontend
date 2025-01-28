'use client';

import React, { ChangeEvent, useEffect, useId, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Check, Eye, EyeOff, X } from 'lucide-react';
import { toast } from "sonner";

// =======================
// HELPER COMPONENTS
// =======================

// Example placeholder logo
function Logo() {
  return (
    <div className="flex items-center justify-center gap-2">
      <div className="h-8 w-8 rounded bg-orange-500" />
      <span className="font-bold">MyApp</span>
    </div>
  );
}

// A simple progress bar showing the user’s step
function ShadcnProgressBar({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) {
  const percentage = (currentStep / totalSteps) * 100;
  return <Progress value={percentage} className="w-full" />;
}

// =======================
// STEP 1: Role Selection
// =======================
function RoleSelection({
  onSelectRole,
}: {
  onSelectRole: (role: string) => void;
}) {
  return (
    <div className="space-y-6 p-6 md:p-8">
      <div className="flex flex-col items-center text-center">
        <div className="relative h-20 w-20">
          {/* Example Mascot Image */}
          <Image
            src={`${process.env.NEXT_PUBLIC_ASSETS_URL}722b612f-b083-4a34-bef7-4b884bbeb2dc.png`}
            alt="Mascot"
            fill
            style={{ objectFit: 'contain' }}
          />
        </div>
        <h1 className="mt-4 text-2xl font-bold">Velkommen! 🎉</h1>
        <p className="text-gray-600">
          La oss starte registreringen ved å velge din rolle.
        </p>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          onClick={() => onSelectRole('arbeidsgiver')}
          className="px-4 py-6"
        >
          Arbeidsgiver
        </Button>
        <Button
          variant="outline"
          onClick={() => onSelectRole('arbeidstaker')}
          className="px-4 py-6"
        >
          Arbeidstaker
        </Button>
        <Button
          variant="default"
          onClick={() => onSelectRole('bedrift')}
          className="col-span-2 bg-green-500 hover:bg-green-600"
        >
          Registrer som bedrift
        </Button>
      </div>
      <div className="text-center text-sm">
        Har du allerede en konto?{' '}
        <a
          href="/portal/logg-inn"
          className="font-semibold text-orange-500 hover:underline"
        >
          Logg Inn her
        </a>
      </div>
    </div>
  );
}

// ========================
// ADVANCED PASSWORD INPUT
// (used for "password" fields)
// ========================
function PasswordStrengthInput({
  password,
  setPassword,
  error,
}: {
  password: string;
  setPassword: (val: string) => void;
  error?: string; // optional field-level error
}) {
  const id = useId();
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible((prev) => !prev);

  // Evaluate password requirements
  const checkStrength = (pass: string) => {
    const requirements = [
      { regex: /.{8,}/, text: 'At least 8 characters' },
      { regex: /[0-9]/, text: 'At least 1 number' },
      { regex: /[a-z]/, text: 'At least 1 lowercase letter' },
      { regex: /[A-Z]/, text: 'At least 1 uppercase letter' },
    ];
    return requirements.map((req) => ({
      met: req.regex.test(pass),
      text: req.text,
    }));
  };

  const strengthArray = checkStrength(password);
  const strengthScore = useMemo(() => {
    return strengthArray.filter((r) => r.met).length;
  }, [strengthArray]);

  const getStrengthColor = (score: number) => {
    if (score === 0) return 'bg-border';
    if (score <= 1) return 'bg-red-500';
    if (score <= 2) return 'bg-orange-500';
    if (score === 3) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getStrengthText = (score: number) => {
    if (score === 0) return 'Enter a password';
    if (score <= 2) return 'Weak password';
    if (score === 3) return 'Medium password';
    return 'Strong password';
  };

  // If there's a field-level error, show the border-destructive style
  const passwordClass = error
    ? 'border-destructive/80 text-destructive focus-visible:border-destructive/80 focus-visible:ring-destructive/20'
    : '';

  return (
    <div>
      <div className="space-y-2">
        <Label htmlFor={id}>
          Passord <span className="text-destructive">*</span>
        </Label>
        <div className="relative">
          <Input
            id={id}
            className={`pe-9 ${passwordClass}`}
            placeholder="Passord"
            type={isVisible ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={Boolean(error || strengthScore < 4)}
            aria-describedby={`${id}-description`}
            required
          />
          <button
            className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
            onClick={toggleVisibility}
            aria-label={isVisible ? 'Hide password' : 'Show password'}
            aria-pressed={isVisible}
            aria-controls={id}
          >
            {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {/* Password strength indicator */}
      <div
        className="mb-2 mt-3 h-1 w-full overflow-hidden rounded-full bg-border"
        role="progressbar"
        aria-valuenow={strengthScore}
        aria-valuemin={0}
        aria-valuemax={4}
        aria-label="Password strength"
      >
        <div
          className={`h-full ${getStrengthColor(strengthScore)} transition-all duration-500 ease-out`}
          style={{ width: `${(strengthScore / 4) * 100}%` }}
        />
      </div>

      {/* Strength text and requirements */}
      <p
        id={`${id}-description`}
        className="mb-2 text-sm font-medium text-foreground"
      >
        {getStrengthText(strengthScore)}. Must contain:
      </p>
      <ul className="space-y-1.5" aria-label="Password requirements">
        {strengthArray.map((req, i) => (
          <li key={i} className="flex items-center gap-2">
            {req.met ? (
              <Check size={16} className="text-emerald-500" />
            ) : (
              <X size={16} className="text-muted-foreground/80" />
            )}
            <span
              className={`text-xs ${
                req.met ? 'text-emerald-600' : 'text-muted-foreground'
              }`}
            >
              {req.text}
            </span>
          </li>
        ))}
      </ul>

      {/* If there's a password error (e.g. mismatch), display it */}
      {error && (
        <p
          className="mt-2 text-xs text-destructive"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
    </div>
  );
}

// ================================
// STEP 2A: PERSONAL INFO FORM
// ================================
interface PersonalInfoFormProps {
  email: string;
  setEmail: (val: string) => void;
  name: string;
  setName: (val: string) => void;
  birthdate: string;
  setBirthdate: (val: string) => void;
  mobile: string;
  setMobile: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  confirmPassword: string;
  setConfirmPassword: (val: string) => void;
  handleBack: () => void;
  handleNext: () => void;
  error: string;
}

function PersonalInfoForm(props: PersonalInfoFormProps) {
  const {
    email,
    setEmail,
    name,
    setName,
    birthdate,
    setBirthdate,
    mobile,
    setMobile,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    handleBack,
    handleNext,
    error,
  } = props;

  // We'll check if the global error references invalid email or password mismatch:
  const isEmailError =
    error.includes('gyldig epost') || error.toLowerCase().includes('email');
  const isConfirmError =
    error.toLowerCase().includes('samsvarer ikke') ||
    error.toLowerCase().includes('mismatch');

  return (
    <div className="space-y-6 p-6 md:p-8">
      <h1 className="text-2xl font-bold text-gray-800">
        Personlig Informasjon 📝
      </h1>
      <div className="grid gap-4">
        {/* Epost (required) */}
        <EmailInput
          label="Epost"
          value={email}
          onChange={setEmail}
          isError={isEmailError}
          errorMsg="Vennligst oppgi en gyldig epostadresse."
        />
        {/* Navn (required) */}
        <RequiredInput
          label="Navn"
          placeholder="Ola Normann"
          value={name}
          onChange={setName}
        />
        {/* Fødselsdato (required for individuals) */}
        <RequiredInput
          label="Fødselsdato"
          type="date"
          value={birthdate}
          onChange={setBirthdate}
        />
        {/* Mobilnummer (required) */}
        <RequiredInput
          label="Mobilnummer"
          placeholder="123 45 678"
          value={mobile}
          onChange={setMobile}
        />

        {/* Password with strength indicator */}
        <PasswordStrengthInput
          password={password}
          setPassword={setPassword}
          // If there's a mismatch or any "Passordene samsvarer ikke!" error, we won't show it here. We'll do it on confirm.
          error={undefined}
        />

        {/* Confirm Password (required). If there's a mismatch error, show it as an error input */}
        <ConfirmPasswordInput
          label="Bekreft Passord"
          value={confirmPassword}
          onChange={setConfirmPassword}
          isError={isConfirmError}
          errorMsg="Passordene samsvarer ikke!"
        />
      </div>

      {/* If there's a "generic" error that doesn't match above, show it here */}
      {error && !isEmailError && !isConfirmError && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={handleBack}>
          Tilbake
        </Button>
        <Button variant="default" onClick={handleNext}>
          Neste
        </Button>
      </div>
    </div>
  );
}

// ================================
// STEP 2B: BUSINESS INFO FORM
// ================================
interface BusinessInfoFormProps {
  orgNumber: string;
  setOrgNumber: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  name: string;
  setName: (val: string) => void;
  mobile: string;
  setMobile: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  confirmPassword: string;
  setConfirmPassword: (val: string) => void;
  handleBack: () => void;
  handleNext: () => void;
  error: string;
}

function BusinessInfoForm(props: BusinessInfoFormProps) {
  const {
    orgNumber,
    setOrgNumber,
    email,
    setEmail,
    name,
    setName,
    mobile,
    setMobile,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    handleBack,
    handleNext,
    error,
  } = props;

  const [orgLookupError, setOrgLookupError] = useState('');
  const [orgFetched, setOrgFetched] = useState(false);

  const isEmailError =
    error.includes('gyldig epost') || error.toLowerCase().includes('email');
  const isConfirmError =
    error.toLowerCase().includes('samsvarer ikke') ||
    error.toLowerCase().includes('mismatch');

  const handleFetchOrganization = async () => {
    setOrgLookupError('');
    if (!orgNumber) {
      setOrgLookupError('Vennligst oppgi et organisasjonsnummer.');
      setOrgFetched(false);
      return;
    }

    try {
      const res = await fetch(
        `https://data.brreg.no/enhetsregisteret/api/enheter/${orgNumber}`,
      );
      if (!res.ok) {
        setOrgLookupError(
          'Fant ikke organisasjonen. Sjekk organisasjonsnummeret og prøv igjen.',
        );
        setOrgFetched(false);
        return;
      }
      const data = await res.json();
      setName(data.navn || '');
      setOrgFetched(true);
    } catch {
      setOrgLookupError(
        'Noe gikk galt under henting av data. Prøv igjen senere.',
      );
      setOrgFetched(false);
    }
  };

  return (
    <div className="space-y-6 p-6 md:p-8">
      <h1 className="text-2xl font-bold text-gray-800">
        Bedrift Informasjon 📝
      </h1>

      <div className="grid gap-4">
        {/* Organisasjonsnummer */}
        <div>
          <Label htmlFor="orgNumber">
            Organisasjonsnummer <span className="text-destructive">*</span>
          </Label>
          <div className="mt-1 flex gap-2">
            <Input
              id="orgNumber"
              placeholder="914939828"
              value={orgNumber}
              onChange={(e) => {
                setOrgNumber(e.target.value);
                setOrgFetched(false);
              }}
              required
            />
            <Button variant="default" onClick={handleFetchOrganization}>
              Hent
            </Button>
          </div>
          {orgLookupError && (
            <p className="mt-1 text-sm text-destructive" role="alert">
              {orgLookupError}
            </p>
          )}
        </div>

        {orgFetched && (
          <>
            {/* Epost */}
            <EmailInput
              label="Epost"
              value={email}
              onChange={setEmail}
              isError={isEmailError}
              errorMsg="Vennligst oppgi en gyldig epostadresse."
            />
            {/* Selskapsnavn (required) */}
            <RequiredInput
              label="Selskapsnavn"
              value={name}
              onChange={setName}
            />
            {/* Mobilnummer (required) */}
            <RequiredInput
              label="Mobilnummer"
              placeholder="123 45 678"
              value={mobile}
              onChange={setMobile}
            />
            {/* Password with strength */}
            <PasswordStrengthInput
              password={password}
              setPassword={setPassword}
              error={undefined}
            />
            {/* Confirm Password */}
            <ConfirmPasswordInput
              label="Bekreft Passord"
              value={confirmPassword}
              onChange={setConfirmPassword}
              isError={isConfirmError}
              errorMsg="Passordene samsvarer ikke!"
            />
          </>
        )}
      </div>

      {/* If there's a global error we haven't shown, display it */}
      {error && !isEmailError && !isConfirmError && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={handleBack}>
          Tilbake
        </Button>
        <Button variant="default" onClick={handleNext} disabled={!orgFetched}>
          Neste
        </Button>
      </div>
    </div>
  );
}

// ==============================
// STEP 3: PROFILE DETAILS FORM
// ==============================
interface ProfileDetailsFormProps {
  bio: string;
  setBio: (val: string) => void;
  image: File | null;
  handleImageChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleBack: () => void;
  handleRegister: () => void;
  error: string;
  success: string;
  isSubmitting: boolean;
}

function ProfileDetailsForm(props: ProfileDetailsFormProps) {
  const {
    bio,
    setBio,
    image,
    handleImageChange,
    handleBack,
    handleRegister,
    error,
    success,
    isSubmitting,
  } = props;

  return (
    <div className="space-y-6 p-6 md:p-8">
      <h1 className="text-2xl font-bold text-gray-800">Profil Detaljer 🎨</h1>
      <div className="grid gap-4">
        {/* Bio */}
        <div>
          <Label htmlFor="bio">Bio</Label>
          <textarea
            id="bio"
            placeholder="Skriv noe om deg selv..."
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 p-2"
          />
        </div>
        {/* Image Upload */}
        <div>
          <Label htmlFor="profileImage">Profilbilde</Label>
          <Input
            id="profileImage"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1"
          />
          {image && (
            <div className="mt-2">
              <Image
                alt="Selected preview"
                src={URL.createObjectURL(image)}
                width={80}
                height={80}
                className="rounded-full object-cover"
              />
            </div>
          )}
        </div>
      </div>

      {/* Show error or success */}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}

      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={handleBack}>
          Tilbake
        </Button>
        <Button
          variant="default"
          onClick={handleRegister}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Registrerer...' : 'Registrer'}
        </Button>
      </div>
    </div>
  );
}

// ================================================================
// Reusable "RequiredInput" snippet for a required field w/ asterisk
// ================================================================
function RequiredInput({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
}: {
  label: string;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  value: string;
  onChange: (val: string) => void;
}) {
  const id = useId();
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label} <span className="text-destructive">*</span>
      </Label>
      <Input
        id={id}
        placeholder={placeholder || label}
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

// ================================================================
// Reusable "EmailInput" snippet that can show an error style
// if isError = true
// ================================================================
function EmailInput({
  label,
  value,
  onChange,
  isError,
  errorMsg,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  isError?: boolean;
  errorMsg?: string;
}) {
  const id = useId();
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label} <span className="text-destructive">*</span>
      </Label>
      <Input
        id={id}
        placeholder={label}
        type="email"
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={
          isError
            ? 'border-destructive/80 text-destructive focus-visible:border-destructive/80 focus-visible:ring-destructive/20'
            : ''
        }
        aria-invalid={isError || false}
      />
      {isError && errorMsg && (
        <p
          className="mt-1 text-xs text-destructive"
          role="alert"
          aria-live="polite"
        >
          {errorMsg}
        </p>
      )}
    </div>
  );
}

// =====================================================================
// Reusable "ConfirmPasswordInput" snippet for confirm password field
// If isError = true, show destructive styles + error text
// =====================================================================
function ConfirmPasswordInput({
  label,
  value,
  onChange,
  isError,
  errorMsg,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  isError?: boolean;
  errorMsg?: string;
}) {
  const id = useId();
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label} <span className="text-destructive">*</span>
      </Label>
      <Input
        id={id}
        placeholder={label}
        type="password"
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={
          isError
            ? 'border-destructive/80 text-destructive focus-visible:border-destructive/80 focus-visible:ring-destructive/20'
            : ''
        }
        aria-invalid={isError || false}
      />
      {isError && errorMsg && (
        <p
          className="mt-1 text-xs text-destructive"
          role="alert"
          aria-live="polite"
        >
          {errorMsg}
        </p>
      )}
    </div>
  );
}

// ========================
// MAIN REGISTER PAGE
// ========================
export default function RegisterPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const totalSteps = 3;

  // role + profileType
  const [role, setRole] = useState('');
  const [profileType, setProfileType] = useState('');

  // business
  const [orgNumber, setOrgNumber] = useState('');

  // user fields
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // optional
  const [bio, setBio] = useState('');
  const [image, setImage] = useState<File | null>(null);

  // UI
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If business, skip birthdate
  useEffect(() => {
    if (profileType === 'business' || role === 'bedrift') {
      setBirthdate(new Date(1990, 1, 1).toISOString());
    }
  }, [profileType, role]);

  // Simple email check
  const isValidEmail = (test: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(test);

  // Step handlers
  const handleNext = () => setStep((prev) => Math.min(prev + 1, totalSteps));
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  // Role selection
  const handleRoleSelection = (selectedRole: string) => {
    if (selectedRole === 'bedrift') {
      setProfileType('business');
      setRole('arbeidsgiver');
    } else {
      setProfileType("individual");
      setRole(selectedRole);
    }
    handleNext();
  };

  // Image validation
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        setError('Kun JPG, PNG og GIF filer er tillatt.');
        return;
      }
      if (file.size > maxSize) {
        setError('Bilde må være mindre enn 5MB.');
        return;
      }
      setImage(file);
      setError('');
    }
  };

  // Final register
  const handleRegister = async () => {
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    // Basic checks
    if (password !== confirmPassword) {
      setError('Passordene samsvarer ikke!');
      setIsSubmitting(false);
      return;
    }
    if (
      !email ||
      !password ||
      !name ||
      !mobile ||
      (profileType === 'individual' && !birthdate)
    ) {
      setError('Vennligst fyll ut alle påkrevde felt.');
      setIsSubmitting(false);
      return;
    }
    if (!isValidEmail(email)) {
      setError('Vennligst oppgi en gyldig epostadresse.');
      setIsSubmitting(false);
      return;
    }

    // Decide endpoint
    const endpoint = profileType === 'business' ? '/users/business' : '/users';

    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      formData.append('role', role);
      formData.append('type', profileType);
      formData.append('name', name);

      if (profileType === 'individual' && birthdate) {
        formData.append('birthDate', birthdate);
      } else if (profileType === 'business') {
        formData.append('birthDate', new Date(1990, 1, 1).toISOString());
      }

      formData.append('mobile', mobile);
      formData.append('bio', bio);

      if (profileType === 'business') {
        formData.append('organization_number', orgNumber);
      }
      if (image) {
        formData.append('image', image);
      }

      const registerResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
        { method: 'POST', body: formData },
      );

      if (!registerResponse.ok) {
        const registerError = await registerResponse.json();
        throw new Error(
          registerError.message || 'En feil oppstod under registreringen.',
        );
      }

      toast.success('Registrering vellykket! Logger inn...');

      // Auto-login
      const loginResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        },
      );

      if (!loginResponse.ok) {
        const loginError = await loginResponse.json();
        throw new Error(loginError.message || 'Autentisering mislyktes.');
      }

      const loginData = await loginResponse.json();
      localStorage.setItem('token', loginData.access_token);
      router.push('/portal');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Kunne ikke koble til serveren.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // RENDER
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <Card className="overflow-hidden">
          <CardContent className="grid p-0 md:grid-cols-2">
            {/* LEFT SIDE: STEPS */}
            <div className="flex flex-col">
              {/* Logo + Progress */}
              <div className="p-4 md:p-6">
                <div className="mb-2 flex justify-center">
                  <Logo />
                </div>
                <ShadcnProgressBar currentStep={step} totalSteps={totalSteps} />
              </div>

              {/* Step 1 */}
              {step === 1 && (
                <RoleSelection onSelectRole={handleRoleSelection} />
              )}

              {/* Step 2 */}
              {step === 2 &&
                (profileType === 'business' ? (
                  <BusinessInfoForm
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
                ))}

              {/* Step 3 */}
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

            {/* RIGHT SIDE: IMAGE (hidden on small screens) */}
            <div className="relative hidden bg-muted md:block">
              <Image
                src={`${process.env.NEXT_PUBLIC_ASSETS_URL}5c6a2d28-09a2-4f9b-87c4-36c0ec26319c.png`}
                alt="Registration Image"
                fill
                style={{ objectFit: 'cover' }}
                className="dark:brightness-[0.2] dark:grayscale"
              />
            </div>
          </CardContent>
        </Card>

        {/* Global error/success below card (optional) */}
        {error && (
          <div className="mt-4 text-center text-red-600" role="alert">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-4 text-center text-green-600">{success}</div>
        )}
      </div>
    </div>
  );
}
