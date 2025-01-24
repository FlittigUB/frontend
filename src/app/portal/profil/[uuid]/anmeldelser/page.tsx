// app/portal/stillinger/[slug]/ProfileReviews.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '@/app/portal/profil/[uuid]/UserContext';
import { Review } from "@/common/types";
import axios from "axios";
import ReviewsSection from "@/components/portal/user/reviews/ReviewsSection";

const ProfileReviews: React.FC = () => {
  const user = useUser();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState<number>(0);

  useEffect(() => {
    // Define an async function inside useEffect
    const fetchReviews = async () => {
      try {
        const response = await axios.get<Review[]>(`${process.env.NEXT_PUBLIC_API_URL}/reviews/user/${user.id}`);
        setReviews(response.data);
        calculateAverageRating(response.data);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Kunne ikke hente omtaler.');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [user.id]);

  const calculateAverageRating = (reviews: Review[]) => {
    if (reviews.length === 0) {
      setAverageRating(0);
      return;
    }
    const total = reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
    const avg = total / reviews.length;
    setAverageRating(parseFloat(avg.toFixed(1))); // Round to one decimal place
  };

  if (loading) {
    return <div className="mx-auto max-w-6xl p-6">Laster omtaler...</div>;
  }

  if (error) {
    return <div className="mx-auto max-w-6xl p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="text-2xl font-bold mb-4">{user.name} sine omtaler</h1>
      <p className="mb-6 text-gray-700">
        Her kan du se omtalene til {user.name}
      </p>

      {/* Reviews Section */}
      <ReviewsSection
        reviews={reviews}
        averageRating={averageRating}
      />
    </div>
  );
};

export default ProfileReviews;
