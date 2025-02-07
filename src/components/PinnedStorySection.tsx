"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function PinnedStorySection() {
  // 1. Hook into scroll
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // 2. Animate horizontal sliding (0% to -200% for 3 steps)
  const xTransform = useTransform(scrollYProgress, [0, 1], ["0%", "-200%"]);

  // 3. Create a parallax effect for a background element (moves slower than the content)
  const bgTransform = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  // 4. Define animation variants for the step cards
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  // 5. Data for each step (allows for dynamic mapping)
  const steps = [
    {
      id: 1,
      title: "Steg 1: Kontakt",
      description:
        "Kari Hansen har et travelt liv, men drømmer om en nyoppryddet hage. ...",
    },
    {
      id: 2,
      title: "Steg 2: Avtale",
      description:
        "Kari og Ola avtaler tid, sted og lønn på en enkel måte. ...",
    },
    {
      id: 3,
      title: "Steg 3: Resultat",
      description:
        "Hagen er striglet, bedene luket og avfallet fjernet. ...",
    },
  ];

  return (
    <section
      ref={ref}
      className="relative h-[300vh] w-full bg-gray-50 overflow-hidden"
    >
      {/* Parallax background element */}
      <motion.div
        style={{ x: bgTransform }}
        className="absolute inset-0 bg-gradient-to-r from-green-100 to-blue-100"
      />

      {/* Sticky container to pin content during scroll */}
      <div className="sticky top-0 left-0 right-0 flex h-screen overflow-hidden">
        {/* Horizontal container that slides as we scroll */}
        <motion.div style={{ x: xTransform }} className="flex w-[300vw] relative z-10">
          {/* Background timeline line (stays static) */}
          <div className="absolute top-1/2 left-0 right-0 z-0 h-[2px] bg-gray-300"></div>

          {/* Map through each step to render the cards */}
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="relative flex h-full w-screen items-center justify-center p-4"
            >
              {/* Step indicator circle with a micro-animation on hover */}
              <motion.div
                whileHover={{ scale: 1.2 }}
                className="absolute top-1/2 left-1/2 z-10 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-600"
              />

              {/* Animated card that appears when in view */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                variants={cardVariants}
                transition={{ delay: index * 0.3, duration: 0.6, ease: "easeOut" }}
                className="relative z-20 w-full max-w-md rounded-2xl bg-white p-8 shadow-lg"
              >
                <h2 className="mb-2 text-center text-2xl font-extrabold text-green-900">
                  {step.title}
                </h2>
                <p className="text-gray-700">{step.description}</p>
              </motion.div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
