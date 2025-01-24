// pages/profile.tsx
'use client';

import React, { ChangeEvent, FormEvent, useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import Tooltip from '@/components/common/ToolTip';
import Link from 'next/link';
import axios from 'axios';
import { FaCamera } from 'react-icons/fa';
import LoadingLogo from '@/components/NSRVLoader';
import { Review } from "@/common/types"; // Importing Review interface
import { jwtDecode } from 'jwt-decode';
import ReviewsSection from "@/components/portal/user/reviews/ReviewsSection"; // Corrected import

interface User {
  id: string;
  name: string | null;
  email: string | null;
  bio: string | null;
  role: string | null;
  image: string | null;
  verified: boolean;
  mobile?: number | null; // Changed to number based on backend schema
  guardian?: string | null;
  needs_guardian?: boolean | null;
  // Add other fields as necessary
}

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [bio, setBio] = useState('');
  const [guardian, setGuardian] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // States for reviews
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState<boolean>(true);
  const [reviewsError] = useState<string | null>(null);

  // Function to determine role
  const getRole = () => {
    return user?.role || 'arbeidstaker';
  };

  const role = getRole();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token'); // Ensure consistency with token key
        if (!token) {
          throw new Error('No JWT token found. Please log in.');
        }

        const decoded: JwtPayload = jwtDecode<JwtPayload>(token);
        const userId = decoded.sub;
        console.log(decoded);

        const [userResponse, reviewsResponse] = await Promise.all([
          axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            },
          ),
          axios.get<Review[]>(
            `${process.env.NEXT_PUBLIC_API_URL}/reviews/user/${userId}`,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            },
          )
        ]);

        console.log(userResponse.data.user);

        const data: User = userResponse.data.user;
        setUser(data);
        setName(data.name || '');
        setBio(data.bio || '');
        setGuardian(data.guardian || ''); // Adjust based on actual field
        setMobile(data.mobile ? data.mobile.toString() : ''); // Convert number to string for input
        setEmail(data.email || '');
        setVerified(data.verified);
        setPreviewImage(
          data.image
            ? `${process.env.NEXT_PUBLIC_ASSETS_URL}${data.image}`
            : `${process.env.NEXT_PUBLIC_ASSETS_URL}70e5b449-da0a-4d91-af74-8a4592080b98`,
        );

        // Set reviews
        setReviews(reviewsResponse.data);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Kunne ikke hente data.');
      } finally {
        setLoading(false);
        setReviewsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No JWT token found. Please log in.');
      }

      const formData = new FormData();
      formData.append('name', name);
      formData.append('bio', bio);
      formData.append('mobile', mobile);
      formData.append('email', email);

      // Conditionally append guardian if needs_guardian is true
      if (user?.needs_guardian) {
        formData.append('guardian', guardian);
      }

      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${user?.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setSuccessMessage('Profilen din er oppdatert!');
      setUser(response.data.updatedItem);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate overall average rating
  const overallAverageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
    const avg = total / reviews.length;
    return parseFloat(avg.toFixed(1));
  }, [reviews]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingLogo />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-xl text-red-500">Feil: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center px-4 py-10">
      <div className="flex w-full max-w-lg flex-col items-center space-y-6 rounded-3xl p-6">
        {/* Success Message */}
        {successMessage && (
          <div className="w-full rounded-md bg-green-100 p-4 text-green-700">
            {successMessage}
          </div>
        )}

        {/* Profile Header */}
        <div className="relative flex w-full flex-col items-center space-y-4">
          {/* Profile Image Container with Hover Effects */}
          <div className="group relative h-40 w-40 overflow-hidden rounded-full bg-gray-200 shadow-inner">
            <Image
              src={
                previewImage || '/default-profile.png' // Ensure default image path is correct
              }
              alt="Profile Picture"
              layout="fill"
              objectFit="cover"
              className="object-cover transition duration-300 group-hover:blur-sm group-hover:brightness-50 group-hover:filter"
              placeholder="blur"
              blurDataURL="/default-avatar.png" // Low-res placeholder
            />

            {/* Overlay for Hover Effects */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-25 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {/* Change Profile Picture Icon */}
              <label
                htmlFor="image-upload"
                className="flex cursor-pointer flex-col items-center text-white"
                aria-label="Endre profilbilde"
              >
                <FaCamera size={24} className="mb-1" />
              </label>
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </div>

          {/* Edit Label */}
          <p className="mt-2 text-gray-700">Klikk for å redigere</p>

          {/* Name and Verified Badge */}
          <div className="flex items-center space-x-2 flex-col">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-b-2 border-gray-300 bg-transparent text-2xl font-semibold text-gray-800 outline-none focus:border-blue-500 dark:text-gray-50"
              placeholder="Navn"
              required
            />
            {/* Verified Badge */}
            {verified && (
              <Tooltip text="Denne brukerens identitet er verifisert.">
                <div className="flex items-center space-x-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-600 shadow-neumorphic">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Verifisert</span>
                </div>
              </Tooltip>
            )}
          </div>

          {/* Role Tag */}
          <div
            className={`flex items-center rounded-full px-4 py-1 text-sm font-medium ${
              role === 'arbeidsgiver'
                ? 'bg-blue-300 text-blue-900'
                : 'bg-green-300 text-green-900'
            }`}
          >
            {role === 'arbeidsgiver' ? 'Arbeidsgiver' : 'Arbeidstaker'}
          </div>
        </div>

        {/* Bio */}
        <div className="w-full rounded-2xl bg-background p-4 shadow-neumorphic">
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full resize-none border-none bg-transparent text-gray-800 outline-none dark:text-gray-50"
            rows={5}
            placeholder="Skriv din bio her..."
            required
          />
        </div>

        {/* Contact Info */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          {/* Guardian Field - Conditionally Rendered */}
          {user?.needs_guardian && (
            <div className="flex items-center justify-between rounded-2xl bg-background p-4 shadow-neumorphic">
              <label htmlFor="guardian" className="font-medium text-gray-800">
                Foresatte:
              </label>
              <input
                type="text"
                id="guardian"
                value={guardian}
                onChange={(e) => setGuardian(e.target.value)}
                className="border-none bg-transparent text-right text-gray-800 outline-none dark:text-gray-50"
                placeholder="Foresatt navn"
                required={user?.needs_guardian}
              />
            </div>
          )}

          {/* Mobile Field */}
          <div className="flex items-center justify-between rounded-2xl bg-background p-4 shadow-neumorphic">
            <label htmlFor="mobile" className="font-medium text-gray-800">
              Mobil:
            </label>
            <input
              type="tel"
              id="mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="border-none bg-transparent text-right text-gray-800 outline-none dark:text-gray-50"
              placeholder="Mobilnummer"
              pattern="^(\+47\s?)?([0-9]{2}\s?){3}[0-9]{2}$"
              title="Format: 12 34 567"
              required={!user?.needs_guardian || user?.needs_guardian}
            />
          </div>

          {/* Email Field */}
          <div className="flex items-center justify-between rounded-2xl bg-background p-4 shadow-neumorphic">
            <label htmlFor="email" className="font-medium text-gray-800">
              Epost:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-none bg-transparent text-right text-gray-800 outline-none dark:text-gray-50"
              placeholder="Epostadresse"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full rounded-2xl bg-blue-500 py-2 font-semibold text-white shadow-neumorphic ${
              isSubmitting
                ? 'cursor-not-allowed opacity-50'
                : 'hover:bg-blue-600 transition-colors duration-300'
            }`}
          >
            {isSubmitting ? 'Oppdaterer...' : 'Oppdater Profil'}
          </button>
        </form>

        {/* Dynamic Reviews Section */}
        <div className="w-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
              Anmeldelser
            </h2>
            <Link
              href={`/portal/profil/${user?.id}/anmeldelser`} // Adjust the route as needed
              className="text-blue-500 hover:underline"
            >
              Se alle anmeldelser
            </Link>
          </div>

          {/* Loading and Error States for Reviews */}
          {reviewsLoading ? (
            <div className="flex items-center justify-center">
              <LoadingLogo />
            </div>
          ) : reviewsError ? (
            <p className="text-red-500">Feil: {reviewsError}</p>
          ) : reviews.length === 0 ? (
            <p className="text-gray-600">Ingen anmeldelser tilgjengelig.</p>
          ) : (
            <div className="space-y-4">
              {/* Overall Average Rating */}
              <div className="mb-6">
                <ReviewsSection
                  reviews={reviews}
                  averageRating={overallAverageRating}
                  limit={5} // Display up to 5 reviews
                />
              </div>
            </div>
          )}
        </div>

        {/* Logout and Customer Service */}
        <div className="w-full space-y-4">
          <Link
            className="block w-full rounded-2xl bg-primary py-2 text-center font-semibold text-gray-800 shadow-neumorphic hover:bg-yellow-400 transition-colors duration-300"
            href="mailto:kundeservice@flittigub.no"
          >
            Kundeservice
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem('token'); // Ensure consistency with token key
              window.location.href = '/portal/logg-inn'; // Redirect to login page
            }}
            className="w-full rounded-2xl bg-primary py-2 font-semibold text-gray-800 shadow-neumorphic hover:bg-yellow-400 transition-colors duration-300"
          >
            Logg ut
          </button>
        </div>
      </div>
    </div>
  );
}
