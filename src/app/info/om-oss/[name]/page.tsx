// src/app/portal/employee/[name]/page.tsx

import axios from 'axios';
import { Employee } from '@/common/types';
import Logo from '@/components/common/Logo';
import { Metadata } from 'next';
import NavbarLayout from '@/components/NavbarLayout';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export const revalidate = 60; // Oppfrisk siden hvert 60. sekund

interface PageProps {
  params: Promise<{ name: string }>;
}

// Hent ansattdata
async function fetchEmployee(name: string): Promise<Employee | null> {
  try {
    const response = await axios.get<Employee>(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/employee/${encodeURIComponent(name)}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  } catch (error: any) {
    console.error('Feil ved henting av ansatt:', error);
    return null;
  }
}

// Generer metadata for SEO
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const employee = await fetchEmployee((await params).name);

  if (!employee) {
    return {
      title: 'Den ansatte ble ikke funnet | Flittig',
      description: 'Den ansatte ble ikke funnet.',
    };
  }

  const description = employee.details?.substring(0, 150) || 'Ansatte.';

  return {
    title: `${employee.name} | Flittig UB Ansatte`,
    description: description,
    openGraph: {
      title: `${employee.name} | Flittig UB Ansatte`,
      description: description,
    },
  };
}

const EmployeePage = async ({ params }: PageProps) => {
  const employee = await fetchEmployee((await params).name);

  if (!employee) {
    notFound();
  }

  return (
    <NavbarLayout>
      <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
        {/* Logo at the top */}
        <div className="mb-12 flex justify-center">
          <Logo />
        </div>

        {/* Ansattkort */}
        <div className="mx-auto mb-16 max-w-4xl">
          <div className="rounded-3xl bg-white p-8 text-center shadow-md ring-1 ring-gray-200">
            <h1 className="mb-2 font-serif text-4xl font-bold tracking-tight text-foreground">
              {employee?.name}
            </h1>
            <p className="mb-6 text-lg font-medium text-gray-700">
              {employee?.role || 'Teammedlem'}
            </p>
            <div className="flex flex-col items-center justify-center gap-8 md:flex-row md:justify-around">
              <div className="relative h-48 w-48 overflow-hidden rounded-full bg-gray-200 shadow-neumorphic-icon">
                {employee?.image ? (
                  <Image
                    fill
                    src={`${process.env.NEXT_PUBLIC_ASSETS_URL}${employee.image}`}
                    alt={`${employee.name} sitt profilbilde`}
                    sizes="(max-width: 768px) 100vw, 40vw"
                    priority
                    className="object-cover"
                  />
                ) : (
                  <Image
                    fill
                    src="/images/default-avatar.png"
                    alt="Default profilbilde"
                    sizes="(max-width: 768px) 100vw, 40vw"
                    priority
                    className="object-cover"
                  />
                )}
              </div>
              <div className="prose max-w-prose text-left text-gray-800">
                <p>{employee?.details}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Generell informasjonsseksjon */}
        <div className="prose prose-lg mx-auto max-w-3xl text-gray-800">
          <h2 className="mb-4 text-2xl font-bold text-foreground">
            Om Teamet Vårt
          </h2>
          <p>
            Hos Flittig UB består teamet vårt av ungdommer som brenner for å
            skape en forskjell i lokalsamfunnet. Vi kombinerer kreativitet,
            pågangsmot og en vilje til å hjelpe andre med å tilby pålitelige
            tjenester innen barnepass, husvask, plenklipping og andre småjobber.
            Hvert medlem i teamet vårt bidrar med unike talenter og erfaringer,
            noe som gjør oss sterke som en samlet enhet. Vi setter samarbeid,
            ansvarlighet og kvalitet høyt, og jobber alltid for å levere
            tjenester som møter kundenes forventninger.
          </p>

          <h2 className="mb-4 mt-10 text-2xl font-bold text-foreground">
            Vår Misjon
          </h2>
          <p>
            Misjonen til Flittig UB er å gjøre hverdagen enklere for voksne og
            eldre, samtidig som vi gir unge muligheten til å tjene litt ekstra
            og utvikle verdifulle ferdigheter. Vi ønsker å bygge broer mellom
            generasjoner ved å skape en plattform som gjør det enkelt å finne
            hjelp eller tilby sine tjenester. Gjennom vårt arbeid bidrar vi til
            å styrke lokalsamfunn, øke tilgjengeligheten av småjobber og fremme
            ansvarsfølelse blant unge.
          </p>

          <h2 className="mb-4 mt-10 text-2xl font-bold text-foreground">
            Hvorfor Velge Flittig UB?
          </h2>
          <p>
            Når du velger Flittig UB, støtter du ungdom som ønsker å gjøre en
            forskjell. Vi tilbyr skreddersydde løsninger, slik at du kan få
            hjelp til alt fra barnevakt til en rask opprydding før selskap. Alle
            jobber er håndplukket for å sikre kvalitet og trygghet for begge
            parter. Med vårt system for vurderinger og omtaler, kan du være
            trygg på at tjenestene vi tilbyr er pålitelige.
          </p>

          <h2 className="mb-4 mt-10 text-2xl font-bold text-foreground">
            Hverdagen hos Flittig
          </h2>
          <p>
            Å være en del av Flittig UB betyr å jobbe i et miljø som oppmuntrer
            til vekst, læring og samarbeid. For oss handler det om mer enn bare
            småjobber – det handler om å skape en meningsfull opplevelse for
            både kunder og arbeidere. Våre teammedlemmer lærer å håndtere
            ansvar, kommunisere effektivt og bygge relasjoner som varer..
          </p>
          <h2 className="mb-4 mt-10 text-2xl font-bold text-foreground">
            Fremtiden Med Flittig UB
          </h2>
          <p>
            Vi er dedikerte til å vokse som bedrift og utvide tilbudet vårt. Med
            teknologi som BankID-innlogging og et brukervennlig grensesnitt,
            sikrer vi en trygg og enkel opplevelse for både kunder og arbeidere.
            Samtidig fokuserer vi på å skape muligheter for unge i lokalmiljøet
            og heve standarden for småjobber i Norge. Flittig UB – en smartere
            måte å få ting gjort på.
          </p>
        </div>
      </section>
    </NavbarLayout>
  );
};

export default EmployeePage;
