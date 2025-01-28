"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import NavbarLayout from "@/components/NavbarLayout";
import { Button } from "@/components/ui/button"; // or your custom button
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ParallaxLayer } from "@/components/effects/ParallaxLayer";
import { PinnedStorySection } from "@/components/PinnedStorySection";

export default function Home() {
  return (
    <NavbarLayout>
      <main className="flex flex-col">
        {/*
          HERO SECTION
          Multiple parallax layers + text animations
        */}
        <section className="relative flex min-h-[90vh] w-full flex-col items-center justify-center overflow-hidden">
          {/* Parallax Background Layers */}
          <ParallaxLayer
            src="https://panel.flittigub.no/assets/5c6a2d28-09a2-4f9b-87c4-36c0ec26319c.png"
            alt="Hero Background"
            speed={0.5} // slow movement for the far background
            priority
          />
          {/* Semi-Transparent overlay for better text contrast */}
          <div className="absolute inset-0 z-10 bg-black/40" />

          {/* Hero Content */}
          <div className="relative z-20 flex max-w-5xl flex-col items-center px-6 py-12 text-center">
            <motion.h1
              className="mb-6 text-5xl font-extrabold tracking-tight text-white drop-shadow-md md:text-6xl"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 1.0,
                ease: "easeOut",
              }}
            >
              Gjør hverdagen enklere med Flittig
            </motion.h1>

            <motion.p
              className="mb-8 max-w-3xl text-lg text-white md:text-xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              En plattform som kobler ungdom med mennesker som trenger hjelp til
              småoppgaver—raskt, trygt og enkelt.
            </motion.p>

            <motion.div
              className="flex flex-col items-center space-y-3 md:flex-row md:space-x-4 md:space-y-0"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              <Button
                asChild
                variant="default"
                size="lg"
                className="bg-yellow-500 hover:bg-yellow-600"
              >
                <Link href="/portal/registrer-deg">Bli flittig du også</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-yellow-500 text-yellow-500 hover:bg-yellow-50"
              >
                <Link href="/portal/stillinger">
                  Se ledige oppdrag
                  <p className="text-sm text-gray-400">
                    (Krever ikke innlogging)
                  </p>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                <Link href="/portal">
                  Publiser oppdrag
                  <p className="text-sm text-gray-400">(Krever innlogging)</p>
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/*
          ABOUT SECTION
          Fades in on scroll
        */}
        <motion.section
          className="bg-white px-6 py-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-4 text-center text-4xl font-bold text-gray-900 md:text-5xl">
              Hva er Flittig?
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-gray-700">
              Flittig er en ungdomsbedrift som forenkler hverdagen for de som
              trenger litt ekstra hjelp. Eldre eller travle familier kan ha
              utfordringer med alt fra husvask og hagearbeid til barnepass.
              Samtidig finnes det unge som ønsker å tjene litt ekstra ved å
              bruke sine ferdigheter og sin tilgjengelige tid.
            </p>
            <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-gray-700">
              Gjennom Flittig kan du enten legge ut oppdrag du vil ha utført,
              eller finne småjobber som passer dine ønsker. Dette gjør det
              enkelt å koble behov og ressurser i nærmiljøet, til alles fordel.
            </p>
            <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-gray-700">
              Som ungdomsbedrift har Flittig UB allerede gjort en merkbar
              forskjell. For eksempel har en av våre faste oppdragsgivere, Kari
              Hansen, brukt plattformen jevnlig for hagearbeid og lettere
              vedlikehold av boligen. Samtidig har unge arbeidstakere som Ola
              Nordmann og Emma Larsen fått muligheten til å bygge
              arbeidserfaring og tjene litt ekstra. Slike historier viser
              hvordan Flittig skaper en vinn-vinn-situasjon for både
              privatpersoner og lokalsamfunnet.
            </p>
          </div>
        </motion.section>

        {/*
          HOW IT WORKS
          Staggered cards fade in
        */}
        <motion.section
          className="bg-green-50 px-6 py-16"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, y: 30 },
            show: {
              opacity: 1,
              y: 0,
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
        >
          <div className="mx-auto max-w-5xl">
            <motion.h2
              className="mb-8 text-center text-3xl font-bold text-green-900 md:text-4xl"
              variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
            >
              Hvordan fungerer Flittig?
            </motion.h2>
            <div className="grid max-w-4xl grid-cols-1 gap-10 md:mx-auto md:grid-cols-2">
              {[
                {
                  title: "For oppdragsgivere",
                  text: `Opprett en profil og legg ut en kort beskrivelse av oppdraget — når, hvor og hva som skal gjøres. Du får raskt oversikt over interesserte ungdommer, og dere blir enige om lønn og tidsrammer.`,
                },
                {
                  title: "For arbeidstakere",
                  text: `Er du student eller ung voksen? Bla gjennom ledige stillinger uten å logge inn. Deretter kan du opprette en brukerkonto når du er klar for å sende en søknad. Slik tjener du litt ekstra og får verdifull erfaring.`,
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
                >
                  <Card className="border-none shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold text-green-900">
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="leading-relaxed text-gray-700">
                        {item.text}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/*
          WHY CHOOSE FLITTIG
        */}
        <motion.section
          className="relative flex flex-col items-center justify-center bg-white px-6 py-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Hvorfor velge Flittig?
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-gray-700">
              Vi vektlegger trygghet, fleksibilitet og enkelhet — alt for å
              koble behov og ressurser på en smidig måte. Hverken oppdragsgiver
              eller arbeidstaker trenger å forholde seg til tunge prosesser
              eller skjulte avgifter.
            </p>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {[
                {
                  title: "Nærmiljø-fokus",
                  text: "Finn eller tilby hjelp i ditt eget område og bygg gode relasjoner på tvers av generasjoner.",
                },
                {
                  title: "Raskt og effektivt",
                  text: "Svar og avtaler kommer kjapt, uten fordyrende mellomledd eller komplisert oppfølging.",
                },
                {
                  title: "Stor fleksibilitet",
                  text: "Bestem selv når du vil jobbe, og hvilke oppgaver du ønsker å ta på deg. Oppdragsgivere setter kravene ut fra egne behov.",
                },
              ].map((item, i) => (
                <Card key={i} className="border-none bg-yellow-50 shadow-sm">
                  <CardHeader>
                    <CardTitle className="mb-2 text-xl font-semibold text-gray-900">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="leading-relaxed text-gray-700">{item.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </motion.section>

        {/*
          COMMUNITY IMPACT
        */}
        <motion.section
          className="bg-green-50 px-6 py-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-4 text-center text-3xl font-bold text-green-900 md:text-4xl">
              Vårt bidrag til lokalsamfunnet
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-gray-700">
              Småjobber som husvask, flyttehjelp og barnepass knytter folk
              tettere sammen. Flittig gir unge en trygg arena for å tjene litt
              ekstra og utvikle seg, samtidig som flere får løst daglige
              utfordringer. Kort sagt: alle vinner, og lokalsamfunnet blir litt
              bedre.
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
        </motion.section>

        {/*
          SPONSORS
        */}
        <motion.section
          className="bg-white px-6 py-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
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
              -side.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-8">
              {[
                {
                  img: `${process.env.NEXT_PUBLIC_ASSETS_URL}f80115fb-2be2-4131-9a3d-f6121fe58af8.png`,
                  alt: "Kristoffer Nerskogen Logo",
                },
                {
                  img: `${process.env.NEXT_PUBLIC_ASSETS_URL}4d17118a-2269-4af1-818a-79926aef1234.png`,
                  alt: "UIA Logo",
                },
                {
                  img: `${process.env.NEXT_PUBLIC_ASSETS_URL}ccf4234a-f3f4-4a60-a225-bcbadd67dfda.png`,
                  alt: "Dyreparken Logo",
                },
              ].map((sponsor, i) => (
                <motion.div
                  key={i}
                  className="transition-transform hover:scale-105"
                  whileHover={{ scale: 1.05 }}
                >
                  <Link href="/info/om-oss" aria-label="Les mer om sponsor">
                    <Image
                      src={sponsor.img}
                      alt={sponsor.alt}
                      width={120}
                      height={60}
                      className="object-contain"
                    />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/*
          SERVICES
        */}
        <motion.section
          className="bg-green-50 px-6 py-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-4 text-center text-3xl font-bold text-green-900 md:text-4xl">
              Eksempler på oppgaver
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-center text-lg leading-relaxed text-gray-700">
              Her er noen populære tjenester du kan tilby eller få utført:
            </p>
            <div className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
              {[
                {
                  title: "Rengjøring",
                  description:
                    "Hjelp med husvask, rydding eller annet vedlikehold innendørs.",
                },
                {
                  title: "Hagearbeid",
                  description:
                    "Alt fra gressklipping og planting til å forskjønne uteplassen.",
                },
                {
                  title: "Barnepass",
                  description:
                    "Ansvarsfulle ungdommer kan stille opp som barnevakt.",
                },
              ].map((service, i) => (
                <Card
                  key={i}
                  className="flex flex-col items-center justify-center border-none bg-yellow-50 p-4 text-center shadow-sm"
                >
                  <CardHeader>
                    <CardTitle className="mb-2 text-xl font-semibold text-gray-900">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{service.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Button
                asChild
                variant="default"
                size="lg"
                className="bg-yellow-500 hover:bg-yellow-600"
              >
                <Link href="/portal/stillinger">Se flere oppdrag</Link>
              </Button>
            </div>
          </div>
        </motion.section>

        {/*
          PINNED STORYTELLING SECTION
          (Optional; you can keep or remove this if you want that scrollytelling effect)
        */}
        <PinnedStorySection />


        {/*
          CTA SECTION
          A final strong call to action with another subtle parallax
        */}
        <section className="relative flex min-h-[40vh] w-full items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-green-100 to-green-200 opacity-80" />

          <div className="relative z-20 mx-auto max-w-5xl p-6 text-center md:p-12">
            <motion.div
              className="mx-auto rounded-xl bg-white/80 px-6 py-12 shadow-xl backdrop-blur-sm md:px-12"
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-extrabold text-gray-900 md:text-5xl">
                Bli med i Flittig i dag!
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-gray-700">
                Opprett en konto og finn hjelpere, eller se ledige oppdrag på et
                øyeblikk. Sammen bygger vi et mer inkluderende og fleksibelt
                lokalsamfunn.
              </p>
              <div className="mt-8 flex flex-col items-center space-y-3 md:flex-row md:space-x-4 md:space-y-0">
                <Button
                  asChild
                  variant="default"
                  size="lg"
                  className="bg-yellow-500 shadow-lg hover:bg-yellow-600"
                >
                  <Link href="/portal/registrer-deg">Registrer deg</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-yellow-500 text-yellow-500 shadow-lg hover:bg-yellow-50"
                >
                  <Link href="/portal/stillinger">
                    Se oppdrag uten innlogging
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </NavbarLayout>
  );
}
