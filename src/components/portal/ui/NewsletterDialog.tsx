'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { MailIcon } from 'lucide-react';
import Link from 'next/link';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

export default function NewsletterDialog() {
  const [email, setEmail] = useState('');
  const [newsletterType, setNewsletterType] = useState('arbeidstaker');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/newsletter?type=${newsletterType}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        },
      );

      if (!response.ok) {
        throw new Error('Failed to subscribe');
      }
      setMessage('Takk for at du abonnerte!');
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Nyhetsbrev</Button>
      </DialogTrigger>
      <DialogContent>
        <div className="mb-2 flex flex-col items-center gap-2">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <svg
              className="stroke-zinc-800 dark:stroke-zinc-100"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 32 32"
              aria-hidden="true"
            >
              <circle cx="16" cy="16" r="12" fill="none" strokeWidth="8" />
            </svg>
          </div>
          <DialogHeader>
            <DialogTitle className="sm:text-center">
              Aldri gå glipp av oppdateringer
            </DialogTitle>
            <DialogDescription className="sm:text-center">
              Abonner for å få e-post om nyheter i Flittig UB
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="*:not-first:mt-2">
            <div className="relative">
              <Input
                id="dialog-subscribe"
                className="peer ps-9"
                placeholder="navn@epost.no"
                type="email"
                aria-label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                <MailIcon size={16} aria-hidden="true" />
              </div>
            </div>
          </div>

          <RadioGroup
            onValueChange={(value) => setNewsletterType(value)}
            defaultValue="arbeidstaker"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="arbeidstaker" id="r1" />
              <Label htmlFor="r1">Arbeidstaker</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="arbeidsgiver" id="r2" />
              <Label htmlFor="r2">Arbeidsgiver</Label>
            </div>
          </RadioGroup>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Abonnerer...' : 'Abonner'}
          </Button>
        </form>

        {message && (
          <p
            className={`text-center text-xs ${
              message === 'Takk for at du abonnerte!'
                ? 'text-green-500'
                : 'text-red-500'
            }`}
          >
            {message}
          </p>
        )}

        <p className="text-center text-xs text-muted-foreground">
          Ved å abonnere godtar du vår{' '}
          <Link className="underline hover:no-underline" href="#">
            Privacy Policy
          </Link>
          .
        </p>
      </DialogContent>
    </Dialog>
  );
}
