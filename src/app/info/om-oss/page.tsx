import BeaverHero from '@/components/common/BeaverHero';
import Section from '@/components/common/Section';
import Image from 'next/image';
import Link from 'next/link';
import NavbarLayout from "@/components/NavbarLayout";

export const revalidate = 3600; // Revalidate every hour: 3600

async function fetchCooperationPartners() {
  const res = await fetch(`${process.env.API_URL}/cooperationPartners`, {
    next: { revalidate: 3600 }, // Cache for 1 hour: 3600
  });

  if (!res.ok) {
    throw new Error('Failed to fetch cooperation partners');
  }

  return res.json();
}

export default async function OmOssPage() {
  let cooperationPartners = [];

  try {
    cooperationPartners = await fetchCooperationPartners();
  } catch (error) {
    console.error(error);
  }

  return (
    <NavbarLayout>
      <BeaverHero title={'Om Oss'} />
      <Section className="bg-secondary">
        <h2 className={'pb-8 text-center text-5xl text-blueGreen'}>
          Gjengen i Flittig UB
        </h2>

        <Image
          height={300}
          width={300}
          src={
            process.env.NEXT_PUBLIC_ASSETS_URL +
            '722b612f-b083-4a34-bef7-4b884bbeb2dc.png'
          }
          alt="Flittig UB logo"
          className="mx-auto md:mx-0"
        />
        <h2 className="text-center md:text-left w-full md:w-2/5 text-lg text-gray-600">
          Flittig er en ungdomsbedrift fra Kristiansand Katedralskole Gimle,
          bestående av 5 engasjerte elever. (f.v) HR- og Personalansvarlig: Ayad
          Muhammad Hayer, Produkt- og bærekraftsansvarlig: Henrik Granseth,
          Økonomi- og salgsansvarlig: Ingrid Stray, SoMe, Markeds- og
          Kommunikasjonsansvarlig, og Grafisk Designer: Celine Stahl og Daglig
          Leder: Emilie Kopland.
        </h2>
      </Section>
      <Section className="bg-secondary">
        <div className="space-y-12">
          {cooperationPartners.map((partner: any) => (
            <div
              key={partner.id}
              className="grid grid-cols-1 md:grid-cols-2 items-center gap-8"
            >
              {/* Partner Logo */}
              <div className="flex justify-center items-center">
                <Image
                  src={`${process.env.NEXT_PUBLIC_ASSETS_URL}${partner.logo}`}
                  alt={partner.title}
                  className="object-contain"
                  width={400}
                  height={400}
                />
              </div>

              {/* Partner Details */}
              <div className="flex flex-col justify-center items-center text-center md:items-start md:text-left space-y-4">
                <h2 className="text-2xl font-bold text-foreground">{partner.title}</h2>
                <p className="text-lg text-gray-600 max-w-lg">{partner.description}</p>
                <div>
                  {partner.link.map((link: any, index: number) => (
                    <Link
                      key={index}
                      href={link.link}
                      passHref
                      className="inline-block rounded border-2 border-gray-400 px-6 py-2 text-gray-600 hover:bg-gray-100"
                    >
                      {link.title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section className="flex h-80 flex-row items-center justify-center bg-primary">
        <h2 className="pb-4 text-left text-5xl text-foreground">Addresse</h2>
      </Section>
      <Section className="flex flex-col items-center justify-center bg-secondary">
        <h2 className="pb-4 text-left text-5xl text-blueGreen">
          &#34;Kontoret&#34;
        </h2>
        <p className="mb-8 mt-2 text-left text-2xl text-gray-600">
          Lund, Jegersbergveien 1, 4630 Kristiansand
        </p>
        <Image
          src="/gmaps.png"
          alt="Google Maps Plassering for kontoret"
          width={900}
          height={600}
        />
      </Section>
    </NavbarLayout>
  );
}
