import BeaverHero from '@/components/common/BeaverHero';
import Section from '@/components/common/Section';
import Image from 'next/image';
import NavbarLayout from "@/components/NavbarLayout";

export default function OmOssPage() {
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
        <h2 className="w-2/5 text-lg text-gray-600">
          Flittig er en ungdomsbedrift fra Kristiansand Katedralskole Gimle,
          bestående av 5 engasjerte elever. (f.v) HR- og Personalansvarlig: Ayad
          Muhammad Hayer, Produkt- og bærekraftsansvarlig: Henrik Granseth,
          Økonomi- og salgsansvarlig: Ingrid Stray, SoMe, Markeds- og
          Kommunikasjonsansvarlig, og Grafisk Designer: Celine Stahl og Daglig
          Leder: Emilie Kopland.
        </h2>
      </Section>
      <Section className="bg-secondary">
        <div className="flex flex-row items-center justify-center">
          <Image
            src={
              process.env.NEXT_PUBLIC_ASSETS_URL +
              'ccf4234a-f3f4-4a60-a225-bcbadd67dfda.png'
            }
            alt="Flittig UB Logo"
            className="mx-auto md:mx-0"
            width={500}
            height={100}
          />
          <div className="mx-5 w-1/3">
            <h2 className="pb-4 text-left text-3xl text-foreground">
              SamarbeidsPartner
            </h2>
            <p className="mt-2 text-left text-lg text-gray-600">
              Vi er utrolig stolte og takknemlige for å ha Kristiansand Dyrepark
              som offisiell samarbeidspartner.
            </p>
          </div>
        </div>
        <a
          href="https://dyreparken.no"
          className="mt-12 border-2 border-gray-400 px-12 py-4 text-gray-600"
        >
          Dyreparken.no
        </a>
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
