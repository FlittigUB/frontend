import Image from 'next/image';
import NavbarLayout from '@/components/NavbarLayout';
import Link from 'next/link';

export default function Home() {
  return (
    <NavbarLayout>
      <main>
        {/* HERO SECTION */}
        <section className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden bg-gray-100 text-center">
          {/* Background Image */}
          <div className="absolute inset-0 z-0 h-full w-full">
            <Image
              src="https://panel.flittigub.no/assets/5c6a2d28-09a2-4f9b-87c4-36c0ec26319c.png"
              alt="Flittig Hero Background"
              fill
              className="object-cover"
              style={{ objectPosition: '50% 80%' }}
              priority
            />
          </div>

          {/* Semi-Transparent Overlay */}
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 to-black/10" />

          <div className="relative z-20 max-w-4xl px-6 py-12">
            <h1 className="mb-4 text-5xl font-extrabold text-white drop-shadow-md md:text-6xl">
              Gjør hverdagen enklere med Flittig
            </h1>
            <p className="mb-6 text-lg text-white md:text-xl">
              En plattform som kobler ungdom med mennesker som trenger hjelp til
              småoppgaver—raskt, trygt og enkelt.
            </p>
            <div className="flex flex-col items-center space-y-3 md:flex-row md:space-x-4 md:space-y-0">
              <Link
                href="/portal/registrer-deg"
                className="inline-block rounded-md bg-yellow-500 px-8 py-3 text-lg font-semibold text-white shadow-md transition-transform duration-300 hover:scale-105 hover:bg-yellow-600"
              >
                Bli flittig du også
              </Link>
              <Link
                href="/portal/stillinger"
                className="leading-5 bg-white inline-block rounded-md border border-yellow-500 px-8 py-3 text-lg font-semibold text-yellow-500 shadow-md transition-transform duration-300 hover:scale-105 hover:bg-yellow-50"
              >
                Se ledige oppdrag
                <p className="text-sm text-gray-400">(Krever ikke innlogging)</p>
              </Link>
              {/* CTA 2 */}
              <Link
                href="/portal"
                className="bg-white inline-block rounded-md border border-green-500 px-8 py-3 text-lg font-semibold text-green-500 shadow-md transition-transform duration-300 hover:scale-105 hover:bg-green-50"
              >
                Publiser oppdrag
                <p className="text-sm text-gray-400">(Krever innlogging)</p>
              </Link>
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section className="bg-white px-6 py-16">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-4 text-center text-4xl font-bold text-gray-900 md:text-5xl">
              Hva er Flittig?
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-gray-700">
              Flittig er en ungdomsbedrift som forenkler hverdagen for de som
              trenger litt ekstra hjelp. Eldre eller travle familier kan ha
              utfordringer med alt fra husvask og hagearbeid til barnepass.
              Samtidig finnes det unge som ønsker å tjene litt ekstra ved å bruke
              sine ferdigheter og sin tilgjengelige tid.
            </p>
            <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-gray-700">
              Gjennom Flittig kan du enten legge ut oppdrag du vil ha utført, eller
              finne småjobber som passer dine ønsker. Dette gjør det enkelt å koble
              behov og ressurser i nærmiljøet, til alles fordel.
            </p>
            <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-gray-700">
              Som ungdomsbedrift har Flittig UB allerede gjort en merkbar
              forskjell. For eksempel har en av våre faste oppdragsgivere, Kari
              Hansen, brukt plattformen jevnlig for hagearbeid og lettere
              vedlikehold av boligen. Samtidig har unge arbeidstakere som Ola
              Nordmann og Emma Larsen fått muligheten til å bygge arbeidserfaring
              og tjene litt ekstra. Slike historier viser hvordan Flittig skaper
              en vinn-vinn-situasjon for både privatpersoner og lokalsamfunnet.
            </p>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="bg-green-50 px-6 py-16">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-8 text-center text-3xl font-bold text-green-900 md:text-4xl">
              Hvordan fungerer Flittig?
            </h2>
            <div className="grid max-w-4xl grid-cols-1 gap-10 md:mx-auto md:grid-cols-2">
              <div>
                <h3 className="mb-2 text-xl font-semibold text-green-900">
                  For oppdragsgivere
                </h3>
                <p className="leading-relaxed text-gray-700">
                  Opprett en profil og legg ut en kort beskrivelse av oppdraget —
                  når, hvor og hva som skal gjøres. Du får raskt oversikt over
                  interesserte ungdommer, og dere blir enige om lønn og
                  tidsrammer.
                </p>
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold text-green-900">
                  For arbeidstakere
                </h3>
                <p className="leading-relaxed text-gray-700">
                  Er du student eller ung voksen? Bla gjennom ledige stillinger
                  uten å logge inn. Deretter kan du opprette en brukerkonto når du
                  er klar for å sende en søknad. Slik tjener du litt ekstra og får
                  verdifull erfaring.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* WHY CHOOSE FLITTIG SECTION */}
        <section className="relative flex flex-col items-center justify-center overflow-hidden bg-white px-6 py-16 text-center">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Hvorfor velge Flittig?
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-gray-700">
              Vi vektlegger trygghet, fleksibilitet og enkelhet — alt for å koble
              behov og ressurser på en smidig måte. Hverken oppdragsgiver eller
              arbeidstaker trenger å forholde seg til tunge prosesser eller skjulte
              avgifter.
            </p>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <div className="rounded-lg bg-yellow-50 p-6 shadow-sm">
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  Nærmiljø-fokus
                </h3>
                <p className="leading-relaxed text-gray-700">
                  Finn eller tilby hjelp i ditt eget område og bygg gode relasjoner
                  på tvers av generasjoner.
                </p>
              </div>
              <div className="rounded-lg bg-yellow-50 p-6 shadow-sm">
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  Raskt og effektivt
                </h3>
                <p className="leading-relaxed text-gray-700">
                  Svar og avtaler kommer kjapt, uten fordyrende mellomledd eller
                  komplisert oppfølging.
                </p>
              </div>
              <div className="rounded-lg bg-yellow-50 p-6 shadow-sm">
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  Stor fleksibilitet
                </h3>
                <p className="leading-relaxed text-gray-700">
                  Bestem selv når du vil jobbe, og hvilke oppgaver du ønsker å
                  ta på deg. Oppdragsgivere setter kravene ut fra egne behov.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* COMMUNITY IMPACT SECTION */}
        <section className="bg-green-50 px-6 py-16">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-4 text-center text-3xl font-bold text-green-900 md:text-4xl">
              Vårt bidrag til lokalsamfunnet
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-gray-700">
              Småjobber som husvask, flyttehjelp og barnepass knytter folk tettere
              sammen. Flittig gir unge en trygg arena for å tjene litt ekstra og
              utvikle seg, samtidig som flere får løst daglige utfordringer.
              Kort sagt: alle vinner, og lokalsamfunnet blir litt bedre.
            </p>
            <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-gray-700">
              Lurer du på noe mer? Du kan lese mer om oss på
              <Link
                href="/info/om-oss"
                className="ml-1 font-semibold text-green-900 underline"
              >
                Om Oss-siden
              </Link>
              , eller du kan sjekke vår
              <Link
                href="/info/ofte-stilte-sporsmal"
                className="ml-1 font-semibold text-green-900 underline"
              >
                FAQ
              </Link>
              .
            </p>
            {/* External link section for SEO */}
            <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-gray-700">
              For mer informasjon om hvordan ungdomsbedrifter fungerer i Norge,
              kan du lese mer hos
              <a
                href="https://ue.no/"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 font-semibold text-green-900 underline"
              >
                Ungt Entreprenørskap
              </a>
              .
            </p>
          </div>
        </section>

        {/* SPONSORS SECTION */}
        <section className="bg-white px-6 py-16">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-4 text-center text-3xl font-bold text-gray-900 md:text-4xl">
              Våre sponsorer
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-center text-lg leading-relaxed text-gray-700">
              Vi er stolte av å ha flotte samarbeidspartnere som støtter vårt
              arbeid og hjelper oss å vokse. Mer informasjon finner du på vår
              <Link
                href="/info/om-oss"
                className="ml-1 font-semibold text-green-900 underline"
              >
                Om Oss
              </Link>
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-8">
              <Link
                href="/info/om-oss"
                aria-label="Les mer om sponsor"
                className="transition-transform hover:scale-105"
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_ASSETS_URL}f80115fb-2be2-4131-9a3d-f6121fe58af8.png`}
                  alt="Kristoffer Nerskogen Logo"
                  width={120}
                  height={60}
                  className="object-contain"
                />
              </Link>
              <Link
                href="/info/om-oss"
                aria-label="Les mer om sponsor"
                className="transition-transform hover:scale-105"
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_ASSETS_URL}4d17118a-2269-4af1-818a-79926aef1234.png`}
                  alt="UIA Logo"
                  width={120}
                  height={60}
                  className="object-contain"
                />
              </Link>
              <Link
                href="/info/om-oss"
                aria-label="Les mer om sponsor"
                className="transition-transform hover:scale-105"
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_ASSETS_URL}ccf4234a-f3f4-4a60-a225-bcbadd67dfda.png`}
                  alt="Dyreparken Logo"
                  width={120}
                  height={60}
                  className="object-contain"
                />
              </Link>
            </div>
          </div>
        </section>

        {/* SERVICES SECTION */}
        <section className="bg-green-50 px-6 py-16">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-4 text-center text-3xl font-bold text-green-900 md:text-4xl">
              Eksempler på oppgaver
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-center text-lg leading-relaxed text-gray-700">
              Her er noen populære tjenester du kan tilby eller få utført:
            </p>
            <div className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-6 text-gray-700 md:grid-cols-3">
              <div className="flex flex-col items-center justify-center rounded-lg bg-yellow-50 p-4 shadow-sm">
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  Rengjøring
                </h3>
                <p className="text-center">
                  Hjelp med husvask, rydding eller annet vedlikehold innendørs.
                </p>
              </div>
              <div className="flex flex-col items-center justify-center rounded-lg bg-yellow-50 p-4 shadow-sm">
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  Hagearbeid
                </h3>
                <p className="text-center">
                  Alt fra gressklipping og planting til å forskjønne uteplassen.
                </p>
              </div>
              <div className="flex flex-col items-center justify-center rounded-lg bg-yellow-50 p-4 shadow-sm">
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  Barnepass
                </h3>
                <p className="text-center">
                  Ansvarsfulle ungdommer kan stille opp som barnevakt.
                </p>
              </div>
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/portal/stillinger"
                className="inline-block rounded-md bg-yellow-500 px-8 py-3 text-lg font-semibold text-white shadow-md transition-transform duration-300 hover:scale-105 hover:bg-yellow-600"
              >
                Se flere oppdrag
              </Link>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="relative flex min-h-[40vh] w-full items-center justify-center bg-green-100">
          <div className="absolute inset-0 z-0 opacity-10">
            <Image
              src="/Bever-mynt-bg.png"
              alt="Flittig UB Background"
              fill
              className="object-cover object-center"
            />
          </div>
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <div className="mx-4 rounded-xl bg-white/80 px-8 py-12 shadow-md backdrop-blur-sm">
              <h2 className="text-4xl font-extrabold text-gray-900 md:text-5xl">
                Bli med i Flittig i dag!
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-gray-700">
                Opprett en konto og finn hjelpere, eller se ledige oppdrag på et
                øyeblikk. Sammen bygger vi et mer inkluderende og fleksibelt
                lokalsamfunn.
              </p>
              <div className="mt-8 flex flex-col items-center space-y-3 md:flex-row md:space-x-4 md:space-y-0">
                <Link
                  href="/portal/registrer-deg"
                  className="inline-block rounded-md bg-yellow-500 px-8 py-3 text-lg font-semibold text-white shadow-lg transition-transform duration-300 hover:scale-105 hover:bg-yellow-600"
                >
                  Registrer deg
                </Link>
                <Link
                  href="/portal/stillinger"
                  className="inline-block rounded-md border border-yellow-500 px-8 py-3 text-lg font-semibold text-yellow-500 shadow-lg transition-transform duration-300 hover:scale-105 hover:bg-yellow-50"
                >
                  Se oppdrag uten innlogging
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </NavbarLayout>
  );
}
