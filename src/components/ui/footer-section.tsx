import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Facebook, Instagram } from 'lucide-react';
import Link from 'next/link';
import NewsletterDialog from '@/components/portal/ui/NewsletterDialog';
import axios from 'axios';

interface Info {
  id: string;
  status: 'published' | 'draft' | 'archived';
  content: string;
  title: string;
  description: string;
}

export const revalidate = 300;

async function FooterSection() {
  const infoLinks = (
    await axios.get<Info[]>(`${process.env.NEXT_PUBLIC_API_URL}/info`)
  ).data;
  return (
    <footer className="relative border-t bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="relative">
            <h2 className="mb-4 text-3xl font-bold tracking-tight">
              Hold deg oppdatert
            </h2>
            <p className="mb-6 text-muted-foreground">
              Bli med i vår e-post liste for nyheter i Flittig UB.
            </p>
            <div className="relative">
              <NewsletterDialog />
            </div>
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
            <h3 className="mb-4 text-lg font-semibold">Info</h3>
            <nav className="space-y-2 text-sm">
              {infoLinks
                .filter((link) => link.status === 'published')
                .map((link) => (
                  <Link
                    className="block transition-colors hover:text-primary"
                    key={link.id}
                    href={`/info/${link.id}`}
                  >
                    {link.title.split('|')[0]}
                  </Link>
                ))}
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
            <Link
              href="/info/flittig-ub-policy"
              className="transition-colors hover:text-primary"
            >
              Bedrifts Policy
            </Link>
            <Link
              href="/info/vilkaar-for-bruk"
              className="transition-colors hover:text-primary"
            >
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
