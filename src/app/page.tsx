import Image from 'next/image';
import BeaverHero from '@/components/common/BeaverHero';
import NavbarLayout from '@/components/NavbarLayout';
import Link from 'next/link';

export default function Home() {
  return (
    <NavbarLayout>
      <div className="relative bg-background">
        <BeaverHero
          title={'En enklere hverdag!'}
          subtitle={'Plattformen som gjør det lett å få hjelp til småjobber.'}
        />

        <section className="bg-secondary px-4 py-12">
          <div className="mx-auto flex max-w-4xl flex-col items-center md:flex-row md:items-start md:space-x-8">
            <div className="flex-shrink-0">
              <Image
                height={400}
                data-testid="flittig-logo"
                width={400}
                src="/FIB.png"
                alt="Flittig UB logo"
                className="mx-auto md:mx-0"
              />
            </div>
            <div className="mt-8 text-center md:text-left">
              <h2 className="text-blueGreen text-3xl font-bold">
                Hvordan fungerer Flittig?
              </h2>
              <p className="mb-6 mt-4 text-lg text-foreground">
                I Flittig legger du enkelt ut annonser over arbeidsoppgavene du
                trenger å få løst. Slik vil potensielle arbeidstakere kunne
                finne de småjobbene som passer de best. Fortell hva, hvor og
                når, så kan du anse jobben som gjort. Enkel å bruke, enkel å
                like!
              </p>
              <Link
                href="/portal/registrer-deg"
                className="hover:bg-primary-dark rounded-md bg-primary px-6 py-2 font-medium text-white"
              >
                Bli flittig nå!
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-primary px-4 py-24">
          <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
            <div className="mt-8">
              <h2 className="text-5xl font-bold text-foreground">
                Hverdagen skal være enkel
              </h2>
              <p className="mt-4 text-2xl text-foreground">
                ... og med flittig er du bare få tastetrykk unna
              </p>
            </div>
          </div>
        </section>

        <section className="bg-secondary px-4 py-12">
          <div className="mx-auto max-w-5xl text-center">
            <h2 className="text-blueGreen text-5xl font-bold">
              Vasking, flytting eller handlehjelp?
            </h2>
            <div className="flex w-full items-center justify-center">
              <p className="mt-8 text-center text-xl text-foreground md:w-1/2">
                Med Flittig løser du små og mellomstore jobber på en enkel måte.
                Det har aldri vært lettere å skaffe hjelp!
              </p>
            </div>
            <div className="mt-8 flex justify-center">
              <Image
                src="/tre-bevere.png"
                alt="Tre bevere som representerer vasking, flytting og handlehjelp"
                width={600}
                height={400}
                className="w-full md:w-3/4"
              />
            </div>
          </div>
        </section>

        <section className="relative flex h-[50vh] w-full">
          <Image
            src="/Bever-mynt-bg.png"
            alt="Flittig UB Logo"
            fill
            priority
            className="absolute inset-0 object-cover object-left md:object-center"
          />
          <div className="z-10 flex w-1/3 flex-1 flex-col items-center justify-center rounded-xl border border-white/30 bg-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-md">
            <h1 className="text-center text-5xl font-bold text-foreground">
              Bli flittig du også!
            </h1>
            <Link
              data-testid="bli-flittig-button"
              href="/portal/registrer-deg"
              className="mt-6 rounded-md bg-secondary px-6 py-2 font-medium text-foreground"
            >
              Registrer deg
            </Link>
          </div>
        </section>
      </div>
    </NavbarLayout>
  );
}
