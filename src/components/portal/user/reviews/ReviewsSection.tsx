// components/ReviewsSection.tsx
'use client';

import React from 'react';
import { Review } from "@/common/types";
import ReviewCard from './ReviewCard';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';

interface ReviewsSectionProps {
  reviews: Review[];
  averageRating: number;
  limit?: number; // Optional prop to limit number of reviews displayed
}

const ReviewsSection: React.FC<ReviewsSectionProps> = (({ reviews, averageRating, limit }) => {

  // Helper function to render star ratings, including half stars
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;

    for (let i = 1; i <= fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-500" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-500" />);
    }

    const totalStars = hasHalfStar ? fullStars + 1 : fullStars;

    for (let i = totalStars + 1; i <= 5; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-yellow-500" />);
    }

    return stars;
  };

  // Helper function to get the reviewer's image URL
  const getReviewerImage = (review: Review) => {
    if (review.by_user?.image) {
      // If image is an object with id
      if (typeof review.by_user.image === 'object' && 'id' in review.by_user.image) {
        return `${process.env.NEXT_PUBLIC_ASSETS_URL}/${review.by_user.image.id}`;
      }
      // If image is a string (UUID)
      if (typeof review.by_user.image === 'string') {
        return `${process.env.NEXT_PUBLIC_ASSETS_URL}/${review.by_user.image}`;
      }
    }
    // Return a default avatar if no image is available
    return '/default-avatar.png'; // Ensure you have a default avatar image at this path
  };

  // Determine which reviews to display based on the limit
  const displayedReviews = limit ? reviews.slice(0, limit) : reviews;

  return (
    <div>
      {/* Average Rating Section */}
      <div className="flex items-center mb-6 p-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg shadow-md">
        <span className="text-4xl font-bold text-white mr-4">{averageRating}</span>
        <div className="flex items-center">
          {renderStars(averageRating)}
        </div>
        <span className="ml-4 text-lg text-white">({reviews.length} {reviews.length === 1 ? 'omtale' : 'omtaler'})</span>
      </div>

      {displayedReviews.length > 0 ? (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              getReviewerImage={getReviewerImage}
              renderStars={renderStars}
              // Optional: Customize texts if needed
              anonymousText="Anonym"
              unknownCategoryText="Ukjent kategori"
              noCommentText="Ingen kommentar."
            />
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-600">Ingen anmeldelser å vise.</p>
      )}
    </div>
  );
});

export default ReviewsSection;
