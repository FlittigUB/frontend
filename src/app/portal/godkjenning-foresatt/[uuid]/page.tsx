'use client';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Application, Review } from '@/common/types';
import Head from 'next/head';
import JobItemPreview from '@/components/portal/job/JobItemPreview';
import ReviewsSection from '@/components/portal/user/reviews/ReviewsSection';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";

interface GuardianApplicationData {
  uuid: string;
  application: Application;
  status: string;
}

const GuardianApplicationPage = () => {
  const [guardianApp, setGuardianApp] = useState<GuardianApplicationData | null>(null);
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [averageRating, setAverageRating] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const params = useParams<{ uuid: string }>();
  const guardianAppId = params.uuid;

  // Fetch the guardian application data
  useEffect(() => {
    const fetchGuardianApplication = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/guardian-application/${guardianAppId}`
        );
        setGuardianApp(response.data);
      } catch (error) {
        console.error('Error fetching guardian application:', error);
        toast.error('Kunne ikke hente foresatt godkjenning data.');
      }
    };

    if (guardianAppId) {
      fetchGuardianApplication();
    }
  }, [guardianAppId]);

  // Fetch reviews once the guardian application has been loaded
  useEffect(() => {
    const fetchReviews = async () => {
      if (!guardianApp?.application?.job?.user?.id) return;
      try {
        const response = await axios.get<Review[]>(
          `${process.env.NEXT_PUBLIC_API_URL}/reviews/user/${guardianApp.application.job.user.id}`
        );
        setReviews(response.data);
        calculateAverageRating(response.data);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        toast.error('Kunne ikke hente omtaler til arbeidsgiver.');
      }
    };
    fetchReviews();
  }, [guardianApp]);

  const calculateAverageRating = (reviews: Review[]) => {
    if (reviews.length === 0) {
      setAverageRating(0);
      return;
    }
    const total = reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
    const avg = total / reviews.length;
    setAverageRating(parseFloat(avg.toFixed(1)));
  };

  // Example function for approving the application
  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/guardian-application/${guardianAppId}/accept`)
      toast.success('Søknaden ble godkjent!');
    } catch (error) {
      console.error('Error approving application:', error);
      toast.error('Det oppstod en feil under godkjenning.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Example function for declining the application
  const handleDecline = async () => {
    setIsProcessing(true);
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/guardian-application/${guardianAppId}/accept`)
      toast.success('Søknaden ble avslått!');
    } catch (error) {
      console.error('Error declining application:', error);
      toast.error('Det oppstod en feil under avslåing.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Show a simple loading state while fetching data
  if (!guardianApp) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Laster data...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
        <title>Foresatt Godkjenning</title>
      </Head>
      <div className="container mx-auto p-4">
        <h1 className="my-4 text-3xl font-bold">Foresatt Godkjenning</h1>
        {guardianApp.status === 'waiting' ? (
          <h2 className="mb-4 text-xl">
            {guardianApp.application.user.name} ber om godkjenning til å søke på
            en jobb
          </h2>
        ) : (
          <h2 className="mb-4 text-xl">
            {guardianApp.application.user.name} sin søknad er godkjent.
          </h2>
        )}

        {guardianApp.application.job ? (
          <JobItemPreview job={guardianApp.application.job} />
        ) : (
          <p className="text-red-500">Jobben ble ikke funnet!</p>
        )}

        {/* Action buttons */}
        {guardianApp.application.status === 'waitingOnGuardian' && (
          <div className="my-6 flex space-x-4">
            <Button
              onClick={handleApprove}
              variant="default"
              className={`${
                isProcessing ? 'cursor-not-allowed opacity-50' : ''
              }`}
            >
              Godkjenn
            </Button>
            <Button
              onClick={handleDecline}
              variant="destructive"
              className={`${
                isProcessing ? 'cursor-not-allowed opacity-50' : ''
              }`}
            >
              Avslå
            </Button>
          </div>
        )}

        {/* Reviews section */}
        {reviews ? (
          <div>
            <p className="my-4 text-2xl font-bold">
              {guardianApp.application.job.user.name} sine omtaler
            </p>
            <ReviewsSection reviews={reviews} averageRating={averageRating} />
          </div>
        ) : (
          <p>Omtaler ikke funnet</p>
        )}
      </div>
    </>
  );
};

export default GuardianApplicationPage;
