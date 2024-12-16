// src/app/portal/registrer-deg/page.tsx
'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import PersonalInfoForm from "@/components/login/PersonalInfoForm";
import ProgressIndicator from "@/components/login/ProgressIndicator";
import RoleSelection from "@/components/login/RoleSelection";
import ProfileDetailsForm from "@/components/login/ProfileDetailsForm";
import Logo from "@/components/common/Logo"; // Importing the Logo component

export default function MultiStepRegisterPage() {
  const router = useRouter();

  // State variables
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [mobile, setMobile] = useState(''); // New state for mobile number
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [bio, setBio] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle role selection
  const handleRoleSelection = (selectedRole: string) => {
    setRole(selectedRole);
    setStep(2);
  };

  // Handle image file selection with validation
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  // Email validation
  const isValidEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Handle form submission
  const handleRegister = async () => {
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    // Basic form validations
    if (password !== confirmPassword) {
      setError('Passordene samsvarer ikke!');
      setIsSubmitting(false);
      return;
    }

    if (!email || !password || !name || !birthdate || !mobile) { // Include mobile in required fields
      setError('Vennligst fyll ut alle påkrevde felt.');
      setIsSubmitting(false);
      return;
    }

    if (!isValidEmail(email)) {
      setError('Vennligst oppgi en gyldig epostadresse.');
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      formData.append('role', role);
      formData.append('name', name);
      formData.append('birthDate', birthdate); // Ensure this is in ISO format
      formData.append('mobile', mobile); // Append mobile number
      formData.append('bio', bio);
      if (image) {
        formData.append('image', image); // This is handled by @UploadedFile
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: 'POST',
          body: formData, // Correctly sending FormData
        },
      );
      console.log(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`);
      console.log(process.env.NEXT_PUBLIC_API_URL);
      console.log(response);
      if (response.ok) {
        setSuccess('Registrering vellykket! Logger inn...');

        // Automatically log in the user
        const loginResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email,
              password,
            }),
          },
        );

        if (loginResponse.ok) {
          const loginData = await loginResponse.json();
          // Store JWT token securely
          localStorage.setItem('token', loginData.access_token);
          // Redirect to /portal
          router.push('/portal');
        } else {
          const loginError = await loginResponse.json();
          setError(loginError.message || 'Autentisering mislyktes.');
        }
      } else {
        const registerError = await response.json();
        setError(registerError.message || 'En feil oppstod under registreringen.');
      }
    } catch (err) {
      console.error(err);
      setError('Kunne ikke koble til serveren.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Navigation handlers
  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  // Handle step click from ProgressIndicator
  const handleStepClick = (clickedStep: number) => {
    if (clickedStep <= step) {
      setStep(clickedStep);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
      {/* Logo */}
      <div className="mb-8">
        <Logo />
      </div>

      {/* Progress Indicator */}
      <ProgressIndicator
        currentStep={step}
        onStepClick={handleStepClick}
        isDarkMode={false}
      />

      {/* Step Content */}
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-md">
        {step === 1 && <RoleSelection onSelectRole={handleRoleSelection} />}
        {step === 2 && (
          <PersonalInfoForm
            email={email}
            setEmail={setEmail}
            name={name}
            setName={setName}
            birthdate={birthdate}
            setBirthdate={setBirthdate}
            mobile={mobile} // Pass mobile state
            setMobile={setMobile} // Pass setMobile function
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            handleBack={handleBack}
            handleNext={handleNext}
            error={error}
          />
        )}
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
