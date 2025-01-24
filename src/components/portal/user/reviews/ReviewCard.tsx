// components/ReviewCard.tsx
'use client';

import React, { useState } from 'react';
import { Review } from "@/common/types";
import Image from 'next/image';

interface ReviewCardProps {
  review: Review;
  getReviewerImage: (review: Review) => string;
  renderStars: (rating: number) => JSX.Element[];
  // Optional: Customizable texts
  anonymousText?: string;
  unknownCategoryText?: string;
  noCommentText?: string;
}

const ReviewCard: React.FC<ReviewCardProps> = (({
                                                            review,
                                                            getReviewerImage,
                                                            renderStars,
                                                            anonymousText = 'Anonym',
                                                            unknownCategoryText = 'Ukjent kategori',
                                                            noCommentText = 'Ingen kommentar.',
                                                          }) => {
  const [imgSrc, setImgSrc] = useState(getReviewerImage(review));

  const handleImageError = () => {
    setImgSrc('/default-avatar.png');
  };

  return (
    <li className="p-6 border rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center mb-4">
        {/* Reviewer's Image */}
        <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
          <Image
            src={imgSrc}
            alt={review.by_user?.name || anonymousText}
            layout="fill"
            objectFit="cover"
            onError={handleImageError}
            className="rounded-full"
            placeholder="blur"
            blurDataURL="/default-avatar.png" // Low-res placeholder
          />
        </div>
        <div>
          {/* Reviewer's Name */}
          <div className="text-lg font-semibold text-gray-800">
            {review.by_user?.name || anonymousText}
          </div>
          {/* Optional: Job Title */}
          {review.job && (
            <div className="text-sm text-gray-500">
              - {review.job.category?.name || unknownCategoryText}
            </div>
          )}
        </div>
      </div>
      {/* Star Ratings */}
      <div className="flex items-center mb-2">
        {review.rating !== undefined && renderStars(review.rating)}
      </div>
      {/* Comment */}
      <p className="text-gray-700">
        {review.comment || noCommentText}
      </p>
    </li>
  );
});

export default ReviewCard;
