'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Facebook, Instagram, Send } from 'lucide-react';
import Link from 'next/link';

function FooterSection() {

  return (
    <footer className="relative border-t bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <h2 className="mb-4 text-3xl font-bold tracking-tight">
              Hold deg oppdatert
            </h2>
            <p className="mb-6 text-muted-foreground">
              Bli med i vår e-post liste for nyheter i Flittig UB.
            </p>
            <form className="relative">
              <Input
                type="email"
                placeholder="Enter your email"
                className="pr-12 backdrop-blur-sm"
              />
              <Button
                variant="default"
                type="submit"
                size="icon"
                className="absolute right-1 top-1 h-8 w-8 rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Subscribe</span>
              </Button>
            </form>
            <div className="absolute -right-4 top-0 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Lenker</h3>
            <nav className="space-y-2 text-sm">
              <Link
                href="#"
                className="block transition-colors hover:text-primary"
              >
                Hjem
              </Link>
              <Link
                href="/info/om-oss"
                className="block transition-colors hover:text-primary"
              >
                Om oss
              </Link>
              <Link
                href="#"
                className="block transition-colors hover:text-primary"
              >
                Kontakt
              </Link>
            </nav>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Kontakt oss</h3>
            <address className="space-y-2 text-sm not-italic">
              <p>Jegersbergveien 1</p>
              <p>Kristiansand, 4639</p>
              <Link href={'mailto:kontakt@flittigub.no'}>
                Email: kontakt@flittigub.no
              </Link>
            </address>
          </div>
          <div className="relative">
            <h3 className="mb-4 text-lg font-semibold">Følg oss</h3>
            <div className="mb-6 flex space-x-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                    >
                      <Facebook className="h-4 w-4" />
                      <span className="sr-only">Facebook</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Følg oss på facebook</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                    >
                      <Instagram className="h-4 w-4" />
                      <span className="sr-only">Instagram</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Følg oss på instagram</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 text-center md:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2025 Flittig Ungdomsbedrift. Alle rettigheter reservert.
          </p>
          <nav className="flex gap-4 text-sm">
            <Link href="/info/flittig-ub-policy" className="transition-colors hover:text-primary">
              Bedrifts Policy
            </Link>
            <Link href="/info/vilkaar-for-bruk" className="transition-colors hover:text-primary">
              Vilkår for bruk
            </Link>
            <Link href="#" className="transition-colors hover:text-primary">
              Cookie Settings
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

export { FooterSection };
