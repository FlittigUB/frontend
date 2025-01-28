"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image, { ImageProps } from "next/image";

interface ParallaxLayerProps extends ImageProps {
  speed?: number; // The higher the speed, the bigger the parallax shift
  className?: string;
}

export function ParallaxLayer({
                                speed = 0.3,
                                className = "",
                                ...props
                              }: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // This range determines how much the image moves relative to scroll
  const y = useTransform(scrollY, [0, 1000], [0, 1000 * speed]);

  return (
    <div className={`absolute inset-0 ${className}`} ref={ref}>
      <motion.div style={{ y }} className="h-full w-full">
        <Image {...props} fill className="object-cover object-center" alt={"Parallax layer background image"} />
      </motion.div>
    </div>
  );
}
