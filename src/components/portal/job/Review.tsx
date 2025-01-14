// /components/Review.tsx

'use client';

import React, { useEffect, useState, FormEvent } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { Job, User } from "@/common/types";
import { useAuthContext } from "@/context/AuthContext";

interface ReviewProps {
  receiverId: string; // ID of the arbeidsgiver
  jobId: string;
}

interface ExistingReview {
  id: string;
  user: User;
  rating: number;
  comment: string;
  job: Job;
  created_at: string;
}

const Review: React.FC<ReviewProps> = ({ receiverId, jobId }) => {
  const [hasReviewed, setHasReviewed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const { token } = useAuthContext();

  // Fetch existing reviews to check if the user has already reviewed
  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await axios.get<ExistingReview[]>(
          `${process.env.NEXT_PUBLIC_API_URL}/reviews/user/${receiverId}`,
        );
        console.log(response);
        console.log(receiverId);
        // Assuming that the current user is the one who might have reviewed
        // Filter reviews by jobId and current user
        const currentUserReview = response.data.find(
          (review) => review.job.id === jobId
        );
        console.log(currentUserReview);
        if (currentUserReview) {
          setHasReviewed(true);
        }
      } catch (err: any) {
        // If there's an error fetching, assume no review exists
        console.error('Error fetching reviews:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [receiverId, jobId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        user: receiverId,
        rating,
        comment,
        job: jobId,
      };
      console.log(payload);
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/reviews`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success('Takk for din vurdering!');
      setHasReviewed(true);
    } catch (err: any) {
      console.log(err.message);
      // Correctly parse the error message
      const msg =
        (err.response?.data?.message && typeof err.response.data.message === 'object')
          ? err.response.data.message.message
          : err.response?.data?.message || err.message || 'Kunne ikke sende vurderingen.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-2 p-4 rounded bg-blue-50">
        <svg
          className="h-5 w-5 animate-spin text-blue-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
        <span className="text-blue-500">Laster vurderingsstatus...</span>
      </div>
    );
  }

  if (hasReviewed) {
    return (
      <div className="mt-4 p-4 rounded bg-green-100">
        <p className="text-sm text-green-800">
          Du har allerede gitt en vurdering for denne jobben.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 p-6 rounded-xl bg-blue-50 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800">Gi en vurdering</h3>
      <form onSubmit={handleSubmit} className="mt-4 space-y-6">
        {/* Rating */}
        <div>
          <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
            Vurdering
          </label>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none"
                aria-label={`${star} star${star > 1 ? 'er' : ''}`}
              >
                {(hoverRating || rating) >= star ? (
                  <FaStar
                    className={`h-8 w-8 text-yellow-400 hover:text-yellow-500 transition-colors duration-200`}
                  />
                ) : (
                  <FaRegStar
                    className={`h-8 w-8 text-gray-300 hover:text-yellow-500 transition-colors duration-200`}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
            Kommentar
          </label>
          <textarea
            id="comment"
            name="comment"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm resize-none transition-colors duration-200"
            placeholder="Del dine erfaringer..."
            required
          ></textarea>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={submitting || rating === 0} // Disable if not rated
            className={`w-full inline-flex justify-center rounded-full ${
              rating === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors duration-200`}
          >
            {submitting ? 'Sender vurdering...' : 'Send vurdering'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Review;
