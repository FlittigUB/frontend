// /components/Review.tsx

'use client';

import React, { useEffect, useState, FormEvent } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Job, User } from "@/common/types";
import { useAuthContext } from "@/context/AuthContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

/**
 * Updated StarIcon component with adjusted colors for less contrast.
 */
function StarIcon({ filled, ...props }: { filled: boolean } & React.SVGProps<SVGSVGElement>) {
  return filled ? (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor" // Changed to use currentColor for better control
      stroke="none" // Removed stroke for filled stars
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ) : (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor" // Use a lighter stroke color
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

// Define the structure of existing reviews
interface ExistingReview {
  id: string;
  user: User;
  rating: number;
  comment: string;
  job: Job;
  created_at: string;
}

// Define the props for the Review component
interface ReviewProps {
  receiverId: string; // ID of the employer
  jobId: string;
}

const Review: React.FC<ReviewProps> = ({ receiverId, jobId }) => {
  const [hasReviewed, setHasReviewed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const { token, user } = useAuthContext(); // Assuming user info is available

  // Fetch existing reviews to check if the user has already reviewed
  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await axios.get<ExistingReview[]>(
          `${process.env.NEXT_PUBLIC_API_URL}/reviews/user/${receiverId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Find if the current user has reviewed the specific job
        const currentUserReview = response.data.find(
          (review) => review.job.id === jobId && review.user.id === user?.id
        );

        if (currentUserReview) {
          setHasReviewed(true);
          setRating(currentUserReview.rating);
          setComment(currentUserReview.comment);
        }
      } catch (err: any) {
        // If there's an error fetching, assume no review exists
        console.error('Error fetching reviews:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [receiverId, jobId, token, user]);

  // Handle form submission
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
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/reviews`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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

  // Handle rating reset
  const handleReset = () => {
    setRating(0);
    setComment('');
  };

  // Display a loading state while fetching review status
  if (loading) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Laster vurdering</CardTitle>
          <CardDescription>Vennligst vent mens vi laster din vurderingsstatus.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center">
          <svg
            className="h-6 w-6 animate-spin text-primary"
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
        </CardContent>
      </Card>
    );
  }

  // If the user has already reviewed, display their review
  if (hasReviewed) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Takk for din vurdering!</CardTitle>
          <CardDescription>Vi setter pris på din tilbakemelding.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }, (_, i) => i + 1).map((star) => (
              <StarIcon
                key={star}
                filled={star <= rating}
                className={`w-6 h-6 ${
                  star <= rating ? 'text-yellow-400' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          {comment && (
            <p className="text-sm text-gray-700">
              &#34;{comment}&#34;
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  // Render the review form if the user has not yet reviewed
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Gi en vurdering</CardTitle>
        <CardDescription>La oss få vite hva du synes om denne jobben.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-4">
          {/* Rating */}
          <div className="flex items-center gap-2">
            <Label htmlFor="rating">Vurdering:</Label>
            <div className="flex items-center gap-2">
              {Array.from({ length: 5 }, (_, i) => i + 1).map((star) => (
                <StarIcon
                  key={star}
                  filled={star <= (hoverRating || rating)}
                  className={`w-6 h-6 cursor-pointer transition-colors duration-200 ${
                    star <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-400'
                  }`}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  aria-label={`${star} star`}
                />
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <Label htmlFor="comment">Kommentar:</Label>
            <textarea
              id="comment"
              name="comment"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-primary focus:ring-primary sm:text-sm resize-none"
              placeholder="Del dine erfaringer..."
              required
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex justify-between">
            <Button
              type="button"
              variant="ghost"
              onClick={handleReset}
              disabled={submitting || rating === 0}
            >
              Reset
            </Button>
            <Button
              variant="default"
              type="submit"
              disabled={submitting || rating === 0}
              className={`${submitting || rating === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-500'} text-white`}
            >
              {submitting ? 'Sender vurdering...' : 'Submit'}
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
};

export default Review;
