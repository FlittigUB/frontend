import BeaverHero from '@/components/common/BeaverHero';
import Section from '@/components/common/Section';
import Image from 'next/image';
import Link from 'next/link';
import NavbarLayout from '@/components/NavbarLayout';

export const revalidate = 3600; // Revalidate every hour: 3600

// Function to fetch Cooperation Partners
async function fetchCooperationPartners() {
  const res = await fetch(`${process.env.API_URL}/cooperationPartners`, {
    next: { revalidate: 3600 }, // Cache for 1 hour: 3600
  });

  if (!res.ok) {
    throw new Error('Failed to fetch cooperation partners');
  }

  return res.json();
}

// Function to fetch Employees
async function fetchEmployees() {
  const res = await fetch(`${process.env.API_URL}/employee`, {
    next: { revalidate: 3600 }, // Cache for 1 hour: 3600
  });

  if (!res.ok) {
    throw new Error('Failed to fetch employees');
  }

  return res.json();
}

export default async function OmOssPage() {
  let cooperationPartners = [];
  let employees = [];

  try {
    cooperationPartners = await fetchCooperationPartners();
  } catch (error) {
    console.error('Error fetching cooperation partners:', error);
  }

  try {
    employees = await fetchEmployees();
  } catch (error) {
    console.error('Error fetching employees:', error);
  }

  return (
    <NavbarLayout>
      <BeaverHero title={'Om Oss'} />

      {/* Team Members Section */}
      <Section className="bg-secondary">
        <h2 className="text-blueGreen pb-8 text-center text-5xl">
          Gjengen i Flittig UB
        </h2>

        <Image
          height={300}
          width={300}
          src={
            process.env.NEXT_PUBLIC_ASSETS_URL +
            '722b612f-b083-4a34-bef7-4b884bbeb2dc.png'
          }
          alt="Flittig UB maskott"
          className="mx-auto md:mx-0"
        />

        <h2 className="w-full text-center text-lg text-gray-600 md:w-2/5 md:text-left">
          Flittig er en ungdomsbedrift fra Kristiansand Katedralskole Gimle,
          bestående av 5 engasjerte elever. (f.v) HR- og Personalansvarlig: Ayad
          Muhammad Hayer, Produkt- og bærekraftsansvarlig: Henrik Granseth,
          Økonomi- og salgsansvarlig: Ingrid Stray, SoMe, Markeds- og
          Kommunikasjonsansvarlig, og Grafisk Designer: Celine Stahl og Daglig
          Leder: Emilie Kopland.
        </h2>

        {/* Existing Team Members (Hard-Coded) */}
        <div className="mt-12 px-4">
          <h3 className="text-blueGreen mb-8 text-center text-3xl">
            Møt Teamet
          </h3>
          <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {employees.map((employee: any) => (
              <div
                key={employee.id}
                className="flex flex-col items-center text-center"
              >
                <Image
                  height={150}
                  width={150}
                  src={
                    process.env.NEXT_PUBLIC_ASSETS_URL + employee.image // Assuming each employee has a 'photo' field
                  }
                  alt={employee.name}
                  className="mb-4 rounded-full"
                />
                <h4 className="text-blueGreen text-xl">
                  <Link href={`/info/om-oss/${employee.id}`}>
                    {employee.name}
                  </Link>
                </h4>
                <p className="text-gray-600 mb-4">{employee.role}</p>
                <Link
                  aria-label={`Les mer om ${employee.name}`}
                  className="inline-block rounded border-2 border-gray-400 px-6 py-2 text-gray-600 hover:bg-gray-100 mt-auto transition focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  href={`/info/om-oss/${employee.id}`}
                  passHref
                >
                  Les mer
                </Link>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Cooperation Partners Section */}
      <Section className="bg-secondary">
        <div className="space-y-12">
          {cooperationPartners.map((partner:any) => (
            <div
              data-testid="cooperation-partner" // Corrected attribute name
              key={partner.id}
              className="grid grid-cols-1 items-center gap-8 md:grid-cols-2"
            >
              {/* Partner Logo */}
              <div className="flex items-center justify-center">
                <Image
                  src={`${process.env.NEXT_PUBLIC_ASSETS_URL}${partner.logo}`}
                  alt={partner.title}
                  className="object-contain"
                  width={400}
                  height={400}
                />
              </div>

              {/* Partner Details */}
              <div className="flex flex-col items-center justify-center space-y-4 text-center md:items-start md:text-left">
                <h2 className="text-2xl font-bold text-foreground">
                  {partner.title}
                </h2>
                <p className="max-w-lg text-lg text-gray-600">
                  {partner.description}
                </p>
                <div>
                  {partner.link.map((link: any, index: never) => (
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

      {/* Address Section */}
      <Section className="flex h-80 flex-row items-center justify-center bg-primary">
        <h2 className="pb-4 text-left text-5xl text-foreground">Addresse</h2>
      </Section>
      <Section className="flex flex-col items-center justify-center bg-secondary">
        <h2 className="text-blueGreen pb-4 text-left text-5xl">
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
