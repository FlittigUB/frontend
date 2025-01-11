import Image from 'next/image';
import BeaverHero from '@/components/common/BeaverHero';
import NavbarLayout from '@/components/NavbarLayout';
import Link from 'next/link';

export default function Home() {
  return (
    <NavbarLayout>
      <div className="relative bg-gradient-to-b from-yellow-300 via-yellow-200 to-yellow-100">
        {/* Hero Section */}
        <BeaverHero
          title="En enklere hverdag!"
          subtitle="Plattformen som gjør det lett å få hjelp til småjobber."
        />

        {/* How It Works Section */}
        <section className="bg-secondary px-6 py-16">
          <div className="mx-auto flex max-w-6xl flex-col items-center md:flex-row md:items-start md:space-x-12">
            <div className="flex-shrink-0">
              <Image
                height={400}
                width={400}
                src="/FIB.png"
                alt="Flittig UB logo"
                className="mx-auto drop-shadow-lg"
              />
            </div>
            <div className="mt-8 text-center md:text-left">
              <h2 className="text-blueGreen text-4xl font-extrabold">
                Hvordan fungerer Flittig?
              </h2>
              <p className="mb-6 mt-4 text-lg text-gray-800">
                I Flittig legger du enkelt ut annonser over arbeidsoppgavene du
                trenger å få løst. Slik vil potensielle arbeidstakere kunne finne
                de småjobbene som passer de best. Fortell hva, hvor og når, så kan
                du anse jobben som gjort. Enkel å bruke, enkel å like!
              </p>
              <Link
                href="/portal/registrer-deg"
                className="hover:bg-primary-dark rounded-lg bg-primary px-8 py-3 font-semibold text-white shadow-md transition duration-300"
              >
                Bli flittig nå!
              </Link>
            </div>
          </div>
        </section>

        {/* Key Message Section */}
        <section className="bg-gradient-to-r from-green-100 via-white to-green-100 px-6 py-20">
          <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
            <h2 className="text-5xl font-bold text-green-800">
              Hverdagen skal være enkel
            </h2>
            <p className="mt-4 text-2xl text-gray-700">
              ... og med Flittig er du bare få tastetrykk unna.
            </p>
          </div>
        </section>

        {/* Services Section */}
        <section className="bg-secondary px-6 py-16">
          <div className="mx-auto max-w-6xl text-center">
            <h2 className="text-blueGreen text-5xl font-extrabold">
              Vasking, flytting eller handlehjelp?
            </h2>
            <p className="mt-8 text-xl text-gray-800 md:w-3/5 mx-auto">
              Med Flittig løser du små og mellomstore jobber på en enkel måte.
              Det har aldri vært lettere å skaffe hjelp!
            </p>
            <div className="mt-8 flex justify-center">
              <Image
                src="/tre-bevere.png"
                alt="Tre bevere som representerer vasking, flytting og handlehjelp"
                width={600}
                height={400}
                className="rounded-lg drop-shadow-xl"
              />
            </div>
          </div>
        </section>

        {/* Call-to-Action Section */}
        <section className="relative flex h-[60vh] w-full">
          {/* Full-Width Background Image */}
          <Image
            src="/Bever-mynt-bg.png"
            alt="Flittig UB Background"
            fill
            priority
            className="absolute inset-0 object-cover object-center"
          />

          {/* Content Box */}
          <div
            className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center justify-center text-center px-4 py-12">
            <div className="rounded-xl bg-white/80 py-12 px-10 shadow-lg backdrop-blur-sm">
              <h1 className="text-5xl font-extrabold text-gray-900">
                Bli flittig du også!
              </h1>
              <p className="mt-4 text-lg text-gray-700 leading-relaxed">
                Registrer deg i dag og bli en del av vårt voksende nettverk!
              </p>
              <Link
                data-testid="bli-flittig-button"
                href="/portal/registrer-deg"
                className="mt-6 inline-block rounded-lg bg-yellow-500 px-8 py-3 text-lg font-semibold text-white shadow-md transition-transform duration-300 hover:bg-yellow-600 hover:scale-105"
              >
                Registrer deg
              </Link>
            </div>
          </div>
        </section>

      </div>
    </NavbarLayout>
  );
}
