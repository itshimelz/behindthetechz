"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

type Props = {
  children: ReactNode;
  delay?: number;
  className?: string;
  once?: boolean;
  amount?: number;
  duration?: number;
  offsetY?: number;
};

export function SectionReveal({
  children,
  delay = 0,
  className,
  once = true,
  amount = 0.2,
  duration = 0.18,
  offsetY = 8,
}: Props) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: offsetY }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
