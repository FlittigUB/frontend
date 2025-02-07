// app/layout.tsx or app/layout.jsx
'use client'
import './globals.css';
import React, { ReactNode } from "react";
import InsightsScript from '@/components/analytics/PlausibleScript';
import GoogleTagManager from '@/components/analytics/GoogleTagManager';
import { AnimatePresence, motion  } from "framer-motion";
import { usePathname } from "next/navigation";
import { Footerdemo } from "@/components/ui/footer-section";

export default function RootLayout({ children }: { children: ReactNode }) {
  // We track the current route to create a key for the motion.div
  const pathname = usePathname();

  return (
    <html lang="en">
    <body>
    {/* AnimatePresence tracks route changes and can animate out the old page, in the new page */}
    <AnimatePresence mode="wait">
      {/*
            The key must change on route change, so we use pathname.
            This triggers exit animations, then enter animations.
          */}
      <motion.div
        key={pathname}
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -80 }}
        transition={{ duration: 0.5 }}
      >
        <InsightsScript/>
        <GoogleTagManager/>
          {children}
        <Footerdemo/>
      </motion.div>
    </AnimatePresence>
    </body>
    </html>
  );
}
