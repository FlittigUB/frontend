"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function PinnedStorySection() {
  const ref = useRef<HTMLDivElement>(null);

  // Track scroll on the 300vh container
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  /**
   * We'll divide the scroll into thirds for 3 steps.
   * Each step fades in/out over about 10% of its chunk for a more drawn-out transition.
   */
  const step1Opacity = useTransform(scrollYProgress, [0.00, 0.10, 0.23, 0.33], [0, 1, 1, 0]);
  const step2Opacity = useTransform(scrollYProgress, [0.33, 0.43, 0.56, 0.66], [0, 1, 1, 0]);
  const step3Opacity = useTransform(scrollYProgress, [0.66, 0.76, 0.90, 1.00], [0, 1, 1, 0]);

  // A larger translate range from 75% down to -75% for a noticeable "float up"
  const step1Y = useTransform(scrollYProgress, [0.00, 0.33], ["75%", "-75%"]);
  const step2Y = useTransform(scrollYProgress, [0.33, 0.66], ["75%", "-75%"]);
  const step3Y = useTransform(scrollYProgress, [0.66, 1.00], ["75%", "-75%"]);

  return (
    <section
      ref={ref}
      className="relative h-[300vh] w-full bg-gray-50"
    >
      {/* Sticky container for the multistep story */}
      <div className="sticky top-0 left-0 right-0 flex h-screen items-center justify-center">
        <div className="relative w-full max-w-4xl px-4">
          {/*
            STEP 1
            "Neumorphic" style: subtle, soft shadows with rounded corners.
            Tailwind's arbitrary values for box-shadow or you can define them in your CSS.
          */}
          <motion.div
            style={{ opacity: step1Opacity, y: step1Y }}
            className="absolute inset-x-0 flex justify-center"
          >
            <Card
              className="rounded-2xl bg-[#e0e0e0] p-6 shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff] md:p-8"
            >
              <CardHeader>
                <CardTitle className="mb-2 text-center text-3xl font-extrabold text-green-900 md:text-4xl">
                  Steg 1: Kontakt
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-gray-700 md:text-lg">
                <p>
                  Kari Hansen har et travelt liv, men drømmer om en nyoppryddet
                  hage. Hun oppdager <strong>Flittig</strong> og legger ut en
                  forespørsel.
                </p>
                <p>
                  Hun får raskt kontakt med Ola Nordmann — en student som
                  elsker hagearbeid og ønsker å tjene litt ekstra ved siden av
                  studiene.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/*
            STEP 2
          */}
          <motion.div
            style={{ opacity: step2Opacity, y: step2Y }}
            className="absolute inset-x-0 flex justify-center"
          >
            <Card
              className="rounded-2xl bg-[#e0e0e0] p-6 shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff] md:p-8"
            >
              <CardHeader>
                <CardTitle className="mb-2 text-center text-3xl font-extrabold text-green-900 md:text-4xl">
                  Steg 2: Avtale
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-gray-700 md:text-lg">
                <p>
                  Kari og Ola avtaler tid, sted og lønn på en enkel måte. Begge
                  føler seg trygge, siden Flittig sørger for en smidig prosess
                  uten unødvendige gebyrer.
                </p>
                <p>
                  Gjennom Flittig kan de også sjekke hverandres tidligere
                  evalueringer, så tilliten er høy fra starten.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/*
            STEP 3
          */}
          <motion.div
            style={{ opacity: step3Opacity, y: step3Y }}
            className="absolute inset-x-0 flex justify-center"
          >
            <Card
              className="rounded-2xl bg-[#e0e0e0] p-6 shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff] md:p-8"
            >
              <CardHeader>
                <CardTitle className="mb-2 text-center text-3xl font-extrabold text-green-900 md:text-4xl">
                  Steg 3: Resultat
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-gray-700 md:text-lg">
                <p>
                  I løpet av en helg er hagen striglet, bedene luket og avfallet
                  fjernet. Kari er strålende fornøyd, og Ola får betalt for
                  innsatsen.
                </p>
                <p className="font-semibold text-green-700">
                  En enkel og lønnsom ordning for begge – og et grønnere
                  nabolag i samme slengen!
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
